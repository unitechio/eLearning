import React from "react";
import { CTABanner, Footer, TopNav } from "../shared/Layout";
import { latestTests } from "../data";

export function IELTSOnlineTestPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <TopNav active="IELTS Online Test ▾" />
      <div className="bg-amber-50 py-14 text-center px-4">
        <h1 className="text-3xl font-extrabold text-gray-900">Luyện thi IELTS Online Test<br /><span className="text-red-600">miễn phí - DOL Tự học</span></h1>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">
        <section>
          <h2 className="text-xl font-extrabold text-gray-900 mb-4">Bài test mới nhất</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {latestTests.map((t) => (
              <div key={t.name} className="border border-gray-200 rounded-xl p-4 hover:border-red-400 transition-colors cursor-pointer group">
                <p className="font-semibold text-sm text-gray-900 group-hover:text-red-600 transition-colors">{t.name}</p>
                <p className="text-xs text-gray-400 mt-1">{t.views} · {t.q} câu</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <CTABanner />
      <Footer />
    </div>
  );
}
