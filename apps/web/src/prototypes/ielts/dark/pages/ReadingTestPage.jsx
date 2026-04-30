import React, { useState } from "react";
import { kakapoText } from "../data";

export function ReadingTestPage() {
  const [answers, setAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 13;
  const tfngQ = [
    { id: 3, text: "Adult male kakapo bring food back to nesting females." },
    { id: 4, text: "The Polynesian rat was a greater threat to the kakapo than Polynesian settlers." },
    { id: 5, text: "Kakapo were transferred from Rakiura Island to other locations because they were at risk from feral cats." },
  ];

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button className="text-gray-500">✕</button>
          <div>
            <div className="bg-red-600 text-white font-bold px-2 py-0.5 rounded text-xs inline-block">DOL ĐÌNH LỰC</div>
            <p className="text-xs text-gray-400 mt-0.5">IELTS Online Test · CAM 20 · Reading Test 1</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold">⏱ 58:52</div>
      </div>

      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 120px)" }}>
        <div className="w-1/2 overflow-y-auto p-6 border-r border-gray-200 bg-white">
          <h2 className="text-xl font-extrabold mb-1">The kākāpō</h2>
          <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">{kakapoText}</p>
        </div>
        <div className="w-1/2 overflow-y-auto p-6 space-y-4">
          {tfngQ.map((q) => (
            <div key={q.id} className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm font-medium text-gray-800 mb-3"><span className="text-red-600 font-bold mr-1">{q.id}</span>{q.text}</p>
              <div className="space-y-2">
                {["True", "False", "Not given"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name={`rq${q.id}`} value={opt} onChange={() => setAnswers((p) => ({ ...p, [q.id]: opt }))} checked={answers[q.id] === opt} className="accent-red-600" />
                    <span className="text-sm text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500"><span>⋮⋮</span><span>Passage 1 &nbsp; Đã làm 0/13</span></div>
        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setCurrentPage(p)} className={`w-7 h-7 rounded-full text-xs font-semibold transition-all ${p === currentPage ? "bg-red-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>{p}</button>
          ))}
        </div>
        <button className="bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">7 → 13</button>
      </div>
    </div>
  );
}
