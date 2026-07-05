import React from 'react';
import { UniPublicHeader, ArticleShell, AuthorRow, AudioMiniPlayer, VocabularyList, FloatingSocialButtons } from './SampleShared';
import { speakingAnswers, speakingLifeStagesQuestions, speakingVocabulary } from '../data';

function SectionDivider() {
  return <div className="my-10 text-center text-slate-400">· &nbsp; · &nbsp; ·</div>;
}

const speakingHighlightPattern =
  /(laughing until our sides hurt|pool our pocket money|draw chalk hopscotch on the footpath|level up in my career|build a solid savings cushion|grow roots while still chasing a few adventures)/g;

function isSpeakingHighlight(part: string) {
  return /^(laughing until our sides hurt|pool our pocket money|draw chalk hopscotch on the footpath|level up in my career|build a solid savings cushion|grow roots while still chasing a few adventures)$/.test(part);
}

export function SpeakingSampleDetailPage() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <UniPublicHeader />
      <ArticleShell sections={['Danh sách câu hỏi', 'Sample từng câu', 'Vocabulary', 'Bài tập exercise', 'Lời kết']}>
        <div className="text-sm font-semibold text-red-600">Trang chủ › Kiến thức IELTS › IELTS Speaking Sample › IELTS Speaking Part 1</div>
        <h1 className="mt-8 font-serif text-5xl font-black leading-tight">IELTS Speaking part 1 - Topic Life Stages: Bài mẫu và từ vựng</h1>
        <p className="mt-6 text-xl leading-9 text-slate-500">Bài mẫu 8.0+ IELTS Speaking part 1 cho topic Life Stages kèm dàn ý, từ vựng, và bài tập. Những câu hỏi này được xuất hiện trong đề thi IELTS Speaking thật vào quý 2 năm 2026.</p>
        <AuthorRow />

        <section className="mt-8" id="Danh sách câu hỏi">
          <h2 className="font-serif text-4xl font-black">🚀 Danh sách câu hỏi</h2>
          <p className="mt-6 text-xl leading-8">Dưới đây là list câu hỏi Speaking Part 1 thường xuất hiện trong chủ đề <strong>Life Stages.</strong></p>
          <div className="mt-6 rounded-xl border border-slate-200 p-6 text-xl font-black leading-9">
            {speakingLifeStagesQuestions.map((question, index) => <p key={question}>{index + 1}. {question}</p>)}
          </div>
        </section>

        <SectionDivider />

        <section id="Sample từng câu">
          <h2 className="font-serif text-4xl font-black">📝 Sample từng câu</h2>
          <p className="mt-6 text-xl leading-8">Cùng tham khảo câu trả lời Speaking Part 1 mẫu cho chủ đề <strong>Life Stages</strong> dưới đây nhé!</p>
          <div className="mt-8 space-y-8">
            {speakingAnswers.map((item) => (
              <article className="rounded-xl bg-slate-50 p-7" key={item.question}>
                <h3 className="font-serif text-3xl font-black leading-tight">{item.question}</h3>
                <AudioMiniPlayer />
                <p className="font-serif text-2xl leading-10">
                  {item.answer.split(speakingHighlightPattern).map((part, index) =>
                    isSpeakingHighlight(part) ? <span className="text-red-500 underline" key={`${part}-${index}`}>{part}</span> : part,
                  )}
                </p>
              </article>
            ))}
          </div>
        </section>

        <SectionDivider />

        <section id="Vocabulary">
          <h2 className="font-serif text-4xl font-black">📚 Vocabulary</h2>
          <p className="mt-6 text-xl leading-8">Dưới đây là danh sách từ vựng ghi điểm chủ đề <strong>Life Stages Part 1</strong> thường được dùng trong bài.</p>
          <div className="mt-7"><VocabularyList entries={speakingVocabulary} /></div>
        </section>

        <SectionDivider />

        <section id="Bài tập exercise">
          <h2 className="font-serif text-4xl font-black">✨ Bài tập exercise</h2>
          <p className="mt-6 text-2xl leading-9">Cùng UNI Tự học làm bài tập sau đây để ôn lại các từ vựng đã được dùng trong bài Sample nhé!</p>
          <div className="mt-6 rounded-lg border border-slate-200 p-8 text-xl leading-10 shadow-sm">
            {['She is', 'Meditation helps me', 'My old friends were', 'The kids', 'She took on extra work to'].map((stem, index) => (
              <p className="mb-7" key={stem}>{index + 1}. → {stem} <select className="mx-2 border-b border-slate-300 bg-white px-8 py-1" />.</p>
            ))}
            <div className="mt-8 flex items-center justify-between bg-red-600 p-6 text-white"><div><p className="text-2xl font-black">Rất tiếc</p><p>Bạn chỉ làm đúng 0/8 😭</p></div><button className="rounded-lg bg-white px-6 py-3 font-black text-red-600" type="button">Làm lại</button></div>
          </div>
        </section>

        <section className="mt-10 rounded-lg border border-slate-200 p-8" id="Lời kết">
          <h2 className="font-serif text-4xl font-black">💡 Lời kết</h2>
          <p className="mt-6 font-serif text-2xl leading-10">Bài viết trên đã tổng hợp bí kíp giúp bạn hoàn thành phần thi Speaking Part 1 chủ đề <strong>Life Stages</strong> bao gồm câu hỏi, câu trả lời mẫu và list từ vựng ghi điểm.</p>
        </section>
        <AuthorRow />
      </ArticleShell>
      <FloatingSocialButtons />
    </div>
  );
}
