interface QuestionNumberGridProps {
  total?: number;
  current?: number;
  answered?: number[];
  onSelect?: (questionNumber: number) => void;
  columns?: number;
}

interface QuestionDrawerSection {
  label: string;
  total: number;
}

interface QuestionDrawerProps {
  sections: QuestionDrawerSection[];
  current: number;
  answered: number[];
  onSelect?: (questionNumber: number) => void;
  open: boolean;
  onToggle?: () => void;
}

export function QuestionNumberGrid({
  total = 40,
  current = 1,
  answered = [],
  onSelect,
  columns = 5,
}: QuestionNumberGridProps) {
  const answeredSet = new Set(answered);

  return (
    <div
      className="grid gap-1.5"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: total }, (_, i) => i + 1).map((n) => {
        const isActive = n === current;
        const isDone = answeredSet.has(n);

        return (
          <button
            key={n}
            type="button"
            onClick={() => onSelect?.(n)}
            aria-current={isActive ? "step" : undefined}
            aria-label={`Câu ${n}${isDone ? " (đã trả lời)" : ""}`}
            className={`w-8 h-8 rounded-full text-xs font-medium transition-all font-label ${
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : isDone
                ? "bg-primary/10 text-primary border border-primary/30"
                : "border border-outline-variant text-on-surface-variant hover:border-primary/50 hover:text-primary"
            }`}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}

export function QuestionDrawer({
  sections,
  current,
  answered,
  onSelect,
  open,
  onToggle,
}: QuestionDrawerProps) {
  return (
    <div
      className={`bg-surface-container-lowest border-r border-outline-variant transition-all duration-200 ${
        open ? "w-52" : "w-0 overflow-hidden"
      }`}
    >
      {open && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-on-surface">Bảng câu hỏi</span>
            <button
              type="button"
              onClick={onToggle}
              aria-label="Đóng bảng câu hỏi"
              className="text-on-surface-variant hover:text-on-surface transition-colors"
            >
              ✕
            </button>
          </div>
          <nav aria-label="Danh sách câu hỏi">
            {sections.map((sec) => (
              <div key={sec.label} className="mb-4">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-2">
                  {sec.label}
                </p>
                <QuestionNumberGrid
                  total={sec.total}
                  current={current}
                  answered={answered}
                  onSelect={onSelect}
                  columns={5}
                />
              </div>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
