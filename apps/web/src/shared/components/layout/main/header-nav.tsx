import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems  = ["IELTS Online Test ▾", "Bài mẫu IELTS ▾", "Chép chính tả"];

export default function HeaderNav({ active = "" }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-xs">
          D
        </div>
        <span className="font-black text-gray-900 text-sm tracking-tight">UNI TỰ HỌC</span>
      </div>

      {/* Nav */}
      <nav className="hidden md:flex items-center gap-6">
        {navItems.map((item) => (
          <button
            key={item}
            className={`text-sm font-medium transition-colors hover:text-red-600 ${
              active === item ? "text-red-600" : "text-gray-600"
            }`}
          >
            {item}
          </button>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button className="text-gray-500 hover:text-gray-800 transition-colors">🔍</button>
        <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold">
          P
        </div>
      </div>
    </header>
  );
}
