"use client";

import React, { useState } from "react";
import { useSpeakingStore } from "@/domains/speaking/stores/use-speaking-store";
import { Gauge, Languages, Sparkles, RefreshCcw, Volume2, Mic, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/shared/lib";

interface PhoneDetail {
  phone: string;
  score: 'Good' | 'Warning' | 'Missing';
}

interface SyllableDetail {
  syllable: string;
  phones: PhoneDetail[];
  score: 'Good' | 'Warning' | 'Missing';
}

export function FeedbackPanel() {
  const { isRecording, scoringResult, setScoringResult } = useSpeakingStore();
  const [selectedWord, setSelectedWord] = useState<string | null>("make");

  // Mock pronunciation details for demonstration matching user's image
  const pronunciationDetails: Record<string, SyllableDetail> = {
    "make": {
      syllable: "make",
      score: "Warning",
      phones: [
        { phone: "M", score: "Good" },
        { phone: "EY", score: "Good" },
        { phone: "K", score: "Missing" }
      ]
    },
    "planning": {
      syllable: "planning",
      score: "Good",
      phones: [
        { phone: "P", score: "Good" },
        { phone: "L", score: "Good" },
        { phone: "AE", score: "Good" },
        { phone: "N", score: "Good" },
        { phone: "IH", score: "Good" },
        { phone: "NG", score: "Good" }
      ]
    },
    "was": {
      syllable: "was",
      score: "Good",
      phones: [
        { phone: "W", score: "Good" },
        { phone: "AH", score: "Good" },
        { phone: "Z", score: "Good" }
      ]
    }
  };

  const playAudioSample = (type: 'native' | 'user') => {
    // Synth speaking sample or play feedback file
    const text = "Well, I was planning to make a delicious chocolate cake for the party tonight.";
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      if (type === 'user') {
        utterance.rate = 0.85; // simulate slower user speed
        utterance.pitch = 1.1;
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  if (isRecording) {
    return (
      <div className="h-full bg-slate-50 border border-slate-100/50 rounded-2xl flex flex-col items-center justify-center space-y-4 p-12 text-center text-slate-400">
        <Sparkles className="w-12 h-12 text-slate-300 animate-pulse" />
        <p className="font-semibold text-sm">AI is listening and evaluating in real-time...</p>
      </div>
    );
  }

  // Load default scoring results if none are present to keep the UI fully alive for testing/demo
  const currentResult = scoringResult || {
    overall_band: 7.0,
    feedback: "Well, I was planning to make a delicious chocolate cake for the party tonight, but I ended making a mess in the kitchen. I guess I'll have to clean up and start baking cake.",
    criteria: {
      fluency: 7.5,
      lexical: 7.0,
    },
    mistakes: [
      { text: "was planning", suggestion: "had planned" }
    ]
  };

  return (
    <aside className="space-y-6 animate-in fade-in duration-500">
      
      {/* Pronunciation & Stress Breakdown Card */}
      <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <header className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
          <Sparkles className="w-5 h-5 text-blue-500" />
          <h3 className="font-black text-base">Đề xuất lỗi trong bài nói của bạn</h3>
        </header>

        {/* Text viewer with colors */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 leading-relaxed font-semibold text-slate-800 text-sm">
          <span>Well, I </span>
          <span 
            className="border-b-2 border-orange-400 bg-orange-50 px-1 rounded cursor-pointer"
            onClick={() => setSelectedWord("was")}
          >
            was
          </span>
          <span> </span>
          <span 
            className="border-b-2 border-orange-400 bg-orange-50 px-1 rounded cursor-pointer"
            onClick={() => setSelectedWord("planning")}
          >
            planning
          </span>
          <span> to </span>
          <span 
            className="border-b-2 border-red-400 bg-red-50 px-1 rounded cursor-pointer font-black text-red-700"
            onClick={() => setSelectedWord("make")}
          >
            make
          </span>
          <span> a delicious chocolate cake for the party tonight...</span>
        </div>

        {/* Floating popover/details for selected word */}
        {selectedWord && pronunciationDetails[selectedWord] && (
          <article className="border border-slate-100 rounded-2xl bg-white p-4 shadow-lg space-y-4">
            <header className="flex items-center justify-between border-b border-slate-50 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Từ đã chọn:</span>
                <span className="font-black text-slate-800 uppercase">{selectedWord}</span>
              </div>
              <div className="flex gap-2">
                <button
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                  onClick={() => playAudioSample('native')}
                  title="Nghe phát âm chuẩn Native"
                  type="button"
                  aria-label="Play native speaker sample"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
                <button
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition"
                  onClick={() => playAudioSample('user')}
                  title="Nghe lại bài nói của bạn"
                  type="button"
                  aria-label="Play user recording sample"
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
              </div>
            </header>

            {/* Phoneme Table breakdown matching DOL LMS design */}
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-2">Syllable</th>
                  <th className="pb-2">Phone</th>
                  <th className="pb-2 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-bold text-slate-700">
                {pronunciationDetails[selectedWord].phones.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5">{idx === 0 ? selectedWord : ""}</td>
                    <td className="py-2.5 font-mono">{p.phone}</td>
                    <td className="py-2.5 text-right">
                      <span className={cn(
                        "inline-flex items-center gap-1 text-[11px] font-black rounded-full px-2.5 py-0.5",
                        p.score === 'Good' && "bg-green-50 text-green-700",
                        p.score === 'Warning' && "bg-orange-50 text-orange-700",
                        p.score === 'Missing' && "bg-red-50 text-red-700"
                      )}>
                        {p.score === 'Good' && <CheckCircle className="w-3 h-3 text-green-600" />}
                        {p.score === 'Warning' && <AlertTriangle className="w-3 h-3 text-orange-600" />}
                        {p.score === 'Missing' && <XCircle className="w-3 h-3 text-red-600" />}
                        {p.score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        )}
      </section>

      {/* Main Score summary */}
      <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Band Score ước tính
          </p>
          <h3 className="text-4xl font-extrabold text-slate-800 tracking-tighter">
            {currentResult.overall_band.toFixed(1)} <span className="text-lg font-medium text-slate-300">/ 9.0</span>
          </h3>
        </div>
        <div className="w-16 h-16 rounded-full border-[5px] border-red-500/20 flex flex-col items-center justify-center relative bg-slate-50">
          <div className="absolute inset-0 rounded-full border-[5px] border-red-500 border-t-transparent rotate-45"></div>
          <span className="text-red-500 font-black text-xs">Top 8%</span>
        </div>
      </section>

      {/* Category metrics */}
      <section className="grid grid-cols-1 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Gauge className="text-red-500 w-5 h-5" />
              <h4 className="font-bold text-sm text-slate-700">Fluency & Coherence</h4>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-red-50 text-red-600 rounded-full">
              {currentResult.criteria.fluency.toFixed(1)}
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Lưu ý cách ngắt nghỉ tự nhiên, tránh kéo dài hơi ở cuối câu hỏi hoặc khi ngắt cụm giới từ.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Languages className="text-blue-500 w-5 h-5" />
              <h4 className="font-bold text-sm text-slate-700">Lexical Resource</h4>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
              {currentResult.criteria.lexical.toFixed(1)}
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Từ vựng khá linh hoạt, tuy nhiên cần bổ sung thêm các collocations nâng cao để đạt band 7.5+.
          </p>
        </div>
      </section>

      {/* Try again */}
      <button 
        onClick={() => setScoringResult(null)}
        className="w-full py-3.5 bg-slate-100 text-slate-700 font-black rounded-xl text-sm hover:bg-slate-200 transition flex items-center justify-center gap-2 border border-slate-200/50"
      >
        <RefreshCcw className="w-4 h-4" />
        Luyện nói lại để nâng cao điểm
      </button>
    </aside>
  );
}
