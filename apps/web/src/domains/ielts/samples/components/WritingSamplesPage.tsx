import React from 'react';
import { UniPublicHeader, SampleFilterSidebar, SampleHero, SampleListItemCard, FloatingSocialButtons } from './SampleShared';
import { writingSamples } from '../data';

export function WritingSamplesPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <UniPublicHeader />
      <SampleHero description="Tổng hợp các bài mẫu IELTS General Writing Task 1 theo dạng đề, kèm phân tích, dịch nghĩa và bài tập." title="UNI IELTS Writing Sample" />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-3xl font-black">Kho bài mẫu</h2>
        <div className="mt-6 grid gap-8 lg:grid-cols-[220px,1fr]">
          <SampleFilterSidebar categories={['Request Letter', 'Advice Seeking Letter', 'Application letter', 'Complaint Letter', 'Apology Letter']} />
          <section className="space-y-8">
            {writingSamples.map((item) => <SampleListItemCard basePath="/ielts-writing-sample/general-task-1" item={item} key={item.slug} />)}
          </section>
        </div>
      </main>
      <FloatingSocialButtons />
    </div>
  );
}
