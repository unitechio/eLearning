import React, { useState } from 'react';
import {
  Bell, Check, Search, Calendar, Inbox, MoreHorizontal, Eye, Trash2, ShieldAlert
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { EmptyState } from '@/shared/components/ui/empty-state';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  NotificationItem
} from '../api/notificationService';
import { cn } from '@/shared/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/components/ui/dropdown-menu';

// Helper to determine badge color depending on notification category
const getCategoryStyles = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'critical blocker':
    case 'security':
    case 'error':
      return 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-450';
    case 'order':
    case 'success':
      return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-450';
    case 'revenue':
      return 'bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-450';
    case 'marketing':
    case 'announcement':
      return 'bg-amber-50 text-amber-605 dark:bg-amber-950/40 dark:text-amber-450';
    default:
      return 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
  }
};

// Helper for formatting time (e.g. "Just now", "2 hours ago")
const formatTimeAgo = (dateStr: string) => {
  try {
    const past = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - past.getTime();
    if (diffMs < 60000) return 'Just now';
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    return past.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return '2 hours ago';
  }
};

export const AdminNotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'unread' | 'read'>('unread');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Query notifications from backend
  const { data, isLoading } = useNotifications({
    q: searchQuery,
    read: activeTab === 'read',
  });

  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const notifications = data?.items || [];
  const unreadCount = activeTab === 'unread' ? notifications.length : 0;

  // Render Skeleton while loading
  const renderSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-850 rounded-xl animate-pulse">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-slate-850" />
            <div className="space-y-2">
              <div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-850" />
              <div className="h-3 w-72 rounded bg-slate-200 dark:bg-slate-850" />
            </div>
          </div>
          <div className="h-5 w-24 rounded bg-slate-200 dark:bg-slate-850" />
        </div>
      ))}
    </div>
  );

  return (
    <main className="p-6 space-y-6 flex flex-col w-full antialiased font-inter text-slate-800 dark:text-slate-200">
      {/* Header Panel */}
      <header className="flex flex-col gap-4 border-b border-slate-100 pb-5 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <nav aria-label="breadcrumb" className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <span>Workflows</span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-slate-900 dark:text-slate-100">Notifications</span>
          </nav>
          
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <Badge className="bg-indigo-600 hover:bg-indigo-600 text-white rounded-full text-xs font-bold px-2 py-0.5 border-none">
                {unreadCount}
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            View system alerts, audits, invoices receipts, and student registrations.
          </p>
        </div>

        {/* Time filters buttons matching Screenshot 4 */}
        <div className="flex items-center gap-1.5 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-lg p-1">
          {(['7d', '30d', '90d', '1y'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setTimeFilter(filter)}
              className={cn(
                "px-3 py-1 rounded text-xs font-bold transition-all",
                timeFilter === filter
                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-850 dark:hover:text-slate-205"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </header>

      {/* Tabs & Controls Toolbar matching Screenshot 5 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
        {/* Unread / Read Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('unread')}
            className={cn(
              "pb-3 text-sm font-bold border-b-2 transition-colors",
              activeTab === 'unread'
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-850 dark:hover:text-slate-200"
            )}
          >
            Unread
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('read')}
            className={cn(
              "pb-3 text-sm font-bold border-b-2 transition-colors",
              activeTab === 'read'
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-850 dark:hover:text-slate-200"
            )}
          >
            Read
          </button>
        </div>

        {/* Right side: Search, Date Filter and Mark Read */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-full sm:w-[220px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search for notification"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9 text-xs rounded-lg border-slate-200 bg-white dark:bg-slate-950 dark:border-slate-800"
            />
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 h-9 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-50">
            <span className="text-[11px]">Date and time</span>
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
          </div>

          {activeTab === 'unread' && notifications.length > 0 && (
            <Button
              onClick={() => markAllReadMutation.mutate()}
              size="sm"
              disabled={markAllReadMutation.isPending}
              className="h-9 bg-slate-900 hover:bg-slate-855 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 font-bold px-4 rounded-lg border border-slate-200 dark:border-slate-800"
            >
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-1">
        {isLoading ? (
          renderSkeleton()
        ) : notifications.length === 0 ? (
          <EmptyState
            title="All caught up!"
            description="You don't have any notifications at the moment."
            icon={Bell}
          />
        ) : (
          <div className="border border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-center justify-between p-4 transition-colors",
                  !item.is_read ? "bg-slate-50/20 hover:bg-slate-50/50 dark:bg-slate-900/10 dark:hover:bg-slate-900/20" : "hover:bg-slate-50/20 dark:hover:bg-slate-900/10"
                )}
              >
                {/* Left Side: Unread Dot + Content */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  {!item.is_read && (
                    <span
                      className="mt-2 h-2 w-2 rounded-full bg-indigo-600 ring-4 ring-indigo-50 dark:ring-indigo-950 shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  {item.is_read && (
                    <span className="h-2 w-2 shrink-0 opacity-0" aria-hidden="true" />
                  )}
                  <div className="min-w-0 space-y-0.5">
                    <p className="font-bold text-slate-900 dark:text-white text-xs leading-normal">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal max-w-[500px] truncate">
                      {item.message}
                    </p>
                  </div>
                </div>

                {/* Right Side: Category Badge + Time + Actions */}
                <div className="flex items-center gap-6 ml-4 shrink-0">
                  <Badge className={cn("border-none text-[9px] font-black rounded-md px-2 py-0.5", getCategoryStyles(item.category))}>
                    {item.category || 'System'}
                  </Badge>

                  <span className="text-[10px] font-bold text-slate-400 w-24 text-right">
                    {formatTimeAgo(item.created_at)}
                  </span>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border-none">
                        <MoreHorizontal className="h-4 w-4 text-slate-500" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      {!item.is_read && (
                        <DropdownMenuItem onClick={() => markReadMutation.mutate(item.id)} className="gap-2 cursor-pointer">
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Mark Read</span>
                        </DropdownMenuItem>
                      )}
                      {item.link && (
                        <DropdownMenuItem onClick={() => window.open(item.link, '_blank')} className="gap-2 cursor-pointer">
                          <Eye className="h-3.5 w-3.5 text-slate-550" />
                          <span>View Detail</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="gap-2 text-rose-600 focus:text-rose-600 cursor-pointer">
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
export default AdminNotificationsPage;
