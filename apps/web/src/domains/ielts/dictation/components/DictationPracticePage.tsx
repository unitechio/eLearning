import React from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, Info, Mic } from 'lucide-react';
import { cn } from '@/shared/lib';
import { dictationLesson, dictationSentences } from '../data';
import { AudioPracticeBar, DictationHeader, FloatingMagicButton, QuestionNumberGrid } from './DictationShared';

export function DictationPracticePage() {
  const [activeQuestion, setActiveQuestion] = React.useState(1);
  const [answer, setAnswer] = React.useState('');
  const [checked, setChecked] = React.useState<number[]>([]);
  const [hideQuestions, setHideQuestions] = React.useState(false);
  const [scriptOpen, setScriptOpen] = React.useState(true);

  const sentence = dictationSentences.find((item) => item.id === activeQuestion) ?? dictationSentences[0];
  const completed = checked;

  return (
    <div className="ielts-test-shell bg-slate-100">
      <DictationHeader />
      <main className="flex min-h-0 flex-1 overflow-y-auto">
        <QuestionNumberGrid
          active={activeQuestion}
          completed={completed}
          count={dictationLesson.sentenceCount}
          hidden={hideQuestions}
          onSelect={(value) => {
            setActiveQuestion(value);
            setAnswer('');
          }}
          onToggle={() => setHideQuestions((current) => !current)}
        />
        <section className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-8">
          <div className="ielts-question-card p-5 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button className="text-slate-500 hover:text-slate-900" onClick={() => setActiveQuestion((current) => Math.max(1, current - 1))} type="button">
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <p className="text-lg font-black text-slate-900">Câu {sentence.id}/42</p>
                <button className="text-slate-500 hover:text-slate-900" onClick={() => setActiveQuestion((current) => Math.min(42, current + 1))} type="button">
                  <ArrowRight className="h-5 w-5" />
                </button>
                <span className="text-sm font-bold text-slate-500">{sentence.wordCount} từ</span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-1 text-xs font-black">
                <span className={cn('inline-flex rounded-lg px-3 py-2', sentence.difficulty === 'easy' ? 'bg-slate-100 text-slate-900' : 'text-slate-500')}>EASY</span>
                <span className={cn('inline-flex rounded-lg px-3 py-2', sentence.difficulty === 'hard' ? 'bg-slate-100 text-slate-900' : 'text-slate-500')}>HARD</span>
              </div>
            </div>

            <div className="mt-8">
              <AudioPracticeBar duration={sentence.duration} />
            </div>

            <label className="mt-7 block rounded-xl bg-slate-100 p-5 focus-within:ring-2 focus-within:ring-blue-200">
              <textarea
                className="h-24 w-full resize-none bg-transparent text-base font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                onChange={(event) => setAnswer(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && answer.trim()) {
                    event.preventDefault();
                    setChecked((current) => Array.from(new Set([...current, sentence.id])));
                  }
                }}
                placeholder="Nhập những gì bạn nghe được"
                value={answer}
              />
              <div className="flex justify-end text-slate-500">
                <Mic className="h-5 w-5" />
              </div>
            </label>

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2 text-sm font-semibold text-slate-500">
                <p className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-600" /> Nhấn phím <kbd className="rounded border border-slate-300 bg-white px-2 py-1 text-xs">Enter</kbd> để kiểm tra.
                </p>
                <p>Chuyển qua Unikey Eng để tránh lỗi typing trên Macbook.</p>
              </div>
              <div className="flex gap-3">
                <button className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-500" onClick={() => setAnswer('')} type="button">Làm lại</button>
                <button
                  className={cn('rounded-xl px-5 py-3 text-sm font-black', answer.trim() ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-400')}
                  disabled={!answer.trim()}
                  onClick={() => setChecked((current) => Array.from(new Set([...current, sentence.id])))}
                  type="button"
                >
                  Kiểm tra
                </button>
              </div>
            </div>
          </div>

          <div className="ielts-question-card mt-6 overflow-hidden">
            <button className="flex w-full items-center justify-between px-5 py-4 text-left font-black text-slate-900" onClick={() => setScriptOpen((current) => !current)} type="button">
              Script, pronunciation & translate
              <ChevronDown className={cn('h-5 w-5 transition', scriptOpen ? 'rotate-180' : '')} />
            </button>
            {scriptOpen ? (
              <div>
                <div className="border-t border-slate-100 px-5 py-5">
                  <p className="text-sm font-bold uppercase text-slate-500">English <span className="ml-2 text-slate-400">A</span> <span className="normal-case">Click vào từ để nghe phát âm</span></p>
                  <p className="mt-3 text-base leading-7 text-slate-900">
                    {sentence.english.split(' ').map((word) => (
                      <button className="mr-1 border-b border-dotted border-slate-300 hover:text-blue-600" key={`${sentence.id}-${word}`} type="button">
                        {word}
                      </button>
                    ))}
                  </p>
                  <button className="mt-3 text-sm font-bold text-blue-600" type="button">♨ Luyện shadowing câu</button>
                </div>
                <div className="border-t border-slate-100 px-5 py-5">
                  <p className="text-sm font-bold uppercase text-slate-500">Vietnamese</p>
                  <p className="mt-3 italic leading-7 text-slate-700">{sentence.vietnamese}</p>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </main>
      <FloatingMagicButton />
    </div>
  );
}
