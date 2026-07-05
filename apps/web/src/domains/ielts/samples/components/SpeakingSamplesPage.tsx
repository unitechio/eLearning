import React from 'react';
import { UniPublicHeader, FloatingShortcuts, SampleFilterSidebar, SampleHero, SampleListItemCard, TrialBanner, ConsultationAndFooter, FloatingSocialButtons } from './SampleShared';
import { speakingSamples } from '../data';

export function SpeakingSamplesPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <UniPublicHeader />
      <SampleHero description="IELTS Speaking Part 1 Sample Tổng hợp các bài mẫu, câu hỏi, câu trả lời mẫu, từ vựng và bài tập chi tiết theo chủ đề" title="UNI IELTS Speaking Part 1 Sample" />
      <FloatingShortcuts />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-3xl font-black">Kho bài mẫu</h2>
        <div className="mt-6 grid gap-8 lg:grid-cols-[220px,1fr]">
          <SampleFilterSidebar categories={['Talk about yourself', 'Work & Study', 'Hobby', 'Home', 'Routine']} />
          <section className="space-y-8">
            {speakingSamples.map((item) => <SampleListItemCard basePath="/ielts-speaking-sample/part-1" item={item} key={item.slug} />)}
            <div className="flex justify-center gap-2 pt-6">
              {[1, 2, 3, 4, 5].map((page) => <button className={page === 1 ? 'h-8 w-8 rounded-full bg-red-600 text-sm font-black text-white' : 'h-8 w-8 rounded-full bg-slate-100 text-sm font-black'} key={page} type="button">{page}</button>)}
              <span className="px-2 text-slate-400">...</span>
              <button className="h-8 w-8 rounded-full bg-slate-100 text-sm font-black" type="button">52</button>
            </div>
          </section>
        </div>
        <TrialBanner />
      </main>
      <ConsultationAndFooter />
      <FloatingSocialButtons />
    </div>
  );
}
