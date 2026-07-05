import React from 'react';
import { BookOpen, ChevronDown, LogOut, Search, Star, UserRound, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/lib';
import { HeaderLoadingBar } from '@/shared/components/feedback';
import { OptimizedImage } from '@/shared/components/media';
import type { PracticeCard, PracticeSection } from '../data';
import { courseBanners, popularSearches } from '../data';
import { ConsultationAndFooter, FloatingShortcuts, TrialBanner } from '@/domains/ielts/samples/components/SampleShared';

export function SelfStudyHeader({ loading = false }: { loading?: boolean }) {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link className="flex items-center gap-2" to="/tu-hoc-practice">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-red-600">
              <div className="absolute -left-2 top-1.5 h-5 w-10 -rotate-12 rounded-full bg-white" />
              <div className="absolute bottom-1.5 right-1 h-4 w-6 -rotate-12 rounded-full bg-white" />
            </div>
            <div className="leading-none">
              <p className="text-[11px] font-black">UNI</p>
              <p className="text-lg font-black uppercase">Tự học</p>
              <p className="text-[8px] font-bold text-slate-500">tuhoc.Unienglish.vn</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-800 lg:flex">
            <Link className="inline-flex items-center gap-1" to="/luyen-thi-ielts/ielts-reading-practice">IELTS Online Test <ChevronDown className="h-4 w-4" /></Link>
            <Link className="inline-flex items-center gap-1" to="/ielts-writing-sample/general-task-1">Bài mẫu IELTS <ChevronDown className="h-4 w-4" /></Link>
            <Link to="/chep-chinh-ta/cam20-t4-the-football-stadium">Chép chính tả</Link>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700" onClick={() => setSearchOpen(true)} type="button">
              <Search className="h-5 w-5" />
            </button>
            <div className="relative">
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#69a84f] text-lg font-black text-white" onClick={() => setMenuOpen((current) => !current)} type="button">
                p
              </button>
              {menuOpen ? <ProfileMenu /> : null}
            </div>
          </nav>
        </div>
        <HeaderLoadingBar loading={loading} />
      </header>
      {searchOpen ? <SearchOverlay onClose={() => setSearchOpen(false)} /> : null}
    </>
  );
}

function ProfileMenu() {
  return (
    <div className="absolute right-0 top-[calc(100%+12px)] w-72 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
      {[
        [UserRound, 'Thông tin cá nhân'],
        [BookOpen, 'Tài khoản Pro'],
        [Star, 'Nhận ngày học FREE'],
        [LogOut, 'Đăng xuất'],
      ].map(([Icon, label], index) => (
        <button className={cn('flex w-full items-center gap-4 px-5 py-4 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50', index === 0 ? 'bg-slate-100' : '')} key={label as string} type="button">
          <Icon className="h-5 w-5" />
          {label as string}
        </button>
      ))}
    </div>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/55">
      <div className="ml-auto min-h-[420px] w-[calc(100%-90px)] rounded-bl-xl bg-white shadow-2xl">
        <div className="flex h-16 items-center gap-4 border-b border-slate-100 bg-slate-50 px-6">
          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-700" onClick={onClose} type="button">
            <X className="h-5 w-5" />
          </button>
          <Search className="h-6 w-6 text-slate-400" />
          <input autoFocus className="h-full flex-1 bg-transparent text-lg outline-none placeholder:text-slate-400" placeholder="Bạn muốn tìm..." />
        </div>
        <div className="px-8 py-5">
          <p className="text-sm font-semibold text-slate-700">Popular</p>
          <div className="mt-3 space-y-4">
            {popularSearches.map((item, index) => (
              <button className="flex items-center gap-4 text-left text-lg text-slate-900" key={item} type="button">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-600">{index + 1}</span>
                {item}
              </button>
            ))}
          </div>
          <p className="mt-6 text-sm font-semibold text-slate-700">Explore UNI’s Content Types</p>
          <div className="mt-4 flex flex-wrap gap-4">
            {['Online Test', 'Reading Practice', 'Listening Practice', 'Chép Chính Tả', 'Daily Learning'].map((item) => (
              <button className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-base font-black text-slate-700 shadow-sm" key={item} type="button">{item}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SwiperContent__Container({ children }: { children: React.ReactNode }) {
  return (
    <section className="SwiperContent__Container mx-auto max-w-6xl border-b border-slate-200 px-4 py-8" data-component="SwiperContent__Container">
      {children}
    </section>
  );
}

export function Swiper__SwiperMain({ children }: { children: React.ReactNode }) {
  return (
    <div className="Swiper__SwiperMain swiper-main relative" data-component="Swiper__SwiperMain" data-slot="swiper-main">
      {children}
    </div>
  );
}

export function CourseCarousel() {
  return (
    <SwiperContent__Container>
      <Swiper__SwiperMain>
        <button
          aria-label="Previous slide"
          className="Swiper__Navigation Swiper__Navigation--prev absolute -left-5 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xl shadow-lg md:flex"
          data-component="Swiper__Navigation"
          data-direction="prev"
          type="button"
        >
          ‹
        </button>
        <div className="Swiper__Wrapper grid gap-4 md:grid-cols-4" data-component="Swiper__Wrapper">
          {courseBanners.map((item) => (
            <Link className="Swiper__Slide relative h-28 overflow-hidden rounded-[8px] bg-slate-900" data-component="Swiper__Slide" key={item.title} to={item.href}>
              <OptimizedImage
                alt={item.title}
                aspectClassName="h-full"
                className="Swiper__SlideImage h-full opacity-55"
                data-component="Swiper__SlideImage"
                imageClassName="h-full w-full object-cover"
                src={item.image}
                widthHint={720}
              />
              <div className="Swiper__SlideOverlay absolute inset-0 flex items-center justify-center px-4 text-center text-[20px] font-bold leading-tight text-white" data-component="Swiper__SlideOverlay">
                {item.title}
              </div>
            </Link>
          ))}
        </div>
        <button
          aria-label="Next slide"
          className="Swiper__Navigation Swiper__Navigation--next absolute -right-5 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xl shadow-lg md:flex"
          data-component="Swiper__Navigation"
          data-direction="next"
          type="button"
        >
          ›
        </button>
      </Swiper__SwiperMain>
    </SwiperContent__Container>
  );
}

export function PracticeCardGrid({ section }: { section: PracticeSection }) {
  return (
    <section className="PageSectionLayout__Main mx-auto mt-16 max-w-6xl px-4" data-component="PageSectionLayout__Main">
      <div className="PageSectionLayout__Header mb-5 flex items-center justify-between" data-component="PageSectionLayout__Header">
        <h2 className="text-2xl font-black text-slate-900">{section.title}</h2>
        <Link className="text-xs font-black text-slate-600 hover:text-red-600" to={section.href}>Xem thêm ›</Link>
      </div>
      <div className="PageSectionLayout__Content grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-component="PageSectionLayout__Content">
        {section.items.map((item) => <ContentCard item={item} key={`${section.title}-${item.title}`} />)}
      </div>
    </section>
  );
}

export function ContentCard({ item, compact = false }: { item: PracticeCard; compact?: boolean }) {
  return (
    <article className={cn('StructuralCard__Main', compact ? '' : 'min-w-0')} data-component="StructuralCard__Main">
      {!compact ? (
        <Link className="StructuralCard__ItemMain relative block overflow-hidden rounded-[8px]" data-component="StructuralCard__ItemMain" to={item.href}>
          {item.badge ? <span className="absolute left-2 top-2 z-10 rounded bg-white/90 px-2 py-1 text-[11px] font-black text-slate-700">{item.badge}</span> : null}
          <OptimizedImage alt={item.title} aspectClassName="aspect-[1.55]" src={item.image} widthHint={520} />
        </Link>
      ) : null}
      <Link
        className={cn(
          'ResponsiveTypography__EnhancedTitle responsive-typography english english-typo font-inter mt-3 block font-black leading-5 text-slate-900 hover:text-red-600',
          compact ? 'text-sm' : 'text-base',
        )}
        data-component="ResponsiveTypography__EnhancedTitle"
        to={item.href}
      >
        {item.title}
      </Link>
      <div className="Meta__Main shared-meta mt-1 flex flex-wrap items-center gap-1 text-xs font-semibold text-slate-500" data-component="Meta__Main">
        <span className="meta-item" data-component="meta-item">
          <span
            className="ResponsiveTypography__EnhancedText responsive-typography english english-typo font-inter meta-text"
            data-component="ResponsiveTypography__EnhancedText"
          >
            {item.meta}
          </span>
        </span>
      </div>
      <Link className="mt-3 inline-flex items-center rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:border-red-200 hover:text-red-600" to={item.href}>
        <span className="mr-2 text-red-600">⊙</span> {item.action}
      </Link>
    </article>
  );
}

export { ConsultationAndFooter, FloatingShortcuts, TrialBanner };
