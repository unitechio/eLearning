interface FilterGroup {
  title: string;
  items: string[];
}

interface FilterSidebarProps {
  groups?: FilterGroup[];
  selected?: Record<string, string[]>;
  onToggle?: (group: string, item: string) => void;
  sort?: string;
  sortOptions?: string[];
  onSort?: (value: string) => void;
  searchValue?: string;
  onSearch?: (value: string) => void;
}

export function FilterSidebar({
  groups = [],
  selected = {},
  onToggle,
  sort,
  sortOptions = ["Mới nhất", "Cũ nhất", "Nhiều lượt xem nhất"],
  onSort,
  searchValue = "",
  onSearch,
}: FilterSidebarProps) {
  return (
    <aside className="w-48 shrink-0 hidden md:block">
      {/* Search */}
      <p className="font-bold text-sm text-gray-700 mb-2">Tìm kiếm</p>
      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden mb-5">
        <input
          value={searchValue}
          onChange={(e) => onSearch?.(e.target.value)}
          className="flex-1 text-sm px-3 py-2 outline-none"
          placeholder="Search"
        />
        <span className="px-3 text-gray-400 text-sm">🔍</span>
      </div>

      {/* Filter groups */}
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Bộ lọc</p>
      {groups.map((group) => (
        <div key={group.title} className="mb-5">
          {group.title && (
            <p className="text-sm font-semibold text-gray-700 mb-1">{group.title}</p>
          )}
          <div className="space-y-1.5">
            {group.items.map((item) => {
              const checked = (selected[group.title] ?? []).includes(item);
              return (
                <label key={item} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="accent-red-600"
                    checked={checked}
                    onChange={() => onToggle?.(group.title, item)}
                  />
                  <span className="text-sm text-gray-600 group-hover:text-red-600 transition-colors">
                    {item}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {/* Sort */}
      {sortOptions.length > 0 && (
        <>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">SẮP XẾP THEO</p>
          <div className="space-y-1.5">
            {sortOptions.map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sidebar-sort"
                  value={s}
                  checked={sort === s}
                  onChange={() => onSort?.(s)}
                  className="accent-red-600"
                />
                <span className="text-sm text-gray-600">{s}</span>
              </label>
            ))}
          </div>
        </>
      )}
    </aside>
  );
}
