import React, { useState } from "react";
import { RED } from "../theme";

export function ProgressPage() {
  const [tab, setTab] = useState("Dictation");
  const months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 font-sans">
      <h1 className="text-2xl font-extrabold">Tiến trình học tập</h1>
      <p className="text-gray-400 text-sm mt-1">Theo dõi hoạt động hàng ngày, chuỗi ngày học và thói quen luyện tập.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {[
          { icon: "🔥", value: "0 ngày", label: "Chuỗi dài nhất" },
          { icon: "📖", value: "0", label: "Từ đã lưu" },
          { icon: "⏱", value: "0m", label: "Thời gian luyện tập" },
          { icon: "🎯", value: "0 XP", label: "Tổng XP" },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="font-bold text-white">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="font-bold mb-3">Tổng quan hoạt động (6 tháng gần đây)</h2>
        <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
          <div className="flex gap-6 text-xs text-gray-500 mb-2 ml-8">
            {months.map((m) => <span key={m} className="flex-1 text-center">{m}</span>)}
          </div>
          {["Mon", "Wed", "Fri"].map((day) => (
            <div key={day} className="flex items-center gap-1 mb-1">
              <span className="w-7 text-xs text-gray-500">{day}</span>
              <div className="flex gap-1">
                {Array.from({ length: 26 }).map((_, i) => <div key={i} className="w-3 h-3 rounded-sm bg-gray-800" />)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold">Luyện tập hàng ngày (30 ngày gần đây)</h2>
          <div className="flex gap-2">
            {["Dictation", "Shadowing", "Luyện nói", "Từ vựng"].map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${tab === t ? `${RED} text-white` : "bg-gray-800 text-gray-400 hover:text-white"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
