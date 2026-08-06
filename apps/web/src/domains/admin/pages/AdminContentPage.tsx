import React, { useState } from 'react';
import { 
  Plus, Edit, Trash2, BookOpen
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { 
  AdminPageLayout, AdminCard, AdminCardContent, AdminDataTable, type AdminColumnDef 
} from '@/shared/components/admin';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import { Textarea } from '@/shared/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils';

interface IELTSContentItem {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  module: string; // "ielts" | "sat" | "toeic"
  skill: 'reading' | 'listening' | 'writing' | 'speaking';
  content_type: string; // "practice" | "mock_test"
  level: string; // "A1" | "B2" | "C1" | "academic" | "general"
  status: 'draft' | 'published' | 'archived';
  thumbnail_url?: string;
  audio_url?: string;
  pdf_url?: string;
  duration_seconds?: number;
}

export function AdminContentPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'reading' | 'listening' | 'writing' | 'speaking'>('reading');
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Form states for Create/Edit Modal
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState<IELTSContentItem | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    description: '',
    module: 'ielts',
    skill: 'reading' as 'reading' | 'listening' | 'writing' | 'speaking',
    content_type: 'practice',
    level: 'academic',
    status: 'draft',
    thumbnail_url: '',
    audio_url: '',
    pdf_url: '',
    duration_seconds: 2400
  });

  // Query Content Items
  const { data: contentData, isLoading, error } = useQuery({
    queryKey: ['admin-ielts-content'],
    queryFn: async () => {
      try {
        const res = await apiClient.get<{ data: IELTSContentItem[] }>('/admin/ielts/content?page=1&page_size=100');
        return res.data.data;
      } catch {
        // Fallback Mock Data if API fails
        return [
          { id: 1, title: "IELTS Reading Mock Test 1", slug: "ielts-reading-test-1", module: "ielts", skill: "reading", content_type: "mock_test", level: "academic", status: "published" },
          { id: 2, title: "IELTS Listening Practice 2", slug: "ielts-listening-practice-2", module: "ielts", skill: "listening", content_type: "practice", level: "general", status: "draft" },
          { id: 3, title: "IELTS Writing Task 2", slug: "ielts-writing-task-2", module: "ielts", skill: "writing", content_type: "practice", level: "academic", status: "published" },
          { id: 4, title: "IELTS Speaking Part 1", slug: "ielts-speaking-part-1-warm-up", module: "ielts", skill: "speaking", content_type: "practice", level: "academic", status: "published" }
        ] as IELTSContentItem[];
      }
    }
  });

  const createMutation = useMutation({
    mutationFn: async (payload: typeof formData) => {
      const res = await apiClient.post('/admin/ielts/content', payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Tạo bài thi thành công!');
      void queryClient.invalidateQueries({ queryKey: ['admin-ielts-content'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Lỗi tạo bài thi');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: number, payload: typeof formData }) => {
      const res = await apiClient.put(`/admin/ielts/content/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Cập nhật bài thi thành công!');
      void queryClient.invalidateQueries({ queryKey: ['admin-ielts-content'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Lỗi cập nhật');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiClient.delete(`/admin/ielts/content/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Đã xóa bài thi');
      void queryClient.invalidateQueries({ queryKey: ['admin-ielts-content'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Lỗi xóa bài thi');
    }
  });

  const handleOpenEdit = (item: IELTSContentItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      slug: item.slug,
      subtitle: item.subtitle || '',
      description: item.description || '',
      module: item.module || 'ielts',
      skill: item.skill,
      content_type: item.content_type || 'practice',
      level: item.level || 'academic',
      status: item.status || 'draft',
      thumbnail_url: item.thumbnail_url || '',
      audio_url: item.audio_url || '',
      pdf_url: item.pdf_url || '',
      duration_seconds: item.duration_seconds || 2400
    });
    setShowFormModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, payload: formData });
    } else {
      createMutation.mutate(formData);
    }
    setShowFormModal(false);
  };

  const contentItems = contentData || [];

  const filteredItems = contentItems.filter(item => {
    const matchesSkill = item.skill === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || item.level === levelFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSkill && matchesSearch && matchesLevel && matchesStatus;
  });

  const tabs = [
    { value: 'reading', label: 'Reading' },
    { value: 'listening', label: 'Listening' },
    { value: 'writing', label: 'Writing' },
    { value: 'speaking', label: 'Speaking' }
  ];

  const columns: AdminColumnDef<IELTSContentItem>[] = [
    {
      header: 'Tiêu đề bài thi',
      cell: (item) => <span className="font-semibold text-foreground">{item.title}</span>,
    },
    {
      header: 'Slug / Path',
      cell: (item) => <span className="font-mono text-xs text-muted-foreground">{item.slug}</span>,
    },
    {
      header: 'Dạng bài',
      cell: (item) => <span className="text-muted-foreground capitalize">{item.content_type.replace('_', ' ')}</span>,
    },
    {
      header: 'Trình độ',
      cell: (item) => <span className="font-semibold text-foreground/80 uppercase">{item.level}</span>,
    },
    {
      header: 'Trạng thái',
      cell: (item) => (
        <Badge className={cn("text-[11px] font-semibold border-transparent", item.status === 'published' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-slate-500/10 text-slate-500')}>
          {item.status}
        </Badge>
      ),
    },
    {
      header: 'Thao tác',
      cell: (item) => (
        <div className="flex justify-end gap-1.5 pr-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-foreground" 
            onClick={() => handleOpenEdit(item)}
            title="Sửa"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-red-500 hover:text-red-650 hover:bg-red-500/10" 
            onClick={() => void deleteMutation.mutateAsync(item.id)}
            title="Xóa"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
      className: 'text-right w-[100px]',
    },
  ];

  const rightActions = (
    <div className="flex items-center gap-2">
      <Select value={levelFilter} onValueChange={setLevelFilter}>
        <SelectTrigger className="w-[130px] h-10 rounded-[10px] text-xs font-semibold bg-slate-50/50">
          <SelectValue placeholder="Trình độ" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Mọi trình độ</SelectItem>
          <SelectItem value="academic">Academic</SelectItem>
          <SelectItem value="general">General</SelectItem>
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[130px] h-10 rounded-[10px] text-xs font-semibold bg-slate-50/50">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Mọi trạng thái</SelectItem>
          <SelectItem value="published">Đã đăng</SelectItem>
          <SelectItem value="draft">Bản nháp</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={() => { 
        setEditingItem(null); 
        setFormData({
          title: '',
          slug: '',
          subtitle: '',
          description: '',
          module: 'ielts',
          skill: activeTab,
          content_type: 'practice',
          level: 'academic',
          status: 'draft',
          thumbnail_url: '',
          audio_url: '',
          pdf_url: '',
          duration_seconds: 2400
        });
        setShowFormModal(true); 
      }} className="h-10 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-3 text-xs gap-1.5 rounded-[10px] shadow-sm shrink-0">
        <Plus className="w-4 h-4" /> Tạo bài tập
      </Button>
    </div>
  );

  return (
    <AdminPageLayout
      title="IELTS Content Manager"
      description="Quản lý kho học liệu, các bài thi thử Mock Tests, đề thi IELTS Reading/Listening."
      icon={BookOpen}
    >
      {/* Skill Tabs */}
      <nav aria-label="Skill Tabs" className="flex gap-1 border-b border-border/60 pb-px">
        {tabs.map(tab => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value as any)}
            className={cn(
              "px-4 py-2 text-xs font-semibold border-b-2 transition-colors relative -mb-px",
              activeTab === tab.value 
                ? 'border-primary text-foreground' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <AdminDataTable
        data={filteredItems}
        columns={columns}
        isLoading={isLoading}
        error={error}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm theo tiêu đề bài thi..."
        rightActions={rightActions}
        emptyTitle="Không tìm thấy bài thi nào"
        emptyDescription="Thử thay đổi bộ lọc hoặc thêm bài thi mới."
      />

      {/* Create / Edit Form Dialog */}
      <Dialog open={showFormModal} onOpenChange={setShowFormModal}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              {editingItem ? 'Cập nhật nội dung' : 'Tạo mới nội dung bài thi'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label className="text-xs font-semibold text-muted-foreground">Tiêu đề bài thi</Label>
              <Input 
                value={formData.title} 
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. IELTS Reading Mock Test 2"
                className="h-10 rounded-[10px]"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label className="text-xs font-semibold text-muted-foreground">Slug (Path)</Label>
              <Input 
                value={formData.slug} 
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="e.g. ielts-reading-mock-test-2"
                className="h-10 rounded-[10px]"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-xs font-semibold text-muted-foreground">Mô tả chi tiết</Label>
              <Textarea 
                value={formData.description} 
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Nội dung tóm tắt..."
                className="min-h-[80px] rounded-[10px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-xs font-semibold text-muted-foreground">Dạng bài</Label>
                <Select value={formData.content_type} onValueChange={(val) => setFormData(prev => ({ ...prev, content_type: val }))}>
                  <SelectTrigger className="h-10 rounded-[10px]"><SelectValue placeholder="Dạng bài" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="practice">Luyện tập (Practice)</SelectItem>
                    <SelectItem value="mock_test">Thi thử (Mock Test)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="text-xs font-semibold text-muted-foreground">Trình độ</Label>
                <Select value={formData.level} onValueChange={(val) => setFormData(prev => ({ ...prev, level: val }))}>
                  <SelectTrigger className="h-10 rounded-[10px]"><SelectValue placeholder="Trình độ" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="B2">Level B2</SelectItem>
                    <SelectItem value="C1">Level C1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-xs font-semibold text-muted-foreground">Trạng thái</Label>
                <Select value={formData.status} onValueChange={(val) => setFormData(prev => ({ ...prev, status: val }))}>
                  <SelectTrigger className="h-10 rounded-[10px]"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Bản nháp</SelectItem>
                    <SelectItem value="published">Đã đăng</SelectItem>
                    <SelectItem value="archived">Lưu trữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="text-xs font-semibold text-muted-foreground">Thời lượng (giây)</Label>
                <Input 
                  type="number" 
                  value={formData.duration_seconds} 
                  onChange={(e) => setFormData(prev => ({ ...prev, duration_seconds: Number(e.target.value) }))}
                  className="h-10 rounded-[10px]"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 mt-4">
              <Button type="button" variant="outline" onClick={() => setShowFormModal(false)} className="h-10 rounded-[10px] text-sm font-semibold">Hủy</Button>
              <Button type="submit" className="h-10 rounded-[10px] text-sm font-semibold">Lưu lại</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  );
}

export default AdminContentPage;
