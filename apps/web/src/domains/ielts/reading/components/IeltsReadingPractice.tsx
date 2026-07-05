import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronLeft, Clock3, Grid3X3, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/shared/lib';
import { urbanFarmingPassage } from '../data';
import { QuestionPalette, type QuestionPalettePassage } from '@/domains/ielts/shared/ui';

type QuestionGroup = 'sentences' | 'table' | 'tfng';

const groupConfig: Record<QuestionGroup, { label: string; range: string; start: number; end: number }> = {
  sentences: { label: 'Question 1 - 3', range: '4 - 7', start: 1, end: 3 },
  table: { label: 'Question 4 - 7', range: '8 - 13', start: 4, end: 7 },
  tfng: { label: 'Question 8 - 13', range: 'Nộp bài', start: 8, end: 13 },
};

function UniTestBrand() {
  return (
    <Link className="flex items-center gap-3" to="/luyen-thi-ielts/ielts-reading-practice">
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

function AnswerInput({
  number,
  value,
  onChange,
  className,
}: {
  number: number;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <span className="inline-flex items-center gap-1 align-baseline">
      <span className="text-sm font-black text-blue-700">{number}.</span>
      <input
        className={cn('h-8 w-28 border-0 border-b border-blue-500 bg-transparent px-2 text-center text-sm font-semibold text-slate-900 outline-none focus:bg-blue-50', className)}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </span>
  );
}

function TestHeader({
  onExit,
  timer,
  action,
}: {
  onExit: () => void;
  timer: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-red-200 hover:text-red-600" onClick={onExit} type="button">
          <X className="h-5 w-5" />
        </button>
        <UniTestBrand />
        <div className="hidden h-8 w-px bg-slate-200 md:block" />
        <div className="min-w-0">
          <p className="text-base font-black text-slate-900">Làm bài</p>
          <p className="truncate text-sm text-slate-600">IELTS Reading Practice Test - Urban farming</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 text-red-600 sm:flex">
          <Clock3 className="h-5 w-5 text-slate-500" />
          <span className="text-base font-black tabular-nums">{timer}</span>
        </div>
        {action}
      </div>
    </header>
  );
}

function PassagePanel() {
  return (
    <section className="min-h-0 overflow-visible bg-white px-6 py-7 md:px-10 lg:overflow-y-auto lg:px-14">
      <article className="mx-auto max-w-[760px] text-[16px] leading-[1.45] text-slate-950">
        <h1 className="text-2xl font-black tracking-tight">Urban farming</h1>
        <p className="mt-2 font-black leading-5">
          In Paris, urban farmers are trying a soil-free approach to agriculture that uses less space and fewer resources. Could it help cities face the threats to our food supplies?
        </p>
        <div className="mt-6 space-y-6">
          {urbanFarmingPassage.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>
    </section>
  );
}

function QuestionBanner({
  title,
  instruction,
}: {
  title: string;
  instruction: string;
}) {
  return (
    <div className="QuestionGroupGuideline__Main ielts-question-banner rounded-[16px]">
      <p className="text-sm font-black">{title}</p>
      <p className="mt-1 text-sm font-black">{instruction}</p>
    </div>
  );
}

function SentenceQuestions({
  answers,
  setAnswer,
}: {
  answers: Record<number, string>;
  setAnswer: (question: number, value: string) => void;
}) {
  return (
    <div className="mx-auto max-w-[760px]">
      <QuestionBanner instruction="Choose NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage for each answer." title="Question 1 - 3 Complete the sentences below." />
      <div className="SingleAnswer__SingleAnswerMain SentenceComplete__Main mt-4 rounded-[16px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="space-y-7 text-sm leading-8 text-slate-950">
          <div className="SentenceComplete__QuestionWrapper">
            <span className="font-black text-blue-700">1.</span> Vertical tubes are used to grow strawberries,{' '}
            <AnswerInput number={1} onChange={(value) => setAnswer(1, value)} value={answers[1] ?? ''} /> and herbs.
          </div>
          <div className="SentenceComplete__QuestionWrapper">
            <span className="font-black text-blue-700">2.</span> There will eventually be a daily harvest of as much as{' '}
            <AnswerInput number={2} onChange={(value) => setAnswer(2, value)} value={answers[2] ?? ''} /> in weight of fruit and vegetables.
          </div>
          <div className="SentenceComplete__QuestionWrapper">
            <span className="Question__QuestionWrapper font-black text-blue-700">3.</span> It may be possible that the farm&apos;s produce will account for as much as 10% of the city&apos;s{' '}
            <AnswerInput number={3} onChange={(value) => setAnswer(3, value)} value={answers[3] ?? ''} /> overall.
          </div>
        </div>
      </div>
    </div>
  );
}

function TableQuestions({
  answers,
  setAnswer,
}: {
  answers: Record<number, string>;
  setAnswer: (question: number, value: string) => void;
}) {
  return (
    <div className="mx-auto max-w-[780px]">
      <QuestionBanner instruction="Choose ONE WORD ONLY from the passage for each answer." title="Question 4 - 7 Complete the table below." />
      <div className="mt-4 overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto p-4">
          <table className="min-w-[760px] border-collapse text-sm text-slate-950">
            <thead>
              <tr>
                <th className="border border-slate-300 bg-slate-100 px-4 py-5 text-center text-base font-black" colSpan={4}>
                  Intensive farming versus aeroponic urban farming
                </th>
              </tr>
              <tr>
                <th className="w-[26%] border border-slate-300 px-4 py-4" />
                <th className="w-[26%] border border-slate-300 px-4 py-4 font-black">Growth</th>
                <th className="w-[26%] border border-slate-300 px-4 py-4 font-black">Selection</th>
                <th className="w-[22%] border border-slate-300 px-4 py-4 font-black">Sale</th>
              </tr>
            </thead>
            <tbody className="align-top leading-7">
              <tr>
                <th className="border border-slate-300 px-4 py-4 text-left font-black">Intensive farming</th>
                <td className="border border-slate-300 px-4 py-4">
                  <p>- wide range of</p>
                  <p>
                    <AnswerInput number={4} onChange={(value) => setAnswer(4, value)} value={answers[4] ?? ''} /> used
                  </p>
                  <p>- techniques pollute air</p>
                </td>
                <td className="border border-slate-300 px-4 py-4">
                  <p>- quality not good</p>
                  <p>- varieties of fruit and vegetables chosen that can survive long</p>
                  <p>
                    <AnswerInput number={5} onChange={(value) => setAnswer(5, value)} value={answers[5] ?? ''} />
                  </p>
                </td>
                <td className="border border-slate-300 px-4 py-4">
                  <p>
                    - <AnswerInput className="w-24" number={6} onChange={(value) => setAnswer(6, value)} value={answers[6] ?? ''} /> receive very little of overall income
                  </p>
                </td>
              </tr>
              <tr>
                <th className="border border-slate-300 px-4 py-4 text-left font-black">Aeroponic urban farming</th>
                <td className="border border-slate-300 px-4 py-4">
                  <p>- no soil used</p>
                  <p>- nutrients added to water, which is recycled</p>
                </td>
                <td className="border border-slate-300 px-4 py-4">
                  <p>- produce chosen because of its</p>
                  <p>
                    <AnswerInput number={7} onChange={(value) => setAnswer(7, value)} value={answers[7] ?? ''} />
                  </p>
                </td>
                <td className="border border-slate-300 px-4 py-4" />
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mx-4 mb-2 h-2 rounded-full bg-slate-300" />
      </div>
    </div>
  );
}

const tfngQuestions = [
  'Urban farming can take place above or below ground.',
  'Some of the equipment used in aeroponic farming can be made by hand.',
  'Urban farming relies more on electricity than some other types of farming.',
  'Fruit and vegetables grown on an aeroponic urban farm are cheaper than traditionally grown organic produce.',
  'Most produce can be grown on an aeroponic urban farm at any time of the year.',
  'Aeroponic urban farming has already been tested in several countries.',
];

function TfngQuestions({
  answers,
  setAnswer,
}: {
  answers: Record<number, string>;
  setAnswer: (question: number, value: string) => void;
}) {
  return (
    <div className="mx-auto max-w-[760px]">
      <QuestionBanner instruction="" title="Question 8 - 13 Choose TRUE/FALSE/NOT GIVEN" />
      <div className="mt-4 space-y-3">
        {tfngQuestions.map((question, index) => {
          const number = index + 8;
          return (
            <div className="rounded-[16px] border border-slate-200 bg-white p-5 shadow-sm" key={question}>
              <p className="text-sm font-black leading-6 text-slate-950">
                <span className="text-blue-700">{number}.</span> {question}
              </p>
              <div className="mt-4 space-y-3">
                {['True', 'False', 'Not given'].map((option) => (
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-950" key={option}>
                    <span className={cn('flex h-5 w-5 items-center justify-center rounded-full border', answers[number] === option ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white')}>
                      {answers[number] === option ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
                    </span>
                    <input className="sr-only" name={`question-${number}`} onChange={() => setAnswer(number, option)} type="radio" value={option} />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuestionsPanel({
  group,
  answers,
  setAnswer,
}: {
  group: QuestionGroup;
  answers: Record<number, string>;
  setAnswer: (question: number, value: string) => void;
}) {
  return (
    <section className="min-h-0 overflow-visible bg-white px-4 py-8 md:px-8 lg:overflow-y-auto">
      {group === 'sentences' ? <SentenceQuestions answers={answers} setAnswer={setAnswer} /> : null}
      {group === 'table' ? <TableQuestions answers={answers} setAnswer={setAnswer} /> : null}
      {group === 'tfng' ? <TfngQuestions answers={answers} setAnswer={setAnswer} /> : null}
    </section>
  );
}

function BottomNav({
  group,
  answers,
  onGroupChange,
  onSubmit,
  showPalette,
  onTogglePalette,
}: {
  group: QuestionGroup;
  answers: Record<number, string>;
  onGroupChange: (group: QuestionGroup) => void;
  onSubmit: () => void;
  showPalette: boolean;
  onTogglePalette: () => void;
}) {
  const answeredCount = useMemo(() => Object.values(answers).filter(Boolean).length, [answers]);
  const active = groupConfig[group];
  const groups: QuestionGroup[] = ['sentences', 'table', 'tfng'];
  const currentIndex = groups.indexOf(group);
  const previous = groups[Math.max(0, currentIndex - 1)];
  const next = groups[Math.min(groups.length - 1, currentIndex + 1)];

  return (
    <footer className="relative grid shrink-0 grid-cols-1 items-center gap-3 border-t border-slate-200 bg-white px-4 py-3 sm:grid-cols-[260px,1fr,180px]">
      {showPalette ? (
        <div className="absolute bottom-[calc(100%+8px)] left-4 z-40">
          <QuestionPalette
            activeQuestion={active.start}
            onClose={onTogglePalette}
            onQuestionSelect={(question) => {
              if (question <= 3) onGroupChange('sentences');
              else if (question <= 7) onGroupChange('table');
              else onGroupChange('tfng');
            }}
            passages={[
              { id: 1, label: 'Passage 1', start: 1, end: 13, answered: answeredCount },
              { id: 2, label: 'Passage 2', start: 14, end: 26, answered: 0 },
              { id: 3, label: 'Passage 3', start: 27, end: 40, answered: 0 },
            ] satisfies QuestionPalettePassage[]}
          />
        </div>
      ) : null}
      <div className="hidden sm:block">
        <div className="flex items-center gap-3">
          <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700" onClick={onTogglePalette} type="button">
            <Grid3X3 className="h-5 w-5" />
          </button>
          <div>
            <p className="text-sm font-black text-slate-900">Passage 1</p>
            <p className="text-sm text-slate-600">Đã làm {answeredCount} / 13</p>
          </div>
        </div>
      </div>
      <div className="PracticeTestQuestionBar__Main flex justify-center gap-2 overflow-x-auto">
        {Array.from({ length: 13 }, (_, index) => index + 1).map((number) => {
          const inActiveGroup = number >= active.start && number <= active.end;
          const done = Boolean(answers[number]);
          return (
            <button
              className={cn(
                'QuestionNumberButton__Container number-explanation size-medium type-default flex h-8 min-w-9 items-center justify-center rounded-[8px] border px-2 text-sm font-black transition',
                inActiveGroup ? 'border-blue-600 bg-blue-50 text-blue-700' : done ? 'border-blue-100 bg-blue-50 text-blue-700' : 'border-slate-300 bg-white text-slate-700',
              )}
              key={number}
              onClick={() => {
                if (number <= 3) onGroupChange('sentences');
                else if (number <= 7) onGroupChange('table');
                else onGroupChange('tfng');
              }}
              type="button"
            >
              {number}
            </button>
          );
        })}
      </div>
      <div className="flex justify-end gap-2">
        {group !== 'sentences' ? (
          <button className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-slate-200 px-4 text-sm font-bold text-slate-600" onClick={() => onGroupChange(previous)} type="button">
            <ArrowLeft className="h-4 w-4" /> {groupConfig[previous].start} - {groupConfig[previous].end}
          </button>
        ) : null}
        <button className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-red-600 px-4 text-sm font-black text-white" onClick={() => (group === 'tfng' ? onSubmit() : onGroupChange(next))} type="button">
          {active.range} {group !== 'tfng' ? <ArrowRight className="h-4 w-4" /> : null}
        </button>
      </div>
    </footer>
  );
}

export function IeltsReadingPractice() {
  const navigate = useNavigate();
  const [group, setGroup] = useState<QuestionGroup>('sentences');
  const [showPalette, setShowPalette] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({
    1: 'lettuces',
    2: '1,000 kg',
    3: 'consumption',
  });

  const setAnswer = (question: number, value: string) => {
    setAnswers((current) => ({ ...current, [question]: value }));
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      <TestHeader
        action={<Link className="ButtonSize__Container vocalulary_btn button-size large vertical-padding rounded-[8px] bg-red-600 px-4 py-2 text-sm font-black text-white" to="/luyen-thi-ielts/ielts-reading-practice/urban-farming/vocabulary">Học từ vựng</Link>}
        onExit={() => navigate('/luyen-thi-ielts/ielts-reading-practice')}
        timer={group === 'sentences' ? '04:57' : group === 'table' ? '05:31' : '04:35'}
      />
      <main className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-[1fr,1fr] lg:overflow-hidden">
        <div className="min-h-[45vh] border-r border-slate-200 lg:min-h-0">
          <PassagePanel />
        </div>
        <QuestionsPanel answers={answers} group={group} setAnswer={setAnswer} />
      </main>
      <BottomNav
        answers={answers}
        group={group}
        onGroupChange={setGroup}
        onSubmit={() => navigate('/luyen-thi-ielts/ielts-reading-practice/urban-farming/answer-key')}
        onTogglePalette={() => setShowPalette((current) => !current)}
        showPalette={showPalette}
      />
      <button className="fixed right-0 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-l-full bg-white text-blue-500 shadow-lg lg:flex" type="button">
        ✦
      </button>
      <Link className="fixed left-4 top-20 hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm lg:inline-flex" to="/luyen-thi-ielts/ielts-reading-practice">
        <ChevronLeft className="h-4 w-4" />
        Kho đề
      </Link>
    </div>
  );
}
