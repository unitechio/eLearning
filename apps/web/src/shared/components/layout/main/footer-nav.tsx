import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  {
    title: "LUYỆN THI IELTS",
    items: ["IELTS Online Test", "IELTS Reading Practice", "IELTS Listening Practice"],
  },
  {
    title: "VỀ UNI IELTS ",
    items: ["Linearthinking", "Nền tảng công nghệ", "Đội ngũ giáo viên", "Thành tích học viên"],
  },
  {
    title: "UNI ECOSYSTEM",
    items: ["UNI Grammar", "UNI Dictionary", "Kiến thức IELTS tổng hợp", "UNI superLMS"],
  },
];

export default function FooterNav() {
  return (
    <footer className="bg-gray-900 text-gray-400 px-8 py-10 mt-16">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        {/* Brand column */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-xs">
              D
            </div>
            <span className="text-white font-bold">UNI TỰ HỌC</span>
          </div>
          <p className="text-xs leading-relaxed text-gray-500">
            Một sản phẩm thuộc Học viện Tiếng Anh Tự Duy UNI English (IELTS Đình Lực) –{" "}
            <span className="hover:text-white cursor-pointer">www.UNIenglish.vn</span>
          </p>
          <p className="text-xs mt-2 text-gray-500">
            Trụ sở: Hẻm 458/14, đường 3/2, P12, Q10, TP.HCM
          </p>
          <p className="text-xs mt-1 text-gray-500">Hotline: 1800 96 96 39</p>
          <div className="flex gap-2 mt-3">
            {["f", "▶", "📸"].map((icon, i) => (
              <button
                key={i}
                className="w-7 h-7 bg-gray-800 hover:bg-gray-700 rounded-full text-xs flex items-center justify-center transition-colors"
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Nav columns */}
        {navItems.map((col) => (
          <div key={col.title}>
            <p className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
              {col.title}
            </p>
            <ul className="space-y-2">
              {col.items.map((item) => (
                <li key={item}>
                  <button className="text-xs text-gray-500 hover:text-white transition-colors">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-gray-800 flex items-center justify-between text-xs text-gray-600">
        <span>© 2024 UNI English. All rights reserved.</span>
        <div className="flex gap-4">
          {["Giới thiệu", "Chính sách bảo mật", "Điều khoản sử dụng"].map((t) => (
            <button key={t} className="hover:text-gray-400 transition-colors">{t}</button>
          ))}
        </div>
      </div>
    </footer>
  );
}
