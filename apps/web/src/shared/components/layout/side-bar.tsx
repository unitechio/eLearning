// components/layout/SenglishSidebar.jsx
// Used by: Leaderboard, Progress, Shadowing, Dictation pages (Senglish domain)

const NAV = [
  { section: "TỔNG QUAN", items: [{ icon: "🏠", label: "Trang chủ", id: "home" }] },
  {
    section: "LUYỆN TẬP",
    items: [
      { icon: "🎧", label: "Dictation", id: "dictation" },
      { icon: "🎤", label: "Shadowing", id: "shadowing" },
      { icon: "💬", label: "Luyện nói", id: "speaking" },
      { icon: "📚", label: "Luyện từ vựng", id: "vocab" },
    ],
  },
  {
    section: "THƯ VIỆN",
    items: [
      { icon: "🎬", label: "Video của tôi", id: "video" },
      { icon: "📋", label: "Danh sách từ", id: "wordlist", badge: 0 },
      { icon: "🤖", label: "Từ điển AI", id: "ai-dict" },
    ],
  },
  {
    section: "TIẾN ĐỘ",
    items: [
      { icon: "🏆", label: "Xếp hạng", id: "leaderboard" },
      { icon: "📊", label: "Thống kê", id: "stats" },
    ],
  },
];

export default function Sidebar({ active = "shadowing", collapsed = false }) {
  return (
    <aside
      className={`${
        collapsed ? "w-14" : "w-44"
      } bg-gray-900 border-r border-gray-800 flex flex-col shrink-0 transition-all duration-200`}
    >
      {/* Logo */}
      <div className="px-4 py-4 border-b border-gray-800 flex items-center gap-2">
        <div className="w-7 h-7 bg-gray-700 rounded text-white font-black text-xs flex items-center justify-center shrink-0">
          S
        </div>
        {!collapsed && (
          <span className="text-sm font-black text-white tracking-tight">SENGLISH</span>
        )}
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-4 px-2">
        {NAV.map((group) => (
          <div key={group.section}>
            {!collapsed && (
              <p className="text-xs text-gray-600 uppercase tracking-widest px-2 mb-1">
                {group.section}
              </p>
            )}
            {group.items.map((item) => (
              <button
                key={item.id}
                className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors ${
                  item.id === active
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="shrink-0">{item.icon}</span>
                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}
                {!collapsed && item.badge !== undefined && (
                  <span className="ml-auto bg-gray-700 text-gray-400 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-800 space-y-2">
        <button className="w-full text-xs bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-3 py-2 rounded-lg transition-colors">
          {collapsed ? "⚡" : "⚡ Nâng cấp Premium"}
        </button>
        <div className="flex items-center gap-2 px-1">
          <div className="w-7 h-7 rounded-full bg-gray-600 text-xs flex items-center justify-center shrink-0 text-gray-300">
            14
          </div>
          {!collapsed && (
            <span className="text-xs text-gray-400 truncate">14.phạm tiến đạt</span>
          )}
        </div>
      </div>
    </aside>
  );
}
