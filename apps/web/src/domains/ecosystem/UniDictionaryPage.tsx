import React, { useState } from 'react';
import { BookOpen, Search, Volume2, Save, Check, Award, Compass, MessageCircle } from 'lucide-react';
import { cn } from '@/shared/lib';

interface DictionaryResult {
  word: string;
  ipa: string;
  wordType: string;
  meaning: string;
  collocation: string;
  idioms: string[];
  example: string;
}

export function UniDictionaryPage() {
  const [word, setWord] = useState('');
  const [result, setResult] = useState<DictionaryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const mockDb: Record<string, DictionaryResult> = {
    "diligent": {
      word: "diligent",
      ipa: "/ˈdɪl.ɪ.dʒənt/",
      wordType: "adjective",
      meaning: "Cần cù, siêng năng, chu đáo. (Careful and using a lot of effort).",
      collocation: "highly diligent student, diligent effort",
      idioms: ["work like a beaver (làm việc siêng năng)"],
      example: "She was a diligent student, always completing her assignments ahead of schedule."
    },
    "progress": {
      word: "progress",
      ipa: "/ˈprəʊ.ɡres/",
      wordType: "noun",
      meaning: "Sự tiến bộ, sự tiến triển. (Movement to an improved or more developed state).",
      collocation: "make significant progress, rapid progress",
      idioms: ["step by step (từng bước tiến bộ)"],
      example: "The class is making rapid progress in IELTS writing skills."
    },
    "evaluate": {
      word: "evaluate",
      ipa: "/ɪˈvæl.ju.eɪt/",
      wordType: "verb",
      meaning: "Đánh giá, ước lượng giá trị. (To judge or calculate the quality or value of something).",
      collocation: "carefully evaluate, evaluate performance",
      idioms: ["weigh up the pros and cons (cân nhắc ưu nhược điểm)"],
      example: "Teachers evaluate students' essay writing based on four academic criteria."
    }
  };

  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = word.trim().toLowerCase();
    if (!query) return;

    setIsLoading(true);
    setIsSaved(false);

    try {
      const response = await fetch(`/api/v1/dictionary/lookup?word=${encodeURIComponent(query)}`);
      if (response.ok) {
        const res = await response.json();
        setResult({
          word: res.data.word,
          ipa: res.data.ipa || `/${res.data.word}/`,
          wordType: res.data.word_type || 'noun',
          meaning: res.data.meaning,
          collocation: res.data.collocation || `${res.data.word} usage`,
          idioms: res.data.idiom ? [res.data.idiom] : ["N/A"],
          example: res.data.example,
        });
      } else {
        throw new Error('API offline');
      }
    } catch (err) {
      // Offline fallback mock
      setTimeout(() => {
        const found = mockDb[query];
        if (found) {
          setResult(found);
        } else {
          setResult({
            word: query,
            ipa: `/${query}/`,
            wordType: 'noun',
            meaning: `Định nghĩa của từ "${query}" đang được cập nhật trong từ điển điện tử DOL.`,
            collocation: `practice ${query}`,
            idioms: ["N/A"],
            example: `This is a sample sentence showing the term '${query}' in context.`
          });
        }
        setIsLoading(false);
      }, 500);
      return;
    }
    setIsLoading(false);
  };

  const speakWord = async () => {
    if (!result) return;
    try {
      const response = await fetch('/api/v1/public/practice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: result.word, locale: 'en', speed: 1.0 })
      });
      if (response.ok) {
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audio.play();
      } else {
        throw new Error("TTS failed");
      }
    } catch (e) {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(result.word);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleSaveWord = async () => {
    if (!result) return;
    setIsSaved(true);
    try {
      await fetch('/api/v1/dictionary/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: result.word }),
      });
    } catch (e) {
      // silent
    }
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <header className="text-center space-y-3 mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600">
          <BookOpen className="h-3.5 w-3.5" /> uni Dictionary
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Từ điển học thuật eEnglish</h1>
        <p className="text-sm font-semibold text-slate-500 max-w-xl mx-auto">Tra cứu từ vựng theo tư duy hệ thống. Tự động hiển thị IPA, collocations, idioms đi kèm ví dụ IELTS.</p>
      </header>

      {/* Search Bar Form */}
      <form onSubmit={handleLookup} className="relative rounded-3xl border-2 border-slate-200 bg-white p-3 flex items-center shadow-md">
        <Search className="h-6 w-6 text-slate-400 ml-3" />
        <input
          type="text"
          placeholder="Nhập từ cần tra cứu (ví dụ: diligent, progress, evaluate...)"
          className="flex-1 bg-transparent px-4 py-3 text-base font-bold text-slate-800 outline-none placeholder:text-slate-400"
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />
        <button
          type="submit"
          className="rounded-2xl bg-red-600 px-6 py-3 text-sm font-black text-white hover:bg-red-700 transition shadow-sm"
        >
          Tra cứu
        </button>
      </form>

      {/* Lookup Result Box */}
      <section className="mt-8">
        {isLoading ? (
          <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center text-slate-400">
            <span className="font-bold">Đang tra cứu từ vựng học thuật...</span>
          </div>
        ) : result ? (
          <article className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-300">
            
            {/* Word Header */}
            <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-black text-slate-900 capitalize">{result.word}</h2>
                  <button
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition"
                    onClick={speakWord}
                    type="button"
                    title="Nghe phát âm"
                    aria-label="Play pronunciation"
                  >
                    <Volume2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                  <span className="text-red-500 font-bold">{result.ipa}</span>
                  <span>•</span>
                  <span className="italic">{result.wordType}</span>
                </div>
              </div>

              {/* 1-click Save to Vocab */}
              <button
                className={cn(
                  'flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-black transition shadow-sm border',
                  isSaved 
                    ? 'bg-green-500 border-green-400 text-white' 
                    : 'bg-white border-slate-200 text-slate-700 hover:border-red-500 hover:bg-red-50 hover:text-red-600'
                )}
                onClick={handleSaveWord}
                type="button"
              >
                {isSaved ? (
                  <>
                    <Check className="h-4 w-4" /> Đã lưu từ vựng
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Lưu vào Sổ từ
                  </>
                )}
              </button>
            </header>

            {/* Meaning details */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="h-4 w-4 text-blue-500" /> Ý nghĩa của từ
                  </h3>
                  <p className="mt-2 text-base font-bold text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">{result.meaning}</p>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageCircle className="h-4 w-4 text-purple-500" /> Ví dụ thực tế (IELTS Context)
                  </h3>
                  <p className="mt-2 text-sm font-semibold italic text-slate-700 bg-purple-50/50 p-4 rounded-2xl border border-purple-100/50 leading-relaxed">{result.example}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-orange-500" /> Collocations phổ biến
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {result.collocation.split(',').map((col, idx) => (
                      <span key={idx} className="rounded-xl bg-orange-50 border border-orange-100 px-4 py-2 text-xs font-black text-orange-700">
                        {col.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    💡 Idioms chứa từ
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {result.idioms.map((idm, idx) => (
                      <li key={idx} className="text-xs font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {idm}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </article>
        ) : (
          <article className="rounded-3xl border-2 border-dashed border-slate-200 bg-white p-12 text-center text-slate-400 flex flex-col items-center justify-center">
            <Search className="h-10 w-10 text-slate-300 mb-2" />
            <p className="text-sm font-bold">Nhập từ vựng ở trên để bắt đầu tra cứu phát âm, dịch nghĩa và các collocations học thuật.</p>
          </article>
        )}
      </section>
    </main>
  );
}
