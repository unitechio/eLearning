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
            onClick={() => onSelect?.(n)}
            className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${
              isActive
                ? "bg-red-600 text-white shadow-sm"
                : isDone
                ? "bg-red-100 text-red-600 border border-red-300"
                : "border border-gray-300 text-gray-500 hover:border-red-400 hover:text-red-500"
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
    <div className={`bg-white border-r border-gray-200 transition-all duration-200 ${open ? "w-52" : "w-0 overflow-hidden"}`}>
      {open && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-gray-700">Bảng câu hỏi</span>
            <button onClick={onToggle} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          {sections.map((sec) => (
            <div key={sec.label} className="mb-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{sec.label}</p>
              <QuestionNumberGrid
                total={sec.total}
                current={current}
                answered={answered}
                onSelect={onSelect}
                columns={5}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
