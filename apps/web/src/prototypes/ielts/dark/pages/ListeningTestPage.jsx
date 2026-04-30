import React, { useState } from "react";
import { listeningQ11_16, optionsAI } from "../data";

export function ListeningTestPage() {
  const [section, setSection] = useState(2);
  const [answers17, setAnswers17] = useState({});
  const [gridAnswers, setGridAnswers] = useState({});
  const [section4Answers, setSection4Answers] = useState({});
  const [timeLeft] = useState("25:00");
  const toggleGrid = (row, col) => setGridAnswers((prev) => ({ ...prev, [`${row}-${col}`]: !prev[`${row}-${col}`] }));
  const sectionScores = { 1: "0/10", 2: "0/10", 3: "0/10", 4: "0/10" };

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button className="text-gray-500 hover:text-gray-700">✕</button>
          <div>
            <div className="bg-red-600 text-white font-bold px-2 py-0.5 rounded text-xs inline-block">DOL ĐÌNH LỰC</div>
            <p className="text-xs text-gray-400 mt-0.5">IELTS Online Test · CAM 20 · Listening Test 2</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold"><span>⏱</span><span>{timeLeft}</span></div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {section === 2 && (
          <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-red-600 text-white px-4 py-3 text-sm font-semibold">
                Question 11 – 16 &nbsp; Match each role of the volunteers, <b>A–I</b>, with the correct activity.
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="w-8"></th>
                      <th className="text-left font-normal text-gray-600 pb-2 pr-4"></th>
                      {optionsAI.map((o) => <th key={o.key} className="text-center font-bold text-gray-700 w-8 pb-2">{o.key}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {listeningQ11_16.map((q) => (
                      <tr key={q.id} className="border-t border-gray-100">
                        <td className="text-red-600 font-bold py-2 pr-2 align-middle">{q.id}.</td>
                        <td className="pr-4 py-2 text-gray-800 align-middle whitespace-nowrap">{q.text}</td>
                        {optionsAI.map((o) => (
                          <td key={o.key} className="text-center py-2 align-middle">
                            <button onClick={() => toggleGrid(q.id, o.key)} className={`w-5 h-5 rounded border text-xs transition-all ${gridAnswers[`${q.id}-${o.key}`] ? "bg-red-600 border-red-600 text-white" : "border-gray-300 text-gray-300 hover:border-red-400"}`}>✓</button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-red-600 text-white px-4 py-3 text-sm font-semibold">
                Question 17 – 20 &nbsp; Choose appropriate options <b>A</b>, <b>B</b>, or <b>C</b>.
              </div>
              <div className="p-4 space-y-4">
                {[
                  { id: 17, q: "Which event requires the largest number of volunteers?", opts: ["the music festival", "the science festival", "the book festival"] },
                  { id: 18, q: "What is the most important requirement for volunteers at the festivals?", opts: ["interpersonal skills", "personal interest in the event", "flexibility"] },
                ].map((item) => (
                  <div key={item.id} className="border border-gray-100 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-800 mb-3"><span className="text-red-600 font-bold mr-1">{item.id}</span>{item.q}</p>
                    <div className="space-y-2">
                      {item.opts.map((opt) => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                          <input type="radio" name={`q${item.id}`} value={opt} onChange={() => setAnswers17((p) => ({ ...p, [item.id]: opt }))} checked={answers17[item.id] === opt} className="accent-red-600" />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {section === 4 && (
          <div className="max-w-2xl mx-auto px-4 py-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-red-600 text-white px-4 py-3 text-sm font-semibold">
                Question 31 – 40 &nbsp; Complete the notes below using <span className="underline">ONE WORD ONLY</span>.
              </div>
              <div className="p-5 space-y-4 text-sm text-gray-800">
                {[31, 32, 33, 34].map((id) => (
                  <div key={id}>
                    <span className="text-red-600 font-bold">{id}</span>
                    <input value={section4Answers[id] || ""} onChange={(e) => setSection4Answers((p) => ({ ...p, [id]: e.target.value }))} className="mx-2 border-b-2 border-gray-300 focus:border-red-600 outline-none text-sm w-24 text-center" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-500 text-xs"><span>⋮⋮</span><span>Section {section}</span><span className="text-gray-400">Đã làm 0/10</span></div>
        <div className="flex gap-3">
          {[1, 2, 3, 4].map((s) => (
            <button key={s} onClick={() => setSection(s)} className={`text-xs px-2 py-1 rounded transition-all ${s === section ? "text-red-600 font-bold border-b-2 border-red-600" : "text-gray-400 hover:text-gray-700"}`}>
              Section {s} &nbsp;{sectionScores[s]}
            </button>
          ))}
        </div>
        <button className="bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">Nộp bài</button>
      </div>
    </div>
  );
}
