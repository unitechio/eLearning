import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, Save, Check, Sparkles, BookOpen, User, HelpCircle } from 'lucide-react';
import { cn } from '@/shared/lib';

interface Annotation {
  start: number;
  end: number;
  type: 'idiom' | 'collocation' | 'grammar' | 'vocabulary';
  original: string;
  alternative: string;
  explanation: string;
}

interface CriteriaScores {
  [key: string]: number;
}

interface SubmissionDetail {
  id: string;
  prompt: string;
  response: string;
  wordCount: number;
  aiScore: number;
  aiFeedback: string;
  teacherAudioUrl: string;
  annotations: Annotation[];
  criteriaScores: CriteriaScores;
  isGraded: boolean;
}

export function AssignmentReviewPage() {
  const { id } = useParams<{ id: string }>();
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  
  // Interactive note popup state
  const [activeAnnotation, setActiveAnnotation] = useState<Annotation | null>(null);
  const [savedAnnotations, setSavedAnnotations] = useState<string[]>([]);
  
  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Fetch submission detail (with fallback mock)
    const fetchDetail = async () => {
      try {
        const response = await fetch(`/api/v1/writing/submissions/${id}`);
        if (response.ok) {
          const res = await response.json();
          setSubmission({
            id: res.data.id,
            prompt: res.data.prompt,
            response: res.data.response,
            wordCount: res.data.word_count,
            aiScore: res.data.ai_score,
            aiFeedback: res.data.ai_feedback,
            teacherAudioUrl: res.data.teacher_audio_url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            annotations: JSON.parse(res.data.annotated_text || '[]'),
            criteriaScores: JSON.parse(res.data.criteria_scores || '{}'),
            isGraded: res.data.is_graded,
          });
        } else {
          throw new Error('Fallback to mock');
        }
      } catch (e) {
        // High quality mock data for demo / offline fallback
        setSubmission({
          id: id || 'sample-writing-id',
          prompt: "Some people think that universities should provide graduates with the knowledge and skills needed in the workplace. Others think that the true function of a university should be to give access to knowledge for its own sake, regardless of whether the course is useful to an employer. Discuss both views and give your opinion.",
          response: "It is widely believed that universities should prepare graduates for their future career. In my opinion, I think that the primary goal of university education is to help students make progress in their chosen professions, but also to explore pure knowledge. For instance, when a student is on cloud nine with learning, he go beyond simple career training.",
          wordCount: 65,
          aiScore: 7.0,
          aiFeedback: "Your essay exhibits a clear stance and structures arguments logical. However, some informal idioms and grammatical errors prevent a higher band score.",
          teacherAudioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
          annotations: [
            {
              start: 135,
              end: 148,
              type: 'collocation',
              original: 'make progress',
              alternative: 'achieve rapid progress',
              explanation: "Dùng 'achieve rapid progress' hoặc 'attain significant advancement' thay cho cụm thông thường 'make progress' giúp bài viết mang tính học thuật cao hơn (Academic style)."
            },
            {
              start: 201,
              end: 214,
              type: 'idiom',
              original: 'on cloud nine',
              alternative: 'profoundly inspired',
              explanation: "Thành ngữ 'on cloud nine' mang sắc thái thân mật (informal), tránh dùng trong văn viết nghị luận IELTS Task 2. Hãy thay bằng 'deeply enthusiastic' hoặc 'profoundly inspired'."
            },
            {
              start: 234,
              end: 239,
              type: 'grammar',
              original: 'he go',
              alternative: 'he goes',
              explanation: "Lỗi hòa hợp chủ vị (Subject-Verb Agreement): Chủ từ là 'he' số ít, động từ chia ở hiện tại đơn phải là 'goes'."
            }
          ],
          criteriaScores: {
            "Task Achievement": 7.5,
            "Coherence & Cohesion": 7.0,
            "Lexical Resource": 6.5,
            "Grammatical Range": 6.5
          },
          isGraded: true,
        });
      }
    };
    fetchDetail();
  }, [id]);

  // Audio Control Handlers
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

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Rendering Annotated Essay Text
  const renderAnnotatedText = () => {
    if (!submission) return null;
    const { response: text, annotations } = submission;
    if (annotations.length === 0) return <p className="text-slate-800 text-lg leading-relaxed whitespace-pre-wrap">{text}</p>;

    // Sort annotations by start index
    const sorted = [...annotations].sort((a, b) => a.start - b.start);
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    sorted.forEach((ann, index) => {
      // Append text before highlight
      if (ann.start > lastIndex) {
        elements.push(
          <span key={`text-${lastIndex}`} className="text-slate-800 text-lg leading-relaxed">
            {text.substring(lastIndex, ann.start)}
          </span>
        );
      }

      // Determine highlight classes
      let underlineClass = '';
      if (ann.type === 'idiom') underlineClass = 'border-purple-500 bg-purple-50 hover:bg-purple-100/80 text-purple-900 border-b-2 decoration-purple-500';
      else if (ann.type === 'collocation') underlineClass = 'border-blue-500 bg-blue-50 hover:bg-blue-100/80 text-blue-900 border-b-2 decoration-blue-500';
      else if (ann.type === 'grammar') underlineClass = 'border-amber-500 bg-amber-50 hover:bg-amber-100/80 text-amber-900 border-b-2 decoration-amber-500';
      else underlineClass = 'border-emerald-500 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border-b-2 decoration-emerald-500';

      // Append Highlighted Span
      elements.push(
        <button
          key={`highlight-${ann.start}`}
          className={cn('inline px-1 py-0.5 rounded font-black cursor-pointer transition select-none', underlineClass)}
          onClick={() => setActiveAnnotation(ann)}
          type="button"
        >
          {text.substring(ann.start, ann.end)}
        </button>
      );
      lastIndex = ann.end;
    });

    // Append remaining text
    if (lastIndex < text.length) {
      elements.push(
        <span key={`text-${lastIndex}`} className="text-slate-800 text-lg leading-relaxed">
          {text.substring(lastIndex)}
        </span>
      );
    }

    return <p className="leading-loose whitespace-pre-wrap">{elements}</p>;
  };

  // Save annotation to student vocabulary book
  const handleSaveToVocab = async (ann: Annotation) => {
    try {
      await fetch('/api/v1/vocabulary/words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          term: ann.original,
          meaning: ann.explanation,
          part_of_speech: ann.type,
          example: `Native alternative: ${ann.alternative}`,
        }),
      });
    } catch (e) {
      // ignore
    }
    setSavedAnnotations((prev) => [...prev, ann.original]);
  };

  // Generate SVG Radar Chart coordinates
  const renderRadarChart = () => {
    if (!submission) return null;
    const scores = submission.criteriaScores;
    const keys = Object.keys(scores);
    if (keys.length === 0) return null;

    const center = 120;
    const radius = 80;
    const angleStep = (2 * Math.PI) / keys.length;

    // Calculate axis points
    const points = keys.map((key, i) => {
      const score = scores[key];
      const factor = score / 9.0; // IELTS Band 9 scale
      const angle = i * angleStep - Math.PI / 2;
      const x = center + radius * factor * Math.cos(angle);
      const y = center + radius * factor * Math.sin(angle);
      return { x, y, label: key, score };
    });

    const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');

    // Background circles
    const gridCircles = [0.33, 0.66, 1.0].map((factor) => {
      const r = radius * factor;
      return <circle key={factor} cx={center} cy={center} r={r} fill="none" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />;
    });

    // Grid lines from center to outer limit
    const gridLines = keys.map((_, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="#e2e8f0" strokeWidth="1" />;
    });

    // Render text labels around the polygon
    const labelElements = points.map((p, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const labelRadius = radius + 22;
      const lx = center + labelRadius * Math.cos(angle);
      const ly = center + labelRadius * Math.sin(angle);
      let textAnchor = 'middle';
      if (Math.cos(angle) > 0.1) textAnchor = 'start';
      else if (Math.cos(angle) < -0.1) textAnchor = 'end';

      return (
        <g key={i}>
          <text x={lx} y={ly} textAnchor={textAnchor} className="text-[10px] font-black fill-slate-500">{p.label}</text>
          <text x={lx} y={ly + 12} textAnchor={textAnchor} className="text-[10px] font-black fill-red-500">{p.score.toFixed(1)}</text>
        </g>
      );
    });

    return (
      <svg className="mx-auto" width="280" height="260">
        <rect width="280" height="260" fill="none" />
        {gridCircles}
        {gridLines}
        <polygon points={polygonPoints} fill="rgba(239, 68, 68, 0.15)" stroke="#ef4444" strokeWidth="2.5" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#ef4444" />
        ))}
        {labelElements}
      </svg>
    );
  };

  if (!submission) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-bold">Đang tải bài viết và nhận xét sửa bài...</p>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <header className="flex items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-4">
          <Link
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition"
            to="/lms"
            aria-label="Back to LMS"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Chi tiết bài sửa Assignment</h1>
            <p className="text-sm font-bold text-slate-500">Giáo viên chấm điểm & nhận xét bằng giọng nói</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-red-50 px-4 py-2 text-sm font-black text-red-600 border border-red-100">
            Overall Band {submission.aiScore.toFixed(1)}
          </span>
        </div>
      </header>

      {/* Grid Layout: Left Column = Essay & Audio, Right Column = Radar Chart & Interactive Note Detail */}
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        
        {/* Left Side: Essay display & Teacher Audio */}
        <section className="lg:col-span-2 space-y-6">
          
          {/* Teacher Commentary Block ("thu âm") */}
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 text-xs">🎙</span>
              Nhận xét bằng giọng nói của Giáo Viên
            </h2>
            <p className="mt-2 text-sm text-slate-500">Bạn sẽ có cảm giác như giáo viên đang ngồi cạnh và giảng bài trực tiếp.</p>
            
            {/* Custom Audio Player with Waveform Mock */}
            <div className="mt-6 rounded-2xl bg-red-50/50 border border-red-100 p-4 sm:p-6">
              <audio
                ref={audioRef}
                src={submission.teacherAudioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
              />
              <div className="flex flex-wrap items-center gap-4">
                <button
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-700"
                  onClick={togglePlay}
                  type="button"
                  aria-label={isPlaying ? "Pause commentary" : "Play commentary"}
                >
                  {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
                </button>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-red-200 bg-white text-red-600 hover:bg-red-50"
                  onClick={restartAudio}
                  type="button"
                  aria-label="Replay audio from start"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>

                {/* Progress bar */}
                <div className="flex-1 min-w-40 flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">{formatTime(currentTime)}</span>
                  <div className="relative flex-1 h-3 flex items-center bg-slate-200/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 transition-all duration-100" 
                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-500">{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </article>

          {/* Graded Essay Response Display */}
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <header className="border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-xl font-black text-slate-900">Bài viết của bạn</h2>
              <p className="mt-1 text-xs font-bold text-slate-400 uppercase tracking-wider">{submission.wordCount} từ • Bấm vào các cụm tô màu để xem hướng dẫn sửa chi tiết</p>
            </header>
            
            <div className="prose max-w-none">
              {renderAnnotatedText()}
            </div>
          </article>

          {/* Prompt/Question Card */}
          <article className="rounded-3xl border border-slate-200 bg-slate-100 p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Đề bài Assignment</h3>
            <p className="mt-3 font-semibold text-slate-700 leading-relaxed">{submission.prompt}</p>
          </article>

        </section>

        {/* Right Side: Radar Chart & Note Popover Details */}
        <section className="space-y-6">
          
          {/* Chart evaluation */}
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-center">
            <h2 className="text-lg font-black text-slate-900 mb-4">Đánh giá tiêu chí học thuật</h2>
            {renderRadarChart()}
          </article>

          {/* Interactive Annotation Popover / Detail View */}
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm min-h-60">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
              <Sparkles className="h-5 w-5 text-red-500" />
              Chi tiết lỗi & Gợi ý sửa
            </h2>

            {activeAnnotation ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={cn(
                    'rounded-full px-3 py-1 text-xs font-bold uppercase border',
                    activeAnnotation.type === 'idiom' && 'bg-purple-50 border-purple-200 text-purple-700',
                    activeAnnotation.type === 'collocation' && 'bg-blue-50 border-blue-200 text-blue-700',
                    activeAnnotation.type === 'grammar' && 'bg-amber-50 border-amber-200 text-amber-700',
                    activeAnnotation.type === 'vocabulary' && 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  )}>
                    {activeAnnotation.type === 'collocation' ? 'Collocation' : activeAnnotation.type === 'idiom' ? 'Idiom' : 'Ngữ pháp'}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase">Cụm gốc</h3>
                  <p className="text-base font-black text-slate-700 mt-1 line-through decoration-red-400">{activeAnnotation.original}</p>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase">Đề xuất thay thế</h3>
                  <p className="text-base font-black text-green-600 mt-1">{activeAnnotation.alternative}</p>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase">Giải thích chi tiết</h3>
                  <p className="text-sm font-semibold text-slate-600 mt-1 leading-relaxed">{activeAnnotation.explanation}</p>
                </div>

                {/* Save Note / Vocabulary Action */}
                <button
                  className={cn(
                    'mt-6 w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-black transition',
                    savedAnnotations.includes(activeAnnotation.original)
                      ? 'bg-green-500 text-white'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  )}
                  onClick={() => handleSaveToVocab(activeAnnotation)}
                  type="button"
                >
                  {savedAnnotations.includes(activeAnnotation.original) ? (
                    <>
                      <Check className="h-4 w-4" /> Đã lưu vào Sổ từ vựng
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Lưu để học sau
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center text-slate-400 space-y-3">
                <HelpCircle className="h-10 w-10 text-slate-300" />
                <p className="text-sm font-bold">Hãy click vào các cụm từ gạch chân trong bài viết để xem phân tích chi tiết của giáo viên.</p>
              </div>
            )}
          </article>

        </section>

      </div>
    </main>
  );
}
