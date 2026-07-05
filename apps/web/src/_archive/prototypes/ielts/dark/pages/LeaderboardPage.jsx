import React, { useState } from "react";
import { leaderboardData } from "../data";
import { Avatar } from "../shared/Avatar";
import { RED } from "../theme";

export function LeaderboardPage() {
  const [period, setPeriod] = useState("Tuần");
  const [tab, setTab] = useState("time");
  const top3 = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      <div className="text-center pt-10 pb-4 px-4">
        <h1 className="text-3xl font-extrabold">🏆 Bảng xếp hạng</h1>
        <p className="text-gray-400 mt-1 text-sm">Xem thứ hạng của bạn so với người học khác</p>
        <div className="mt-4 inline-flex gap-1 bg-gray-800 p-1 rounded-full">
          {["Tuần", "Tháng"].map((p) => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${period === p ? `${RED} text-white` : "text-gray-400 hover:text-white"}`}>
              {p}
            </button>
          ))}
        </div>
        <div className="mt-3 inline-flex gap-2">
          {[
            { key: "time", label: "⏱ Thời gian luyện tập" },
            { key: "points", label: "⭐ Điểm" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${tab === item.key ? `${RED} border-red-600 text-white` : "border-gray-700 text-gray-400 hover:border-gray-500"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center items-end gap-4 px-6 py-6">
        {[top3[1], top3[0], top3[2]].map((u, i) => {
          const heights = ["h-28", "h-36", "h-24"];
          const sizes = ["w-14 h-14", "w-20 h-20", "w-14 h-14"];
          return (
            <div key={u.rank} className="flex flex-col items-center gap-1">
              <span className="text-2xl">{u.medal}</span>
              <div className={`rounded-full border-4 ${i === 1 ? "border-yellow-400" : i === 0 ? "border-gray-300" : "border-orange-600"} overflow-hidden ${sizes[i]}`}>
                <Avatar name={u.name} size={i === 1 ? 20 : 14} />
              </div>
              <span className={`text-xs font-semibold mt-1 ${i === 1 ? "text-white text-sm" : "text-gray-300"}`}>{u.name}</span>
              <span className="text-xs text-gray-400">{u.time}</span>
              {u.streak && <span className="text-xs text-orange-400">🔥 {u.streak}d</span>}
              <div className={`${heights[i]} w-20 rounded-t-lg mt-1 flex items-end justify-center pb-2 font-bold text-lg`} style={{ background: i === 1 ? "rgba(212,37,37,0.3)" : "rgba(255,255,255,0.07)" }}>
                {u.rank}
              </div>
            </div>
          );
        })}
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-24 space-y-1">
        {rest.map((u) => (
          <div key={u.rank} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 transition-colors">
            <span className="w-7 text-center text-gray-500 font-mono text-sm">{u.rank}</span>
            <Avatar name={u.name} size={9} />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{u.name}</p>
              {u.streak && <p className="text-xs text-orange-400">🔥 {u.streak} ngày</p>}
            </div>
            <span className="text-sm font-semibold text-gray-200">{u.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
