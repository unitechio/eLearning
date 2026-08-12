import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  Grid,
  List as ListIcon,
  Trash2,
  Eye,
  Heart,
  Share2,Columns3,
  MoreVertical,
  ChevronDown,
  Download,
  AlertCircle,
  HelpCircle,
  Bell,
  SlidersHorizontal,
  FolderIcon,
  Calendar,
  CheckCircle,
  History,
  Info,
  Archive,
  ArrowRight,
  Settings,
  Sparkles,
  ExternalLink,
  ChevronRight,
  FileText,
  MousePointerSquareDashed,
  Presentation,
  Globe,
  Sliders,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';

import {
  useDocuments,
  useDocumentStats,
  useFolders,
  useCreateFolder,
  useDeleteFolder,
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
  useRestoreDocument,
  usePermanentDeleteDocument,
  useFavoriteDocument,
  useUnfavoriteDocument
} from './documents/hooks/useDocuments';
import { Document, Folder } from './documents/types';
import {DOCUMENT_TABS,DOCUMENT_VIEW_MODES} from '@/constants/document.constants';
import type { DocumentTab, DocumentViewMode } from '@/shared/types/document.types';

import { getFileIcon, getFileColorVariant, formatFileSize, canPreview } from './documents/utils/file-utils';
import { UploadProgressItem } from './documents/components/UploadProgressItem';
import { PremiumDateRangePicker } from './documents/components/PremiumDateRangePicker';
import { DocumentPreview } from './documents/components/DocumentPreview';
import { DocumentDetailsPanel } from './documents/components/DocumentDetailsPanel';
import { DocumentShareDialog } from './documents/components/DocumentShareDialog';
import { apiClient } from '@/shared/api/client';
import { cn } from '@/shared/lib/utils';

const getDocThumbnail = (doc: Document) => {
  const asset = doc.current_version?.file_asset;
  if (!asset) return null;
  if (asset.thumbnail_key) {
    return `/api/v1/public/media/serve?key=${asset.thumbnail_key}`;
  }
  const ext = asset.extension?.toLowerCase() || '';
  const isImage = /^(jpg|jpeg|png|webp|gif|svg)$/i.test(ext);
  if (isImage && asset.storage_key) {
    return `/api/v1/public/media/serve?key=${asset.storage_key}`;
  }
  return null;
};

export function AdminDocumentPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Core filter states
  const [currentTab, setCurrentTab] = useState<DocumentTab>('all');
  const [viewMode, setViewMode] = useState<DocumentViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('updated_desc');
  const [groupBy, setGroupBy] = useState<'date' | 'none'>('date');
  const [mimeFilter, setMimeFilter] = useState('');

  // Folder navigation state
  const [currentFolderID, setCurrentFolderID] = useState<number | undefined>(undefined);
  const [folderPath, setFolderPath] = useState<Array<{ id: number; name: string }>>([]);

  // Date Range state
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Selection states
  const [selectedDocs, setSelectedDocs] = useState<number[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Dialog & Detail states
  const [activePreview, setActivePreview] = useState<Document | null>(null);
  const [activeDetails, setActiveDetails] = useState<Document | null>(null);
  const [activeShare, setActiveShare] = useState<Document | null>(null);
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Folder Picker (Move File feature) states
  const [folderPickerOpen, setFolderPickerOpen] = useState(false);
  const [docToMove, setDocToMove] = useState<Document | null>(null);
  const [pickerFolderID, setPickerFolderID] = useState<number | undefined>(undefined);
  const [pickerFolderPath, setPickerFolderPath] = useState<Array<{ id: number; name: string }>>([]);

  // Upload Queue State
  const [uploadQueue, setUploadQueue] = useState<{
    id: string;
    filename: string;
    size: number;
    progress: number;
    status: 'uploading' | 'paused' | 'completed' | 'failed';
    error?: string;
  }[]>([]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset pagination to page 1 on filter/search/tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [currentTab, debouncedSearch, mimeFilter, currentFolderID, dateRange]);

  // Queries
  const { data: { items: documents = [], total = 0 } = { items: [], total: 0 }, isLoading } = useDocuments({
    search: debouncedSearch,
    sort_by: sortBy,
    mime_type: mimeFilter,
    is_favorite: currentTab === 'favorites' ? true : undefined,
    status: currentTab === 'trash' ? 'deleted' : 'active',
    folder_id: currentTab === 'folders' ? (currentFolderID ?? 'null') : undefined,
    start_date: dateRange.from?.toISOString(),
    end_date: dateRange.to?.toISOString(),
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
  });

  const { data: folders = [] } = useFolders(currentFolderID);
  const { data: pickerFolders = [] } = useFolders(pickerFolderID);
  const { data: stats } = useDocumentStats();

  const createDocMutation = useCreateDocument();
  const updateDocMutation = useUpdateDocument();
  const deleteDocMutation = useDeleteDocument();
  const restoreDocMutation = useRestoreDocument();
  const permDeleteDocMutation = usePermanentDeleteDocument();
  const favoriteDocMutation = useFavoriteDocument();
  const unfavoriteDocMutation = useUnfavoriteDocument();

  const createFolderMutation = useCreateFolder();
  const deleteFolderMutation = useDeleteFolder();
  // Folder navigation handlers
  const handleNavigateToFolder = (folder: Folder) => {
    setCurrentFolderID(folder.id);
    setFolderPath((prev) => {
      const idx = prev.findIndex((item) => item.id === folder.id);
      if (idx !== -1) {
        return prev.slice(0, idx + 1);
      }
      return [...prev, { id: folder.id, name: folder.name }];
    });
  };

  const handleNavigateToBreadcrumb = (id?: number) => {
    setCurrentFolderID(id);
    if (id === undefined) {
      setFolderPath([]);
    } else {
      const idx = folderPath.findIndex((item) => item.id === id);
      if (idx !== -1) {
        setFolderPath(folderPath.slice(0, idx + 1));
      }
    }
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    createFolderMutation.mutate(
      {
        name: newFolderName,
        parent_id: currentFolderID,
      },
      {
        onSuccess: () => {
          setNewFolderName('');
          setCreateFolderOpen(false);
          toast.success('Folder created successfully');
        },
        onError: (err: any) => {
          toast.error(`Failed to create folder: ${err.message}`);
        },
      }
    );
  };


  // Create document helper from quick template
  const handleCreateQuickDoc = (type: 'note' | 'document' | 'whiteboard' | 'presentation') => {
    const titles = {
      note: 'New Quick Note',
      document: 'Untitled Document',
      whiteboard: 'Untitled Whiteboard',
      presentation: 'Untitled Presentation',
    };

    const docTitle = `${titles[type]} - ${new Date().toLocaleDateString()}`;

    // Auto-create document payload
    const formData = new FormData();
    formData.append('title', docTitle);
    formData.append('description', `Created using ${type} template`);
    formData.append('visibility', 'private');
    if (currentFolderID !== undefined) {
      formData.append('folder_id', currentFolderID.toString());
    }

    // Attach a virtual mock file so type check passes on the backend
    const content = type === 'note'
      ? 'Write your note here...'
      : type === 'document'
      ? 'Untitled Document Content'
      : type === 'whiteboard'
      ? 'Whiteboard canvas metadata'
      : 'Presentation template';

    const blob = new Blob([content], { type: 'text/plain' });
    const file = new File([blob], `${titles[type].toLowerCase().replace(/\s+/g, '_')}.txt`, { type: 'text/plain' });
    formData.append('file', file);

    createDocMutation.mutate(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['documents'] });
        queryClient.invalidateQueries({ queryKey: ['document-stats'] });
        toast.success(`Successfully created ${titles[type]}`);
      },
      onError: (err: any) => {
        toast.error(`Failed to create template: ${err.message}`);
      }
    });
  };

  const handleUploadFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const queueId = crypto.randomUUID();
      setUploadQueue((prev) => [
        ...prev,
        {
          id: queueId,
          filename: file.name,
          size: file.size,
          progress: 0,
          status: 'uploading',
        },
      ]);

      const formData = new FormData();
      formData.append('title', file.name.replace(/\.[^/.]+$/, ""));
      formData.append('description', 'Uploaded via document manager');
      formData.append('visibility', 'private');
      if (currentFolderID !== undefined) {
        formData.append('folder_id', currentFolderID.toString());
      }
      formData.append('file', file);

      apiClient
        .post('/admin/documents', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;
            setUploadQueue((prev) =>
              prev.map((item) => (item.id === queueId ? { ...item, progress } : item))
            );
          },
        })
        .then(() => {
          setUploadQueue((prev) =>
            prev.map((item) =>
              item.id === queueId ? { ...item, status: 'completed', progress: 100 } : item
            )
          );
          queryClient.invalidateQueries({ queryKey: ['documents'] });
          queryClient.invalidateQueries({ queryKey: ['document-stats'] });
          toast.success(`Successfully uploaded ${file.name}`);
        })
        .catch((err: Error) => {
          setUploadQueue((prev) =>
            prev.map((item) =>
              item.id === queueId ? { ...item, status: 'failed', error: err.message } : item
            )
          );
          toast.error(`Upload failed for ${file.name}`);
        });
    });
  };

  const toggleFavorite = (doc: Document) => {
    if (doc.is_favorite) {
      unfavoriteDocMutation.mutate(doc.id, {
        onSuccess: () => toast.success('Removed from favorites'),
      });
    } else {
      favoriteDocMutation.mutate(doc.id, {
        onSuccess: () => toast.success('Added to favorites'),
      });
    }
  };

  const handleDeleteDoc = (id: number) => {
    deleteDocMutation.mutate(id, {
      onSuccess: () => toast.success('Document moved to trash'),
    });
  };

  // Grouping logic by date
  const groupedDocs = useMemo(() => {
    if (groupBy === 'none') {
      return { 'All Documents': documents };
    }

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    const groups: { [key: string]: Document[] } = {
      'Previous 7 days': [],
      'Previous 30 days': [],
      'Previous 3 months': [],
      'Older': [],
    };

    documents.forEach((doc) => {
      const docDate = new Date(doc.updated_at);
      if (docDate >= sevenDaysAgo) {
        groups['Previous 7 days'].push(doc);
      } else if (docDate >= thirtyDaysAgo) {
        groups['Previous 30 days'].push(doc);
      } else if (docDate >= threeMonthsAgo) {
        groups['Previous 3 months'].push(doc);
      } else {
        groups['Older'].push(doc);
      }
    });

    // Remove empty groups to clean layout
    return Object.fromEntries(
      Object.entries(groups).filter(([_, items]) => items.length > 0)
    );
  }, [documents, groupBy]);

  return (
    <main className="flex-1 flex flex-col h-screen w-full dark:bg-slate-950 overflow-hidden font-sans">
      {/* 1. TOP BREADCRUMB BAR */}
      <header className="h-[52px] px-4 border-b border-slate-200/70 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white dark:bg-slate-950">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground select-none">Document</h1>
          <button type="button" aria-label="More options" className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-8 items-center rounded-sm border border-slate-200/80 bg-white p-0.5 dark:border-slate-800 dark:bg-slate-900">
            {DOCUMENT_VIEW_MODES.map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                aria-label={label}
                className={cn(
                  "flex h-6 w-7 items-center justify-center rounded-[4px] transition-colors",
                  viewMode === mode
                    ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                )}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
              </button>
            ))}
          </div>

          {/* Search Button trigger */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-sm border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 pl-10 pr-4 py-2 text-xs font-bold text-slate-900 focus:outline-none dark:text-white w-48 transition-all focus:w-64"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                size="sm"
                className="inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-3 py-4 text-xs gap-1.5 rounded-md shadow-xs"
                >
                <Plus className="h-4.5 w-4.5" /> Create
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl p-1 z-50">
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="text-xs font-bold p-2 text-slate-750 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                Upload Files
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCreateFolderOpen(true)} className="text-xs font-bold p-2 text-slate-750 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                Create Folder
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCreateQuickDoc('note')} className="text-xs font-bold p-2 text-slate-750 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                Create Quick Note
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleUploadFiles(e.target.files)}
          />
        </div>
      </header>

      {/* 2. SUB-HEADER CONTROLS & FILTER ROW */}
      <section className="h-11 shrink-0 flex items-center justify-between border-b border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900" aria-label="View filters">
        <nav aria-label="Document view filter tabs">
          <ul className="flex items-center gap-0.5" role="list">
            {DOCUMENT_TABS.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setCurrentTab(id)}
                  className={cn(
                    "flex h-8 items-center gap-1.5 rounded-sm px-2.5 text-xs font-medium transition-colors",
                    currentTab === id
                      ? "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setGroupBy(prev => prev === 'date' ? 'none' : 'date')}
            className="h-8 rounded-sm border border-slate-200/80 px-2.5 text-xs font-medium text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Columns3 className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
            Group by {groupBy === 'date' ? 'Date' : 'None'}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="h-8 rounded-sm border border-slate-200/80 px-2.5 text-xs font-medium text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Sliders className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
                Sort
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="min-w-[170px] rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-800 dark:bg-slate-900 z-50">
              <DropdownMenuItem
                onClick={() => setSortBy('updated_desc')}
                className="rounded-md px-2.5 py-1.5 text-xs font-medium cursor-pointer"
              >
                Recently Updated
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortBy('name_asc')}
                className="rounded-md px-2.5 py-1.5 text-xs font-medium cursor-pointer"
              >
                Name A-Z
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortBy('size_desc')}
                className="rounded-md px-2.5 py-1.5 text-xs font-medium cursor-pointer"
              >
                Largest Size
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Folder filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="h-8 rounded-sm border border-slate-200/80 px-2.5 text-xs font-medium text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
              >
                <FolderIcon className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
                {currentFolderID ? 'Folder: Filtered' : 'Folder: All'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[180px] max-h-60 overflow-y-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-800 dark:bg-slate-900 z-50">
              <DropdownMenuItem
                onClick={() => {
                  setCurrentFolderID(undefined);
                  setFolderPath([]);
                }}
                className="rounded-md px-2.5 py-1.5 text-xs font-semibold cursor-pointer"
              >
                All Folders (Root)
              </DropdownMenuItem>
              {folders.map((folder) => (
                <DropdownMenuItem
                  key={folder.id}
                  onClick={() => handleNavigateToFolder(folder)}
                  className="rounded-md px-2.5 py-1.5 text-xs font-semibold cursor-pointer"
                >
                  {folder.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            type="button"
            onClick={() => setShowDatePicker(prev => !prev)}
            variant="ghost"
            className="h-8 rounded-sm border border-slate-200/80 px-2.5 text-xs font-medium text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Calendar className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
            Filter Date
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-sm border border-slate-200/80 text-slate-500 shadow-none hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Search documents"
          >
            <Search className="h-3.5 w-3.5" />
          </Button>
        </div>
      </section>

      {/* Date picker popover container */}
      {showDatePicker && (
        <div className="absolute right-6 top-28 z-50">
          <div className="fixed inset-0 bg-slate-950/[0.02]" onClick={() => setShowDatePicker(false)} />
          <PremiumDateRangePicker value={dateRange} onChange={(range) => { setDateRange(range); setShowDatePicker(false); }} className="relative z-50" />
        </div>
      )}

      {/* 3. SCROLLABLE CONTENT BODY */}
      <div className="flex-1 overflow-y-auto py-6 space-y-8 bg-slate-50/30 px-4">

        {/* Statistics row */}
        {stats && currentTab === 'all' && (
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4" aria-label="Library Overview Statistics">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl p-4 flex items-center gap-4 shadow-xs">
              <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Documents</p>
                <h4 className="text-lg font-black text-slate-800 dark:text-white leading-tight mt-0.5">{stats.total_documents}</h4>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl p-4 flex items-center gap-4 shadow-xs">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Sliders className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Storage Used</p>
                <h4 className="text-lg font-black text-slate-800 dark:text-white leading-tight mt-0.5">{formatFileSize(stats.total_storage)}</h4>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl p-4 flex items-center gap-4 shadow-xs">
              <div className="h-10 w-10 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Uploaded This Month</p>
                <h4 className="text-lg font-black text-slate-800 dark:text-white leading-tight mt-0.5">{stats.uploaded_month}</h4>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl p-4 flex items-center gap-4 shadow-xs">
              <div className="h-10 w-10 rounded-lg bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Categories</p>
                <h4 className="text-lg font-black text-slate-800 dark:text-white leading-tight mt-0.5 truncate">
                  {Object.keys(stats.stats_by_type || {}).length} types
                </h4>
              </div>
            </div>
          </section>
        )}

        {/* Folder Breadcrumb Row */}
        {currentTab === 'folders' && (
          <section aria-label="Folder Navigation Breadcrumb">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl p-3 shadow-xs">
              <button
                type="button"
                onClick={() => handleNavigateToBreadcrumb(undefined)}
                className="hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                <FolderIcon className="h-3.5 w-3.5" />
                Root
              </button>
              {folderPath.map((item) => (
                <React.Fragment key={item.id}>
                  <ChevronRight className="h-3 w-3 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => handleNavigateToBreadcrumb(item.id)}
                    className="hover:text-slate-800 dark:hover:text-slate-200 last:text-slate-850 last:dark:text-slate-100 cursor-pointer"
                  >
                    {item.name}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </section>
        )}

        {/* Nested Folders Grid */}
        {currentTab === 'folders' && folders.length > 0 && (
          <section className="space-y-3">
            <header className="flex h-7 items-center gap-2">
              <h2 className="text-[12px] font-semibold text-slate-600 dark:text-slate-350">Subfolders</h2>
              <span className="text-[10px] font-medium tabular-nums text-slate-400">{String(folders.length).padStart(2, '0')}</span>
            </header>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {folders.map((folder) => (
                <article
                  key={folder.id}
                  onDoubleClick={() => handleNavigateToFolder(folder)}
                  className="group relative flex items-center justify-between rounded-xl border border-slate-200/60 bg-white p-3.5 shadow-xs hover:shadow-md transition cursor-pointer dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1" onClick={() => handleNavigateToFolder(folder)}>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400">
                      <FolderIcon className="h-4.5 w-4.5" />
                    </span>
                    <span className="truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                      {folder.name}
                    </span>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        aria-label={`Actions for folder ${folder.name}`}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 cursor-pointer"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl p-1 z-50">
                      <DropdownMenuItem
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete folder "${folder.name}"? All subfolders and files inside will be permanently deleted.`)) {
                            deleteFolderMutation.mutate(folder.id, {
                              onSuccess: () => toast.success('Folder deleted'),
                              onError: (err: any) => toast.error(`Failed to delete folder: ${err.message}`),
                            });
                          }
                        }}
                        className="text-xs font-bold p-2 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Quick templates row (Screenshot) */}
        {currentTab !== 'trash' && currentTab !== 'favorites' && (
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4" aria-label="Template shortcuts">
            {/* Card 1: Quick note */}
            <article
              onClick={() => handleCreateQuickDoc('note')}
              className="rounded-md border border-slate-100 bg-white p-4 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:border-slate-200 transition cursor-pointer flex items-center gap-4 text-left dark:bg-slate-900 dark:border-slate-850"
            >
              <figure className="h-10 w-10 rounded-md bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 flex items-center justify-center shrink-0" aria-hidden="true">
                <FileText className="h-5 w-5" />
              </figure>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold leading-5 text-slate-900 dark:text-slate-100">New quick note</h3>
                <p className="mt-0.5 truncate text-xs font-normal leading-4 text-slate-500 dark:text-slate-400">Create a quick note for you</p>
              </div>
            </article>

            {/* Card 2: Document */}
            <article
              onClick={() => handleCreateQuickDoc('document')}
              className="group flex items-center gap-3.5 px-4 py-2.5 text-left cursor-pointer rounded-md border border-slate-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-red-900/50"
            >
              <figure
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-600 transition-colors duration-200 group-hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:group-hover:bg-red-950/50"
                aria-hidden="true"
              >
                <FileText className="h-[18px] w-[18px]" strokeWidth={1.8} />
              </figure>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold leading-5 text-slate-900 dark:text-slate-100">
                  New document
                </h3>
                <p className="mt-0.5 truncate text-xs font-normal leading-4 text-slate-500 dark:text-slate-400">
                  Write a project document
                </p>
              </div>
            </article>

            {/* Card 3: Whiteboard */}
            <article
              onClick={() => handleCreateQuickDoc('whiteboard')}
              className="rounded-md border border-slate-100 bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:border-slate-200 transition cursor-pointer flex items-center gap-4 text-left dark:bg-slate-900 dark:border-slate-850"
            >
              <figure className="h-10 w-10 rounded-md bg-orange-50 dark:bg-orange-950/20 text-orange-600 flex items-center justify-center shrink-0" aria-hidden="true">
                <MousePointerSquareDashed className="h-5 w-5" />
              </figure>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold leading-5 text-slate-900 dark:text-slate-100">New whiteboard</h3>
                <p className="mt-0.5 truncate text-xs font-normal leading-4 text-slate-500 dark:text-slate-400">Create a sharing whiteboard</p>
              </div>
            </article>

            {/* Card 4: Presentation */}
            <article
              onClick={() => handleCreateQuickDoc('presentation')}
              className="rounded-md border border-slate-100 bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:border-slate-200 transition cursor-pointer flex items-center gap-4 text-left dark:bg-slate-900 dark:border-slate-850"
            >
              <figure className="h-10 w-10 rounded-md bg-purple-50 dark:bg-purple-950/20 text-purple-600 flex items-center justify-center shrink-0" aria-hidden="true">
                <Presentation className="h-5 w-5" />
              </figure>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold leading-5 text-slate-900 dark:text-slate-100">New presentation</h3>
                <p className="mt-0.5 truncate text-xs font-normal leading-4 text-slate-500 dark:text-slate-400">Build a presentation</p>
              </div>
            </article>
          </section>
        )}

        {/* Grouped lists */}
        {Object.entries(groupedDocs).map(([groupName, docs]) => (
          <section key={groupName} className="space-y-3">
            <header className="flex h-7 items-center gap-2">
              <h2 className="text-[12px] font-semibold text-slate-600 dark:text-slate-350">{groupName}</h2>
              <span className="text-[10px] font-medium tabular-nums text-slate-400">{String(docs.length).padStart(2, '0')}</span>
            </header>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-4">
                {docs.map((doc) => {
                  const FileIconComp = getFileIcon(doc.title);
                  const { bg, iconColor } = getFileColorVariant(doc.title);
                  const thumbnail = getDocThumbnail(doc);
                  const ext = doc.title.split('.').pop()?.toLowerCase() ?? '';

                  return (
                    <article key={doc.id} className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.08)] transition-all duration-200 hover:-translate-y-px hover:border-slate-300 hover:shadow-[0_8px_24px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-900">
                      <button
                        type="button"
                        onClick={() => setActivePreview(doc)}
                        className="h-28 w-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-100 dark:border-slate-800 cursor-pointer"
                      >
                        <div className="aspect-[16/9] w-full h-full">
                          {thumbnail ? (
                            <img src={thumbnail} alt={doc.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.015]" />
                          ) : (
                            // Render beautiful mock thumbnail designs to replace raw grey icons
                            <div className="w-full h-full">
                              {(() => {
                                if (ext === 'pdf') {
                                  return (
                                    <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-rose-500 to-red-600 p-3 text-white text-left select-none">
                                      <span className="text-[9px] font-black tracking-widest uppercase opacity-75">PORTABLE DOCUMENT</span>
                                      <h4 className="text-lg font-black leading-tight drop-shadow-sm mt-1">PDF</h4>
                                      <div className="w-12 h-1 bg-white/40 rounded-full mt-2" />
                                      <div className="mt-auto space-y-1">
                                        <div className="h-1 bg-white/20 rounded-full w-full" />
                                        <div className="h-1 bg-white/20 rounded-full w-3/4" />
                                      </div>
                                    </div>
                                  );
                                }
                                if (/^(xls|xlsx|csv|ods)$/i.test(ext)) {
                                  return (
                                    <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-emerald-500 to-teal-600 p-3 text-white text-left select-none">
                                      <span className="text-[9px] font-black tracking-widest uppercase opacity-75">SPREADSHEET</span>
                                      <h4 className="text-lg font-black leading-tight drop-shadow-sm mt-1">{ext.toUpperCase()}</h4>
                                      <div className="w-12 h-1 bg-white/40 rounded-full mt-2" />
                                      <div className="mt-auto grid grid-cols-3 gap-1">
                                        <div className="h-2 bg-white/20 rounded-xs" />
                                        <div className="h-2 bg-white/20 rounded-xs" />
                                        <div className="h-2 bg-white/20 rounded-xs" />
                                        <div className="h-2 bg-white/10 rounded-xs col-span-2" />
                                        <div className="h-2 bg-white/10 rounded-xs" />
                                      </div>
                                    </div>
                                  );
                                }
                                if (/^(doc|docx|rtf|odt)$/i.test(ext)) {
                                  return (
                                    <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-blue-500 to-indigo-600 p-3 text-white text-left select-none">
                                      <span className="text-[9px] font-black tracking-widest uppercase opacity-75">DOCUMENT WORD</span>
                                      <h4 className="text-lg font-black leading-tight drop-shadow-sm mt-1">{ext.toUpperCase()}</h4>
                                      <div className="w-12 h-1 bg-white/40 rounded-full mt-2" />
                                      <div className="mt-auto space-y-1.5">
                                        <div className="h-1 bg-white/30 rounded-full w-full" />
                                        <div className="h-1 bg-white/30 rounded-full w-11/12" />
                                        <div className="h-1 bg-white/20 rounded-full w-4/5" />
                                      </div>
                                    </div>
                                  );
                                }
                                if (/^(ppt|pptx|odp)$/i.test(ext)) {
                                  return (
                                    <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-amber-500 to-orange-600 p-3 text-white text-left select-none">
                                      <span className="text-[9px] font-black tracking-widest uppercase opacity-75">PRESENTATION</span>
                                      <h4 className="text-lg font-black leading-tight drop-shadow-sm mt-1">SLIDES</h4>
                                      <div className="w-12 h-1 bg-white/40 rounded-full mt-2" />
                                      <div className="mt-auto h-8 border border-white/20 rounded-md bg-white/10 flex items-center justify-center">
                                        <div className="w-4 h-3 bg-white/30 rounded-xs" />
                                      </div>
                                    </div>
                                  );
                                }
                                if (/^(zip|rar|gz|tar)$/i.test(ext)) {
                                  return (
                                    <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-purple-500 to-violet-600 p-3 text-white text-left select-none">
                                      <span className="text-[9px] font-black tracking-widest uppercase opacity-75">COMPRESSED ARCHIVE</span>
                                      <h4 className="text-lg font-black leading-tight drop-shadow-sm mt-1">{ext.toUpperCase()}</h4>
                                      <div className="w-12 h-1 bg-white/40 rounded-full mt-2" />
                                      <div className="mt-auto flex justify-between items-center bg-white/10 border border-white/20 rounded-md p-1.5">
                                        <div className="w-2.5 h-2.5 bg-white/30 rounded-xs" />
                                        <div className="h-1 bg-white/20 rounded-full flex-1 mx-2" />
                                        <div className="w-2.5 h-2 bg-white/40 rounded-xs" />
                                      </div>
                                    </div>
                                  );
                                }
                                if (/^(txt|md|json|js|ts|html|css|yaml|yml|xml)$/i.test(ext)) {
                                  return (
                                    <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-slate-700 to-slate-900 p-3 text-white text-left select-none font-mono">
                                      <span className="text-[8px] font-black tracking-widest uppercase opacity-60">SOURCE CODE</span>
                                      <h4 className="text-base font-black leading-tight drop-shadow-sm mt-1">{ext.toUpperCase()}</h4>
                                      <div className="w-12 h-0.5 bg-white/20 rounded-full mt-1.5" />
                                      <div className="mt-auto space-y-1 text-[8px] text-white/45">
                                        <div><span className="text-blue-400">const</span> data = &#123;&#125;;</div>
                                        <div><span className="text-purple-400">export</span> default;</div>
                                      </div>
                                    </div>
                                  );
                                }
                                return (
                                  <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-950 p-3 text-slate-700 dark:text-slate-350 text-left select-none">
                                    <span className="text-[9px] font-black tracking-widest uppercase opacity-60">UNKNOWN FILE</span>
                                    <h4 className="text-lg font-black leading-tight drop-shadow-sm mt-1 truncate">{ext.toUpperCase() || 'FILE'}</h4>
                                    <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mt-2" />
                                    <div className="mt-auto flex items-center justify-center">
                                      <FileIconComp className={cn('h-6 w-6', iconColor)} />
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      </button>

                      <div className="flex h-12 items-center justify-between gap-2 px-3">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <FileIconComp className={cn('h-4 w-4 shrink-0', iconColor)} strokeWidth={1.8} />
                          <span title={doc.title} className="truncate text-xs font-bold text-slate-800 dark:text-white">
                            {doc.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {currentTab !== 'trash' && (
                            <>
                              {/* Eye icon for document preview */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActivePreview(doc);
                                }}
                                aria-label="Preview document"
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-blue-500 transition dark:hover:bg-slate-800 cursor-pointer"
                              >
                                <Eye className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(doc);
                                }}
                                aria-label={doc.is_favorite ? "Remove from favorites" : "Add to favorites"}
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-red-500 transition dark:hover:bg-slate-800 cursor-pointer"
                              >
                                <Heart
                                  className={cn(
                                    "h-3.5 w-3.5 shrink-0 transition-colors",
                                    doc.is_favorite ? "fill-current text-red-500" : "text-slate-400"
                                  )}
                                  strokeWidth={1.8}
                                />
                              </button>
                            </>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button type="button" aria-label={`Actions for ${doc.title}`} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 opacity-0 transition hover:bg-slate-100 hover:text-slate-700 group-hover:opacity-100 dark:hover:bg-slate-800 cursor-pointer">
                                <MoreVertical className="h-3.5 w-3.5" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 rounded-lg border border-slate-200 bg-white p-1 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
                              {currentTab === 'trash' ? (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      restoreDocMutation.mutate(doc.id, {
                                        onSuccess: () => toast.success('Document restored successfully'),
                                      });
                                    }}
                                    className="rounded-md px-2.5 py-2 text-xs font-medium text-emerald-600 focus:bg-emerald-50 dark:focus:bg-emerald-950/20 cursor-pointer"
                                  >
                                    Restore
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      if (confirm('Are you sure you want to permanently delete this document? This action cannot be undone.')) {
                                        permDeleteDocMutation.mutate(doc.id, {
                                          onSuccess: () => toast.success('Document permanently deleted'),
                                        });
                                      }
                                    }}
                                    className="rounded-md px-2.5 py-2 text-xs font-medium text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/20 cursor-pointer"
                                  >
                                    Delete Permanently
                                  </DropdownMenuItem>
                                </>
                              ) : (
                                <>
                                  <DropdownMenuItem onClick={() => setActivePreview(doc)} className="rounded-md px-2.5 py-2 text-xs font-medium cursor-pointer">Preview</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setActiveDetails(doc)} className="rounded-md px-2.5 py-2 text-xs font-medium cursor-pointer">Details</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setActiveShare(doc)} className="rounded-md px-2.5 py-2 text-xs font-medium cursor-pointer">Share</DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setDocToMove(doc);
                                      setPickerFolderID(undefined);
                                      setPickerFolderPath([]);
                                      setFolderPickerOpen(true);
                                    }}
                                    className="rounded-md px-2.5 py-2 text-xs font-medium cursor-pointer"
                                  >
                                    Move to Folder
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => toggleFavorite(doc)} className="rounded-md px-2.5 py-2 text-xs font-medium cursor-pointer">{doc.is_favorite ? 'Remove favorite' : 'Add to favorite'}</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDeleteDoc(doc.id)} className="rounded-md px-2.5 py-2 text-xs font-medium text-rose-600 focus:bg-rose-50 cursor-pointer">Move to Trash</DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* List View Table */
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.01)] text-left">
                <table className="w-full text-left border-collapse" role="table">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-900">
                      <th scope="col" className="p-4 w-12">
                        <input
                          aria-label="Select all"
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDocs(docs.map((d) => d.id));
                            } else {
                              setSelectedDocs([]);
                            }
                          }}
                          checked={selectedDocs.length === docs.length && docs.length > 0}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </th>
                      <th scope="col" className="p-4">Name</th>
                      <th scope="col" className="p-4">Size</th>
                      <th scope="col" className="p-4">Last Updated</th>
                      <th scope="col" className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody role="rowgroup">
                    {docs.map((doc) => {
                      const FileIconComp = getFileIcon(doc.title);
                      const isSel = selectedDocs.includes(doc.id);
                      const size = doc.current_version?.file_asset?.size || 0;

                      return (
                        <tr
                          key={doc.id}
                          className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-850/30 text-xs font-semibold text-slate-700 dark:text-slate-350 animate-in fade-in duration-200"
                        >
                          <td className="p-4">
                            <input
                              aria-label={`Select ${doc.title}`}
                              type="checkbox"
                              checked={isSel}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedDocs((prev) => [...prev, doc.id]);
                                } else {
                                  setSelectedDocs((prev) => prev.filter((id) => id !== doc.id));
                                }
                              }}
                              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="p-4 flex items-center gap-2.5">
                            <FileIconComp className="h-4 w-4 text-slate-400 shrink-0" />
                            <span className="font-bold text-slate-800 dark:text-white truncate max-w-[200px]">
                              {doc.title}
                            </span>
                          </td>
                          <td className="p-4">{formatFileSize(size)}</td>
                          <td className="p-4">
                            {new Date(doc.updated_at).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {currentTab !== 'trash' && (
                                <>
                                  {/* Eye icon for document preview in list view */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActivePreview(doc);
                                    }}
                                    aria-label="Preview document"
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-blue-500 transition dark:hover:bg-slate-800 cursor-pointer"
                                  >
                                    <Eye className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleFavorite(doc);
                                    }}
                                    aria-label={doc.is_favorite ? "Remove from favorites" : "Add to favorites"}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-red-500 transition dark:hover:bg-slate-800 cursor-pointer"
                                  >
                                    <Heart
                                      className={cn(
                                        "h-3.5 w-3.5 shrink-0 transition-colors",
                                        doc.is_favorite ? "fill-current text-red-500" : "text-slate-400"
                                      )}
                                      strokeWidth={1.8}
                                    />
                                  </button>
                                </>
                              )}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button
                                    type="button"
                                    aria-label="File options"
                                    className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-40 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl p-1 z-50">
                                  {currentTab === 'trash' ? (
                                    <>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          restoreDocMutation.mutate(doc.id, {
                                            onSuccess: () => toast.success('Document restored successfully'),
                                          });
                                        }}
                                        className="text-xs font-bold p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer"
                                      >
                                        Restore
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          if (confirm('Are you sure you want to permanently delete this document? This action cannot be undone.')) {
                                            permDeleteDocMutation.mutate(doc.id, {
                                              onSuccess: () => toast.success('Document permanently deleted'),
                                            });
                                          }
                                        }}
                                        className="text-xs font-bold p-2 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                      >
                                        Delete Permanently
                                      </DropdownMenuItem>
                                    </>
                                  ) : (
                                    <>
                                      <DropdownMenuItem
                                        onClick={() => setActivePreview(doc)}
                                        className="text-xs font-bold p-2 text-slate-700 dark:text-slate-355 rounded-lg hover:bg-slate-50 cursor-pointer"
                                      >
                                        Preview
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => setActiveDetails(doc)}
                                        className="text-xs font-bold p-2 text-slate-700 dark:text-slate-355 rounded-lg hover:bg-slate-50 cursor-pointer"
                                      >
                                        Details
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setDocToMove(doc);
                                          setPickerFolderID(undefined);
                                          setPickerFolderPath([]);
                                          setFolderPickerOpen(true);
                                        }}
                                        className="text-xs font-bold p-2 text-slate-750 dark:text-slate-355 rounded-lg hover:bg-slate-50 cursor-pointer"
                                      >
                                        Move to Folder
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleDeleteDoc(doc.id)}
                                        className="text-xs font-bold p-2 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                      >
                                        Delete
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}

        {documents.length === 0 && folders.length === 0 && !isLoading && (
          <article className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-6 text-left">
            <figure className="h-12 w-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4" aria-hidden="true">
              <HelpCircle className="h-6 w-6" />
            </figure>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">No items found</h3>
            <p className="mt-1 text-[13px] text-slate-400 max-w-xs">Upload your first teaching material or create a folder above to get started.</p>
          </article>
        )}

        {/* Pagination Row - Premium Styled */}
        {(() => {
          const totalPages = Math.ceil(total / itemsPerPage);
          if (totalPages <= 1) return null;

          return (
            <nav aria-label="Pagination Navigation" className="flex items-center justify-between border-t border-slate-200/80 dark:border-slate-800 pt-5 bg-transparent mt-4">
              <span className="text-[11px] font-semibold text-slate-450 dark:text-slate-500">
                Showing page {currentPage} of {totalPages} ({total} items total)
              </span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="text-xs font-bold rounded-xl border-slate-200/80 hover:bg-slate-100 hover:text-slate-800 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:bg-slate-800/60 cursor-pointer px-4"
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="text-xs font-bold rounded-xl border-slate-200/80 hover:bg-slate-100 hover:text-slate-800 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:bg-slate-8500 cursor-pointer px-4"
                >
                  Next
                </Button>
              </div>
            </nav>
          );
        })()}
      </div>

      {/* Contextual Bulk Action Toolbar */}
      {selectedDocs.length > 0 && (
        <aside className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-850 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 z-40 text-white font-sans transition-all animate-in fade-in slide-in-from-bottom-5">
          <span className="text-xs font-bold text-slate-300">
            {selectedDocs.length} selected
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                if (confirm(`Move ${selectedDocs.length} items to trash?`)) {
                  selectedDocs.forEach(id => deleteDocMutation.mutate(id));
                  setSelectedDocs([]);
                  toast.success('Selected documents moved to trash');
                }
              }}
              className="flex items-center gap-1.5 bg-rose-600/10 border border-rose-500/20 text-rose-400 px-3 py-1.5 rounded-xl text-[10px] font-black hover:bg-rose-600/20 transition cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        </aside>
      )}

      {/* Bottom Right Persistent Upload Queue Drawer */}
      {uploadQueue.length > 0 && (
        <aside className="fixed bottom-6 right-6 w-96 max-h-[350px] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-40 p-4 space-y-3 font-sans transition-all animate-in fade-in slide-in-from-bottom-5">
          <header className="flex items-center justify-between border-b pb-2 dark:border-slate-800">
            <h4 className="text-xs font-black text-slate-800 dark:text-white font-sans">
              Uploads in Progress ({uploadQueue.filter((item) => item.status === 'uploading').length})
            </h4>
            <button
              type="button"
              onClick={() => setUploadQueue([])}
              className="text-[10px] font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
            >
              Clear Queue
            </button>
          </header>
          <div className="space-y-3.5 max-h-[250px] overflow-y-auto pr-1">
            {uploadQueue.map((item) => (
              <UploadProgressItem
                key={item.id}
                filename={item.filename}
                progress={item.progress}
                size={item.size}
                status={item.status}
                error={item.error}
                onCancel={() =>
                  setUploadQueue((prev) => prev.filter((prevItem) => prevItem.id !== item.id))
                }
              />
            ))}
          </div>
        </aside>
      )}

      {/* Create Folder Dialog */}
      <Dialog open={createFolderOpen} onOpenChange={setCreateFolderOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 z-50">
          <DialogHeader>
            <DialogTitle className="text-sm font-black text-slate-900 dark:text-white">Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-slate-300 dark:focus:border-slate-700"
                autoFocus
              />
            </div>
          </div>
          <footer className="flex justify-end gap-2.5">
            <Button type="button" variant="ghost" onClick={() => setCreateFolderOpen(false)} className="text-xs font-bold rounded-xl cursor-pointer">
              Cancel
            </Button>
            <Button type="button" onClick={handleCreateFolder} disabled={!newFolderName.trim() || createFolderMutation.isPending} className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl px-4 cursor-pointer">
              {createFolderMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </footer>
        </DialogContent>
      </Dialog>

      {/* Folder Picker (Move File Feature) Dialog */}
      <Dialog open={folderPickerOpen} onOpenChange={setFolderPickerOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 z-50 font-sans">
          <DialogHeader>
            <DialogTitle className="text-sm font-black text-slate-900 dark:text-white">
              Move "{docToMove?.title}" to Folder
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border dark:border-slate-850">
              <button
                type="button"
                onClick={() => { setPickerFolderID(undefined); setPickerFolderPath([]); }}
                className="hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer flex items-center gap-0.5"
              >
                <FolderIcon className="h-3 w-3 text-red-500" /> Root
              </button>
              {pickerFolderPath.map((item, idx) => (
                <React.Fragment key={item.id}>
                  <ChevronRight className="h-2.5 w-2.5 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => {
                      setPickerFolderID(item.id);
                      setPickerFolderPath(pickerFolderPath.slice(0, idx + 1));
                    }}
                    className="hover:text-slate-800 dark:hover:text-slate-200 last:text-slate-800 last:dark:text-slate-200 cursor-pointer"
                  >
                    {item.name}
                  </button>
                </React.Fragment>
              ))}
            </div>

            {/* Subfolders list */}
            <div className="border border-slate-100 dark:border-slate-800 rounded-xl max-h-60 overflow-y-auto divide-y dark:divide-slate-850 bg-slate-50/50 dark:bg-slate-950/20">
              {pickerFolders.map((folder) => (
                <div
                  key={folder.id}
                  onDoubleClick={() => {
                    setPickerFolderID(folder.id);
                    setPickerFolderPath((prev) => [...prev, { id: folder.id, name: folder.name }]);
                  }}
                  className="flex items-center gap-2.5 p-3 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer text-xs font-bold text-slate-850 dark:text-slate-200"
                >
                  <FolderIcon className="h-4.5 w-4.5 text-red-500 shrink-0" />
                  <span className="truncate flex-1">{folder.name}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                </div>
              ))}
              {pickerFolders.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-400 font-medium">
                  No subfolders inside
                </div>
              )}
            </div>
          </div>
          <footer className="flex justify-between gap-2.5 border-t dark:border-slate-800 pt-3">
            <button
              type="button"
              onClick={() => {
                if (docToMove) {
                  updateDocMutation.mutate({
                    id: docToMove.id,
                    title: docToMove.title,
                    folder_id: undefined, // Move to Root
                  }, {
                    onSuccess: () => {
                      setFolderPickerOpen(false);
                      queryClient.invalidateQueries({ queryKey: ['documents'] });
                      toast.success(`Moved "${docToMove.title}" to Root`);
                    },
                    onError: (err: any) => toast.error(`Failed to move: ${err.message}`),
                  });
                }
              }}
              className="text-xs font-black text-red-600 hover:bg-red-50/50 px-3 py-2 rounded-xl transition cursor-pointer"
            >
              Move to Root
            </button>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={() => setFolderPickerOpen(false)} className="text-xs font-bold rounded-xl cursor-pointer">
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  if (docToMove && pickerFolderID !== undefined) {
                    updateDocMutation.mutate({
                      id: docToMove.id,
                      title: docToMove.title,
                      folder_id: pickerFolderID,
                    }, {
                      onSuccess: () => {
                        setFolderPickerOpen(false);
                        queryClient.invalidateQueries({ queryKey: ['documents'] });
                        toast.success(`Moved "${docToMove.title}" to selected folder`);
                      },
                      onError: (err: any) => toast.error(`Failed to move: ${err.message}`),
                    });
                  }
                }}
                disabled={pickerFolderID === undefined || updateDocMutation.isPending}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl px-4 cursor-pointer"
              >
                {updateDocMutation.isPending ? 'Moving...' : 'Move Here'}
              </Button>
            </div>
          </footer>
        </DialogContent>
      </Dialog>

      {/* Modal Dialogs */}
      {activePreview && activePreview.current_version?.file_asset?.storage_key && (
        <DocumentPreview
          filename={activePreview.title}
          url={`/api/v1/public/media/serve?key=${activePreview.current_version.file_asset.storage_key}`}
          mimeType={activePreview.current_version.file_asset.mime_type}
          size={activePreview.current_version.file_asset.size}
          onClose={() => setActivePreview(null)}
        />
      )}

      {activeDetails && (
        <DocumentDetailsPanel
          document={activeDetails}
          open={!!activeDetails}
          onClose={() => setActiveDetails(null)}
        />
      )}

      {activeShare && (
        <DocumentShareDialog
          document={activeShare}
          open={!!activeShare}
          onClose={() => setActiveShare(null)}
        />
      )}
    </main>
  );
}
