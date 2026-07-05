import React from 'react';
import { ArrowLeft, BookOpenText, Facebook, Mic, RotateCcw, Share2, Sparkles, Volume2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/lib';
import { dictationLesson } from '../data';

export function UniPracticeLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-red-600">
        <div className="absolute -left-3 top-2 h-5 w-11 -rotate-12 rounded-full bg-white" />
        <div className="absolute bottom-2 right-1 h-4 w-6 -rotate-12 rounded-full bg-white" />
      </div>
      <div className="hidden leading-tight sm:block">
        <p className="text-[11px] font-black uppercase text-slate-950">UNI</p>
        <p className="text-[10px] font-bold uppercase text-slate-500">IELTS / SAT & Junior</p>
        <p className="text-base font-black uppercase text-slate-950">Đình Lực</p>
      </div>
    </div>
  );
}

export function DictationHeader({
  mode = 'dictation',
}: {
  mode?: 'dictation' | 'shadowing' | 'vocabulary';
}) {
  const isDictation = mode === 'dictation';
  const title = mode === 'shadowing' ? 'Luyện shadowing' : mode === 'vocabulary' ? 'Luyện phát âm từ vựng' : dictationLesson.title;
  const subtitle = mode === 'vocabulary' ? '13 từ' : mode === 'shadowing' ? '42 câu' : dictationLesson.subtitle;

  return (
    <header className="sticky top-0 z-40 flex min-h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm">
      <div className="flex min-w-0 items-center gap-4">
        <Link
          className={cn(
            'flex h-11 items-center justify-center rounded-xl border border-slate-200 px-3 text-sm font-bold text-slate-700 transition hover:border-red-200 hover:text-red-600',
            isDictation ? 'w-11 px-0' : 'gap-2',
          )}
          to={isDictation ? '/luyen-thi-ielts/ielts-listening-practice' : `/chep-chinh-ta/${dictationLesson.slug}`}
        >
          {isDictation ? <X className="h-5 w-5" /> : <ArrowLeft className="h-4 w-4" />}
          {!isDictation ? <span className="hidden sm:inline">Quay về Chép chính tả</span> : null}
        </Link>
        <UniPracticeLogo />
        <div className="hidden h-8 w-px bg-slate-200 md:block" />
        <div className="min-w-0">
          <h1 className="truncate text-lg font-black text-slate-900">{title}</h1>
          <p className="text-sm font-semibold text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isDictation ? (
          <>
            <button className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 md:flex" type="button">
              <Facebook className="h-4 w-4" /> Share
            </button>
            <Link className="ielts-pill-button hidden gap-2 md:inline-flex" to={`/chep-chinh-ta/${dictationLesson.slug}/shadowing`}>
              <Sparkles className="h-4 w-4" /> Shadowing
            </Link>
          </>
        ) : null}
        <Link className="ielts-pill-button gap-2" to={`/chep-chinh-ta/${dictationLesson.slug}/vocabulary`}>
          <BookOpenText className="h-4 w-4" /> Từ vựng
        </Link>
      </div>
    </header>
  );
}

export function RoundIconButton({
  children,
  active,
  label,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      aria-label={label}
      className={cn(
        'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-slate-600 transition',
        active ? 'border-blue-100 bg-blue-50 text-blue-600' : 'border-slate-200 bg-white hover:border-blue-200 hover:text-blue-600',
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export function AudioPracticeBar({ duration }: { duration: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-sm transition hover:bg-red-700" type="button">
        ▶
      </button>
      <RoundIconButton label="Replay">
        <RotateCcw className="h-5 w-5" />
      </RoundIconButton>
      <div className="min-w-40 flex-1">
        <div className="h-1.5 rounded-full bg-slate-200">
          <div className="h-full w-1 rounded-full bg-red-500" />
        </div>
      </div>
      <span className="text-sm font-semibold text-slate-700">00:00/<span className="text-slate-400">{duration}</span></span>
      <button className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-800" type="button">1×</button>
      <RoundIconButton label="Repeat two times">
        <span className="text-xs font-black">↔2</span>
      </RoundIconButton>
    </div>
  );
}

export function QuestionNumberGrid({
  active,
  completed,
  count,
  hidden,
  onSelect,
  onToggle,
}: {
  active: number;
  completed: number[];
  count: number;
  hidden: boolean;
  onSelect: (value: number) => void;
  onToggle: () => void;
}) {
  if (hidden) {
    return (
      <button className="hidden text-sm font-bold text-slate-500 lg:block" onClick={onToggle} type="button">
        Hiện danh sách câu hỏi
      </button>
    );
  }

  return (
    <aside className="hidden w-[300px] shrink-0 px-6 py-8 lg:block">
      <button className="mb-5 text-sm font-bold text-slate-500" onClick={onToggle} type="button">× Ẩn danh sách câu hỏi</button>
      <div className="grid grid-cols-5 gap-4">
        {Array.from({ length: count }, (_, index) => index + 1).map((number) => (
          <button
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-full border-2 text-sm font-black transition',
              active === number ? 'border-slate-400 bg-slate-100 text-slate-900 shadow-inner' : completed.includes(number) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-300 bg-white text-slate-600 hover:border-blue-400',
            )}
            key={number}
            onClick={() => onSelect(number)}
            type="button"
          >
            {number}
          </button>
        ))}
      </div>
    </aside>
  );
}

export function DictationFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const options = ['Tất cả', 'Đã làm phát âm', 'Chưa làm phát âm'];

  return (
    <div className="relative">
      <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-white" onClick={() => setOpen((current) => !current)} type="button">
        <span className="text-slate-500">Filter:</span> {value} <span className="text-slate-400">⌄</span>
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-20 mt-2 w-52 overflow-hidden rounded-lg border border-slate-200 bg-white py-2 shadow-xl">
          {options.map((option) => (
            <button
              className={cn('block w-full px-4 py-3 text-left text-sm font-semibold hover:bg-slate-50', option === value ? 'bg-slate-100 text-slate-900' : 'text-slate-700')}
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function PronunciationButton({ active }: { active?: boolean }) {
  return (
    <RoundIconButton active={active} label="Practice pronunciation">
      <Mic className="h-4 w-4" />
    </RoundIconButton>
  );
}

export function SoundButton() {
  return (
    <RoundIconButton active label="Play pronunciation">
      <Volume2 className="h-5 w-5" />
    </RoundIconButton>
  );
}

export function FloatingMagicButton() {
  return (
    <button className="fixed right-0 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-l-full bg-white text-blue-500 shadow-lg xl:flex" type="button">
      ✦
    </button>
  );
}
