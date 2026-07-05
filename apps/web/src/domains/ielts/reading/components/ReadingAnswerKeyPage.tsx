import React, { useMemo, useState } from 'react';
import { LockKeyhole, Sparkles, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/shared/lib';
import { urbanFarmingAnswers, urbanFarmingPassage, type ReadingAnswer } from '../data';

type ReviewMode = 'summary' | 'detail';
type ExplanationMode = 'short' | 'linear';

function UniHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  const navigate = useNavigate();

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm">
      <div className="flex min-w-0 items-center gap-3">
        <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700" onClick={() => navigate('/luyen-thi-ielts/ielts-reading-practice')} type="button">
          <X className="h-5 w-5" />
        </button>
        <Link className="flex items-center gap-2" to="/luyen-thi-ielts/ielts-reading-practice">
          <div className="relative h-9 w-9 overflow-hidden rounded-full bg-red-600">
            <div className="absolute -left-2 top-1 h-5 w-9 -rotate-12 rounded-full bg-white" />
            <div className="absolute bottom-1 right-1 h-4 w-5 -rotate-12 rounded-full bg-white" />
          </div>
          <div className="hidden leading-tight sm:block">
            <p className="text-[11px] font-black uppercase text-slate-900">UNI</p>
            <p className="text-[10px] font-bold uppercase text-slate-500">IELTS / SAT & Junior</p>
            <p className="text-sm font-black uppercase text-slate-900">Đình Lực</p>
          </div>
        </Link>
        <div className="hidden h-8 w-px bg-slate-200 md:block" />
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-slate-900">{title}</p>
          <p className="truncate text-xs text-slate-600">{subtitle}</p>
        </div>
      </div>
      {action}
    </header>
  );
}

function ScoreDonut({ score, total }: { score: number; total: number }) {
  const degrees = Math.round((score / total) * 360);

  return (
    <div className="relative flex h-24 w-24 items-center justify-center rounded-full" style={{ background: `conic-gradient(#fb923c ${degrees}deg, #ffedd5 ${degrees}deg)` }}>
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl font-black text-orange-500">
        {score}/{total}
      </div>
      <span className="absolute right-2 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-orange-400 text-white">✓</span>
    </div>
  );
}

function SummaryCard({ onShowReview }: { onShowReview: () => void }) {
  return (
    <section className="BlockResultStatistic__Container grid gap-8 rounded-[8px] bg-white p-7 shadow-sm md:grid-cols-[1fr,210px]">
      <div>
        <h1 className="text-2xl font-black leading-tight text-slate-900">Chúc mừng! Bạn đã hoàn thành bài test trong 20 phút 00 giây.</h1>
        <div className="mt-7 flex flex-wrap items-center gap-8">
          <ScoreDonut score={3} total={13} />
          <div className="space-y-3 text-sm font-bold text-slate-700">
            <p>Đúng: <span className="ml-4 rounded-lg bg-emerald-50 px-4 py-1 text-emerald-700">3</span></p>
            <p>Sai: <span className="ml-6 rounded-lg bg-red-50 px-4 py-1 text-red-600">1</span></p>
            <p>Bỏ qua: <span className="ml-2 rounded-lg bg-slate-100 px-4 py-1 text-slate-600">9</span></p>
          </div>
        </div>
        <button className="mt-8 rounded-[8px] bg-red-600 px-5 py-3 text-sm font-black text-white" onClick={onShowReview} type="button">
          Xem giải thích
        </button>
      </div>
      <div className="hidden items-center justify-center md:flex">
        <div className="relative h-36 w-36 rounded-[36px] bg-indigo-700">
          <div className="absolute left-1/2 top-8 h-16 w-16 -translate-x-1/2 rounded-full bg-white" />
          <div className="absolute left-1/2 top-12 h-11 w-11 -translate-x-1/2 rounded-full bg-rose-100" />
          <div className="absolute bottom-5 left-7 h-12 w-20 rounded-full bg-white" />
          <Sparkles className="absolute -right-1 -top-5 h-7 w-7 fill-amber-400 text-amber-400" />
        </div>
      </div>
    </section>
  );
}

function StatsTable() {
  const rows = [
    ['Sentence Completion', 3, 3, 0, 0],
    ['Table Completion', 4, 0, 1, 3],
    ['True/False/Not Given', 6, 0, 0, 6],
  ];

  return (
    <section className="TableStatisticOnlineTestDesktop__Main rounded-[8px] bg-white shadow-sm">
      <h2 className="border-b border-slate-200 px-7 py-5 text-lg font-black text-slate-900">Bảng thống kê</h2>
      <div className="overflow-x-auto p-7">
        <table className="w-full min-w-[560px] border-collapse text-center text-sm">
          <thead className="bg-slate-50 text-[11px] uppercase text-slate-500">
            <tr>
              {['Loại', 'Số câu', 'Đúng', 'Sai', 'Bỏ qua'].map((item) => (
                <th className="border-r border-slate-200 px-4 py-3 last:border-r-0" key={item}>{item}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([type, total, right, wrong, missed]) => (
              <tr className="border-b border-slate-200 last:border-b-0" key={type}>
                <td className="border-r border-slate-200 px-4 py-6 font-black">{type}</td>
                <td className="border-r border-slate-200 px-4 py-6 text-base font-black">{total}</td>
                <td className="border-r border-slate-200 px-4 py-6"><span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-black text-emerald-700">{right}</span></td>
                <td className="border-r border-slate-200 px-4 py-6"><span className="rounded-full bg-red-100 px-2 py-1 text-xs font-black text-red-600">{wrong}</span></td>
                <td className="px-4 py-6"><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-black text-slate-600">{missed}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AnswerKeyList({ onSelect }: { onSelect: (question: number) => void }) {
  return (
    <section className="BlockAnswerKey__Container block-answer-key rounded-[8px] bg-white shadow-sm">
      <h2 className="border-b border-slate-200 px-7 py-5 text-lg font-black text-slate-900">Answer key</h2>
      <div className="grid gap-x-12 gap-y-4 p-7 sm:grid-cols-2">
        {urbanFarmingAnswers.map((answer) => (
          <button className="flex items-center gap-3 text-left text-sm" key={answer.question} onClick={() => onSelect(answer.question)} type="button">
            <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black text-white', answer.status === 'correct' ? 'bg-emerald-600' : answer.status === 'incorrect' ? 'bg-orange-600' : 'bg-slate-500')}>
              {answer.question}
            </span>
            {answer.status === 'missed' ? <span className="font-semibold text-slate-400">Missed</span> : null}
            {answer.status === 'incorrect' ? <span className="font-semibold text-orange-600 line-through">{answer.userAnswer}</span> : null}
            <span className="text-emerald-700">{answer.correctAnswer}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function ResultSummary({ onShowReview }: { onShowReview: () => void }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <UniHeader subtitle="Urban farming" title="Answer key" />
      <main className="mx-auto max-w-3xl space-y-8 px-4 py-8">
        <SummaryCard onShowReview={onShowReview} />
        <StatsTable />
        <AnswerKeyList onSelect={onShowReview} />
      </main>
    </div>
  );
}

function HighlightedPassage({ selected }: { selected: ReadingAnswer }) {
  return (
    <section className={cn('min-h-0 overflow-y-auto bg-white px-5 py-4 text-[15px] leading-7 text-slate-950', selected.question >= 4 ? 'bg-slate-300' : '')}>
      <article className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-black">Urban farming</h1>
        <p className="mt-4 font-black">In Paris, urban farmers are trying a soil-free approach to agriculture that uses less space and fewer resources. Could it help cities face the threats to our food supplies?</p>
        <div className="mt-6 space-y-6">
          {urbanFarmingPassage.map((paragraph, index) => {
            if (selected.question === 4 && index === 2) {
              return (
                <p className="rounded border-4 border-red-600 bg-white p-2" key={paragraph}>
                  First, I don&apos;t much like the fact that most of the fruit and vegetables we eat have been treated with something like{' '}
                  <span className="rounded bg-red-200 px-1">17 different pesticides</span>, or that the{' '}
                  <span className="rounded bg-emerald-200 px-1">intensive farming techniques that produced them are such huge generators of greenhouse gases</span>.
                  {' '}I don&apos;t much like the fact, either, that they&apos;ve travelled an average of 2,000 refrigerated kilometres to my plate, that their quality is so poor, because the varieties are selected for their capacity to withstand such substantial journeys, or that 80% of the price I pay goes to wholesalers and transport companies, not the producers.
                </p>
              );
            }

            if (selected.question === 1 && index === 0) {
              return <p key={paragraph}>{paragraph.replace('lettuces', '')}<span className="rounded bg-emerald-100 px-1 text-emerald-800">lettuces</span></p>;
            }

            return <p key={paragraph}>{paragraph}</p>;
          })}
        </div>
      </article>
    </section>
  );
}

function AnswerValue({ answer }: { answer: ReadingAnswer }) {
  if (answer.status === 'correct') {
    return <span className="rounded-lg border border-emerald-400 bg-emerald-50 px-2 py-1 text-emerald-700">{answer.correctAnswer}</span>;
  }

  if (answer.status === 'incorrect') {
    return (
      <span className="rounded-xl border border-orange-300 bg-orange-50 px-3 py-2">
        <span className="text-orange-600 line-through">{answer.userAnswer}</span>
        <span className="mx-2 text-slate-400">|</span>
        <span className="text-emerald-700">{answer.correctAnswer}</span>
      </span>
    );
  }

  return (
    <span>
      <span className="text-orange-600">Bỏ trống</span>
      <span className="mx-2 text-slate-400">|</span>
      <span className="text-emerald-700 underline">{answer.correctAnswer}{answer.alternativeAnswers?.[0] ? `/${answer.alternativeAnswers[0]}` : ''}</span>
    </span>
  );
}

function ReviewedQuestion({ answer }: { answer: ReadingAnswer }) {
  if (answer.type === 'Table Completion') {
    const rows = urbanFarmingAnswers.filter((item) => item.type === 'Table Completion');
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[760px] border-collapse text-sm">
            <thead>
              <tr><th className="border border-slate-300 bg-slate-100 px-4 py-4 text-base" colSpan={4}>Intensive farming versus aeroponic urban farming</th></tr>
              <tr>{['', 'Growth', 'Selection', 'Sale'].map((item) => <th className="border border-slate-300 px-4 py-3" key={item}>{item}</th>)}</tr>
            </thead>
            <tbody className="align-top leading-7">
              <tr>
                <th className="border border-slate-300 px-4 py-4 text-left">Intensive farming</th>
                <td className="border border-slate-300 px-4 py-4">- wide range of <br /> <span className={answer.question === 4 ? 'rounded-xl border border-orange-300 bg-orange-50 px-3 py-2' : ''}>4. <AnswerValue answer={rows[0]} /></span> used<br />- techniques pollute air</td>
                <td className="border border-slate-300 px-4 py-4">- quality not good<br />- varieties of fruit and vegetables chosen that can survive long<br />5. <AnswerValue answer={rows[1]} /></td>
                <td className="border border-slate-300 px-4 py-4">- 6. <AnswerValue answer={rows[2]} /> receive very little of overall income</td>
              </tr>
              <tr>
                <th className="border border-slate-300 px-4 py-4 text-left">Aeroponic urban farming</th>
                <td className="border border-slate-300 px-4 py-4">- no soil used<br />- nutrients added to water, which is recycled</td>
                <td className="border border-slate-300 px-4 py-4">- produce chosen because of its<br />7. <AnswerValue answer={rows[3]} /></td>
                <td className="border border-slate-300 px-4 py-4" />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm leading-7">
        <span className="font-black text-blue-700">{answer.question}.</span> {answer.prompt.replace('____', '')}{' '}
        <AnswerValue answer={answer} />
      </p>
    </div>
  );
}

function ExplanationPanel({ answer, mode, setMode }: { answer: ReadingAnswer; mode: ExplanationMode; setMode: (mode: ExplanationMode) => void }) {
  return (
    <div className="mt-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-xl bg-slate-50 p-1">
          <button className={cn('inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-black', mode === 'short' ? 'bg-white shadow-sm' : 'text-slate-500')} onClick={() => setMode('short')} type="button">
            <Sparkles className="h-4 w-4 text-red-500" /> Ngắn gọn
          </button>
          <button className={cn('inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-black', mode === 'linear' ? 'bg-white shadow-sm' : 'text-slate-500')} onClick={() => setMode('linear')} type="button">
            <LockKeyhole className="h-4 w-4" /> Chi tiết theo Linear
          </button>
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold text-blue-700">
          Định vị <input className="h-4 w-8 accent-blue-600" defaultChecked type="checkbox" />
        </label>
      </div>

      {mode === 'linear' && answer.linearLocked ? (
        <div className="rounded-xl border border-red-500 bg-white p-8 text-center">
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Linearthinking</p>
          <h3 className="mt-4 text-xl font-black text-slate-900">Nâng cấp ngay <span className="rounded bg-orange-500 px-1 text-xs text-white">PRO</span> Lên band vượt trội!</h3>
          <p className="mt-4 text-sm text-slate-500">Chỉ từ 299.000đ/tháng - huỷ bất cứ lúc nào</p>
          <button className="mt-5 rounded-lg bg-red-600 px-5 py-3 text-sm font-black text-white" type="button">Nâng cấp ngay</button>
        </div>
      ) : null}

      <section className={cn('rounded-xl border border-slate-200 bg-white', mode === 'linear' && answer.linearLocked ? 'blur-sm' : '')}>
        <h3 className="border-b border-slate-200 px-5 py-4 text-sm font-black">⌘ Giải thích chi tiết</h3>
        <div className="space-y-4 px-5 py-4 text-sm leading-7">
          <p className="font-black">🔥 Step 1: Understand the question:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>{answer.prompt}</li>
            <li><span className="font-black">Prediction:</span> Chỗ trống cần một đáp án khớp ngữ cảnh trong bài đọc.</li>
          </ul>
          <p className="font-black">✨ Step 2: Read relevant information</p>
          <p>📌 Trích dẫn: “{answer.quote}” (Đoạn {answer.paragraph})</p>
          <ul className="list-disc space-y-2 pl-6">
            {answer.explanation.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p className="font-black text-emerald-700">⇒ ✅ Chọn: {answer.correctAnswer}</p>
        </div>
      </section>

      <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7">
        <p className="font-black">ⓘ Lưu ý</p>
        <ul className="mt-3 list-disc pl-6">
          <li>Nội dung giải thích được viết bởi UNI IELTS Đình Lực - Học Viện Tiếng Anh Tư Duy đầu tiên tại Việt Nam</li>
          <li>Đề được viết bởi nhà xuất bản lớn gồm Cambridge và Oxford</li>
        </ul>
      </section>
    </div>
  );
}

function ReviewFooter({ selected, setSelected }: { selected: number; setSelected: (question: number) => void }) {
  return (
    <footer className="grid shrink-0 grid-cols-1 items-center gap-3 border-t border-slate-200 bg-white px-4 py-3 md:grid-cols-[180px,1fr,160px]">
      <div className="hidden md:block">
        <p className="text-sm font-black">Practice</p>
        <p className="text-sm text-slate-600">Làm đúng 3 / 13</p>
      </div>
      <div className="flex justify-center gap-2 overflow-x-auto">
        {urbanFarmingAnswers.map((answer) => (
          <button className={cn('flex h-7 min-w-8 items-center justify-center rounded-lg text-sm font-black', selected === answer.question ? 'border border-red-600 bg-red-50 text-red-600' : answer.status === 'correct' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-900')} key={answer.question} onClick={() => setSelected(answer.question)} type="button">
            {answer.question}
          </button>
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-500" onClick={() => setSelected(Math.max(1, selected - 1))} type="button">Trước</button>
        <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-blue-600" onClick={() => setSelected(Math.min(13, selected + 1))} type="button">Tiếp</button>
      </div>
    </footer>
  );
}

function DetailReview({ initialQuestion }: { initialQuestion: number }) {
  const [selected, setSelected] = useState(initialQuestion);
  const [mode, setMode] = useState<ExplanationMode>('short');
  const answer = useMemo(() => urbanFarmingAnswers.find((item) => item.question === selected) ?? urbanFarmingAnswers[0], [selected]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      <UniHeader
        action={<Link className="ButtonSize__Container vocabulary_btn button-size large vertical-padding rounded-[8px] bg-red-600 px-4 py-2 text-sm font-black text-white" to="/luyen-thi-ielts/ielts-reading-practice/urban-farming/vocabulary">Học từ vựng</Link>}
        subtitle="IELTS Reading Practice Test - Urban farming"
        title="Làm bài"
      />
      <main className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-[1fr,1fr] lg:overflow-hidden">
        <HighlightedPassage selected={answer} />
        <section className="min-h-0 overflow-visible bg-white px-4 py-4 lg:overflow-y-auto">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-xl bg-red-600 px-4 py-3 text-white">
              <p className="text-sm font-black">{answer.type === 'Table Completion' ? 'Question 4 - 7 Complete the table below.' : 'Question 1 - 3 Complete the sentences below.'}</p>
              <p className="mt-1 text-sm font-black">Choose {answer.type === 'Table Completion' ? 'ONE WORD ONLY' : 'NO MORE THAN TWO WORDS AND/OR A NUMBER'} from the passage for each answer.</p>
            </div>
            <div className="mt-4">
              <ReviewedQuestion answer={answer} />
            </div>
            <ExplanationPanel answer={answer} mode={mode} setMode={setMode} />
          </div>
        </section>
      </main>
      <ReviewFooter selected={selected} setSelected={setSelected} />
    </div>
  );
}

export function ReadingAnswerKeyPage() {
  const [mode, setMode] = useState<ReviewMode>('summary');

  if (mode === 'summary') {
    return <ResultSummary onShowReview={() => setMode('detail')} />;
  }

  return <DetailReview initialQuestion={1} />;
}
