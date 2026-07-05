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
    <aside className="w-64 shrink-0 hidden md:block">
      {/* Search */}
      <p className="font-label font-bold text-sm text-on-surface mb-2">Tìm kiếm</p>
      <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden mb-5">
        <input
          value={searchValue}
          onChange={(e) => onSearch?.(e.target.value)}
          className="flex-1 text-sm px-3 py-2 outline-none bg-transparent text-on-surface placeholder:text-on-surface-variant/60"
          placeholder="Search"
        />
        <span className="px-3 text-on-surface-variant text-sm" aria-hidden="true">🔍</span>
      </div>

      {/* Filter groups */}
      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-2">
        Bộ lọc
      </p>
      {groups.map((group) => (
        <div key={group.title} className="mb-5">
          {group.title && (
            <p className="text-sm font-semibold text-on-surface mb-1">{group.title}</p>
          )}
          <div className="space-y-1.5">
            {group.items.map((item) => {
              const checked = (selected[group.title] ?? []).includes(item);
              return (
                <label key={item} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="accent-primary"
                    checked={checked}
                    onChange={() => onToggle?.(group.title, item)}
                  />
                  <span className="text-sm text-on-surface-variant group-hover:text-primary transition-colors">
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
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-2">
            Sắp xếp theo
          </p>
          <div className="space-y-1.5">
            {sortOptions.map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sidebar-sort"
                  value={s}
                  checked={sort === s}
                  onChange={() => onSort?.(s)}
                  className="accent-primary"
                />
                <span className="text-sm text-on-surface-variant">{s}</span>
              </label>
            ))}
          </div>
        </>
      )}
    </aside>
  );
}
