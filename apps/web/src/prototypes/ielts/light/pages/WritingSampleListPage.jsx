import React, { useState } from "react";
import { CTABanner, Footer, TopNav } from "../shared/Layout";
import { filterTags, writingSamples } from "../data";

export function WritingSampleListPage() {
  const [selectedTag, setSelectedTag] = useState(null);
  const [sort, setSort] = useState("Mới nhất");
  const filtered = selectedTag ? writingSamples.filter((s) => s.tag === selectedTag) : writingSamples;

  return (
    <div className="min-h-screen bg-white font-sans">
      <TopNav active="Bài mẫu IELTS ▾" />
      <div className="bg-amber-50 py-14 text-center px-4">
        <h1 className="text-3xl font-extrabold text-gray-900">DOL IELTS Writing<br /><span className="text-red-600">Task 1 General Sample</span></h1>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-10 flex gap-8">
        <div className="w-48 shrink-0 hidden md:block">
          <div className="space-y-1.5">
            {filterTags.map((tag) => (
              <label key={tag} className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={selectedTag === tag} onChange={() => setSelectedTag(selectedTag === tag ? null : tag)} className="accent-red-600" />
                <span className="text-sm group-hover:text-red-600 transition-colors text-gray-600">{tag}</span>
              </label>
            ))}
          </div>
          <div className="mt-5">
            {["Mới nhất", "Cũ nhất"].map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer mb-1.5">
                <input type="radio" name="sort" value={s} checked={sort === s} onChange={() => setSort(s)} className="accent-red-600" />
                <span className="text-sm text-gray-600">{s}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex-1 space-y-5">
          {filtered.map((item, i) => (
            <div key={i} className="flex gap-4 group cursor-pointer border-b border-gray-100 pb-5">
              <div className="w-36 h-24 rounded-xl bg-gray-100 flex items-center justify-center text-4xl shrink-0 overflow-hidden">{item.img}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1"><span className="text-xs text-red-600 font-semibold">{item.quarter} · {item.tag}</span></div>
                <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CTABanner />
      <Footer />
    </div>
  );
}
