import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/shared/components/ui/table';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { Search, Download, AlertTriangle, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface AdminColumnDef<T> {
  header: string;
  cell: (item: T) => React.ReactNode;
  className?: string;
}

interface TabOption<T extends string> {
  value: T;
  label: string;
  icon?: any;
  count?: number;
}

interface AdminDataTableProps<T, TabValue extends string = string> {
  data: T[];
  columns: AdminColumnDef<T>[];
  isLoading?: boolean;
  error?: any;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  tabs?: TabOption<TabValue>[];
  activeTab?: TabValue;
  onTabChange?: (tab: TabValue) => void;
  onExport?: () => void;
  exportLabel?: string;
  rightActions?: React.ReactNode;
  pagination?: {
    page: number;
    totalPages: number;
    totalItems?: number;
    onPageChange: (page: number) => void;
  };
  emptyTitle?: string;
  emptyDescription?: string;
  filters?: React.ReactNode;
}

export function AdminDataTable<T, TabValue extends string = string>({
  data,
  columns,
  isLoading,
  error,
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search...",
  tabs,
  activeTab,
  onTabChange,
  onExport,
  exportLabel = "Export",
  rightActions,
  pagination,
  emptyTitle = "No results found",
  emptyDescription = "No records match your current filters. Try adjusting your search.",
  filters,
}: AdminDataTableProps<T, TabValue>) {
  const [showFilters, setShowFilters] = useState(false);

  // Map custom column defs to TanStack Table v8 columns
  const tsColumns = useMemo(() => {
    return columns.map((col, idx) => ({
      id: col.header || `col_${idx}`,
      header: col.header,
      cell: ({ row }) => col.cell(row.original),
    })) as ColumnDef<T>[];
  }, [columns]);

  // Instantiate TanStack Table
  const table = useReactTable({
    data,
    columns: tsColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section className="space-y-4 w-full" aria-label="Data list section">

      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        {/* Underline Tabs */}
        {tabs && activeTab && onTabChange && (
          <nav
            className="flex items-center gap-0 border-b border-transparent"
            aria-label="Data view tabs"
          >
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const active = activeTab === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => onTabChange(tab.value)}
                  className={cn(
                    "relative flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold transition-all duration-150 whitespace-nowrap border-b-2 -mb-px",
                    active
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {TabIcon && <TabIcon className="h-3.5 w-3.5 shrink-0" />}
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={cn(
                      "ml-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                      active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {/* Right actions toolbar */}
        <div className="flex flex-1 flex-wrap items-center justify-end gap-2 min-w-0">
          {/* Search Input */}
          {onSearchChange !== undefined && searchTerm !== undefined && (
            <label className="relative flex items-center flex-1 max-w-[280px] min-w-[180px]">
              <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground/75 pointer-events-none" aria-hidden="true" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 pr-8 h-10 border-[#EAECF0] dark:border-[#1E1F22] rounded-[10px] text-[13px] bg-slate-50/50 focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary placeholder:text-muted-foreground/50 font-medium"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute right-2.5 text-muted-foreground/60 hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </label>
          )}

          {/* Filters Toggle Button */}
          {filters && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "h-10 rounded-[10px] px-3 text-xs font-semibold gap-1.5 border-[#EAECF0] dark:border-[#1E1F22]",
                showFilters
                  ? "border-primary/50 bg-primary/[0.05] text-primary hover:bg-primary/[0.10]"
                  : "bg-slate-50/50 text-muted-foreground hover:text-foreground"
              )}
            >
              <SlidersHorizontal className="h-[18px] w-[18px]" strokeWidth={1.75} />
              <span>Filters</span>
            </Button>
          )}

          {rightActions}

          {/* Export Button */}
          {onExport && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onExport}
              className="h-10 rounded-[10px] px-3 text-xs font-semibold gap-1.5 border-[#EAECF0] dark:border-[#1E1F22] bg-slate-50/50 text-muted-foreground hover:text-foreground"
            >
              <Download className="h-[18px] w-[18px]" strokeWidth={1.75} />
              <span className="hidden sm:inline">{exportLabel}</span>
            </Button>
          )}
        </div>
      </div>

      {/* ── Filter Panel ── */}
      {filters && showFilters && (
        <div className="rounded-xl border border-[#EAECF0] bg-card shadow-sm overflow-hidden dark:border-[#1E1F22]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#EAECF0]/60 dark:border-[#1E1F22]/50 bg-muted/20">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
              Filters
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowFilters(false)}
              className="h-6 w-6 text-muted-foreground hover:text-foreground rounded"
              aria-label="Close filters"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="p-4">
            {filters}
          </div>
        </div>
      )}

      {/* ── Table Container ── */}
      <div className="rounded-xl border border-[#EAECF0] bg-card shadow-sm overflow-hidden dark:border-[#1E1F22]">
        <div className="relative w-full overflow-auto">
          <Table className="w-full min-w-[600px]">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow 
                  key={headerGroup.id} 
                  className="hover:bg-transparent border-b border-[#EAECF0] dark:border-[#1E1F22] bg-[#FCFCFD] dark:bg-[#0b0b0c] h-11"
                >
                  {headerGroup.headers.map((header, idx) => {
                    const originalCol = columns[idx];
                    return (
                      <TableHead
                        key={header.id}
                        className={cn(
                          "px-4 py-0 text-[13px] font-semibold text-[#667085] dark:text-[#a1a1aa] align-middle",
                          originalCol?.className
                        )}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, rIdx) => (
                  <TableRow key={rIdx} className="hover:bg-transparent border-b border-[#EAECF0]/60 dark:border-[#1E1F22]/40 h-12">
                    {columns.map((_, cIdx) => (
                      <TableCell key={cIdx} className="px-4 py-3">
                        <Skeleton className="h-4 w-3/4 rounded-md" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Failed to load data</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Please refresh the page or try again.</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="p-0 border-none">
                    <EmptyState 
                      title={emptyTitle}
                      description={emptyDescription}
                      className="border-none bg-transparent rounded-none py-16"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-b border-[#EAECF0]/60 dark:border-[#1E1F22]/40 hover:bg-[#F9FAFB] dark:hover:bg-[#18181b] transition-colors h-12"
                  >
                    {row.getVisibleCells().map((cell, cIdx) => {
                      const originalCol = columns[cIdx];
                      return (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            "px-4 py-3 text-[13px] font-medium text-[#111827] dark:text-[#f4f4f5]",
                            originalCol?.className
                          )}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* ── Pagination Footer ── */}
        {pagination && (
          <footer className="flex items-center justify-between px-4 py-3 border-t border-[#EAECF0]/60 dark:border-[#1E1F22]/50 bg-[#FCFCFD] dark:bg-[#0b0b0c]">
            <p className="text-xs text-muted-foreground">
              {pagination.totalItems !== undefined ? (
                <>
                  Showing <span className="font-semibold text-foreground">{data.length}</span> of <span className="font-semibold text-foreground">{pagination.totalItems}</span> items
                </>
              ) : (
                <>
                  Page{" "}
                  <span className="font-semibold text-foreground">{pagination.page}</span>
                  {" "}of{" "}
                  <span className="font-semibold text-foreground">{pagination.totalPages}</span>
                </>
              )}
            </p>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={pagination.page <= 1}
                onClick={() => pagination.onPageChange(pagination.page - 1)}
                className="h-7 w-7 rounded-lg border-[#EAECF0] dark:border-[#1E1F22] text-muted-foreground"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="px-2 text-xs font-semibold text-muted-foreground min-w-[3rem] text-center">
                {pagination.page} / {pagination.totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => pagination.onPageChange(pagination.page + 1)}
                className="h-7 w-7 rounded-lg border-[#EAECF0] dark:border-[#1E1F22] text-muted-foreground"
                aria-label="Next page"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </footer>
        )}
      </div>
    </section>
  );
}
