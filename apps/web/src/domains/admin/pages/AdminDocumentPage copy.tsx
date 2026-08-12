import React, { useRef, useState, useEffect } from 'react';
import {
  FolderPlus,
  Plus,
  Search,
  Filter,
  Grid,
  List as ListIcon,
  Trash2,
  Eye,
  Heart,
  Share2,
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
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

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
import { getFileIcon, getFileColorVariant, formatFileSize, canPreview } from './documents/utils/file-utils';
import { UploadProgressItem } from './documents/components/UploadProgressItem';
import { PremiumDateRangePicker } from './documents/components/PremiumDateRangePicker';
import { DocumentPreview } from './documents/components/DocumentPreview';
import { DocumentDetailsPanel } from './documents/components/DocumentDetailsPanel';
import { DocumentShareDialog } from './documents/components/DocumentShareDialog';
import { apiClient } from '@/shared/api/client';

export function AdminDocumentPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<number | undefined>(undefined);
  const [currentTab, setCurrentTab] = useState<'all' | 'my' | 'favorites' | 'shared' | 'trash'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('updated_desc');
  const [mimeFilter, setMimeFilter] = useState('');

  // Date Range state
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Selection states
  const [selectedDocs, setSelectedDocs] = useState<number[]>([]);

  // Dialog & Detail states
  const [activePreview, setActivePreview] = useState<Document | null>(null);
  const [activeDetails, setActiveDetails] = useState<Document | null>(null);
  const [activeShare, setActiveShare] = useState<Document | null>(null);
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

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

  // Queries
  const { data: stats } = useDocumentStats();
  const { data: folders = [] } = useFolders(selectedFolderId);
  const { data: { items: documents = [] } = { items: [], total: 0 }, isLoading } = useDocuments({
    folder_id: selectedFolderId,
    search: debouncedSearch,
    sort_by: sortBy,
    mime_type: mimeFilter,
    is_favorite: currentTab === 'favorites' ? true : undefined,
    status: currentTab === 'trash' ? 'deleted' : 'active',
  });

  // Mutations
  const createFolderMutation = useCreateFolder();
  const deleteFolderMutation = useDeleteFolder();
  const createDocMutation = useCreateDocument();
  const updateDocMutation = useUpdateDocument();
  const deleteDocMutation = useDeleteDocument();
  const restoreDocMutation = useRestoreDocument();
  const permDeleteDocMutation = usePermanentDeleteDocument();
  const favoriteDocMutation = useFavoriteDocument();
  const unfavoriteDocMutation = useUnfavoriteDocument();

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    createFolderMutation.mutate(
      { name: newFolderName.trim(), parent_id: selectedFolderId },
      {
        onSuccess: () => {
          setNewFolderName('');
          setCreateFolderOpen(false);
          toast.success('Folder created successfully');
        },
      }
    );
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
      if (selectedFolderId) {
        formData.append('folder_id', selectedFolderId.toString());
      }
      formData.append('file', file);

      // Perform upload with progress tracking
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

  const handleRestoreDoc = (id: number) => {
    restoreDocMutation.mutate(id, {
      onSuccess: () => toast.success('Document restored successfully'),
    });
  };

  const handlePermDeleteDoc = (id: number) => {
    if (confirm('Permanently delete this file? This action is irreversible.')) {
      permDeleteDocMutation.mutate(id, {
        onSuccess: () => toast.success('Document permanently deleted'),
      });
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Move ${selectedDocs.length} selected items to trash?`)) {
      selectedDocs.forEach((id) => deleteDocMutation.mutate(id));
      setSelectedDocs([]);
      toast.success('Selected documents moved to trash');
    }
  };

  const handleFolderClick = (folder: Folder) => {
    setSelectedFolderId(folder.id);
  };

  const handleNavigateUp = () => {
    setSelectedFolderId(undefined);
  };

  return (
    <main className="flex h-screen w-full bg-[#f8fafc] dark:bg-slate-950 overflow-hidden font-sans">
      {/* 1. LEFT SIDEBAR PANEL */}
      <aside className="w-64 border-r border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between shrink-0 h-full p-4" aria-label="Documents Navigation">
        <div className="space-y-6">
          <header className="flex items-center gap-2 px-2">
            <figure className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white" aria-hidden="true">
              <FolderIcon className="h-5 w-5" />
            </figure>
            <div>
              <h2 className="text-sm font-black text-slate-800 dark:text-white">Document Manager</h2>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Aline Cloud</span>
            </div>
          </header>

          <nav aria-label="Primary document lists">
            <ul className="space-y-1.5" role="list">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentTab('all');
                    setSelectedFolderId(undefined);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition",
                    currentTab === 'all' && !selectedFolderId
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-950/20"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850"
                  )}
                >
                  <FolderIcon className="h-4.5 w-4.5" />
                  <span>My Document</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentTab('favorites');
                    setSelectedFolderId(undefined);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition",
                    currentTab === 'favorites'
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-950/20"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850"
                  )}
                >
                  <Heart className="h-4.5 w-4.5" />
                  <span>Favourite</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentTab('all');
                    setSelectedFolderId(undefined);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 transition"
                >
                  <Archive className="h-4.5 w-4.5" />
                  <span>Unsorted</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentTab('trash');
                    setSelectedFolderId(undefined);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition",
                    currentTab === 'trash'
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-950/20"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850"
                  )}
                >
                  <Trash2 className="h-4.5 w-4.5" />
                  <span>Trash</span>
                </button>
              </li>
            </ul>
          </nav>

          {/* Directory Folder Tree */}
          <section className="space-y-3">
            <header className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Folders</h3>
              <button
                type="button"
                aria-label="Create Folder"
                onClick={() => setCreateFolderOpen(true)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <Plus className="h-4 w-4" />
              </button>
            </header>
            <ul className="space-y-1" role="list">
              {folders.map((f) => (
                <li key={f.id}>
                  <button
                    type="button"
                    onClick={() => handleFolderClick(f)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 transition",
                      selectedFolderId === f.id && "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-bold"
                    )}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <FolderIcon className="h-4 w-4 text-amber-500 shrink-0" />
                      <span className="truncate">{f.name}</span>
                    </span>
                    <ChevronRight className="h-3 w-3 opacity-40" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Footer Settings Area */}
        <footer className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 transition"
          >
            <Bell className="h-4.5 w-4.5" />
            <span>Notification</span>
          </button>
          <button
            type="button"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 transition"
          >
            <Settings className="h-4.5 w-4.5" />
            <span>Settings</span>
          </button>
        </footer>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <section className="flex-1 flex flex-col overflow-hidden h-full" aria-label="Main Document Library">
        {/* Header Bar */}
        <header className="h-16 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {selectedFolderId && (
              <button
                type="button"
                onClick={handleNavigateUp}
                className="mr-2 text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Back
              </button>
            )}
            <h1 className="text-lg font-black text-slate-800 dark:text-white">
              {selectedFolderId
                ? `Folder: ${folders.find((f) => f.id === selectedFolderId)?.name || 'Contents'}`
                : 'My Document'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick search button */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none dark:text-white w-48 focus:w-64 transition-all"
              />
            </div>

            <Button
              type="button"
              onClick={() => setShowDatePicker((prev) => !prev)}
              variant="outline"
              className="rounded-xl border border-slate-200 dark:border-slate-800 h-9 text-xs flex items-center gap-1.5"
            >
              <Calendar className="h-4 w-4 text-slate-400" />
              Filter Date
            </Button>

            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 h-9 flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="h-4 w-4" /> Upload
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleUploadFiles(e.target.files)}
            />
          </div>
        </header>

        {/* Date picker popover container */}
        {showDatePicker && (
          <div className="absolute right-6 top-20 z-50">
            <div className="fixed inset-0" onClick={() => setShowDatePicker(false)} />
            <PremiumDateRangePicker
              value={dateRange}
              onChange={(range) => {
                setDateRange(range);
                setShowDatePicker(false);
              }}
              className="relative z-50 shadow-2xl"
            />
          </div>
        )}

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Promo banner cards (screenshot) */}
          {!selectedFolderId && (
            <article className="grid grid-cols-1 md:grid-cols-3 gap-4" aria-label="Quick setup tips">
              <div className="rounded-md bg-white p-4 flex items-start gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
                <figure className="h-8 w-8 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 flex items-center justify-center shrink-0" aria-hidden="true">
                  <Sparkles className="h-5 w-5" />
                </figure>
                <div className="text-left min-w-0">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-white">Join the Community</h3>
                  <p className="mt-1 text-[11px] text-slate-400 leading-normal">Welcome to Aline!</p>
                </div>
              </div>
              <div className="rounded-md bg-white p-5 flex items-start gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
                <figure className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 flex items-center justify-center shrink-0" aria-hidden="true">
                  <Download className="h-5 w-5" />
                </figure>
                <div className="text-left min-w-0">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-white">Get Aline App</h3>
                  <p className="mt-1 text-[11px] text-slate-400 leading-normal">Maximize Performance with Aline</p>
                </div>
              </div>
              <div className="rounded-md bg-white p-5 flex items-start gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
                <figure className="h-10 w-10 rounded-xl bg-pink-50 dark:bg-pink-950/20 text-pink-600 flex items-center justify-center shrink-0" aria-hidden="true">
                  <Share2 className="h-5 w-5" />
                </figure>
                <div className="text-left min-w-0">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-white">Share a Aline</h3>
                  <p className="mt-1 text-[11px] text-slate-400 leading-normal">Sharing the Aline Journey</p>
                </div>
              </div>
            </article>
          )}

          {/* Folders Section */}
          {folders.length > 0 && (
            <section className="space-y-4">
              <header className="flex items-center justify-between">
                <h2 className="text-sm font-black text-slate-800 dark:text-white">Folder</h2>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={() => setCreateFolderOpen(true)}
                    variant="outline"
                    className="h-8 rounded-lg text-[10px] font-bold border border-slate-200"
                  >
                    + New Folder
                  </Button>
                </div>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {folders.map((folder, idx) => {
                  const colors = [
                    'from-purple-600 to-indigo-600',
                    'from-teal-600 to-emerald-600',
                    'from-blue-600 to-sky-600',
                    'from-orange-600 to-amber-600',
                  ];
                  const color = colors[idx % colors.length];

                  return (
                    <article
                      key={folder.id}
                      onClick={() => handleFolderClick(folder)}
                      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all cursor-pointer flex flex-col justify-between min-h-[140px] text-left"
                    >
                      {/* Top folder header info */}
                      <div>
                        <div className="flex items-center justify-between">
                          <figure className={`h-9 w-9 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center text-white`} aria-hidden="true">
                            <FolderIcon className="h-4.5 w-4.5" />
                          </figure>
                          <span className="text-[10px] font-bold text-slate-400">
                            Folder
                          </span>
                        </div>
                        <h3 className="mt-4 text-sm font-black text-slate-800 dark:text-white group-hover:text-blue-600 transition">
                          {folder.name}
                        </h3>
                        <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">
                          Logical collection in Aline media document store.
                        </p>
                      </div>

                      {/* Folder collaborative members footer */}
                      <footer className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-850 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-bold">Colaboration:</span>
                        <div className="flex items-center -space-x-1.5">
                          <span className="h-5 w-5 rounded-full bg-slate-100 dark:bg-slate-800 border border-white dark:border-slate-900 flex items-center justify-center font-bold text-[9px] text-slate-500">
                            +5
                          </span>
                        </div>
                      </footer>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {/* Files List / Recent Document Section */}
          <section className="space-y-4">
            <header className="flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-800 dark:text-white">Recent Document</h2>
              <div className="flex items-center gap-2">
                <select
                  aria-label="Sort by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 focus:outline-none"
                >
                  <option value="updated_desc">Recently Updated</option>
                  <option value="name_asc">Name A-Z</option>
                  <option value="name_desc">Name Z-A</option>
                  <option value="size_desc">Largest Size</option>
                </select>
                <div className="flex rounded-lg border border-slate-250 p-0.5 bg-white dark:bg-slate-900 dark:border-slate-800 shrink-0">
                  <button
                    type="button"
                    aria-label="Grid view"
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-1.5 rounded-md",
                      viewMode === 'grid'
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white"
                        : "text-slate-400 hover:text-slate-700"
                    )}
                  >
                    <Grid className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label="List view"
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "p-1.5 rounded-md",
                      viewMode === 'list'
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white"
                        : "text-slate-400 hover:text-slate-700"
                    )}
                  >
                    <ListIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </header>

            {/* Grid View */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {documents.map((doc) => {
                  const FileIcon = getFileIcon(doc.title);
                  const { bg, iconColor } = getFileColorVariant(doc.title);
                  const ext = doc.current_version?.file_asset?.extension || '';
                  const size = doc.current_version?.file_asset?.size || 0;

                  return (
                    <article
                      key={doc.id}
                      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition flex flex-col text-left justify-between"
                    >
                      {/* Document Details Block */}
                      <div className="p-4 flex-1">
                        <header className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-xs font-black text-slate-800 dark:text-white truncate group-hover:text-blue-600 transition">
                              {doc.title}
                            </h3>
                            <p className="mt-0.5 text-[9px] font-semibold text-slate-400">
                              {doc.folder?.name || 'Root'} • {new Date(doc.updated_at).toLocaleDateString()}
                            </p>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                aria-label="File options"
                                className="h-7 w-7 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center shrink-0"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-36 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl p-1 z-50">
                              {canPreview(doc.title) && (
                                <DropdownMenuItem
                                  onClick={() => setActivePreview(doc)}
                                  className="text-xs font-bold p-2 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                                >
                                  <Eye className="mr-2 h-4 w-4 text-slate-400" /> Preview
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => setActiveDetails(doc)}
                                className="text-xs font-bold p-2 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                              >
                                <Info className="mr-2 h-4 w-4 text-slate-400" /> Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setActiveShare(doc)}
                                className="text-xs font-bold p-2 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                              >
                                <Share2 className="mr-2 h-4 w-4 text-slate-400" /> Share
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => toggleFavorite(doc)}
                                className="text-xs font-bold p-2 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                              >
                                <Heart className="mr-2 h-4 w-4 text-slate-400" /> Favorite
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteDoc(doc.id)}
                                className="text-xs font-bold p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg"
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Move to Trash
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </header>

                        {/* File asset category fallback or image rendering */}
                        <div className="mt-4 h-32 w-full rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-850">
                          {ext.match(/(jpg|jpeg|png|webp|gif)/) && doc.current_version?.file_asset?.storage_key ? (
                            <img
                              src={`/api/v1/public/media/serve?key=${doc.current_version.file_asset.storage_key}`}
                              alt={doc.title}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <figure className={`h-12 w-12 rounded-2xl flex items-center justify-center ${bg}`} aria-hidden="true">
                                <FileIcon className={`h-6 w-6 ${iconColor}`} />
                              </figure>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {ext.replace('.', '') || 'file'}
                              </span>
                            </div>
                          )}
                        </div>

                        <p className="mt-4 text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                          {doc.description || 'No description provided.'}
                        </p>
                      </div>

                      {/* Footer Info details */}
                      <footer className="px-4 py-3 border-t border-slate-50 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-900/40 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-bold">
                          {formatFileSize(size)}
                        </span>
                        <span className="inline-flex rounded-full bg-blue-50 dark:bg-blue-950/20 px-2 py-0.5 font-bold text-blue-600">
                          Active
                        </span>
                      </footer>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* List View */
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.01)] text-left">
                <table className="w-full text-left border-collapse" role="table">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-900">
                      <th scope="col" className="p-4 w-12">
                        <input
                          aria-label="Select all documents"
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDocs(documents.map((d) => d.id));
                            } else {
                              setSelectedDocs([]);
                            }
                          }}
                          checked={selectedDocs.length === documents.length && documents.length > 0}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th scope="col" className="p-4">Name</th>
                      <th scope="col" className="p-4">Folder</th>
                      <th scope="col" className="p-4">Size</th>
                      <th scope="col" className="p-4">Last Updated</th>
                      <th scope="col" className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody role="rowgroup">
                    {documents.map((doc) => {
                      const FileIcon = getFileIcon(doc.title);
                      const isSel = selectedDocs.includes(doc.id);
                      const size = doc.current_version?.file_asset?.size || 0;

                      return (
                        <tr
                          key={doc.id}
                          className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-850/30 text-xs font-semibold text-slate-700 dark:text-slate-350"
                        >
                          <td className="p-4">
                            <input
                              aria-label={`Select document ${doc.title}`}
                              type="checkbox"
                              checked={isSel}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedDocs((prev) => [...prev, doc.id]);
                                } else {
                                  setSelectedDocs((prev) => prev.filter((id) => id !== doc.id));
                                }
                              }}
                              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          <td className="p-4 flex items-center gap-2.5">
                            <FileIcon className="h-4 w-4 text-slate-400 shrink-0" />
                            <span className="font-bold text-slate-800 dark:text-white truncate max-w-[200px]">
                              {doc.title}
                            </span>
                          </td>
                          <td className="p-4">{doc.folder?.name || 'Root'}</td>
                          <td className="p-4">{formatFileSize(size)}</td>
                          <td className="p-4">
                            {new Date(doc.updated_at).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  type="button"
                                  aria-label="File options"
                                  className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center ml-auto"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-36 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl p-1 z-50">
                                {canPreview(doc.title) && (
                                  <DropdownMenuItem
                                    onClick={() => setActivePreview(doc)}
                                    className="text-xs font-bold p-2 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50"
                                  >
                                    Preview
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => setActiveDetails(doc)}
                                  className="text-xs font-bold p-2 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50"
                                >
                                  Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteDoc(doc.id)}
                                  className="text-xs font-bold p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {documents.length === 0 && !isLoading && (
              <article className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-6">
                <figure className="h-12 w-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4" aria-hidden="true">
                  <HelpCircle className="h-6 w-6" />
                </figure>
                <h3 className="text-xs font-bold text-slate-800 dark:text-white">No documents found</h3>
                <p className="mt-1 text-[11px] text-slate-400 max-w-xs">Upload your first teaching material or create a folder to get started organizing your assets.</p>
              </article>
            )}
          </section>
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
                onClick={handleBulkDelete}
                className="flex items-center gap-1.5 bg-rose-600/10 border border-rose-500/20 text-rose-400 px-3 py-1.5 rounded-xl text-[10px] font-black hover:bg-rose-600/20 transition"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </aside>
        )}

        {/* Bottom Right Persistent Upload Queue Drawer */}
        {uploadQueue.length > 0 && (
          <aside className="fixed bottom-6 right-6 w-96 max-h-[350px] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-2xl z-40 p-4 space-y-3 font-sans transition-all animate-in fade-in slide-in-from-bottom-5">
            <header className="flex items-center justify-between border-b pb-2 dark:border-slate-800">
              <h4 className="text-xs font-black text-slate-800 dark:text-white">
                Uploads in Progress ({uploadQueue.filter((item) => item.status === 'uploading').length})
              </h4>
              <button
                type="button"
                onClick={() => setUploadQueue([])}
                className="text-[10px] font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white"
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

        {/* Modal Dialogs */}
        <Dialog open={createFolderOpen} onOpenChange={setCreateFolderOpen}>
          <DialogContent className="max-w-sm p-6 rounded-[24px] bg-white dark:bg-slate-900 border dark:border-slate-800 font-sans">
            <DialogHeader>
              <DialogTitle className="text-sm font-black text-slate-800 dark:text-white text-left">
                Create New Folder
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Folder name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-850 dark:text-white"
              />
            </div>
            <footer className="mt-6 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateFolderOpen(false)}
                className="rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCreateFolder}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-6"
              >
                Create
              </Button>
            </footer>
          </DialogContent>
        </Dialog>

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
      </section>
    </main>
  );
}

import { cn } from '@/shared/lib/utils';
