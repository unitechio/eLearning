import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, Info, Play, Pause, RotateCcw, Volume2, HelpCircle } from 'lucide-react';
import { cn } from '@/shared/lib';
import { DictationHeader, QuestionNumberGrid } from './DictationShared';

interface WordDiff {
  text: string;
  status: 'correct' | 'incorrect' | 'missing' | 'extra';
}

export function DictationPracticePage() {
  const [topic, setTopic] = useState('science');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [dictationMode, setDictationMode] = useState<'sentence' | 'word'>('sentence');
  
  const [session, setSession] = useState<{
    id: string;
    expectedText: string;
    audioUrl: string;
  } | null>(null);

  const [activeQuestion, setActiveQuestion] = useState(1);
  const [answer, setAnswer] = useState('');
  const [checked, setChecked] = useState<number[]>([]);
  const [diffResult, setDiffResult] = useState<WordDiff[] | null>(null);
  const [hideQuestions, setHideQuestions] = useState(false);
  const [scriptOpen, setScriptOpen] = useState(true);
  
  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Seed topics & difficulty fallback in case API is offline
  const dictationDb: Record<string, Record<string, string>> = {
    science: {
      beginner: "The sun provides light and energy to all living things on Earth.",
      intermediate: "Carbon dioxide emissions contribute significantly to global warming and climate change.",
      advanced: "Photosynthesis is a fundamental biochemical process whereby autotrophic organisms convert solar energy into chemical energy.",
    },
    technology: {
      beginner: "Modern computers are fast and help us do homework quickly.",
      intermediate: "Artificial intelligence is reshaping various industries by automating repetitive tasks.",
      advanced: "Quantum computing introduces revolutionary paradigm shifts in cryptographic algorithms and parallel processing capabilities.",
    },
    education: {
      beginner: "Students study many different subjects in primary school.",
      intermediate: "Academic success is often associated with disciplined study habits and effective time management.",
      advanced: "Pedagogical paradigms are shifting towards self-directed learning models, fostering critical thinking and cognitive autonomy.",
    },
  };

  const getAudioPath = (t: string, d: string) => {
    // Generate synthetic audio path using public speech APIs or local speech synthesis backup
    return `https://dictation-audio-provider.local/audio/${t}-${d}.mp3`;
  };

  // Start new dictation practice session
  const startSession = async () => {
    try {
      // call backend start practice
      const response = await fetch('/api/v1/practice/dictation/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'dictation', topic, difficulty }),
      });
      if (response.ok) {
        const res = await response.json();
        setSession({
          id: res.data.id,
          expectedText: res.data.expected_text,
          audioUrl: res.data.audio_url,
        });
      } else {
        throw new Error('API offline');
      }
    } catch (e) {
      // Local fallback
      const text = dictationDb[topic]?.[difficulty] || dictationDb.science.intermediate;
      setSession({
        id: `mock-session-${Date.now()}`,
        expectedText: text,
        audioUrl: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3`, // public sample audio
      });
    }
    setAnswer('');
    setDiffResult(null);
  };

  useEffect(() => {
    startSession();
  }, [topic, difficulty]);

  // Audio control hooks
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const restartAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const formatTime = (timeInSecs: number) => {
    const mins = Math.floor(timeInSecs / 60);
    const secs = Math.floor(timeInSecs % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Compare answer and generate a color-coded word-by-word diff result
  const handleCheck = () => {
    if (!session) return;
    const cleanStr = (s: string) => s.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
    
    const expectedWords = session.expectedText.split(/\s+/);
    const answerWords = answer.split(/\s+/);

    const diffs: WordDiff[] = [];
    expectedWords.forEach((word, index) => {
      const cleanExpected = cleanStr(word);
      const cleanAnswer = cleanAnswerWord(answerWords[index]);

      if (cleanAnswer === cleanExpected) {
        diffs.push({ text: word, status: 'correct' });
      } else if (!cleanAnswer) {
        diffs.push({ text: word, status: 'missing' });
      } else {
        diffs.push({ text: word, status: 'incorrect' });
      }
    });

    // Add extra words typed by student
    if (answerWords.length > expectedWords.length) {
      answerWords.slice(expectedWords.length).forEach((word) => {
        diffs.push({ text: word, status: 'extra' });
      });
    }

    setDiffResult(diffs);
    setChecked((current) => Array.from(new Set([...current, activeQuestion])));
  };

  const cleanAnswerWord = (word?: string) => {
    if (!word) return "";
    return word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
  };

  // Speak aloud words
  const speakWord = async (word: string) => {
    try {
      const response = await fetch('/api/v1/public/practice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: word, locale: 'en', speed: 1.0 })
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
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <div className="ielts-test-shell min-h-screen bg-slate-50 font-sans">
      <DictationHeader />
      <main className="flex min-h-[calc(100vh-64px)] flex-col lg:flex-row">
        
        {/* Left Sidebar - Topic/Difficulty Selection */}
        <aside className="w-full border-r border-slate-200 bg-white p-6 lg:w-[280px] shrink-0" aria-label="Bộ lọc chép chính tả">
          <section className="space-y-6">
            <header>
              <h2 className="text-lg font-black text-slate-900">Thiết lập học</h2>
              <p className="text-xs text-slate-500">Tùy biến chủ đề & trình độ</p>
            </header>
            
            {/* Topic Select */}
            <div className="space-y-2">
              <label htmlFor="topic-select" className="text-sm font-bold text-slate-700">Chủ đề</label>
              <select
                id="topic-select"
                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold text-slate-800 outline-none focus:border-red-500"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                <option value="science">Khoa học (Science)</option>
                <option value="technology">Công nghệ (Technology)</option>
                <option value="education">Giáo dục (Education)</option>
              </select>
            </div>

            {/* Difficulty Select */}
            <div className="space-y-2">
              <span className="text-sm font-bold text-slate-700">Độ khó</span>
              <div className="grid grid-cols-3 gap-2">
                {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                  <button
                    key={lvl}
                    className={cn(
                      'rounded-xl border py-2 text-xs font-bold capitalize transition',
                      difficulty === lvl 
                        ? 'border-red-500 bg-red-50 text-red-600' 
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    )}
                    onClick={() => setDifficulty(lvl)}
                    type="button"
                  >
                    {lvl === 'beginner' ? 'Dễ' : lvl === 'intermediate' ? 'Vừa' : 'Khó'}
                  </button>
                ))}
              </div>
            </div>

            {/* Dictation Mode: Sentence or Word */}
            <div className="space-y-2">
              <span className="text-sm font-bold text-slate-700">Chế độ chép</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  className={cn(
                    'rounded-xl border py-2 text-xs font-bold transition',
                    dictationMode === 'sentence'
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  )}
                  onClick={() => setDictationMode('sentence')}
                  type="button"
                >
                  Từng câu
                </button>
                <button
                  className={cn(
                    'rounded-xl border py-2 text-xs font-bold transition',
                    dictationMode === 'word'
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  )}
                  onClick={() => setDictationMode('word')}
                  type="button"
                >
                  Từng từ
                </button>
              </div>
            </div>
          </section>
        </aside>

        {/* Center Content */}
        <section className="flex-1 px-4 py-8 sm:px-8">
          <div className="mx-auto max-w-3xl space-y-6">
            
            {/* Main Dictation Card */}
            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900">
                    Bài học #{activeQuestion}
                  </h3>
                  <p className="text-sm text-slate-500 capitalize">
                    {topic} • {difficulty}
                  </p>
                </div>
                <div className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-black uppercase text-slate-600">
                  Chế độ {dictationMode === 'sentence' ? 'Câu' : 'Từ'}
                </div>
              </header>

              {/* Custom Player Controls */}
              {session && (
                <div className="mt-8 rounded-2xl bg-slate-50 p-4 sm:p-6">
                  <audio
                    ref={audioRef}
                    src={session.audioUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={handleAudioEnded}
                  />
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition hover:bg-red-600"
                      onClick={togglePlay}
                      type="button"
                      aria-label={isPlaying ? "Tạm dừng" : "Phát"}
                    >
                      {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
                    </button>
                    
                    <button
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      onClick={restartAudio}
                      type="button"
                      aria-label="Phát lại từ đầu"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>

                    {/* Progress Slider */}
                    <div className="flex flex-1 items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">{formatTime(currentTime)}</span>
                      <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        value={currentTime}
                        onChange={(e) => {
                          if (audioRef.current) {
                            audioRef.current.currentTime = Number(e.target.value);
                            setCurrentTime(Number(e.target.value));
                          }
                        }}
                        className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-red-500"
                      />
                      <span className="text-xs font-bold text-slate-500">{formatTime(duration)}</span>
                    </div>

                    {/* Playback speed selector */}
                    <div className="flex items-center gap-1">
                      {[0.5, 0.75, 1, 1.25].map((rate) => (
                        <button
                          key={rate}
                          className={cn(
                            'rounded-lg px-2.5 py-1 text-xs font-bold border transition',
                            playbackRate === rate 
                              ? 'border-red-500 bg-red-50 text-red-600'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          )}
                          onClick={() => setPlaybackRate(rate)}
                          type="button"
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Dictation Input Area */}
              <div className="mt-8 space-y-4">
                <label htmlFor="dictation-input" className="text-sm font-bold text-slate-700">Viết lại câu bạn nghe được</label>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
                  <textarea
                    id="dictation-input"
                    className="h-28 w-full resize-none bg-transparent text-base font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                    onChange={(event) => setAnswer(event.target.value)}
                    placeholder="Bắt đầu nhập từ đây..."
                    value={answer}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <Info className="h-4 w-4 text-blue-500" />
                  <span>Ấn nút kiểm tra để xem từ viết đúng/sai. Click từ trong script để nghe lại.</span>
                </div>
                <div className="flex gap-3">
                  <button
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                    onClick={() => {
                      setAnswer('');
                      setDiffResult(null);
                    }}
                    type="button"
                  >
                    Làm lại
                  </button>
                  <button
                    className={cn(
                      'rounded-xl px-6 py-3 text-sm font-black transition shadow-sm',
                      answer.trim() ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-slate-100 text-slate-400'
                    )}
                    disabled={!answer.trim()}
                    onClick={handleCheck}
                    type="button"
                  >
                    Kiểm tra kết quả
                  </button>
                </div>
              </div>
            </article>

            {/* Visual Word-by-Word Diff Result */}
            {diffResult && (
              <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Kết quả đối chiếu</h4>
                <div className="mt-4 flex flex-wrap gap-2 text-lg font-black leading-relaxed">
                  {diffResult.map((wd, index) => (
                    <span
                      key={`${index}-${wd.text}`}
                      className={cn(
                        'px-2 py-0.5 rounded-lg border cursor-pointer select-none transition',
                        wd.status === 'correct' && 'bg-green-50 border-green-200 text-green-700',
                        wd.status === 'incorrect' && 'bg-red-50 border-red-200 text-red-600 line-through',
                        wd.status === 'missing' && 'bg-amber-50 border-amber-200 text-amber-600 border-dashed',
                        wd.status === 'extra' && 'bg-purple-50 border-purple-200 text-purple-600'
                      )}
                      onClick={() => speakWord(wd.text)}
                      title="Click để nghe lại từ này"
                    >
                      {wd.text}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex gap-4 text-xs font-semibold text-slate-500">
                  <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-green-500" /> Đúng</span>
                  <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-red-500" /> Sai</span>
                  <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-amber-500" /> Thiếu</span>
                  <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-purple-500" /> Dư</span>
                </div>
              </article>
            )}

            {/* Script & Translation Accordion */}
            {session && (
              <article className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <button
                  className="flex w-full items-center justify-between px-6 py-4 text-left font-black text-slate-900 hover:bg-slate-50"
                  onClick={() => setScriptOpen(!scriptOpen)}
                  type="button"
                >
                  <span>Script & Dịch nghĩa</span>
                  <ChevronDown className={cn('h-5 w-5 transition', scriptOpen ? 'rotate-180' : '')} />
                </button>
                {scriptOpen && (
                  <div className="border-t border-slate-100 p-6 space-y-4">
                    <div>
                      <span className="text-xs font-black uppercase text-slate-400">English script</span>
                      <p className="mt-2 text-base leading-relaxed text-slate-800">
                        {session.expectedText.split(/\s+/).map((word, i) => (
                          <button
                            key={`${i}-${word}`}
                            className="mr-1.5 border-b border-dotted border-slate-300 hover:text-red-500 hover:border-red-500 font-bold"
                            onClick={() => speakWord(word)}
                            title="Click để nghe phát âm"
                            type="button"
                          >
                            {word}
                          </button>
                        ))}
                      </p>
                    </div>
                    <div className="border-t border-slate-50 pt-4">
                      <span className="text-xs font-black uppercase text-slate-400">Dịch nghĩa tiếng Việt</span>
                      <p className="mt-2 italic text-slate-600">
                        {topic === 'science' && difficulty === 'beginner' && "Mặt trời cung cấp ánh sáng và năng lượng cho mọi sinh vật trên Trái đất."}
                        {topic === 'science' && difficulty === 'intermediate' && "Khí thải carbon dioxide đóng góp đáng kể vào sự nóng lên toàn cầu và biến đổi khí hậu."}
                        {topic === 'science' && difficulty === 'advanced' && "Quang hợp là một quá trình sinh hóa cơ bản mà qua đó các sinh vật tự dưỡng chuyển đổi năng lượng mặt trời thành năng lượng hóa học."}
                        {topic === 'technology' && difficulty === 'beginner' && "Máy tính hiện đại rất nhanh và giúp chúng ta làm bài tập về nhà một cách nhanh chóng."}
                        {topic === 'technology' && difficulty === 'intermediate' && "Trí tuệ nhân tạo đang định hình lại các ngành công nghiệp khác nhau bằng cách tự động hóa các nhiệm vụ lặp đi lặp lại."}
                        {topic === 'technology' && difficulty === 'advanced' && "Điện toán lượng tử giới thiệu những bước chuyển đổi mang tính cách mạng trong các thuật toán mã hóa và khả năng xử lý song song."}
                        {topic === 'education' && difficulty === 'beginner' && "Học sinh học nhiều môn học khác nhau ở trường tiểu học."}
                        {topic === 'education' && difficulty === 'intermediate' && "Thành công trong học tập thường gắn liền với thói quen học tập kỷ luật và quản lý thời gian hiệu quả."}
                        {topic === 'education' && difficulty === 'advanced' && "Các mô hình sư phạm đang chuyển dịch sang các mô hình học tập tự định hướng, thúc đẩy tư duy phản biện và sự tự chủ về mặt nhận thức."}
                        {!dictationDb[topic]?.[difficulty] && "Bản dịch nghĩa chi tiết đang được cập nhật."}
                      </p>
                    </div>
                  </div>
                )}
              </article>
            )}

          </div>
        </section>

      </main>
    </div>
  );
}
