import React, { useState } from "react";

export function DictationPracticePage() {
  const [input, setValue] = useState("");
  const [current, setCurrent] = useState(24);
  const [mode, setMode] = useState("EASY");
  const total = 58;

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex">
      <div className="w-52 bg-white border-r border-gray-200 p-4 hidden md:block">
        <div className="grid grid-cols-5 gap-1.5">
          {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
            <button key={n} onClick={() => setCurrent(n)} className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${n === current ? "bg-red-600 text-white" : n < current ? "bg-gray-200 text-gray-500" : "border border-gray-300 text-gray-600 hover:border-red-400"}`}>{n}</button>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">DOL ĐÌNH LỰC</div><span className="text-sm font-bold text-gray-900">[CAM13 - T2] Nanotechnology</span></div>
        </div>
        <div className="flex-1 flex items-start justify-center p-8">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <span className="font-bold text-gray-900">Câu {current}/{total}</span>
              <div className="flex items-center gap-2">
                {["EASY", "HARD"].map((m) => (
                  <button key={m} onClick={() => setMode(m)} className={`text-xs font-bold px-3 py-1 rounded border transition-all ${mode === m ? "border-gray-600 text-gray-900 bg-gray-100" : "border-gray-200 text-gray-400 hover:border-gray-400"}`}>{m}</button>
                ))}
              </div>
            </div>
            <div className="px-5 pb-4 pt-4">
              <textarea value={input} onChange={(e) => setValue(e.target.value)} placeholder="Nhập những gì bạn nghe được" rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 outline-none focus:border-red-400 resize-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
