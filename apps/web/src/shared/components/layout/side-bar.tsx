interface NavItem {
  icon: string;
  label: string;
  id: string;
  badge?: number;
}

interface NavGroup {
  section: string;
  items: NavItem[];
}

const NAV: NavGroup[] = [
  { section: "Tổng quan", items: [{ icon: "🏠", label: "Trang chủ", id: "home" }] },
  {
    section: "Luyện tập",
    items: [
      { icon: "🎧", label: "Dictation", id: "dictation" },
      { icon: "🎤", label: "Shadowing", id: "shadowing" },
      { icon: "💬", label: "Luyện nói", id: "speaking" },
      { icon: "📚", label: "Luyện từ vựng", id: "vocab" },
    ],
  },
  {
    section: "Thư viện",
    items: [
      { icon: "🎬", label: "Video của tôi", id: "video" },
      { icon: "📋", label: "Danh sách từ", id: "wordlist", badge: 0 },
      { icon: "🤖", label: "Từ điển AI", id: "ai-dict" },
    ],
  },
  {
    section: "Tiến độ",
    items: [
      { icon: "🏆", label: "Xếp hạng", id: "leaderboard" },
      { icon: "📊", label: "Thống kê", id: "stats" },
    ],
  },
];

interface AppSidebarProps {
  activeId?: string;
  collapsed?: boolean;
  username?: string;
  onUpgradeClick?: () => void;
}

export default function AppSidebar({
  activeId = "shadowing",
  collapsed = false,
  username,
  onUpgradeClick,
}: AppSidebarProps) {
  return (
    <aside
      className={`${collapsed ? "w-14" : "w-44"
        } bg-inverse-surface border-r border-inverse-surface/20 flex flex-col shrink-0 transition-all duration-200`}
    >
      {/* Logo */}
      <div className="px-4 py-4 border-b border-inverse-surface/20 flex items-center gap-2">
        <div className="w-7 h-7 bg-primary rounded text-primary-foreground font-black text-xs flex items-center justify-center shrink-0">
          E
        </div>
        {!collapsed && (
          <span className="text-sm font-black text-inverse-on-surface tracking-tight font-headline">
            eEnglish
          </span>
        )}
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-4 px-2" aria-label="Điều hướng chính">
        {NAV.map((group) => (
          <div key={group.section}>
            {!collapsed && (
              <p className="text-xs text-inverse-on-surface/40 uppercase tracking-widest px-2 mb-1 font-label font-semibold">
                {group.section}
              </p>
            )}
            {group.items.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-current={item.id === activeId ? "page" : undefined}
                className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors ${item.id === activeId
                  ? "bg-inverse-on-surface/10 text-inverse-on-surface"
                  : "text-inverse-on-surface/60 hover:bg-inverse-on-surface/10 hover:text-inverse-on-surface"
                  }`}
              >
                <span className="shrink-0" aria-hidden="true">{item.icon}</span>
                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}
                {!collapsed && item.badge !== undefined && (
                  <span className="ml-auto bg-inverse-on-surface/10 text-inverse-on-surface/60 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-inverse-surface/20 space-y-2">
        <button
          type="button"
          onClick={onUpgradeClick}
          className="w-full text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-3 py-2 rounded-lg transition-colors"
        >
          {collapsed ? "⚡" : "⚡ Nâng cấp Premium"}
        </button>
        {username && (
          <div className="flex items-center gap-2 px-1">
            <div className="w-7 h-7 rounded-full bg-inverse-on-surface/10 text-xs flex items-center justify-center shrink-0 text-inverse-on-surface">
              {username.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <span className="text-xs text-inverse-on-surface/60 truncate">{username}</span>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
