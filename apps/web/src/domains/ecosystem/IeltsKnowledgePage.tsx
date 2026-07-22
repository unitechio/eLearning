import React, { useState } from 'react';
import { Compass, BookOpen, Clock, Heart, Award, ArrowRight, User } from 'lucide-react';
import { cn } from '@/shared/lib';

interface KnowledgePost {
  title: string;
  category: string;
  author: string;
  readTime: string;
  summary: string;
  content: string;
  method: string;
}

export function IeltsKnowledgePage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedPost, setSelectedPost] = useState<KnowledgePost | null>(null);

  const filters = ['All', 'Writing', 'Speaking', 'Reading', 'Listening', 'LinearThinking'];

  const posts: KnowledgePost[] = [
    {
      title: "Phương pháp LinearThinking áp dụng trong IELTS Writing Task 2",
      category: "LinearThinking",
      author: "DOL IELTS Đình Lực",
      readTime: "6 min read",
      summary: "Cách đơn giản hóa câu hỏi Writing Task 2 bằng logic chuỗi nguyên nhân - kết quả, loại bỏ hoàn toàn tình trạng bí ý tưởng hoặc viết lan man.",
      content: "LinearThinking là phương pháp giúp tư duy tuyến tính, liên kết các mệnh đề chặt chẽ. Thay vì cố gắng liệt kê quá nhiều ý tưởng vụn vặt, người học chỉ cần phát triển 1 ý tưởng cốt lõi sâu sắc qua chuỗi logic A -> B -> C. Điều này giúp tối ưu điểm Coherence & Cohesion cũng như Grammatical Range trong IELTS Writing.",
      method: "LinearThinking"
    },
    {
      title: "Làm chủ IELTS Reading Section 3 bằng kỹ năng Skimming & Scanning",
      category: "Reading",
      author: "DOL Teacher Team",
      readTime: "8 min read",
      summary: "Chiến thuật định vị thông tin nhanh chóng trong các bài đọc học thuật phức tạp mà không cần hiểu hết 100% từ vựng.",
      content: "Skimming giúp bạn nắm được cấu trúc tổng quát của bài đọc và ý chính của từng đoạn (topic sentences). Scanning dùng để định vị các từ khóa đặc biệt như ngày tháng, tên riêng, số liệu hoặc thuật ngữ chuyên ngành. Kết hợp cả hai kỹ năng này giúp rút ngắn 35% thời gian làm bài Reading.",
      method: "Skimming & Scanning"
    },
    {
      title: "Cấu trúc trả lời Band 8.0+ cho IELTS Speaking Part 1",
      category: "Speaking",
      author: "DOL IELTS Coach",
      readTime: "5 min read",
      summary: "Công thức A.R.E.A (Answer - Reason - Example - Alternative) giúp xây dựng câu trả lời Speaking tự nhiên, mạch lạc và đầy đủ thông tin.",
      content: "Công thức A.R.E.A đảm bảo câu trả lời của bạn luôn có cấu trúc rõ ràng. Bạn bắt đầu bằng việc đưa ra câu trả lời trực tiếp (Answer), giải thích nguyên nhân (Reason), minh họa bằng ví dụ (Example), và đưa ra góc nhìn tương phản hoặc bổ sung (Alternative). Cấu trúc này giúp người nói tránh tình trạng ngập ngừng hoặc câu trả lời quá ngắn.",
      method: "A.R.E.A Formula"
    }
  ];

  const filteredPosts = activeFilter === 'All' 
    ? posts 
    : posts.filter((p) => p.category === activeFilter);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <header className="border-b border-slate-200 pb-5 mb-8">
        <h1 className="text-3xl font-black text-slate-900">Kiến thức IELTS tổng hợp</h1>
        <p className="text-sm font-bold text-slate-500 mt-1">Tổng hợp mẹo làm bài, chiến thuật phòng thi và bài mẫu IELTS Band 8.0+ từ DOL Đình Lực</p>
      </header>

      {/* Category filters */}
      <nav aria-label="Bộ lọc kiến thức" className="flex flex-wrap gap-2 mb-8">
        {filters.map((f) => (
          <button
            key={f}
            className={cn(
              'rounded-full px-5 py-2.5 text-xs font-black transition-all border shadow-sm',
              activeFilter === f
                ? 'bg-red-600 border-red-500 text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:border-red-300 hover:bg-slate-50'
            )}
            onClick={() => {
              setActiveFilter(f);
              setSelectedPost(null);
            }}
            type="button"
          >
            {f}
          </button>
        ))}
      </nav>

      {/* Grid view */}
      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* Posts list grid */}
        <section className="lg:col-span-2 grid gap-6 sm:grid-cols-2">
          {filteredPosts.map((post, idx) => (
            <article
              key={idx}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:border-red-300 transition flex flex-col justify-between"
            >
              <div className="space-y-4">
                <header className="flex items-center justify-between">
                  <span className="rounded-full bg-red-50 px-3 py-1 text-[10px] font-black uppercase text-red-600">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{post.readTime}</span>
                  </div>
                </header>
                <h2 className="text-lg font-black text-slate-900 leading-snug">{post.title}</h2>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-3">{post.summary}</p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-6">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-xs">👤</div>
                  <span className="text-[11px] font-bold text-slate-600">{post.author}</span>
                </div>
                <button
                  className="text-xs font-black text-red-500 flex items-center gap-1"
                  onClick={() => setSelectedPost(post)}
                  type="button"
                >
                  Đọc tiếp <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))}
        </section>

        {/* Selected Post Reader Panel */}
        <aside className="space-y-6" aria-label="Đọc chi tiết bài viết">
          {selectedPost ? (
            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5 animate-in fade-in duration-300">
              <header className="border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedPost.category}</span>
                <h2 className="text-xl font-black text-slate-900 mt-1 leading-snug">{selectedPost.title}</h2>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-bold mt-2">
                  <span className="text-slate-600">{selectedPost.author}</span>
                  <span>•</span>
                  <span>{selectedPost.readTime}</span>
                </div>
              </header>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phương pháp chủ chốt</h3>
                <span className="inline-block rounded-xl bg-red-50 border border-red-100 px-3 py-1.5 text-xs font-black text-red-700 mt-1.5">
                  {selectedPost.method}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tóm tắt</h3>
                <p className="text-sm font-semibold text-slate-600 mt-1.5 leading-relaxed">{selectedPost.summary}</p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nội dung chi tiết</h3>
                <p className="text-sm font-semibold text-slate-700 mt-2 leading-relaxed whitespace-pre-line">{selectedPost.content}</p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  onClick={() => alert("Đã thêm bài viết vào mục yêu thích!")}
                  type="button"
                >
                  <Heart className="h-4 w-4 text-red-500" /> Lưu bài viết
                </button>
              </div>
            </article>
          ) : (
            <article className="rounded-3xl border-2 border-dashed border-slate-200 bg-white p-8 text-center text-slate-400 flex flex-col items-center justify-center min-h-[300px]">
              <Compass className="h-10 w-10 text-slate-300 mb-2" />
              <p className="text-sm font-bold">Hãy chọn một bài viết học thuật ở bên trái để hiển thị chi tiết bài phân tích.</p>
            </article>
          )}
        </aside>

      </div>
    </main>
  );
}
