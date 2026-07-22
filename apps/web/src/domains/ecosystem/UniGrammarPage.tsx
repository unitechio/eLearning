import React, { useState } from 'react';
import { BookOpen, Search, ArrowRight, CheckCircle2, ChevronRight, Award } from 'lucide-react';
import { cn } from '@/shared/lib';

interface GrammarTopic {
  title: string;
  category: string;
  level: string;
  summary: string;
  rules: string[];
  example: string;
}

export function UniGrammarPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<GrammarTopic | null>(null);
  const [testScore, setTestScore] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});

  const topics: GrammarTopic[] = [
    {
      title: "Present Perfect Tense (Thì hiện tại hoàn thành)",
      category: "Tenses",
      level: "Intermediate",
      summary: "Diễn tả hành động bắt đầu ở quá khứ và vẫn tiếp tục ở hiện tại, hoặc hành động vừa mới xảy ra có liên quan tới hiện tại.",
      rules: [
        "Khẳng định: S + have/has + V3/ed",
        "Phủ định: S + have/has + not + V3/ed",
        "Nghi vấn: Have/Has + S + V3/ed?"
      ],
      example: "She has lived in Hanoi for ten years (She still lives in Hanoi now)."
    },
    {
      title: "Relative Clauses (Mệnh đề quan hệ)",
      category: "Clauses",
      level: "Advanced",
      summary: "Dùng để bổ nghĩa cho danh từ đứng trước nó trong câu chính, giúp câu trôi chảy và tránh lặp từ.",
      rules: [
        "Who: làm chủ từ chỉ người (S + Who + V)",
        "Whom: làm túc từ chỉ người (S + Whom + S + V)",
        "Which: thay thế cho danh từ chỉ vật",
        "That: thay thế cho who, whom, which trong mệnh đề quan hệ xác định"
      ],
      example: "The student who won the IELTS scholarship is my cousin."
    },
    {
      title: "Passive Voice (Câu bị động)",
      category: "Sentence Structures",
      level: "Intermediate",
      summary: "Nhấn mạnh đối tượng chịu tác động của hành động thay vì đối tượng thực hiện hành động.",
      rules: [
        "Công thức chung: S + be + V3/ed (+ by O)",
        "Thì hiện tại đơn: S + am/is/are + V3/ed",
        "Thì quá khứ đơn: S + was/were + V3/ed"
      ],
      example: "A delicious cake was baked by my sister yesterday."
    }
  ];

  const testQuestions = [
    {
      id: 1,
      q: "She ______ English since she was ten years old.",
      options: ["studies", "has studied", "studied", "is studying"],
      ans: "has studied"
    },
    {
      id: 2,
      q: "The book ______ you lent me yesterday was extremely interesting.",
      options: ["who", "whom", "which", "whose"],
      ans: "which"
    }
  ];

  const handleTestSubmit = () => {
    let score = 0;
    testQuestions.forEach((item) => {
      if (userAnswers[item.id] === item.ans) {
        score += 50;
      }
    });
    setTestScore(score);
  };

  const filteredTopics = topics.filter((t) => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      
      {/* Header Banner */}
      <header className="rounded-3xl bg-[linear-gradient(135deg,#ef4444_0%,#f87171_100%)] p-6 sm:p-8 text-white shadow-lg mb-8">
        <div className="max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="h-3.5 w-3.5" /> uni Grammar Library
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">Tra cứu & Luyện tập Ngữ pháp thông minh</h1>
          <p className="text-sm sm:text-base leading-relaxed text-red-50">Hệ thống ngữ pháp toàn diện bám sát định dạng IELTS với phương pháp LinearThinking độc quyền.</p>
        </div>
      </header>

      {/* Search and Grid Layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* Left Side: Topic list & search */}
        <section className="lg:col-span-2 space-y-6">
          <div className="relative rounded-2xl border border-slate-200 bg-white p-3 flex items-center shadow-sm">
            <Search className="h-5 w-5 text-slate-400 ml-2" />
            <input
              type="text"
              placeholder="Tìm kiếm chủ điểm ngữ pháp (ví dụ: Hiện tại hoàn thành, Mệnh đề quan hệ...)"
              className="flex-1 bg-transparent px-3 py-2 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {filteredTopics.map((topic, idx) => (
              <article
                key={idx}
                className={cn(
                  'rounded-3xl border p-6 transition shadow-sm cursor-pointer text-left space-y-4 bg-white',
                  selectedTopic?.title === topic.title ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200 hover:border-red-300'
                )}
                onClick={() => {
                  setSelectedTopic(topic);
                  setTestScore(null);
                  setUserAnswers({});
                }}
              >
                <div>
                  <span className="rounded-full bg-red-50 px-3 py-1 text-[10px] font-black uppercase text-red-600">
                    {topic.category}
                  </span>
                  <h2 className="text-lg font-black text-slate-800 mt-2 leading-snug">{topic.title}</h2>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold line-clamp-3">{topic.summary}</p>
                <div className="flex items-center text-xs font-black text-red-500 gap-1 pt-2">
                  <span>Học chủ điểm này</span> <ChevronRight className="h-3 w-3" />
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Right Side: Topic Detail Drawer or Grammar Quiz */}
        <aside className="space-y-6" aria-label="Chi tiết chủ điểm ngữ pháp và luyện tập">
          {selectedTopic ? (
            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5 animate-in fade-in duration-300">
              <header className="border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedTopic.level}</span>
                <h2 className="text-xl font-black text-slate-900 mt-1">{selectedTopic.title}</h2>
              </header>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tóm tắt lý thuyết</h3>
                <p className="text-sm font-semibold text-slate-600 mt-1.5 leading-relaxed">{selectedTopic.summary}</p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Quy tắc & Công thức</h3>
                <ul className="space-y-2">
                  {selectedTopic.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ví dụ thực tế</h3>
                <p className="text-sm font-bold italic text-slate-800 bg-red-50/50 p-3 rounded-xl border border-red-100/50 mt-1.5">{selectedTopic.example}</p>
              </div>

              {/* Grammar Practice Quiz */}
              <div className="border-t border-slate-100 pt-5 space-y-4">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-amber-500" /> Luyện tập nhanh
                </h3>

                {testQuestions.map((q) => (
                  <div key={q.id} className="space-y-2">
                    <p className="text-xs font-black text-slate-700">{q.id}. {q.q}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt) => (
                        <button
                          key={opt}
                          className={cn(
                            'rounded-xl border py-2 text-xs font-bold transition text-center',
                            userAnswers[q.id] === opt 
                              ? 'border-red-500 bg-red-50 text-red-600'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          )}
                          onClick={() => setUserAnswers({ ...userAnswers, [q.id]: opt })}
                          type="button"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {testScore !== null ? (
                  <div className="rounded-2xl bg-green-50 p-4 border border-green-200 text-center space-y-2">
                    <p className="text-sm font-black text-green-800">Kết quả kiểm tra: {testScore}/100 điểm!</p>
                    <button
                      className="text-xs font-bold text-blue-600 underline"
                      onClick={() => {
                        setTestScore(null);
                        setUserAnswers({});
                      }}
                      type="button"
                    >
                      Làm lại đề trắc nghiệm
                    </button>
                  </div>
                ) : (
                  <button
                    className="w-full rounded-xl bg-red-600 py-3 text-xs font-black text-white hover:bg-red-700 transition shadow-md flex items-center justify-center gap-1.5"
                    onClick={handleTestSubmit}
                    type="button"
                  >
                    Nộp bài test <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </article>
          ) : (
            <article className="rounded-3xl border-2 border-dashed border-slate-200 bg-white p-8 text-center text-slate-400 flex flex-col items-center justify-center min-h-[300px]">
              <BookOpen className="h-10 w-10 text-slate-300 mb-2" />
              <p className="text-sm font-bold">Hãy chọn một chủ điểm ngữ pháp bên trái để bắt đầu tra cứu và làm bài kiểm tra nhanh.</p>
            </article>
          )}
        </aside>

      </div>
    </main>
  );
}
