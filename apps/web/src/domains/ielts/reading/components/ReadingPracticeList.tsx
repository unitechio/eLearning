import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Headphones,
  MapPin,
  MessageCircle,
  Search,
  UserRound,
} from 'lucide-react';
import { cn } from '@/shared/lib';
import { useIELTSContentList } from '@/domains/ielts/content/hooks';
import { OptimizedImage } from '@/shared/components/media';
import { ContentSkeletonGrid, HeaderLoadingBar } from '@/shared/components/feedback';
import { PublicHeader } from '@/shared/components/layout/main/PublicHeader';
import { TestCard } from '@/shared/components/molecules/TestCard';
import { PracticeFilterSidebar } from '@/shared/components/organisms/PracticeFilterSidebar';
import { ConsultationSection } from '@/shared/components/organisms/ConsultationSection';
import { readingTests, suggestedReadingTests, type ReadingTest } from '../data';



function ReadingHero() {
  return (
    <section className="bg-[#fbf5ed] px-4 py-14 text-center sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">IELTS Reading Practice Test</h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
          Luyện IELTS Reading online miễn phí với nguồn đề sát với đề thi thực tế, kèm answer key, giải thích chi tiết, từ vựng đi kèm và trải nghiệm làm bài thi thử như trên máy.
        </p>
        <a className="mt-6 inline-flex items-center rounded-[8px] bg-red-600 px-5 py-3 text-xs font-black text-white shadow-sm transition hover:bg-red-700" href="#reading-library">
          Tìm hiểu khóa học
        </a>
      </div>
    </section>
  );
}

function StatusPill({ test }: { test: ReadingTest }) {
  if (test.status === 'in-progress') {
    return <span className="absolute left-2 top-2 rounded-[8px] bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-700">Đang 0/13</span>;
  }

  return <span className="absolute left-2 top-2 rounded-[8px] bg-white/95 px-2 py-1 text-[10px] font-black text-slate-700">{test.questions} câu</span>;
}



function FloatingShortcuts() {
  const items = [
    { label: 'Điểm & Review', className: 'bg-emerald-500' },
    { label: 'Linear-thinking', className: 'bg-red-500' },
    { label: 'Sách độc quyền', className: 'bg-indigo-600' },
  ];

  return (
    <div className="fixed bottom-24 right-4 z-30 hidden flex-col items-end gap-3 xl:flex">
      {items.map((item) => (
        <button className={cn('w-20 rounded-lg px-2 py-3 text-[11px] font-black leading-tight text-white shadow-lg', item.className)} key={item.label} type="button">
          {item.label}
        </button>
      ))}
    </div>
  );
}

function TrialBanner() {
  return (
    <section className="mt-16 overflow-hidden rounded-[8px] bg-[#fde9e9] p-8 sm:p-10">
      <div className="grid items-center gap-8 md:grid-cols-[1fr,220px]">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Gia hạn miễn phí!</h2>
          <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">Tài khoản của bạn đã hết hạn sử dụng. Hãy gia hạn ngay để tiếp tục việc học nhé!</p>
          <Link className="mt-5 inline-flex rounded-full bg-red-600 px-5 py-3 text-xs font-black text-white" to="/billing">
            Gia hạn miễn phí
          </Link>
        </div>
        <div className="hidden h-40 items-center justify-center md:flex">
          <div className="relative h-32 w-32 rounded-full bg-red-500">
            <div className="absolute -left-10 top-10 h-16 w-24 -rotate-12 rounded-md border border-slate-200 bg-white shadow-sm" />
            <div className="absolute -right-8 bottom-2 h-12 w-20 rotate-12 rounded-md border border-slate-200 bg-white shadow-sm" />
          </div>
        </div>
      </div>
    </section>
  );
}



function ReadingFooter() {
  return (
    <footer className="bg-[#202637] px-4 py-12 text-white sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr,1fr,1fr,1fr]">
        <div>
          <Link className="flex items-center gap-2" to="/luyen-thi-ielts/ielts-reading-practice">
            <div className="relative h-9 w-9 overflow-hidden rounded-full bg-red-600 flex-shrink-0">
              <div className="absolute -left-2 top-1 h-5 w-9 -rotate-12 rounded-full bg-white" />
              <div className="absolute bottom-1 right-1 h-4 w-5 -rotate-12 rounded-full bg-white" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase leading-none text-white">UNI</p>
              <p className="text-xs font-black uppercase leading-none text-white">Tự học</p>
            </div>
          </Link>
          <p className="mt-5 max-w-sm text-xs leading-6 text-slate-300">
            Một sản phẩm thuộc Học viện Tiếng Anh Tư Duy UNI English IELTS Đình Lực.
          </p>
          <div className="mt-5 flex gap-2">
            {['f', 'y', 't'].map((item) => (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-black" key={item}>{item}</span>
            ))}
          </div>
        </div>
        {[
          ['Luyện thi IELTS', 'IELTS Online Test', 'IELTS Reading Practice', 'IELTS Listening Practice'],
          ['Về UNI IELTS Đình Lực', 'Linear-thinking', 'Nền tảng công nghệ', 'Đội ngũ giáo viên'],
          ['UNI Ecosystem', 'UNI Grammar', 'UNI Dictionary', 'UNI Super LMS'],
        ].map(([title, ...links]) => (
          <div key={title}>
            <p className="text-xs font-black uppercase text-slate-300">{title}</p>
            <div className="mt-4 space-y-2">
              {links.map((item) => (
                <a className="block text-xs text-slate-400 hover:text-white" href="#" key={item}>{item}</a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl justify-between border-t border-white/10 pt-6 text-xs text-slate-400">
        <span>© 2026 UNI English. All rights reserved.</span>
        <span>Giới thiệu | Chính sách bảo mật | Điều khoản sử dụng</span>
      </div>
    </footer>
  );
}

export function ReadingPracticeList() {
  const [page, setPage] = useState(1);
  const { data: apiItems, loading, error } = useIELTSContentList({ page, page_size: 12, skill: 'reading', content_type: 'practice-test' });
  const visibleTests = useMemo<ReadingTest[]>(() => {
    if (!error && apiItems && apiItems.length > 0) {
      return apiItems.map((item) => ({
        id: String(item.id),
        slug: item.slug,
        title: item.title,
        questions: item.question_count || 0,
        attempts: `${item.view_count || 0} lượt làm`,
        image: item.thumbnail_url || item.preview_image_url || readingTests[0].image,
        tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
      }));
    }
    return readingTests.slice(0, 12);
  }, [apiItems, error]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PublicHeader loading={loading} />
      <ReadingHero />
      <FloatingShortcuts />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <section>
          <h2 className="text-3xl font-black text-slate-900">Gợi ý cho bạn</h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {suggestedReadingTests.map((test) => (
              <TestCard key={test.id} test={test as any} />
            ))}
          </div>
        </section>

        <section className="mt-12 border-t border-outline-variant pt-8" id="reading-library">
          <h2 className="text-3xl font-black text-slate-900">Kho Reading Test</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-[256px,1fr]">
            <PracticeFilterSidebar
              questionTypes={[
                { label: 'Summary Completion', value: 'summary-completion' },
                { label: 'True/False/ Not Given', value: 'tfng' },
                { label: 'Multiple Choice', value: 'mcq' },
                { label: 'Matching Paragraph Information', value: 'matching-paragraph' },
                { label: 'Matching Name', value: 'matching-name' },
              ]}
              totalQuestionTypesCount={15}
            />
            <div>
              <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {loading && !apiItems ? <ContentSkeletonGrid count={9} /> : visibleTests.map((test) => <TestCard key={test.id} test={test as any} />)}
              </div>
              <div className="mt-10 flex items-center justify-center gap-2">
                <button className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400" onClick={() => setPage((current) => Math.max(1, current - 1))} type="button">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {[1, 2, 3, 4, 5].map((item) => (
                  <button
                    className={cn('flex h-8 w-8 items-center justify-center rounded-full text-xs font-black', page === item ? 'bg-red-600 text-white' : 'bg-slate-50 text-slate-500')}
                    key={item}
                    onClick={() => setPage(item)}
                    type="button"
                  >
                    {item}
                  </button>
                ))}
                <span className="px-1 text-xs text-slate-400">...</span>
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-xs font-black text-slate-500" type="button">20</button>
                <button className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400" onClick={() => setPage((current) => Math.min(20, current + 1))} type="button">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <TrialBanner />
      </main>

      <ConsultationSection />
      <ReadingFooter />

      <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
        <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-700 shadow-lg" type="button">
          <ArrowRight className="h-4 w-4 -rotate-90" />
        </button>
        <button className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg" type="button">
          <MessageCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
