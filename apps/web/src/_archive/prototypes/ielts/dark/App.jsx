import React, { useState } from "react";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { ProgressPage } from "./pages/ProgressPage";
import { ListeningTestPage } from "./pages/ListeningTestPage";
import { ReadingTestPage } from "./pages/ReadingTestPage";

const pages = [
  { id: "leaderboard", label: "🏆 Xếp hạng", component: LeaderboardPage },
  { id: "progress", label: "📊 Tiến trình", component: ProgressPage },
  { id: "listening", label: "🎧 Listening Test", component: ListeningTestPage },
  { id: "reading", label: "📖 Reading Test", component: ReadingTestPage },
];

export default function DarkIeltsPrototypeApp() {
  const [active, setActive] = useState("leaderboard");
  const Page = pages.find((p) => p.id === active).component;

  return (
    <div className="font-sans">
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-950 border-b border-gray-800 flex gap-1 px-3 py-2 overflow-x-auto">
        {pages.map((p) => (
          <button
            key={p.id}
            onClick={() => setActive(p.id)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${active === p.id ? "bg-red-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="pt-10">
        <Page />
      </div>
    </div>
  );
}
