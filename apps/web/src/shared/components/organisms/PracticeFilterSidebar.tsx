import React from "react";
import { Search } from "lucide-react";

export interface FilterOption {
  label: string;
  value: string;
}

export interface PracticeFilterSidebarProps {
  /** Label for the search input */
  searchPlaceholder?: string;
  /** Value of the search input */
  searchValue?: string;
  /** Callback when search input changes */
  onSearchChange?: (val: string) => void;
  /** Status options to filter by */
  statusOptions?: FilterOption[];
  /** Question type options */
  questionTypes?: FilterOption[];
  /** Sort options */
  sortOptions?: FilterOption[];
  /** Checked statuses */
  selectedStatuses?: string[];
  /** Checked question types */
  selectedQuestionTypes?: string[];
  /** Selected sort option */
  selectedSort?: string;
  /** Callback for status toggle */
  onStatusToggle?: (val: string) => void;
  /** Callback for question type toggle */
  onQuestionTypeToggle?: (val: string) => void;
  /** Callback for sort selection */
  onSortChange?: (val: string) => void;
  /** Callback for "View All" on question types */
  onViewAllQuestionTypes?: () => void;
  /** Custom total question type count (e.g. 19) */
  totalQuestionTypesCount?: number;
}

export function PracticeFilterSidebar({
  searchPlaceholder = "Search",
  searchValue = "",
  onSearchChange,
  statusOptions = [
    { label: "Bài chưa làm", value: "not-started" },
    { label: "Bài đang làm", value: "in-progress" },
    { label: "Bài đã làm", value: "completed" },
  ],
  questionTypes = [],
  sortOptions = [
    { label: "Mới nhất", value: "newest" },
    { label: "Cũ nhất", value: "oldest" },
    { label: "Nhiều lượt làm nhất", value: "most-viewed" },
    { label: "Từ A > Z", value: "az" },
    { label: "Từ Z > A", value: "za" },
  ],
  selectedStatuses = [],
  selectedQuestionTypes = [],
  selectedSort = "",
  onStatusToggle,
  onQuestionTypeToggle,
  onSortChange,
  onViewAllQuestionTypes,
  totalQuestionTypesCount,
}: PracticeFilterSidebarProps) {
  return (
    <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
      {/* Search Block */}
      <div className="rounded-[8px] border border-slate-200 bg-white p-4">
        <p className="text-base font-black text-slate-900 mb-3">Tìm kiếm</p>
        <label className="flex h-10 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
          <input
            className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
          <button
            className="flex w-10 items-center justify-center bg-slate-700 text-white hover:bg-slate-800 transition"
            type="button"
          >
            <Search className="h-4 w-4" />
          </button>
        </label>
      </div>

      {/* Filter Block */}
      <div className="rounded-[8px] border border-slate-200 bg-white p-4">
        <p className="text-base font-black text-slate-900 mb-4">Bộ lọc</p>
        
        {/* Status */}
        {statusOptions.length > 0 && (
          <div className="border-b border-slate-100 pb-4">
            <p className="text-xs font-bold uppercase text-slate-700">Trạng thái</p>
            {statusOptions.map((item) => (
              <label
                className="mt-3 flex items-center justify-between gap-3 text-sm text-slate-600 cursor-pointer hover:text-slate-900 transition"
                key={item.value}
              >
                {item.label}
                <input
                  className="h-4 w-4 rounded border-slate-300 accent-red-600"
                  type="checkbox"
                  checked={selectedStatuses.includes(item.value)}
                  onChange={() => onStatusToggle?.(item.value)}
                />
              </label>
            ))}
          </div>
        )}

        {/* Question Types */}
        {questionTypes.length > 0 && (
          <div className="border-b border-slate-100 py-4">
            <p className="text-xs font-bold uppercase text-slate-700">
              Dạng câu hỏi {totalQuestionTypesCount ? `(${totalQuestionTypesCount})` : ""}
            </p>
            {questionTypes.map((item) => (
              <label
                className="mt-3 flex items-center justify-between gap-3 text-sm text-slate-600 cursor-pointer hover:text-slate-900 transition"
                key={item.value}
              >
                <span className="line-clamp-1">{item.label}</span>
                <input
                  className="h-4 w-4 rounded border-slate-300 accent-red-600"
                  type="checkbox"
                  checked={selectedQuestionTypes.includes(item.value)}
                  onChange={() => onQuestionTypeToggle?.(item.value)}
                />
              </label>
            ))}
            {onViewAllQuestionTypes && (
              <button
                className="mt-3 text-[13px] font-bold text-blue-600 hover:text-blue-700"
                type="button"
                onClick={onViewAllQuestionTypes}
              >
                Xem Tất Cả
              </button>
            )}
          </div>
        )}

        {/* Sort Options */}
        {sortOptions.length > 0 && (
          <div className="pt-4">
            <p className="text-xs font-bold uppercase text-slate-700">Sắp xếp theo</p>
            {sortOptions.map((item) => (
              <label
                className="mt-3 flex items-center justify-between gap-3 text-sm text-slate-600 cursor-pointer hover:text-slate-900 transition"
                key={item.value}
              >
                {item.label}
                <input
                  className="h-4 w-4 rounded border-slate-300 accent-red-600"
                  type="radio"
                  name="practice-sort"
                  checked={selectedSort === item.value}
                  onChange={() => onSortChange?.(item.value)}
                />
              </label>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
