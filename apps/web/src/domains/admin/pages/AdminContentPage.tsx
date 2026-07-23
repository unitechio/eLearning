import React, { useState } from 'react';
import { 
  BookOpen, 
  Headphones, 
  PenSquare, 
  Mic, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  UploadCloud,
  Loader2
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { cn } from '@/shared/lib';

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
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    subtitle: string;
    description: string;
    module: string;
    skill: 'reading' | 'listening' | 'writing' | 'speaking';
    content_type: string;
    level: string;
    status: string;
    thumbnail_url: string;
    audio_url: string;
    pdf_url: string;
    duration_seconds: number;
  }>({
    title: '',
    slug: '',
    subtitle: '',
    description: '',
    module: 'ielts',
    skill: 'reading',
    content_type: 'practice',
    level: 'academic',
    status: 'draft',
    thumbnail_url: '',
    audio_url: '',
    pdf_url: '',
    duration_seconds: 2400
  });

  // Query Content Items
  const { data: contentData, isLoading } = useQuery({
    queryKey: ['admin-ielts-content'],
    queryFn: async () => {
      try {
        const res = await apiClient.get<{ data: IELTSContentItem[] }>('/admin/ielts/content?page=1&page_size=100');
        return res.data.data;
      } catch {
        // Fallback Mock Data if API fails
        return [
          { id: 1, title: "IELTS Reading Test 1 - Cam 18", slug: "ielts-reading-test-1-cam-18", module: "ielts", skill: "reading", content_type: "mock_test", level: "academic", status: "published", thumbnail_url: "/api/v1/public/media/serve?key=thumbnails/default.jpg" },
          { id: 2, title: "IELTS Listening Practice 2", slug: "ielts-listening-practice-2", module: "ielts", skill: "listening", content_type: "practice", level: "general", status: "draft", thumbnail_url: "" },
          { id: 3, title: "IELTS Writing Task 2 Topic 3", slug: "ielts-writing-task-2-topic-3", module: "ielts", skill: "writing", content_type: "practice", level: "academic", status: "published", thumbnail_url: "" },
          { id: 4, title: "IELTS Speaking Part 1 Warm-up", slug: "ielts-speaking-part-1-warm-up", module: "ielts", skill: "speaking", content_type: "practice", level: "academic", status: "published", thumbnail_url: "" }
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
      void queryClient.invalidateQueries({ queryKey: ['admin-ielts-content'] });
      setShowFormModal(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: typeof formData }) => {
      const res = await apiClient.put(`/admin/ielts/content/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-ielts-content'] });
      setShowFormModal(false);
      setEditingItem(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/admin/ielts/content/${id}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-ielts-content'] });
    }
  });

  const handleOpenCreate = () => {
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
  };

  const handleOpenEdit = (item: IELTSContentItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      slug: item.slug,
      subtitle: item.subtitle || '',
      description: item.description || '',
      module: item.module,
      skill: item.skill,
      content_type: item.content_type,
      level: item.level,
      status: item.status,
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
  };

  const filteredItems = (contentData ?? []).filter(item => {
    const matchesSkill = item.skill === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || item.level === levelFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSkill && matchesSearch && matchesLevel && matchesStatus;
  });

  const getSkillIcon = (skill: string) => {
    switch (skill) {
      case 'listening': return Headphones;
      case 'writing': return PenSquare;
      case 'speaking': return Mic;
      default: return BookOpen;
    }
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 p-6 lg:p-8 text-slate-800 dark:text-slate-100 font-sans">
      {/* Header banner */}
      <header className="rounded-3xl bg-gradient-to-r from-red-500 to-rose-600 p-8 text-white shadow-xl flex items-center justify-between flex-wrap gap-4">
        <section className="flex items-center gap-4">
          <figure className="rounded-2xl bg-white/20 p-3" aria-hidden="true">
            <BookOpen className="h-8 w-8" />
          </figure>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Content Management</h1>
            <p className="mt-1 text-red-100">
              Quản lý và tạo/sửa nội dung luyện thi IELTS Đọc, Nghe, Viết, Nói
            </p>
          </div>
        </section>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-white text-rose-600 hover:bg-slate-50 font-black text-xs px-5 py-3 rounded-2xl transition shadow-md shrink-0"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Tạo bài thi mới</span>
        </button>
      </header>

      {/* Tabs bar selector */}
      <section className="flex flex-col sm:flex-row gap-4 items-center justify-between" aria-label="Controls">
        <nav className="flex items-center gap-2 bg-slate-200/60 dark:bg-slate-800/60 p-1 rounded-2xl" aria-label="Skill groups">
          {(['reading', 'listening', 'writing', 'speaking'] as const).map(skill => {
            const Icon = getSkillIcon(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => setActiveTab(skill)}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 capitalize",
                  activeTab === skill 
                    ? "bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                )}
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{skill}</span>
              </button>
            );
          })}
        </nav>

        {/* Filters and Search */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tiêu đề bài thi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-red-500"
            />
          </label>

          <label htmlFor="level-select">
            <select
              id="level-select"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold focus:outline-none"
            >
              <option value="all">Mọi trình độ</option>
              <option value="academic">Academic</option>
              <option value="general">General</option>
            </select>
          </label>

          <label htmlFor="status-select">
            <select
              id="status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold focus:outline-none"
            >
              <option value="all">Mọi trạng thái</option>
              <option value="published">Đã đăng</option>
              <option value="draft">Bản nháp</option>
            </select>
          </label>
        </div>
      </section>

      {/* Main card list table */}
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm overflow-hidden" aria-label="Contents list">
        {isLoading ? (
          <div className="py-20 text-center text-slate-400 font-bold">Đang tải danh sách bài tập...</div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center text-slate-450 font-bold">Không tìm thấy bài thi nào phù hợp</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold min-w-[650px]">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-black uppercase tracking-wider border-b border-slate-100 dark:border-slate-850">
                <tr>
                  <th className="px-4 py-3">Tiêu đề bài thi</th>
                  <th className="px-4 py-3">Slug / Path</th>
                  <th className="px-4 py-3">Dạng bài</th>
                  <th className="px-4 py-3">Trình độ</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                {filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900 transition">
                    <td className="px-4 py-4 font-bold text-slate-900 dark:text-white truncate max-w-[220px]">
                      {item.title}
                    </td>
                    <td className="px-4 py-4 text-slate-450 font-mono text-[10px] truncate max-w-[150px]">{item.slug}</td>
                    <td className="px-4 py-4 capitalize">{item.content_type.replace('_', ' ')}</td>
                    <td className="px-4 py-4 uppercase font-bold text-slate-500">{item.level}</td>
                    <td className="px-4 py-4">
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide",
                        item.status === 'published' 
                          ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400" 
                          : "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-450"
                      )}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <nav className="inline-flex gap-2" aria-label="Item actions">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
                          aria-label="Edit item"
                        >
                          <Edit className="h-4.5 w-4.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => void deleteMutation.mutateAsync(item.id)}
                          className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/35 rounded-lg text-slate-500 hover:text-rose-600 transition"
                          aria-label="Delete item"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </nav>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Create / Edit Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <article 
            className="w-full max-w-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 relative max-h-[85vh] overflow-y-auto flex flex-col gap-4 text-slate-800 dark:text-slate-100 font-sans"
            role="dialog"
            aria-modal="true"
            aria-label="Content form editor"
          >
            <button 
              type="button" 
              onClick={() => setShowFormModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-650"
              aria-label="Close"
            >
              ✕
            </button>

            <header>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {editingItem ? 'Cập nhật nội dung' : 'Tạo mới nội dung bài thi'}
              </h3>
            </header>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold">
              <label className="block space-y-1">
                <span className="text-slate-500">Tiêu đề bài thi</span>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. IELTS Reading Mock Test 2"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs focus:outline-none focus:border-red-400"
                  required
                />
              </label>

              <label className="block space-y-1">
                <span className="text-slate-500">Slug (Path)</span>
                <input 
                  type="text" 
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="e.g. ielts-reading-mock-test-2"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs focus:outline-none focus:border-red-400"
                  required
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block space-y-1">
                  <span className="text-slate-500">Loại bài thi</span>
                  <select 
                    value={formData.content_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, content_type: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 px-3 py-2.5 focus:outline-none"
                  >
                    <option value="practice">Luyện tập (Practice)</option>
                    <option value="mock_test">Thi thử (Mock Test)</option>
                  </select>
                </label>

                <label className="block space-y-1">
                  <span className="text-slate-500">Học phần (Skill)</span>
                  <select 
                    value={formData.skill}
                    onChange={(e: any) => setFormData(prev => ({ ...prev, skill: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-855 bg-white dark:bg-slate-900 px-3 py-2.5 focus:outline-none"
                  >
                    <option value="reading">Đọc (Reading)</option>
                    <option value="listening">Nghe (Listening)</option>
                    <option value="writing">Viết (Writing)</option>
                    <option value="speaking">Nói (Speaking)</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="block space-y-1">
                  <span className="text-slate-500">Trình độ</span>
                  <select 
                    value={formData.level}
                    onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-855 bg-white dark:bg-slate-900 px-3 py-2.5 focus:outline-none"
                  >
                    <option value="academic">Academic</option>
                    <option value="general">General</option>
                    <option value="B2">B2 Intermediate</option>
                    <option value="C1">C1 Advanced</option>
                  </select>
                </label>

                <label className="block space-y-1">
                  <span className="text-slate-500">Trạng thái</span>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-855 bg-white dark:bg-slate-900 px-3 py-2.5 focus:outline-none"
                  >
                    <option value="draft">Bản nháp (Draft)</option>
                    <option value="published">Đăng bán (Published)</option>
                  </select>
                </label>
              </div>

              <div className="space-y-3">
                <label className="block space-y-1">
                  <span className="text-slate-500">Thumbnail URL</span>
                  <input 
                    type="url" 
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, thumbnail_url: e.target.value }))}
                    placeholder="https://example.com/thumbnail.png"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 focus:outline-none"
                  />
                </label>

                {formData.skill === 'listening' && (
                  <label className="block space-y-1">
                    <span className="text-slate-500">Audio File URL</span>
                    <input 
                      type="url" 
                      value={formData.audio_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, audio_url: e.target.value }))}
                      placeholder="https://example.com/listening.mp3"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 focus:outline-none"
                    />
                  </label>
                )}

                {formData.skill === 'reading' && (
                  <label className="block space-y-1">
                    <span className="text-slate-500">Document PDF URL</span>
                    <input 
                      type="url" 
                      value={formData.pdf_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, pdf_url: e.target.value }))}
                      placeholder="https://example.com/reading-material.pdf"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 focus:outline-none"
                    />
                  </label>
                )}
              </div>

              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="w-full rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3.5 transition flex items-center justify-center gap-2"
              >
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>{editingItem ? 'Cập nhật' : 'Tạo mới nội dung'}</span>
              </button>
            </form>
          </article>
        </div>
      )}
    </main>
  );
}
