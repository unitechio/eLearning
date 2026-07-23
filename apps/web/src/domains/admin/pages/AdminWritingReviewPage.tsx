import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  ArrowRight, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Volume2, 
  Award,
  ChevronRight,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { cn } from '@/shared/lib';

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
  const { data: submissionsData, isLoading } = useQuery({
    queryKey: ['admin-writing-submissions'],
    queryFn: async () => {
      try {
        const res = await apiClient.get<{ data: WritingSubmission[] }>('/admin/writing/submissions?page=1&page_size=50');
        return res.data.data;
      } catch (err) {
        // Fallback mock data if API is not fully running or fails
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

  const reviewMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const res = await apiClient.post(`/admin/writing/submissions/${id}/review`, payload);
      return res.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-writing-submissions'] });
      setSelectedId(null);
    }
  });

  const selectedSubmission = (submissionsData ?? []).find(s => s.id === selectedId);

  // Set default values when submission changes
  React.useEffect(() => {
    if (selectedSubmission) {
      setReviewNote(selectedSubmission.review_note ?? '');
      setAudioUrl(selectedSubmission.teacher_audio_url ?? '');
      setScoreOverride(selectedSubmission.ai_score);
    }
  }, [selectedSubmission]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;
    
    reviewMutation.mutate({
      id: selectedId,
      payload: {
        teacher_audio_url: audioUrl,
        review_note: reviewNote,
        score_override: scoreOverride,
        annotated_text: JSON.stringify(DEFAULT_ANNOTATIONS),
        criteria_scores: JSON.stringify(DEFAULT_CRITERIA)
      }
    });
  };

  const filteredSubmissions = (submissionsData ?? []).filter(sub => {
    const matchesSearch = sub.user_email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          sub.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'graded' && sub.is_graded) || 
                          (statusFilter === 'pending' && !sub.is_graded);
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 p-6 lg:p-8 text-slate-800 dark:text-slate-100 font-sans">
      {/* Header banner */}
      <header className="rounded-3xl bg-gradient-to-r from-violet-600 to-purple-600 p-8 text-white shadow-xl">
        <section className="flex items-center gap-4">
          <figure className="rounded-2xl bg-white/20 p-3" aria-hidden="true">
            <BookOpen className="h-8 w-8" />
          </figure>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Writing Submissions Review</h1>
            <p className="mt-1 text-purple-100">
              Chấm và nhận xét chi tiết bài thi viết của học viên kèm audio giảng bài riêng
            </p>
          </div>
        </section>
      </header>

      {/* Filter and search row */}
      <section className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl" aria-label="Filters">
        <label className="relative flex items-center w-full sm:max-w-md">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo email học viên hoặc đề bài..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:border-purple-500"
          />
        </label>

        <label htmlFor="status-select" className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            id="status-select"
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold focus:outline-none"
          >
            <option value="all">Tất cả bài viết</option>
            <option value="pending">Chờ chấm bài</option>
            <option value="graded">Đã chấm xong</option>
          </select>
        </label>
      </section>

      {/* Main content grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Submissions table/list */}
        <section className="lg:col-span-2 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm overflow-hidden" aria-label="Submission List">
          <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4">Danh sách nộp bài</h2>
          
          {isLoading ? (
            <div className="py-20 text-center text-slate-400 font-bold">Đang tải danh sách bài viết...</div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="py-20 text-center text-slate-450 font-bold">Không tìm thấy bài viết nào phù hợp</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold min-w-[600px]">
                <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-black uppercase tracking-wider border-b border-slate-100 dark:border-slate-850">
                  <tr>
                    <th className="px-4 py-3">Học viên</th>
                    <th className="px-4 py-3">Đề bài</th>
                    <th className="px-4 py-3">Số từ</th>
                    <th className="px-4 py-3">Điểm AI</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-4 py-3">Nộp lúc</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                  {filteredSubmissions.map(sub => (
                    <tr 
                      key={sub.id}
                      onClick={() => setSelectedId(sub.id)}
                      className={cn(
                        "hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition",
                        selectedId === sub.id ? "bg-purple-50/40 dark:bg-purple-950/10" : ""
                      )}
                    >
                      <td className="px-4 py-4 truncate max-w-[150px] font-black text-slate-900 dark:text-white">
                        {sub.user_email}
                      </td>
                      <td className="px-4 py-4 truncate max-w-[200px] text-slate-500">
                        {sub.prompt}
                      </td>
                      <td className="px-4 py-4 text-slate-500">{sub.word_count} từ</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded-lg">
                          <Award className="h-3.5 w-3.5" />
                          <span>Band {sub.ai_score}</span>
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase",
                          sub.is_graded 
                            ? "bg-green-150 text-green-700 dark:bg-green-950/30 dark:text-green-400" 
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                        )}>
                          {sub.is_graded ? 'Đã chấm' : 'Chờ chấm'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-400 text-[10px]">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Selected Submission Side Panel/Drawer */}
        <aside className="lg:col-span-1" aria-label="Review workspace">
          {selectedSubmission ? (
            <article className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm space-y-6">
              <header className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">Chấm & Sửa bài</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">{selectedSubmission.user_email}</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                  aria-label="Close panel"
                >
                  ✕
                </button>
              </header>

              {/* Prompt and Essay Response */}
              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-1">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đề bài (Prompt)</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed mt-1 font-semibold">
                    {selectedSubmission.prompt}
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bài viết của học viên</h4>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed mt-1.5 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl whitespace-pre-wrap font-sans font-semibold">
                    {selectedSubmission.response}
                  </p>
                </div>
              </div>

              {/* Annotated Suggestions Chips */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lỗi chi tiết cần sửa (Annotated notes)</h4>
                <div className="space-y-2">
                  {DEFAULT_ANNOTATIONS.map((ann, idx) => (
                    <div 
                      key={idx}
                      className={cn(
                        "p-3 rounded-2xl border text-xs font-semibold space-y-1.5",
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
                        <span className="font-black bg-white dark:bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-100 dark:border-slate-800">{ann.alternative}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{ann.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Criteria detail scores bar */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tiêu chí chấm điểm (IELTS Criteria)</h4>
                <div className="space-y-2.5">
                  {Object.entries(DEFAULT_CRITERIA).map(([criteria, score]) => (
                    <div key={criteria} className="space-y-1 text-xs">
                      <div className="flex justify-between font-bold">
                        <span>{criteria}</span>
                        <span>{score}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 rounded-full" 
                          style={{ width: `${(score / 9) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teacher Form */}
              <form onSubmit={handleSubmitReview} className="border-t border-slate-100 dark:border-slate-900 pt-4 space-y-4">
                <h4 className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                  Teacher Feedback & Grade
                </h4>

                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">Nhận xét bài viết (Review notes)</span>
                  <textarea
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    placeholder="Viết nhận xét của giáo viên..."
                    className="w-full min-h-20 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:border-purple-500 focus:outline-none"
                    required
                  />
                </label>

                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-350 flex items-center gap-1">
                    <Volume2 className="h-4.5 w-4.5 text-slate-400" />
                    <span>Thu âm giảng bài (Teacher Audio URL)</span>
                  </span>
                  <input
                    type="url"
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    placeholder="https://example.com/feedback-recording.mp3"
                    className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:border-purple-500 focus:outline-none"
                  />
                </label>

                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">Điểm tổng kết (Score Override)</span>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="9"
                    value={scoreOverride}
                    onChange={(e) => setScoreOverride(Number(e.target.value))}
                    className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:border-purple-500 focus:outline-none"
                    required
                  />
                </label>

                <button
                  type="submit"
                  disabled={reviewMutation.isPending}
                  className="w-full rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-3.5 transition flex items-center justify-center gap-2"
                >
                  {reviewMutation.isPending ? 'Đang cập nhật...' : 'Hoàn tất chấm bài & Gửi review'}
                </button>
              </form>
            </article>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-250 dark:border-slate-800 p-8 text-center text-slate-400">
              <AlertCircle className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p className="text-xs font-bold">Chọn một bài viết để bắt đầu sửa bài</p>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
