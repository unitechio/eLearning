import React from "react";

export function TopNav({ active }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-xs">D</div>
        <span className="font-black text-gray-900 text-sm">DOL TỰ HỌC</span>
      </div>
      <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
        {["IELTS Online Test ▾", "Bài mẫu IELTS ▾", "Chép chính tả"].map((n) => (
          <button key={n} className={`hover:text-red-600 transition-colors font-medium ${active === n ? "text-red-600" : ""}`}>{n}</button>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <button className="text-gray-500 hover:text-gray-700">🔍</button>
        <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold">P</div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 px-8 py-10 mt-16">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-xs">D</div>
            <span className="text-white font-bold">DOL TỰ HỌC</span>
          </div>
          <p className="text-xs leading-relaxed">Một sản phẩm thuộc Học viện Tiếng Anh Tự Duy DOL English (IELTS Đình Lực)</p>
        </div>
        {[
          { title: "LUYỆN THI IELTS", items: ["IELTS Online Test", "IELTS Reading Practice", "IELTS Listening Practice"] },
          { title: "VỀ DOL IELTS ĐÌNH LỰC", items: ["Linearthinking", "Nền tảng công nghệ", "Đội ngũ giáo viên"] },
          { title: "DOL ECOSYSTEM", items: ["DOL Grammar", "DOL Dictionary", "DOL superLMS"] },
        ].map((col) => (
          <div key={col.title}>
            <p className="text-white font-semibold mb-2 text-xs uppercase tracking-wide">{col.title}</p>
            {col.items.map((i) => <p key={i} className="text-xs mb-1 hover:text-white cursor-pointer">{i}</p>)}
          </div>
        ))}
      </div>
      <div className="max-w-6xl mx-auto mt-6 pt-6 border-t border-gray-800 text-xs text-center text-gray-600">
        © 2024 DOL English. All rights reserved.
      </div>
    </footer>
  );
}

export function CTABanner() {
  return (
    <div className="bg-red-50 border border-red-100 rounded-2xl p-8 flex items-center justify-between mx-4 md:mx-0 mt-12">
      <div>
        <h3 className="text-xl font-extrabold text-gray-900">Gia hạn miễn phí!</h3>
        <p className="text-gray-500 text-sm mt-1">Tài khoản của bạn đã hết hạn sử dụng. Hãy gia hạn ngay để tiếp tục việc học nhé!</p>
        <button className="mt-3 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-2 rounded-full transition-colors">Gia hạn miễn phí</button>
      </div>
      <div className="text-6xl hidden md:block">📚</div>
    </div>
  );
}
