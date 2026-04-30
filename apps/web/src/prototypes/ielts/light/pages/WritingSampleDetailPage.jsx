import React, { useState } from "react";
import { Footer, TopNav } from "../shared/Layout";

export function WritingSampleDetailPage() {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans">
      <TopNav active="Bài mẫu IELTS ▾" />
      <div className="max-w-5xl mx-auto px-4 py-3 text-xs text-gray-400 flex gap-1 flex-wrap">
        <span>Trang chủ</span><span>›</span><span>IELTS Bài mẫu</span><span>›</span><span className="text-gray-600">Thư cho lời khuyên - Đề 3</span>
      </div>
      <div className="max-w-5xl mx-auto px-4 pb-16 flex gap-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">Thư cho lời khuyên (Letter of Advice) - IELTS General Writing Task 1 - Đề 3</h1>
          <div className="mt-5 bg-gray-50 border border-gray-200 rounded-xl p-5 text-sm text-gray-700 leading-relaxed">
            <p className="italic">Recently you saw an article in a newspaper/journal about a city/town you know. Some of the information in the article was incorrect.</p>
          </div>
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3"><span className="text-lg">✍️</span><h2 className="font-extrabold text-gray-900">Bài mẫu</h2></div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-800 leading-relaxed space-y-3">
              <p>Dear Mr/Ms Madam,</p>
              <p>I am an <span className="underline decoration-red-400">avid reader</span> of The Guardian and I happened to read your article about Hoi An City.</p>
            </div>
          </div>
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4"><span className="text-lg">🔥</span><h2 className="font-extrabold text-gray-900">Bài tập Exercise</h2></div>
            <div className="bg-gray-50 rounded-xl p-5 text-sm">
              <p className="font-semibold text-gray-800 mb-3">Exercise 1:</p>
              <input className="mt-1 border-b border-gray-300 focus:border-red-600 outline-none text-sm w-48 bg-transparent" placeholder="I am an ___ reader" />
              <button onClick={() => setShowAnswer(!showAnswer)} className="mt-3 block bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors">
                {showAnswer ? "Ẩn đáp án" : "Check đáp án"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
