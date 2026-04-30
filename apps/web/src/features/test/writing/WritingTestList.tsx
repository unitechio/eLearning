
// ─── data ─────────────────────────────────────────────────────────────────────
const SAMPLES = [
  { tag: "Advice Seeking Letter", quarter: "Quí 3 2021", title: "Thư cho lời khuyên (Letter of Advice) - IELTS General Writing Task 1 - Đề 3", img: "🏙️" },
  { tag: "Advice Seeking Letter", quarter: "Quí 2 2021", title: "Thư cho lời khuyên (Letter of Advice) - IELTS General Writing Task 1 - Đề 2", img: "💼" },
  { tag: "Advice Seeking Letter", quarter: "Quí 2 2021", title: "Thư cho lời khuyên (Letter of Advice) - IELTS General Writing Task 1 - Đề 1", img: "🚗" },
  { tag: "Application letter",    quarter: "Quí 1 2021", title: "Thư đăng ký (Application Letter) - IELTS General Writing Task 1 - Đề 3",         img: "📋" },
  { tag: "Application letter",    quarter: "Quí 1 2021", title: "Thư xin việc (Job Application Letter) - IELTS General Writing Task 1 - Đề 2",     img: "🤝" },
  { tag: "Application letter",    quarter: "Quí 1 2021", title: "Thư xin việc (Job Application Letter) - IELTS General Writing Task 1 - Đề 1",     img: "🗼" },
  { tag: "Request Letter",        quarter: "Quí 1 2021", title: "Thư yêu cầu (Letter of Request) - IELTS General Writing Task 1 - Đề 3",            img: "📝" },
  { tag: "Request Letter",        quarter: "Quí 1 2021", title: "Thư yêu cầu (Letter of Request) - IELTS General Writing Task 1 - Đề 2",            img: "🚖" },
  { tag: "Request Letter",        quarter: "Quí 1 2021", title: "Thư yêu cầu (Letter of Request) - IELTS General Writing Task 1 - Đề 1",            img: "📨" },
];

const FILTER_TAGS = [
  "Request Letter", "Advice Seeking Letter", "Application letter",
  "Complaint Letter", "Apology Letter",
];

// ─── Sidebar filter ────────────────────────────────────────────────────────────
function FilterSidebar({ selected, onSelect, sort, onSort }) {
  return (
    <aside className="w-48 shrink-0 hidden md:block">
      {/* Search */}
      <p className="font-bold text-sm text-gray-700 mb-3">Tìm kiếm</p>
      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden mb-5">
        <input className="flex-1 text-sm px-3 py-2 outline-none" placeholder="Search" />
        <button className="px-3 text-gray-400">🔍</button>
      </div>

      {/* Filter */}
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Bộ lọc</p>
      <p className="font-semibold text-sm text-gray-700 mb-1">DẠNG ĐỀ BÀI (6)</p>
      <div className="space-y-1.5 mb-5">
        {FILTER_TAGS.map((tag) => (
          <label key={tag} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="accent-red-600"
              checked={selected === tag}
              onChange={() => onSelect(selected === tag ? null : tag)}
            />
            <span className="text-sm text-gray-600 hover:text-red-600 transition-colors">{tag}</span>
          </label>
        ))}
      </div>

      {/* Year */}
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">NĂM</p>
      <label className="flex items-center gap-2 cursor-pointer mb-5">
        <input type="checkbox" className="accent-red-600" defaultChecked />
        <span className="text-sm text-gray-600">2021</span>
      </label>

      {/* Sort */}
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">SẮP XẾP THEO</p>
      {["Mới nhất", "Cũ nhất", "Nhiều lượt xem nhất"].map((s) => (
        <label key={s} className="flex items-center gap-2 cursor-pointer mb-1.5">
          <input
            type="radio"
            name="sort"
            value={s}
            checked={sort === s}
            onChange={() => onSort(s)}
            className="accent-red-600"
          />
          <span className="text-sm text-gray-600">{s}</span>
        </label>
      ))}
    </aside>
  );
}

// ─── Article card (list row) ──────────────────────────────────────────────────
function ArticleRow({ item }) {
  return (
    <div className="flex gap-4 group cursor-pointer border-b border-gray-100 pb-5">
      <div className="w-36 h-24 rounded-xl bg-gray-100 flex items-center justify-center text-4xl shrink-0">
        {item.img}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-red-600 font-semibold mb-1">
          {item.quarter} · {item.tag}
        </p>
        <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors text-sm leading-snug">
          {item.title}
        </h3>
        <p className="mt-1 text-xs text-gray-500 line-clamp-2">
          Đề thi IELTS General Writing Task 1 yêu cầu viết một là thư cho lời khuyên.
          Đây là một trong những dạng bài của Writing General. Dưới đây, DOL sẽ cung cấp
          cho bạn một bài làm mẫu của dạng này, các bạn có thể…
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Writing List Page
// ══════════════════════════════════════════════════════════════════════════════
function WritingListPage() {
  const [selected, setSelected] = useState(null);
  const [sort,     setSort]     = useState("Mới nhất");
  const [page,     setPage]     = useState(1);

  const filtered = selected ? SAMPLES.filter((s) => s.tag === selected) : SAMPLES;

  return (
    <div className="min-h-screen bg-white font-sans">
      <DolHeader active="Bài mẫu IELTS ▾" />

      <HeroBanner
        title="DOL IELTS Writing"
        titleRed="Task 1 General Sample"
        description="Tổng hợp bài mẫu IELTS General Writing Task 1 và hướng dẫn cách làm bài, từ vựng chi tiết theo chủ đề"
      />

      <div className="max-w-5xl mx-auto px-4 py-10 flex gap-8">
        <FilterSidebar
          selected={selected}
          onSelect={setSelected}
          sort={sort}
          onSort={setSort}
        />

        <div className="flex-1 space-y-5">
          {filtered.map((item, i) => <ArticleRow key={i} item={item} />)}
          <Pagination current={page} total={2} onChange={setPage} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <CTABanner />
      </div>
      <DolFooter />
    </div>
  );
}
