import React, { useState } from 'react';
import { 
  FileText, 
  ArrowRight, 
  Clock, 
  Award,
  Sparkles, 
  Volume2, 
  BookOpen
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { 
  AdminPageLayout, AdminCard, AdminCardHeader, AdminCardTitle, AdminCardContent, AdminDataTable, type AdminColumnDef 
} from '@/shared/components/admin';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils';

interface WritingSubmission {
  id: string;
  user_email: string;
  prompt: string;
  response: string;
  word_count: number;
  ai_score: number;
  ai_feedback: string;
  teacher_audio_url: string;
  review_note?: string;
  annotated_text?: string; // JSON string
  criteria_scores?: string; // JSON string  
  is_graded: boolean;
  created_at: string;
}

const DEFAULT_ANNOTATIONS = [
  { start: 10, end: 22, type: "collocation", original: "make progress", alternative: "achieve progress", explanation: "While 'make progress' is fine, 'achieve significant progress' sounds more formal and academic for IELTS Task 2." },
  { start: 35, end: 44, type: "idiom", original: "on cloud nine", alternative: "extremely delighted", explanation: "Avoid casual idioms like 'on cloud nine' in formal writing. Use academic phrasing instead." },
  { start: 55, end: 64, type: "grammar", original: "he go", alternative: "he goes", explanation: "Subject-verb agreement: 'he' is singular, so it requires 'goes'." }
];

const DEFAULT_CRITERIA = {
  "Task Achievement": 7.0,
  "Coherence & Cohesion": 6.5,
  "Lexical Resource": 7.5,
  "Grammatical Range": 6.0
};

export function AdminWritingReviewPage() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'graded'>('all');

  // Form states for teacher review
  const [reviewNote, setReviewNote] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [scoreOverride, setScoreOverride] = useState<number>(7.0);

  // Fetch writing submissions
  const { data: submissionsData, isLoading, error } = useQuery({
    queryKey: ['admin-writing-submissions'],
    queryFn: async () => {
      try {
        const res = await apiClient.get<{ data: WritingSubmission[] }>('/admin/writing/submissions?page=1&page_size=50');
        return res.data.data;
      } catch {
        // Fallback mock data
        return [
          {
            id: "1",
            user_email: "nguyenvanA@gmail.com",
            prompt: "Some people think that universities should provide graduates with the knowledge and skills needed in the workplace. Others think that the true function of a university should be to give access to knowledge for its own sake, regardless of whether the course is useful to an employer. Discuss both views and give your opinion.",
            response: "Universities play a critical role in modern society. Some believe they should prepare students to make progress in their careers, while others suggest universities should focus on pure knowledge. If a student achieves pure knowledge, he go to any jobs and feel on cloud nine...",
            word_count: 260,
            ai_score: 6.5,
            ai_feedback: "The essay addresses both viewpoints but needs a clearer opinion statement in the introduction. Vocabulary is mostly appropriate with a few informal expressions. Grammar shows some singular/plural verb agreement errors.",
            teacher_audio_url: "",
            is_graded: false,
            created_at: "2026-07-23T08:00:00Z"
          },
          {
            id: "2",
            user_email: "lethib@yahoo.com",
            prompt: "The charts below show the percentage of water used for different purposes in six areas of the world. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
            response: "The pie charts illustrate water consumption across six continental areas split into industrial, agricultural, and domestic usage. North America and Europe use water mostly for industrial purposes, whereas Africa and Asia heavily consume water for agriculture...",
            word_count: 175,
            ai_score: 7.5,
            ai_feedback: "Very strong summary with high coherence. Correct comparisons made between industrialized and agricultural nations. Good range of lexical items. Minor article omission errors.",
            teacher_audio_url: "https://example.com/audio-review-2.mp3",
            review_note: "Excellent structural organization. Try to vary your transition words slightly more in the body paragraphs.",
            is_graded: true,
            created_at: "2026-07-22T14:30:00Z"
          }
        ] as WritingSubmission[];
      }
    }
  });

  const gradeMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string, payload: { audio_url: string; note: string; score: number } }) => {
      const res = await apiClient.post(`/admin/writing/submissions/${id}/grade`, payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Đã lưu kết quả chấm bài!');
      void queryClient.invalidateQueries({ queryKey: ['admin-writing-submissions'] });
      setReviewNote('');
      setAudioUrl('');
      setSelectedId(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Lỗi lưu kết quả chấm');
    }
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;
    gradeMutation.mutate({
      id: selectedId,
      payload: {
        audio_url: audioUrl,
        note: reviewNote,
        score: scoreOverride
      }
    });
  };

  const submissions = submissionsData || [];

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = sub.user_email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          sub.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'graded' && sub.is_graded) || 
                          (statusFilter === 'pending' && !sub.is_graded);
    return matchesSearch && matchesStatus;
  });

  const selectedSubmission = submissions.find(s => s.id === selectedId);

  const columns: AdminColumnDef<WritingSubmission>[] = [
    {
      header: 'Học viên',
      cell: (sub) => <span className="font-semibold text-foreground text-[13px]">{sub.user_email}</span>,
    },
    {
      header: 'Đề bài',
      cell: (sub) => <span className="text-muted-foreground truncate max-w-xs inline-block">{sub.prompt}</span>,
    },
    {
      header: 'Số từ',
      cell: (sub) => <span className="text-muted-foreground text-xs">{sub.word_count} từ</span>,
    },
    {
      header: 'Điểm AI',
      cell: (sub) => (
        <Badge variant="outline" className="text-[11px] font-medium border-border/80 text-muted-foreground inline-flex items-center gap-1">
          <Award className="h-3.5 w-3.5" />
          <span>Band {sub.ai_score}</span>
        </Badge>
      ),
    },
    {
      header: 'Trạng thái',
      cell: (sub) => (
        <Badge className={cn("text-[11px] font-semibold border-transparent", sub.is_graded ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400')}>
          {sub.is_graded ? 'Đã chấm' : 'Chờ chấm'}
        </Badge>
      ),
    },
    {
      header: 'Nộp lúc',
      cell: (sub) => <span className="text-muted-foreground text-xs">{new Date(sub.created_at).toLocaleDateString()}</span>,
    },
  ];

  const rightActions = (
    <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as any)}>
      <SelectTrigger className="w-[150px] h-10 rounded-[10px] text-xs font-semibold bg-slate-50/50">
        <SelectValue placeholder="Trạng thái" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Mọi trạng thái</SelectItem>
        <SelectItem value="pending">Chờ chấm</SelectItem>
        <SelectItem value="graded">Đã chấm</SelectItem>
      </SelectContent>
    </Select>
  );

  return (
    <AdminPageLayout
      title="Writing Review Console"
      description="Chấm điểm các bài viết Writing Task 1/Task 2, thu âm phản hồi và sửa chi tiết lỗi diễn đạt."
      icon={BookOpen}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full items-start">
        {/* Left List Pane */}
        <div className="lg:col-span-3">
          <AdminDataTable
            data={filteredSubmissions}
            columns={columns}
            isLoading={isLoading}
            error={error}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Tìm theo email học viên..."
            rightActions={rightActions}
            emptyTitle="Không tìm thấy bài viết nào"
            emptyDescription="Bài viết nộp bởi học viên sẽ xuất hiện tại đây để chấm điểm."
          />
        </div>

        {/* Selected Submission Side Panel */}
        <aside className="lg:col-span-1">
          {selectedSubmission ? (
            <AdminCard className="rounded-2xl">
              <AdminCardHeader className="flex flex-row justify-between items-center border-b border-border/60 pb-3.5">
                <div>
                  <AdminCardTitle className="text-sm font-semibold text-foreground">Chấm & Sửa bài</AdminCardTitle>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{selectedSubmission.user_email}</p>
                </div>
                <Button 
                  type="button" 
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => setSelectedId(null)}
                >
                  ✕
                </Button>
              </AdminCardHeader>

              <AdminCardContent className="space-y-6 pt-4">
                {/* Prompt and Essay Response */}
                <div className="space-y-4 max-h-[30vh] overflow-y-auto pr-1 no-scrollbar">
                  <div>
                    <h4 className="text-[10px] font-bold text-[#98A2B3] dark:text-[#71717a] uppercase tracking-[0.12em] mb-1">Đề bài (Prompt)</h4>
                    <p className="text-xs text-foreground/80 leading-relaxed font-semibold">
                      {selectedSubmission.prompt}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold text-[#98A2B3] dark:text-[#71717a] uppercase tracking-[0.12em] mb-1">Bài viết của học viên</h4>
                    <p className="text-xs text-foreground leading-relaxed p-3 bg-slate-50 dark:bg-slate-900 border border-border/80 rounded-2xl whitespace-pre-wrap font-sans">
                      {selectedSubmission.response}
                    </p>
                  </div>
                </div>

                {/* Annotated Suggestions Chips */}
                <div className="space-y-3 border-t border-border/50 pt-4">
                  <h4 className="text-[10px] font-bold text-[#98A2B3] dark:text-[#71717a] uppercase tracking-[0.12em]">Lỗi chi tiết cần sửa</h4>
                  <div className="space-y-2">
                    {DEFAULT_ANNOTATIONS.map((ann, idx) => (
                      <div 
                        key={idx}
                        className={cn(
                          "p-3.5 rounded-2xl border text-xs font-semibold space-y-1.5",
                          ann.type === 'grammar' 
                            ? 'border-red-100 dark:border-red-950/20 bg-red-50/20 dark:bg-red-950/10 text-red-800 dark:text-red-400' 
                            : ann.type === 'idiom' 
                              ? 'border-amber-100 dark:border-amber-950/20 bg-amber-50/20 dark:bg-amber-950/10 text-amber-800 dark:text-amber-400' 
                              : 'border-blue-100 dark:border-blue-950/20 bg-blue-50/20 dark:bg-blue-950/10 text-blue-800 dark:text-blue-400'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold underline">{ann.original}</span>
                          <ArrowRight className="h-3 w-3" />
                          <span className="font-bold bg-white dark:bg-slate-900 px-2 py-0.5 rounded-lg border border-border/60">{ann.alternative}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{ann.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Criteria detail scores bar */}
                <div className="space-y-3 border-t border-border/50 pt-4">
                  <h4 className="text-[10px] font-bold text-[#98A2B3] dark:text-[#71717a] uppercase tracking-[0.12em]">Tiêu chí chấm điểm</h4>
                  <div className="space-y-2.5">
                    {Object.entries(DEFAULT_CRITERIA).map(([criteria, score]) => (
                      <div key={criteria} className="space-y-1 text-xs">
                        <div className="flex justify-between font-bold">
                          <span className="text-foreground">{criteria}</span>
                          <span className="font-mono text-foreground">{score}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 rounded-full" 
                            style={{ width: `${(score / 9) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Teacher Form */}
                <form onSubmit={handleSubmitReview} className="border-t border-border/65 pt-4 space-y-4">
                  <h4 className="text-[10px] font-bold text-[#98A2B3] dark:text-[#71717a] uppercase tracking-[0.12em]">
                    Teacher Feedback & Grade
                  </h4>

                  <div className="grid gap-2">
                    <Label className="text-xs font-semibold text-muted-foreground">Nhận xét của Giáo viên</Label>
                    <Textarea 
                      value={reviewNote} 
                      onChange={(e) => setReviewNote(e.target.value)}
                      placeholder="Ghi chú phản hồi cho học viên..."
                      className="min-h-[80px] rounded-[10px] text-xs"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-xs font-semibold text-muted-foreground">Đường dẫn file âm thanh phản hồi (Audio URL)</Label>
                    <Input 
                      type="url" 
                      value={audioUrl} 
                      onChange={(e) => setAudioUrl(e.target.value)}
                      placeholder="https://example.com/audio.mp3"
                      className="h-10 rounded-[10px] text-xs"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-xs font-semibold text-muted-foreground">Điểm số tổng kết (Band Score)</Label>
                    <Input 
                      type="number" 
                      step="0.5" 
                      min="1" 
                      max="9"
                      value={scoreOverride} 
                      onChange={(e) => setScoreOverride(Number(e.target.value))}
                      className="h-10 rounded-[10px] font-mono text-sm"
                      required
                    />
                  </div>

                  <Button type="submit" disabled={gradeMutation.isPending} className="w-full h-10 rounded-[10px] text-sm font-semibold">
                    {gradeMutation.isPending ? 'Đang gửi...' : 'Gửi kết quả'}
                  </Button>
                </form>
              </AdminCardContent>
            </AdminCard>
          ) : (
            <div className="text-center py-16 text-muted-foreground border border-dashed border-border/80 rounded-2xl bg-slate-50/20 dark:bg-slate-900/10">
              Chọn bài viết ở danh sách để tiến hành chấm bài.
            </div>
          )}
        </aside>
      </div>
    </AdminPageLayout>
  );
}

export default AdminWritingReviewPage;
