import React, { useState } from 'react';
import { Sparkles, ArrowRight, RotateCcw, CheckCircle, HelpCircle, GraduationCap, Play } from 'lucide-react';
import { cn } from '@/shared/lib';

interface ExerciseStep {
  id: number;
  storyText: string;
  questionType: 'fill-blank' | 'drag-drop' | 'sentence-order';
  questionPrompt: string;
  expectedText: string;
  // Type 1 & 2
  sentenceParts?: string[]; // e.g. ["Artificial intelligence is", "[blank]", "various industries."]
  correctAnswer: string;
  dragOptions?: string[];
  // Type 3
  scrambledWords?: string[];
}

export function StoryExerciseView() {
  const [currentStep, setCurrentStep] = useState(0);
  const [fillValue, setFillValue] = useState('');
  const [dragSelected, setDragSelected] = useState<string | null>(null);
  const [orderedWords, setOrderedWords] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [tutorMessage, setTutorMessage] = useState<string>('Chào mừng bạn! Hôm nay chúng ta sẽ cùng giải mã bí ẩn của Đảo Học Thuật. Hãy làm nhiệm vụ đầu tiên nhé!');

  const steps: ExerciseStep[] = [
    {
      id: 1,
      storyText: "Chúng ta đang đứng trước cánh cổng cổ kính của thư viện DOL. Để mở cổng, hãy điền từ còn thiếu vào câu dưới đây.",
      questionType: "fill-blank",
      questionPrompt: "Điền từ thích hợp vào chỗ trống:",
      sentenceParts: ["Artificial intelligence is", "[blank]", "various industries by automating repetitive tasks."],
      correctAnswer: "reshaping",
      expectedText: "Artificial intelligence is reshaping various industries by automating repetitive tasks."
    },
    {
      id: 2,
      storyText: "Tuyệt vời! Cổng đã mở. Bên trong thư viện có một hòm kho báu chứa các cụm từ đắt giá. Hãy kéo thả từ đúng vào ô để giải mã mật khẩu hòm nhé.",
      questionType: "drag-drop",
      questionPrompt: "Kéo thả từ đúng nhất để hoàn thiện tư duy câu:",
      sentenceParts: ["Academic success is often associated with", "[blank]", "study habits and effective time management."],
      correctAnswer: "disciplined",
      dragOptions: ["disciplined", "lazy", "careless"],
      expectedText: "Academic success is often associated with disciplined study habits and effective time management."
    },
    {
      id: 3,
      storyText: "Nhiệm vụ cuối cùng! Một cuộn giấy da cổ chứa triết lý giáo dục của DOL bị xáo trộn. Hãy bấm ghép các thẻ từ theo đúng thứ tự để khôi phục nguyên trạng.",
      questionType: "sentence-order",
      questionPrompt: "Bấm chọn các thẻ từ để tạo câu hoàn chỉnh:",
      correctAnswer: "Self-directed learning fosters critical thinking.",
      scrambledWords: ["fosters", "learning", "thinking.", "critical", "Self-directed"],
      expectedText: "Self-directed learning fosters critical thinking."
    }
  ];

  const activeStep = steps[currentStep];

  const handleCheck = () => {
    let userAns = '';
    if (activeStep.questionType === 'fill-blank') {
      userAns = fillValue.trim().toLowerCase();
    } else if (activeStep.questionType === 'drag-drop') {
      userAns = (dragSelected || '').trim().toLowerCase();
    } else if (activeStep.questionType === 'sentence-order') {
      userAns = orderedWords.join(' ').trim().toLowerCase();
    }

    const cleanCorrect = activeStep.correctAnswer.trim().toLowerCase();
    const correct = userAns === cleanCorrect;

    setIsCorrect(correct);
    setIsChecked(true);

    if (correct) {
      setTutorMessage("Xuất sắc! Bạn đã làm hoàn toàn chính xác. Thầy rất tự hào về tư duy nhạy bén của bạn!");
      playSuccessSound();
    } else {
      setTutorMessage(`Chưa chính xác rồi. Đáp án đúng phải là: "${activeStep.correctAnswer}". Đừng lo lắng, hãy xem giải thích và làm lại nhé!`);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setFillValue('');
      setDragSelected(null);
      setOrderedWords([]);
      setIsChecked(false);
      setTutorMessage("Hãy tiếp tục chặng tiếp theo của câu chuyện nào! Thầy đang ở đây cùng bạn.");
    } else {
      alert("Chúc mừng! Bạn đã hoàn thành câu chuyện học tập xuất sắc!");
      setCurrentStep(0);
      setFillValue('');
      setDragSelected(null);
      setOrderedWords([]);
      setIsChecked(false);
    }
  };

  const playSuccessSound = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Wonderful job!");
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleWordOrderClick = (word: string) => {
    if (orderedWords.includes(word)) {
      setOrderedWords(orderedWords.filter(w => w !== word));
    } else {
      setOrderedWords([...orderedWords, word]);
    }
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      
      {/* Top progress indicators */}
      <nav aria-label="Tiến trình học" className="flex items-center justify-between border-b border-slate-200 pb-4 mb-8 bg-white p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-6 w-6 text-red-500" />
          <h1 className="text-lg font-black text-slate-800">Hành trình Khám Phá DOL IELTS</h1>
        </div>
        <div className="flex items-center gap-2">
          {steps.map((s, idx) => (
            <div
              key={s.id}
              className={cn(
                'h-3 w-8 rounded-full transition-all duration-350',
                currentStep === idx ? 'bg-red-500 w-12' : idx < currentStep ? 'bg-green-500' : 'bg-slate-200'
              )}
            />
          ))}
        </div>
      </nav>

      {/* Grid Layout: Left Column = Story & Tutor Dialogue, Right Column = Interactive Question */}
      <div className="grid gap-8 md:grid-cols-5 items-start">
        
        {/* Tutor Dialogue & Narrative */}
        <section className="md:col-span-2 space-y-6">
          {/* Tutor Avatar Card */}
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center text-center">
            <div className="relative h-20 w-20 overflow-hidden rounded-full bg-red-100 flex items-center justify-center border-4 border-white shadow-md">
              <span className="text-3xl">👨‍🏫</span>
            </div>
            <h2 className="mt-3 text-lg font-black text-slate-900">Thầy DOL Đình Lực</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Giáo viên hỗ trợ tại nhà</p>
            
            {/* Dialogue Bubble */}
            <div className="relative mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-600 border border-slate-100 text-left leading-relaxed">
              <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-slate-50 border-t border-l border-slate-100" />
              {tutorMessage}
            </div>
          </article>

          {/* Story Narrative Box */}
          <article className="rounded-3xl border border-red-100 bg-red-50/50 p-6 leading-relaxed">
            <h3 className="text-xs font-black uppercase tracking-wider text-red-500 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              Cốt truyện hành trình
            </h3>
            <p className="mt-3 font-semibold text-slate-700">{activeStep.storyText}</p>
          </article>
        </section>

        {/* Interactive Question Card */}
        <section className="md:col-span-3">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 space-y-6">
            <header>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nhiệm vụ #{activeStep.id}</span>
              <h2 className="text-xl font-black text-slate-800 mt-1">{activeStep.questionPrompt}</h2>
            </header>

            {/* Render dynamically based on Question Type */}
            {activeStep.questionType === 'fill-blank' && (
              <div className="space-y-4">
                <div className="text-lg font-semibold text-slate-800 leading-loose flex flex-wrap items-center gap-2">
                  {activeStep.sentenceParts?.map((part, idx) => 
                    part === '[blank]' ? (
                      <input
                        key={idx}
                        id="fill-blank-input"
                        type="text"
                        className="border-b-2 border-slate-300 focus:border-red-500 outline-none px-2 py-1 text-center font-black text-red-600 w-32 bg-slate-50 rounded"
                        placeholder="điền từ"
                        value={fillValue}
                        onChange={(e) => setFillValue(e.target.value)}
                        disabled={isChecked}
                      />
                    ) : (
                      <span key={idx}>{part}</span>
                    )
                  )}
                </div>
              </div>
            )}

            {activeStep.questionType === 'drag-drop' && (
              <div className="space-y-6">
                <div className="text-lg font-semibold text-slate-800 leading-loose flex flex-wrap items-center gap-2">
                  {activeStep.sentenceParts?.map((part, idx) => 
                    part === '[blank]' ? (
                      <div
                        key={idx}
                        className={cn(
                          'min-w-28 h-10 border-2 border-dashed rounded-xl flex items-center justify-center font-black transition',
                          dragSelected ? 'border-red-500 bg-red-50 text-red-600' : 'border-slate-300 bg-slate-50 text-slate-400'
                        )}
                      >
                        {dragSelected || 'thả từ vào đây'}
                      </div>
                    ) : (
                      <span key={idx}>{part}</span>
                    )
                  )}
                </div>

                {/* Option Badges */}
                {!isChecked && activeStep.dragOptions && (
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                    {activeStep.dragOptions.map((opt) => (
                      <button
                        key={opt}
                        className={cn(
                          'rounded-full px-5 py-2.5 text-sm font-bold border transition shadow-sm',
                          dragSelected === opt
                            ? 'border-red-500 bg-red-50 text-red-600'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-red-300 hover:bg-slate-50'
                        )}
                        onClick={() => setDragSelected(opt)}
                        type="button"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeStep.questionType === 'sentence-order' && (
              <div className="space-y-6">
                {/* Assembled sentence workspace */}
                <div className="min-h-16 w-full border-2 border-dashed border-slate-200 rounded-2xl p-4 flex flex-wrap gap-2 items-center bg-slate-50">
                  {orderedWords.length === 0 ? (
                    <span className="text-sm font-bold text-slate-400">Bấm các thẻ từ bên dưới để ghép câu hoàn chỉnh...</span>
                  ) : (
                    orderedWords.map((word) => (
                      <button
                        key={word}
                        className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-2 text-sm font-bold text-blue-700 flex items-center gap-1.5 transition hover:bg-blue-100"
                        onClick={() => handleWordOrderClick(word)}
                        type="button"
                      >
                        {word}
                      </button>
                    ))
                  )}
                </div>

                {/* Scrambled word bank */}
                {!isChecked && activeStep.scrambledWords && (
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                    {activeStep.scrambledWords.map((word) => {
                      const isSelected = orderedWords.includes(word);
                      return (
                        <button
                          key={word}
                          className={cn(
                            'rounded-xl px-4 py-2 text-sm font-bold border transition shadow-sm',
                            isSelected 
                              ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-red-300 hover:bg-slate-50'
                          )}
                          disabled={isSelected}
                          onClick={() => handleWordOrderClick(word)}
                          type="button"
                        >
                          {word}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Check/Result State */}
            {isChecked && (
              <div className={cn(
                'rounded-2xl p-4 border flex items-start gap-3',
                isCorrect 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              )}>
                {isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                ) : (
                  <HelpCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-black text-sm">{isCorrect ? 'Đáp án đúng!' : 'Nhầm lẫn một chút rồi'}</h4>
                  <p className="text-xs font-semibold mt-1 leading-relaxed">
                    {isCorrect ? 'Bạn đã nắm rõ ngữ pháp và trường nghĩa của cụm từ này.' : `Đáp án đúng phải là: ${activeStep.correctAnswer}.`}
                  </p>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
              {isChecked ? (
                <button
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 text-sm font-black text-white hover:bg-red-700 transition shadow-md"
                  onClick={handleNext}
                  type="button"
                >
                  {currentStep === steps.length - 1 ? 'Hoàn thành câu chuyện' : 'Tiếp tục cốt truyện'} <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <>
                  <button
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
                    onClick={() => {
                      setFillValue('');
                      setDragSelected(null);
                      setOrderedWords([]);
                    }}
                    type="button"
                    title="Làm lại nhiệm vụ này"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                  <button
                    className="rounded-xl bg-red-600 px-6 py-3 text-sm font-black text-white hover:bg-red-700 transition shadow-md"
                    onClick={handleCheck}
                    type="button"
                  >
                    Nộp bài giải
                  </button>
                </>
              )}
            </div>
          </article>
        </section>

      </div>
    </main>
  );
}
