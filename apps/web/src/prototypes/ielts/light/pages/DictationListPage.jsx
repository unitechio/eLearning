import React from "react";
import { CTABanner, Footer, TopNav } from "../shared/Layout";
import { dictationItems } from "../data";

export function DictationListPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <TopNav active="Chép chính tả" />
      <div className="bg-amber-50 py-14 text-center px-4">
        <h1 className="text-3xl font-extrabold text-gray-900">Chép Chính Tả Tiếng Anh -<br /><span className="text-red-600">DOL Tự học</span></h1>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {dictationItems.map((item) => (
            <div key={item.title} className="border border-gray-200 rounded-xl overflow-hidden hover:border-red-400 hover:shadow-md transition-all cursor-pointer group">
              <div className="h-32 bg-gray-100 flex items-center justify-center text-5xl relative">
                {item.img}
                <span className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-0.5 rounded-full">{item.tag}</span>
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors leading-snug line-clamp-2">{item.title}</p>
                <p className="text-xs text-gray-400 mt-1">{item.type} · {item.views}</p>
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
