import React from 'react';
import { ArticleShell, AudioMiniPlayer, AuthorRow, UniPublicHeader, FloatingSocialButtons } from './SampleShared';
import { writingSample } from '../data';

function HighlightText({ text }: { text: string }) {
  const terms = /(avid reader|happened to read|published on the 24th issue|incorrect information|corrections for it|distinctive cuisine|food supply|specialty dishes|know about this city like the back of my hand|imperative|confuse readers|lead to a lopsided view about Hoi An)/g;
  const isHighlighted = (part: string) =>
    /^(avid reader|happened to read|published on the 24th issue|incorrect information|corrections for it|distinctive cuisine|food supply|specialty dishes|know about this city like the back of my hand|imperative|confuse readers|lead to a lopsided view about Hoi An)$/.test(part);
  return (
    <>
      {text.split(terms).map((part, index) => isHighlighted(part) ? <span className="text-red-500 underline" key={`${part}-${index}`}>{part}</span> : part)}
    </>
  );
}

export function WritingSampleDetailPage() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <UniPublicHeader />
      <ArticleShell sections={['Đề bài', 'Bài mẫu', 'Phân dịch', 'Bài tập Exercise', 'Lời kết']}>
        <h1 className="font-serif text-5xl font-black leading-tight">{writingSample.title}</h1>
        <p className="mt-6 text-xl leading-9 text-slate-500">Đề thi IELTS General Writing Task 1 yêu cầu viết một lá thư cho lời khuyên. Đây là một trong những dạng bài của Writing General.</p>
        <AuthorRow />

        <section className="mt-8" id="Đề bài">
          <h2 className="font-serif text-4xl font-black">🚀 Đề bài</h2>
          <div className="mt-6 border-l-4 border-slate-800 pl-7 font-serif text-2xl leading-10">
            <p>{writingSample.prompt}</p>
            <ul className="mt-4 list-disc pl-8">
              <li>how you know about this city/town</li>
              <li>what information was incorrect</li>
              <li>what the editor should do about this.</li>
            </ul>
          </div>
        </section>

        <div className="my-10 text-center text-slate-400">· &nbsp; · &nbsp; ·</div>

        <section id="Bài mẫu">
          <div className="flex flex-wrap items-center gap-5">
            <h2 className="font-serif text-4xl font-black">📝 Bài mẫu</h2>
            <AudioMiniPlayer duration="00:49" />
          </div>
          <div className="mt-6 whitespace-pre-line font-serif text-2xl leading-10">
            <HighlightText text={writingSample.sample} />
          </div>
          <p className="mt-8 font-serif text-xl">(169 words)</p>
        </section>

        <div className="my-10 text-center text-slate-400">· &nbsp; · &nbsp; ·</div>

        <section id="Phân dịch">
          <h2 className="font-serif text-4xl font-black">📄 Phân dịch</h2>
          <p className="mt-6 whitespace-pre-line font-serif text-2xl leading-10">{writingSample.translation}</p>
        </section>
      </ArticleShell>
      <FloatingSocialButtons />
    </div>
  );
}
