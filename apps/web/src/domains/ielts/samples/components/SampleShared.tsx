import React from 'react';
import { ArrowRight, CheckCircle2, ChevronDown, Facebook, GraduationCap, Lightbulb, Link as LinkIcon, MessageCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/lib';
import { OptimizedImage } from '@/shared/components/media';
import type { SampleListItem, VocabularyEntry } from '../data';

export function UniPublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link className="flex items-center gap-2" to="/luyen-thi-ielts/ielts-reading-practice">
          <div className="relative h-9 w-9 overflow-hidden rounded-full bg-red-600">
            <div className="absolute -left-2 top-1 h-5 w-9 -rotate-12 rounded-full bg-white" />
            <div className="absolute bottom-1 right-1 h-4 w-5 -rotate-12 rounded-full bg-white" />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase leading-none">UNI</p>
            <p className="text-xs font-black uppercase leading-none">Tự học</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-7 text-xs font-semibold text-slate-700 lg:flex">
          <Link to="/luyen-thi-ielts/ielts-reading-practice">IELTS Online Test</Link>
          <button className="inline-flex items-center gap-1" type="button">Bài mẫu IELTS <ChevronDown className="h-3 w-3" /></button>
          <Link to="/writing-coach">Chấp chính tả</Link>
          <Search className="h-4 w-4" />
          <Link className="flex h-8 w-8 items-center justify-center rounded-full bg-[#69a84f] font-black text-white" to="/login">P</Link>
        </nav>
      </div>
    </header>
  );
}

export function FloatingShortcuts() {
  return (
    <div className="fixed right-4 top-44 z-30 hidden flex-col gap-3 xl:flex">
      {[
        ['Điểm & Review', 'bg-emerald-500'],
        ['Linear-thinking', 'bg-red-500'],
        ['Sách độc quyền', 'bg-indigo-600'],
      ].map(([label, color]) => (
        <button className={cn('w-20 rounded-lg px-2 py-3 text-[11px] font-black leading-tight text-white shadow-lg', color)} key={label} type="button">{label}</button>
      ))}
    </div>
  );
}

export function SampleHero({ title, description }: { title: string; description: string }) {
  return (
    <section className="bg-[#fbf5ed] px-4 py-20 text-center">
      <h1 className="mx-auto max-w-2xl text-4xl font-black leading-tight text-slate-900">{title}</h1>
      <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600">{description}</p>
      <button className="mt-6 rounded-full bg-red-600 px-5 py-3 text-xs font-black text-white" type="button">Tìm hiểu khóa học</button>
    </section>
  );
}

export function SampleFilterSidebar({ categories }: { categories: string[] }) {
  return (
    <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-sm font-black">Tìm kiếm</p>
        <label className="mt-3 flex h-10 overflow-hidden rounded-md bg-slate-100">
          <input className="min-w-0 flex-1 bg-transparent px-3 text-xs outline-none" placeholder="Search" />
          <button className="w-10 bg-slate-700 text-white" type="button"><Search className="mx-auto h-4 w-4" /></button>
        </label>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-sm font-black">Bộ lọc</p>
        <p className="mt-4 text-[11px] font-black uppercase">Chủ đề ({categories.length})</p>
        {categories.map((item) => (
          <label className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-600" key={item}>
            {item}
            <input className="h-3.5 w-3.5 rounded border-slate-300" type="checkbox" />
          </label>
        ))}
        <button className="mt-4 text-[11px] font-bold text-blue-600" type="button">Xem Tất Cả</button>
        <div className="mt-5 border-t border-slate-100 pt-4">
          <p className="text-[11px] font-black uppercase">Sắp xếp theo</p>
          {['Mới nhất', 'Cũ nhất', 'Nhiều lượt xem nhất'].map((item, index) => (
            <label className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-600" key={item}>
              {item}
              <input className="h-3.5 w-3.5 rounded border-slate-300 accent-red-600" defaultChecked={index === 0} type="checkbox" />
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}

export function SampleListItemCard({ item, basePath }: { item: SampleListItem; basePath: string }) {
  return (
    <article className="grid gap-5 sm:grid-cols-[170px,1fr]">
      <Link to={`${basePath}/${item.slug}`}>
        <OptimizedImage alt={item.title} aspectClassName="aspect-[1.5]" className="rounded-lg" src={item.image} widthHint={520} />
      </Link>
      <div>
        <p className="text-xs text-slate-400">{item.category} · {item.date}</p>
        <Link className="mt-1 block text-lg font-black leading-6 text-slate-900 hover:text-red-600" to={`${basePath}/${item.slug}`}>{item.title}</Link>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{item.excerpt}</p>
      </div>
    </article>
  );
}

export function TrialBanner() {
  return (
    <section className="mt-20 overflow-hidden rounded-lg bg-[#fde9e9] p-8 sm:p-10">
      <div className="grid items-center gap-8 md:grid-cols-[1fr,220px]">
        <div>
          <h2 className="text-2xl font-black">Gia hạn miễn phí!</h2>
          <p className="mt-3 text-sm text-slate-600">Tài khoản của bạn đã hết hạn sử dụng. Hãy gia hạn ngay để tiếp tục việc học nhé!</p>
          <button className="mt-5 rounded-lg bg-red-600 px-4 py-3 text-xs font-black text-white" type="button">Gia hạn miễn phí</button>
        </div>
        <div className="hidden h-32 rounded-full bg-red-500 md:block" />
      </div>
    </section>
  );
}

export function ConsultationAndFooter() {
  return (
    <>
      <section className="mt-24 bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-black">Đăng kí test đầu vào IELTS <span className="text-red-600">miễn phí</span> và nhận tư vấn</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {['Nhắn tin UNI qua Facebook', 'Gọi điện liên hệ', 'UNI có 15+ cơ sở tại TP.HCM, Hà Nội và Đà Nẵng'].map((item) => (
              <div className="rounded-lg bg-white p-5 shadow-sm" key={item}><p className="font-black">{item}</p><p className="mt-2 text-sm text-slate-500">Click để xem chi tiết.</p></div>
            ))}
          </div>
        </div>
      </section>
      <footer className="bg-[#202637] px-4 py-12 text-white">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-4">
          <div><p className="font-black">UNI Tự học</p><p className="mt-4 text-xs text-slate-300">Một sản phẩm thuộc Học viện Tiếng Anh Tư Duy UNI English.</p></div>
          {['Luyện thi IELTS', 'Về UNI IELTS Đình Lực', 'UNI Ecosystem'].map((title) => <div key={title}><p className="text-xs font-black uppercase">{title}</p><p className="mt-3 text-xs text-slate-400">IELTS Online Test<br />IELTS Reading Practice<br />IELTS Listening Practice</p></div>)}
        </div>
      </footer>
    </>
  );
}

export function ArticleShell({ children, sections }: { children: React.ReactNode; sections: string[] }) {
  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[190px,1fr,260px]">
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-4 text-sm">
          <p className="font-black">IELTS Speaking part 1 -...</p>
          {sections.map((section) => <a className="block font-semibold text-slate-500 hover:text-red-600" href={`#${section}`} key={section}>✨ {section}</a>)}
        </div>
      </aside>
      <article className="min-w-0">{children}</article>
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-5">
          <p className="text-xl font-black">Tìm hiểu UNI English</p>
          {[
            { title: 'Điểm & Review', desc: 'Thành tích và hàng ngàn review đã tâm cây số.', color: 'bg-red-500', Icon: CheckCircle2 },
            { title: 'Đội ngũ giáo viên', desc: 'Những giáo viên giỏi kiến thức và giỏi truyền đạt.', color: 'bg-emerald-600', Icon: GraduationCap },
            { title: 'Linearthinking', desc: 'Hệ phương pháp Linear-thinking độc quyền tại UNI.', color: 'bg-blue-600', Icon: Lightbulb },
          ].map(({ title, desc, color, Icon }) => (
            <div className="flex gap-4" key={title}>
              <div className={cn('flex h-14 w-14 shrink-0 items-center justify-center rounded-lg text-white', color)}><Icon className="h-5 w-5" /></div>
              <div><p className="font-black">{title}</p><p className="mt-1 text-sm text-slate-500">{desc}</p></div>
            </div>
          ))}
          <a className="inline-flex items-center gap-2 border-t border-slate-200 pt-5 text-sm font-bold text-blue-600" href="#">Test đầu vào IELTS miễn phí <ArrowRight className="h-4 w-4" /></a>
        </div>
      </aside>
    </main>
  );
}

export function AuthorRow() {
  return (
    <div className="mt-6 flex items-center justify-between border-b border-slate-200 pb-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 font-black text-white">D</span>
        <div><p className="font-black">UNI IELTS Đình Lực</p><p className="text-sm text-slate-500">15/05/2026 · &gt;10 mins read</p></div>
      </div>
      <div className="flex gap-5"><LinkIcon className="h-4 w-4" /><Facebook className="h-4 w-4" /></div>
    </div>
  );
}

export function AudioMiniPlayer({ duration = '00:29' }: { duration?: string }) {
  return (
    <div className="my-5 inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
      <button className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100" type="button">▶</button>
      <div className="h-1 w-36 rounded-full bg-red-100"><div className="h-full w-2 rounded-full bg-red-500" /></div>
      <span className="text-sm">00:00 / {duration}</span>
    </div>
  );
}

export function VocabularyList({ entries }: { entries: VocabularyEntry[] }) {
  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <article className="grid rounded-lg border border-slate-200 bg-white sm:grid-cols-[250px,1fr,100px]" key={entry.phrase}>
          <div className="border-b border-slate-200 p-4 sm:border-b-0 sm:border-r"><p className="font-black">{entry.phrase}</p><p className="mt-2 text-sm">🔊 {entry.ipa}</p></div>
          <div className="p-4"><p className="font-semibold">{entry.meaning}</p><p className="mt-2 text-sm text-slate-600">{entry.example} 🔊</p></div>
          <OptimizedImage alt={entry.phrase} aspectClassName="hidden h-full sm:block" className="h-full" src={entry.image} widthHint={240} />
        </article>
      ))}
    </div>
  );
}

export function FloatingSocialButtons() {
  return (
    <div className="fixed bottom-8 right-6 hidden flex-col gap-3 xl:flex">
      <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg" type="button">↑</button>
      <button className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg" type="button"><MessageCircle className="h-5 w-5" /></button>
    </div>
  );
}
