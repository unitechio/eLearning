import React, { useMemo, useState } from 'react';
import { Clock3, GripVertical, Play, RotateCcw, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/shared/lib';
import { listeningPracticeTest, type ListeningChoiceQuestion, type ListeningMatchOption, type ListeningMatchQuestion } from '../data';

type ListeningSection = 'choice' | 'matching';

function UniListeningBrand() {
  return (
    <Link className="flex items-center gap-3" to="/luyen-thi-ielts/ielts-listening-practice">
      <div className="relative h-12 w-12 overflow-hidden rounded-full bg-red-600">
        <div className="absolute -left-3 top-2 h-6 w-12 -rotate-12 rounded-full bg-white" />
        <div className="absolute bottom-2 right-1 h-5 w-7 -rotate-12 rounded-full bg-white" />
      </div>
      <div className="hidden leading-tight sm:block">
        <p className="text-[11px] font-black uppercase text-slate-950">UNI</p>
        <p className="text-[10px] font-bold uppercase text-slate-500">IELTS / SAT & Junior</p>
        <p className="text-base font-black uppercase text-slate-950">Đình Lực</p>
      </div>
    </Link>
  );
}

function ListeningHeader({ timer, onExit }: { timer: string; onExit: () => void }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-red-200 hover:text-red-600" onClick={onExit} type="button">
          <X className="h-5 w-5" />
        </button>
        <UniListeningBrand />
        <div className="hidden h-8 w-px bg-slate-200 md:block" />
        <div className="min-w-0">
          <p className="text-base font-black text-slate-900">Làm bài</p>
          <p className="truncate text-sm text-slate-600">{listeningPracticeTest.subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-red-600">
        <Clock3 className="h-5 w-5 text-slate-500" />
        <span className="text-base font-black tabular-nums">{timer}</span>
      </div>
    </header>
  );
}

function StartModal({ onStart }: { onStart: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
        <h2 className="text-2xl font-black text-slate-950">Bắt đầu</h2>
        <p className="mt-7 text-base text-slate-900">Bấm vào start khi bạn đã sẵn sàng</p>
        <div className="mt-9 flex justify-end">
          <button className="rounded-lg bg-red-600 px-5 py-3 text-sm font-black text-white" onClick={onStart} type="button">
            Start
          </button>
        </div>
      </div>
    </div>
  );
}

function QuestionBanner({ children }: { children: React.ReactNode }) {
  return <div className="ielts-question-banner">{children}</div>;
}

function ChoiceQuestion({
  question,
  selected,
  onSelect,
}: {
  question: ListeningChoiceQuestion;
  selected?: string;
  onSelect: (value: string) => void;
}) {
  return (
    <section className="space-y-4">
      <QuestionBanner>
        Question {question.id} <span className="font-semibold">Choose the correct letter, A, B or C.</span>
      </QuestionBanner>
      <div className="ielts-question-card p-6">
        <p className="text-sm font-black leading-6">
          <span className="text-blue-700">{question.id}.</span> {question.prompt}
        </p>
        <div className="mt-5 space-y-4">
          {question.options.map((option) => (
            <label className="flex cursor-pointer items-center gap-4 text-sm text-slate-950" key={option}>
              <span className={cn('ielts-choice-dot', selected === option && 'ielts-choice-dot-active')}>
                {selected === option ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
              </span>
              <input className="sr-only" name={`listening-${question.id}`} onChange={() => onSelect(option)} type="radio" value={option} />
              {option}
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}

function OptionCard({ option, onPick }: { option: ListeningMatchOption; onPick: (option: ListeningMatchOption) => void }) {
  return (
    <button className="flex w-full items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white px-3 py-3 text-left text-sm text-slate-700 transition hover:border-blue-400 hover:bg-blue-50" onClick={() => onPick(option)} type="button">
      <GripVertical className="h-5 w-5 shrink-0 text-slate-400" />
      <span>{option.text}</span>
    </button>
  );
}

function DropAnswer({
  question,
  option,
  active,
  onClear,
  onFocus,
}: {
  question: ListeningMatchQuestion;
  option?: ListeningMatchOption;
  active: boolean;
  onClear: () => void;
  onFocus: () => void;
}) {
  return (
    <div>
      <p className="text-sm leading-6">
        <span className="font-black text-blue-700">{question.id}.</span> {question.prompt}
      </p>
      <button className={cn('ielts-drop-zone mt-2 w-full justify-between', active && 'ielts-drop-zone-active', option && 'justify-between border-blue-400 text-slate-950')} onClick={onFocus} type="button">
        <span className="mx-auto">{option?.text ?? 'Drop or Select your answer'}</span>
        {option ? (
          <span
            className="ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500"
            onClick={(event) => {
              event.stopPropagation();
              onClear();
            }}
          >
            <X className="h-4 w-4" />
          </span>
        ) : null}
      </button>
    </div>
  );
}

function MatchingQuestions({
  answers,
  activeQuestion,
  onActiveQuestionChange,
  onAssign,
  onClear,
}: {
  answers: Record<number, string>;
  activeQuestion: number;
  onActiveQuestionChange: (question: number) => void;
  onAssign: (question: number, option: ListeningMatchOption) => void;
  onClear: (question: number) => void;
}) {
  const selectedIds = new Set(Object.values(answers).filter(Boolean));
  const availableOptions = listeningPracticeTest.matchingOptions.filter((option) => !selectedIds.has(option.id) || answers[activeQuestion] === option.id);

  return (
    <section className="space-y-4">
      <QuestionBanner>
        Question 4 - 10 <span className="font-semibold">Choose SEVEN answers from the box and write the correct letter, A-I, next to Questions 24-30.</span>
      </QuestionBanner>
      <div className="ielts-question-card grid gap-5 p-5 lg:grid-cols-[1fr,320px]">
        <div className="space-y-4">
          {listeningPracticeTest.matchingQuestions.map((question) => (
            <DropAnswer
              active={activeQuestion === question.id}
              key={question.id}
              onClear={() => onClear(question.id)}
              onFocus={() => onActiveQuestionChange(question.id)}
              option={listeningPracticeTest.matchingOptions.find((option) => option.id === answers[question.id])}
              question={question}
            />
          ))}
        </div>
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg lg:sticky lg:top-4 lg:self-start">
          <p className="text-sm font-black uppercase text-slate-700">Kéo option vào câu hỏi</p>
          <p className="mt-1 text-xs font-black uppercase text-slate-400">9 options</p>
          <div className="mt-4 space-y-2">
            {availableOptions.map((option) => (
              <OptionCard key={option.id} onPick={(picked) => onAssign(activeQuestion, picked)} option={option} />
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

function ListeningContent({
  section,
  choiceAnswers,
  matchingAnswers,
  activeDropQuestion,
  setChoiceAnswer,
  setActiveDropQuestion,
  setMatchingAnswer,
  clearMatchingAnswer,
}: {
  section: ListeningSection;
  choiceAnswers: Record<number, string>;
  matchingAnswers: Record<number, string>;
  activeDropQuestion: number;
  setChoiceAnswer: (question: number, answer: string) => void;
  setActiveDropQuestion: (question: number) => void;
  setMatchingAnswer: (question: number, option: ListeningMatchOption) => void;
  clearMatchingAnswer: (question: number) => void;
}) {
  return (
    <main className="min-h-0 flex-1 overflow-y-auto bg-slate-100 px-4 py-5">
      <div className="mx-auto max-w-5xl space-y-7 pb-24">
        {section === 'choice'
          ? listeningPracticeTest.multipleChoice.map((question) => (
            <ChoiceQuestion key={question.id} onSelect={(answer) => setChoiceAnswer(question.id, answer)} question={question} selected={choiceAnswers[question.id]} />
          ))
          : (
            <MatchingQuestions
              activeQuestion={activeDropQuestion}
              answers={matchingAnswers}
              onActiveQuestionChange={setActiveDropQuestion}
              onAssign={setMatchingAnswer}
              onClear={clearMatchingAnswer}
            />
          )}
      </div>
    </main>
  );
}

function AudioControlBar({ started }: { started: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="absolute -top-3 left-0 rounded bg-red-700 px-1 text-[10px] font-black text-white">00:00</div>
      <button className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-700" disabled={!started} type="button">
        <RotateCcw className="h-5 w-5" />
        <span className="absolute text-[9px] font-black">15</span>
      </button>
      <button className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-900" disabled={!started} type="button">
        <Play className="h-5 w-5 fill-current" />
      </button>
      <button className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-700" disabled={!started} type="button">
        <RotateCcw className="h-5 w-5 rotate-180" />
        <span className="absolute text-[9px] font-black">15</span>
      </button>
    </div>
  );
}

function ListeningFooter({
  section,
  answeredCount,
  started,
  onSectionChange,
}: {
  section: ListeningSection;
  answeredCount: number;
  started: boolean;
  onSectionChange: (section: ListeningSection) => void;
}) {
  return (
    <footer className="relative grid shrink-0 grid-cols-1 items-center gap-3 border-t border-slate-200 bg-white px-4 py-3 sm:grid-cols-[180px,1fr,120px]">
      <AudioControlBar started={started} />
      <div className="flex justify-center gap-2 overflow-x-auto">
        {Array.from({ length: 10 }, (_, index) => index + 1).map((number) => {
          const active = section === 'choice' ? number <= 3 : number >= 4;
          return (
            <button className={cn('flex h-8 min-w-10 items-center justify-center rounded-lg border px-2 text-sm font-black', active ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-300 bg-white text-slate-700')} key={number} onClick={() => onSectionChange(number <= 3 ? 'choice' : 'matching')} type="button">
              {number}
            </button>
          );
        })}
      </div>
      <div className="flex justify-end">
        <button className="rounded-xl bg-red-700 px-4 py-3 text-sm font-black text-white" type="button">Nộp bài</button>
      </div>
      <div className="absolute bottom-full left-0 h-1 w-full bg-slate-200">
        <div className="h-full bg-red-700" style={{ width: `${Math.max(4, answeredCount * 10)}%` }} />
      </div>
    </footer>
  );
}

export function IeltsListeningPractice() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [section, setSection] = useState<ListeningSection>('choice');
  const [activeDropQuestion, setActiveDropQuestion] = useState(6);
  const [choiceAnswers, setChoiceAnswers] = useState<Record<number, string>>({});
  const [matchingAnswers, setMatchingAnswers] = useState<Record<number, string>>({
    6: 'C',
  });

  const answeredCount = useMemo(
    () => Object.values(choiceAnswers).filter(Boolean).length + Object.values(matchingAnswers).filter(Boolean).length,
    [choiceAnswers, matchingAnswers],
  );

  const setChoiceAnswer = (question: number, answer: string) => {
    setChoiceAnswers((current) => ({ ...current, [question]: answer }));
  };

  const setMatchingAnswer = (question: number, option: ListeningMatchOption) => {
    setMatchingAnswers((current) => ({ ...current, [question]: option.id }));
  };

  const clearMatchingAnswer = (question: number) => {
    setMatchingAnswers((current) => {
      const next = { ...current };
      delete next[question];
      return next;
    });
  };

  return (
    <div className="ielts-test-shell">
      <ListeningHeader onExit={() => navigate('/luyen-thi-ielts/ielts-listening-practice')} timer={listeningPracticeTest.duration} />
      <ListeningContent
        activeDropQuestion={activeDropQuestion}
        choiceAnswers={choiceAnswers}
        clearMatchingAnswer={clearMatchingAnswer}
        matchingAnswers={matchingAnswers}
        section={section}
        setActiveDropQuestion={setActiveDropQuestion}
        setChoiceAnswer={setChoiceAnswer}
        setMatchingAnswer={setMatchingAnswer}
      />
      <ListeningFooter answeredCount={answeredCount} onSectionChange={setSection} section={section} started={started} />
      {!started ? <StartModal onStart={() => setStarted(true)} /> : null}
      <button className="fixed right-0 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-l-full bg-white text-blue-500 shadow-lg lg:flex" type="button">
        ✦
      </button>
    </div>
  );
}
