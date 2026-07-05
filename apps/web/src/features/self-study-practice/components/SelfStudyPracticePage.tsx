import React from 'react';
import { recentPractices, practiceSections } from '../data';
import { ConsultationAndFooter, ContentCard, CourseCarousel, FloatingShortcuts, PracticeCardGrid, SelfStudyHeader, TrialBanner } from './SelfStudyShared';

export function SelfStudyPracticePage() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <SelfStudyHeader />
      <FloatingShortcuts />
      <CourseCarousel />

      <main>
        <section className="PageSectionLayout__Main mx-auto mt-10 max-w-6xl px-4" data-component="PageSectionLayout__Main">
          <div className="PageSectionLayout__Header" data-component="PageSectionLayout__Header">
            <h2 className="text-2xl font-black text-slate-900">Bài làm gần đây</h2>
          </div>
          <div className="PageSectionLayout__Content mt-5 grid gap-6 md:grid-cols-3" data-component="PageSectionLayout__Content">
            {recentPractices.map((item) => <ContentCard compact item={item} key={item.title} />)}
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4">
          <TrialBanner />
        </div>

        {practiceSections.map((section) => <PracticeCardGrid key={section.title} section={section} />)}

        <div className="mx-auto max-w-6xl px-4">
          <TrialBanner />
        </div>
      </main>

      <ConsultationAndFooter />
    </div>
  );
}
