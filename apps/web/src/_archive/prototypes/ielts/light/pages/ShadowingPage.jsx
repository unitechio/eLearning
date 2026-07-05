import React, { useState } from "react";
import { shadowingSentences, shadowingWords } from "../data";

export function ShadowingPage() {
  const [currentSentence, setCurrentSentence] = useState(1);
  const [speed, setSpeed] = useState("1x");
  const [recording, setRecording] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans flex">
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800 flex items-center gap-2">
          <span className="text-sm font-bold text-white">Aero Smartwatch Sales Success</span>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2">
          {shadowingSentences.map((s) => (
            <div key={s.id} onClick={() => setCurrentSentence(s.id)} className={`rounded-xl p-3 cursor-pointer transition-all ${s.id === currentSentence ? "bg-gray-700 border border-gray-600" : "bg-gray-800 hover:bg-gray-750"}`}>
              <p className="text-xs text-gray-500 leading-relaxed">{s.text ?? "•• ••••• •• ••• •••••• •••••••••"}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 p-8 flex flex-col gap-6">
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <p className="text-white text-lg font-medium leading-relaxed">{shadowingSentences[0].text}</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <button onClick={() => setRecording(!recording)} className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${recording ? "bg-red-600 animate-pulse" : "bg-gray-700 hover:bg-gray-600"}`}>🎙</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {shadowingWords.map((w, i) => <span key={i} className="bg-gray-800 text-gray-400 px-3 py-1.5 rounded-lg text-sm font-mono tracking-widest">{w}</span>)}
        </div>
      </div>
    </div>
  );
}
