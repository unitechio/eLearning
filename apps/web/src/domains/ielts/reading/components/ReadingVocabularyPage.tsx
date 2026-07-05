import React from 'react';
import { BookOpenCheck, CheckSquare, Download, Facebook, Link as LinkIcon, PlayCircle, Search, Share2, Volume2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { readingTests, urbanFarmingVocabulary, type VocabularyItem } from '../data';

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
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
        <nav className="hidden items-center gap-8 text-xs font-semibold text-slate-700 lg:flex">
          <Link to="/luyen-thi-ielts/ielts-reading-practice">IELTS Online Test</Link>
          <a href="#related">Bài mẫu IELTS</a>
          <a href="#vocabulary">Chấp chính tả</a>
          <Search className="h-4 w-4" />
          <Link className="flex h-8 w-8 items-center justify-center rounded-full bg-[#69a84f] font-black text-white" to="/login">P</Link>
        </nav>
      </div>
    </header>
  );
}

function ProNotice() {
  return (
    <div className="flex items-center justify-center gap-4 bg-red-100 px-4 py-3 text-xs font-semibold text-slate-900">
      <span>Tài khoản UNI Pro của bạn hết hạn, gia hạn ngay nhé !!!</span>
      <Link className="rounded bg-red-600 px-3 py-1 font-black text-white" to="/billing">Gia hạn</Link>
      <button className="text-slate-700" type="button"><X className="h-4 w-4" /></button>
    </div>
  );
}

function ArticleSidebar() {
  return (
    <aside className="space-y-5 text-sm text-slate-700 lg:sticky lg:top-24">
      <div>
        <p className="font-black text-slate-900">IELTS Reading Practice</p>
        <p className="mt-3 leading-6 text-slate-500">Gồm làm đề, xem giải thích chi tiết, học từ vựng của những bài thi IELTS Reading phổ biến nhất trên thị trường.</p>
      </div>
      <div className="border-t border-slate-200 pt-4">
        <button className="flex items-center gap-2 py-2 text-xs font-bold" type="button"><LinkIcon className="h-4 w-4" /> Copy link</button>
        <button className="flex items-center gap-2 py-2 text-xs font-bold" type="button"><Facebook className="h-4 w-4" /> Share</button>
        <Link className="mt-3 inline-flex items-center gap-2 rounded-[8px] bg-red-600 px-4 py-3 text-xs font-black text-white" to="/luyen-thi-ielts/ielts-reading-practice/urban-farming">
          <PlayCircle className="h-4 w-4" /> Làm bài
        </Link>
      </div>
    </aside>
  );
}

function VocabActions() {
  return (
    <div className="flex flex-wrap items-center gap-5 border-y border-slate-200 py-3 text-xs font-bold text-slate-700">
      <Link className="inline-flex items-center gap-2" to="/luyen-thi-ielts/ielts-reading-practice/urban-farming"><PlayCircle className="h-4 w-4 text-red-600" /> Làm bài</Link>
      <Link className="inline-flex items-center gap-2" to="/luyen-thi-ielts/ielts-reading-practice/urban-farming/answer-key"><CheckSquare className="h-4 w-4 text-blue-600" /> Đề và đáp án</Link>
      <Link className="inline-flex items-center gap-2" to="/luyen-thi-ielts/ielts-reading-practice/urban-farming/answer-key"><BookOpenCheck className="h-4 w-4 text-emerald-600" /> Xem giải thích</Link>
    </div>
  );
}

function VocabularyRow({ item }: { item: VocabularyItem }) {
  return (
    <article className="grid overflow-hidden rounded-[8px] border border-slate-200 bg-white text-sm shadow-sm sm:grid-cols-[180px,1fr,96px]">
      <div className="border-b border-slate-200 p-4 sm:border-b-0 sm:border-r">
        <p className="font-black text-slate-950">{item.word}</p>
        <button className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-slate-700" type="button">
          <Volume2 className="h-4 w-4" /> {item.ipa}
        </button>
      </div>
      <div className="p-4">
        <p><span className="font-semibold">({item.partOfSpeech})</span>. {item.meaning}</p>
        <p className="mt-2 text-xs leading-5 text-slate-500">{item.example}</p>
        <button className="mt-2 text-slate-700" type="button"><Volume2 className="h-4 w-4" /></button>
      </div>
      <img alt={item.word} className="hidden h-full w-full object-cover sm:block" src={item.image} />
    </article>
  );
}

function DownloadCard() {
  return (
    <section className="mt-12">
      <p className="text-sm font-black text-slate-900">Bạn có thể tải bản đẹp của từ vựng Urban farming tại đây</p>
      <div className="mt-4 flex items-center justify-between rounded-[12px] bg-slate-100 p-4">
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-red-600 px-2 py-1 text-xs font-black text-white">PDF</span>
          <span className="text-sm font-black">Urban_farming.pdf</span>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-300 text-slate-700" type="button"><Download className="h-5 w-5" /></button>
      </div>
      <div className="mt-5 rounded-[8px] bg-red-50 p-8 text-center">
        <h2 className="text-3xl font-black text-slate-900">Hết hạn sử dụng</h2>
        <p className="mt-3 text-sm text-slate-600">Tài khoản UNI Pro của bạn đã hết hạn. Hãy gia hạn để tiếp tục việc học nhé!</p>
        <Link className="mt-5 inline-flex rounded-[8px] bg-red-600 px-6 py-3 text-sm font-black text-white" to="/billing">Gia hạn tài khoản</Link>
      </div>
    </section>
  );
}

function RelatedArticles() {
  const related = [
    ['Từ Vựng Bài Đọc A Song On The Brain', 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=400&auto=format&fit=crop'],
    ['Từ Vựng Bài Đọc Ancient People In Sahara', 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=400&auto=format&fit=crop'],
    ['Từ Vựng Bài Đọc The Lost City', 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=400&auto=format&fit=crop'],
    ['Từ Vựng Bài Đọc Texting The Television', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop'],
    ['Từ Vựng Bài Đọc The Beginning Of The Modern Designed Gasoline Engines', 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=400&auto=format&fit=crop'],
  ];

  return (
    <section className="mt-12 border-t border-slate-200 pt-8" id="related">
      <h2 className="text-2xl font-black text-slate-900">▣ Bài viết liên quan</h2>
      <div className="mt-5 divide-y divide-slate-200">
        {related.map(([title, image]) => (
          <article className="grid gap-4 py-5 sm:grid-cols-[1fr,130px]" key={title}>
            <div>
              <h3 className="text-base font-black text-slate-900">{title}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">Xem danh sách từ vựng Vocabulary của đề {title.replace('Từ Vựng Bài Đọc ', '')} được lấy từ IELTS Cambridge Test, bao gồm phát âm, định nghĩa, ví dụ và chính...</p>
            </div>
            <img alt={title} className="h-24 w-full rounded-[8px] object-cover" src={image} />
          </article>
        ))}
      </div>
      <div className="mt-7 text-center">
        <button className="rounded-[8px] bg-red-600 px-5 py-3 text-sm font-black text-white" type="button">Đọc thêm</button>
      </div>
    </section>
  );
}

export function ReadingVocabularyPage() {
  const test = readingTests.find((item) => item.slug === 'urban-farming') ?? readingTests[0];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <SiteHeader />
      <ProNotice />
      <main className="mx-auto grid max-w-7xl gap-10 px-4 py-8 lg:grid-cols-[180px,1fr,170px]">
        <ArticleSidebar />
        <article>
          <div className="text-[11px] font-black uppercase tracking-wide text-blue-700">
            Trang chủ <span className="mx-2 text-slate-400">›</span> IELTS Online Test <span className="mx-2 text-slate-400">›</span> IELTS Reading Practice Tests
          </div>
          <h1 className="mt-5 text-4xl font-serif text-slate-950">Từ Vựng Bài Đọc Urban Farming</h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Xem danh sách từ vựng Vocabulary của đề Urban Farming được lấy từ cuốn Cambridge IELTS Practice Test 18 - Test 1 - Passage 1. Phần từ vựng IELTS của bài chứa bộ từ, bao gồm phát âm, định nghĩa, ví dụ và cả hình...
          </p>
          <button className="mt-1 text-sm font-semibold text-red-600" type="button">See more</button>
          <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 font-black text-white">D</span>
            <span className="font-bold text-emerald-700">UNI IELTS Đình Lực</span>
            <span>12/04/2026</span>
          </div>
          <div className="mt-5">
            <VocabActions />
          </div>
          <img alt={test.title} className="mt-8 aspect-[1.9] w-full rounded-sm object-cover" src={test.image} />
          <div className="mt-5 flex justify-center gap-3 text-slate-400">· · ·</div>

          <section className="mt-12 space-y-4" id="vocabulary">
            {urbanFarmingVocabulary.map((item) => (
              <VocabularyRow item={item} key={item.word} />
            ))}
          </section>

          <DownloadCard />
          <section className="mt-10 border-t border-slate-200 pt-7">
            <h2 className="text-lg font-black text-slate-900">IELTS Reading Practice</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Gồm làm đề, xem giải thích chi tiết, học từ vựng của những bài thi IELTS Reading phổ biến nhất trên thị trường</p>
            <Link className="mt-4 inline-flex items-center gap-2 rounded-[8px] bg-red-600 px-4 py-2 text-xs font-black text-white" to="/luyen-thi-ielts/ielts-reading-practice/urban-farming">
              <PlayCircle className="h-4 w-4" /> Làm bài
            </Link>
          </section>
          <RelatedArticles />
        </article>
        <aside className="hidden lg:block">
          <div className="sticky top-24 text-xs">
            <p className="font-black text-slate-900">Từ Vựng Bài Đọc Urban...</p>
            <button className="mt-3 flex items-center gap-2 font-black text-red-600" type="button"><Download className="h-4 w-4" /> Download pdf vocab</button>
          </div>
        </aside>
      </main>
      <button className="fixed right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-l-full bg-white text-blue-500 shadow-lg xl:flex" type="button">
        ✦
      </button>
    </div>
  );
}
