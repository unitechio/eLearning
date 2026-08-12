import React, { useEffect, useState } from 'react';
import {
  Search, Calendar, Filter, Settings, Plus, Eye, Trash2, CheckCircle2,
  Clock, AlertCircle, X, ChevronRight, Inbox, HelpCircle, Loader2, Send,
  UserCheck, User, Sparkles, AlertTriangle, FileText, ArrowRight, MessageSquare
} from 'lucide-react';
import {
  useAddAdminSupportTicketComment,
  useAdminSupportTicket,
  useAdminSupportTickets,
  useAssignSupportTicket,
  useUpdateSupportTicketStatus,
} from '@/domains/support/api/hooks';
import { useAdminUsers } from '@/domains/admin/api/users';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { cn } from '@/shared/lib/utils';
import { toast } from 'sonner';

const TICKET_VIEWS = [
  { label: 'All Ticket', count: 54, id: 'all' },
  { label: 'General', count: 12, id: 'general' },
  { label: 'Bug Report', count: 16, id: 'bug' },
  { label: 'Feature Request', count: 9, id: 'feature' },
  { label: 'Integration Issue', count: 4, id: 'integration' },
  { label: 'Documentation', count: 25, id: 'documentation' },
];

const TEAMS = [
  { label: 'Knowledge Base', count: 4 },
  { label: 'Support Team', count: 8 },
  { label: 'Community', count: 17 },
];

const STATUS_OPTIONS = ['open', 'in_progress', 'resolved', 'closed'];

export function AdminSupportTicketsPage() {
  const [selectedTicketId, setSelectedTicketId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [activeView, setActiveView] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Detail Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Replies states
  const [commentText, setCommentText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedAssigneeId, setSelectedAssigneeId] = useState('');

  // API query bindings
  const ticketsQuery = useAdminSupportTickets({ page: currentPage, page_size: pageSize });
  const usersQuery = useAdminUsers({ page: 1, page_size: 100 });
  const detailQuery = useAdminSupportTicket(selectedTicketId);

  const assignMutation = useAssignSupportTicket();
  const statusMutation = useUpdateSupportTicketStatus();
  const commentMutation = useAddAdminSupportTicketComment(selectedTicketId);

  const tickets = ticketsQuery.data?.items || [];
  const selectedTicket = detailQuery.data?.ticket || tickets.find(t => t.id === selectedTicketId) || null;

  useEffect(() => {
    if (selectedTicket) {
      setSelectedStatus(selectedTicket.status);
      setSelectedAssigneeId(selectedTicket.assignee_id || '');
    }
  }, [selectedTicket]);

  const handleTicketClick = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setIsDrawerOpen(true);
  };

  const handleAssignAgent = async (ticketId: string, assigneeId: string) => {
    if (!assigneeId) return;
    await assignMutation.mutateAsync({ id: ticketId, assigneeId });
    toast.success('Agent assigned successfully');
  };

  const handleUpdateStatus = async (ticketId: string, status: string) => {
    if (!status) return;
    await statusMutation.mutateAsync({ id: ticketId, status });
    toast.success('Ticket status updated');
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    await commentMutation.mutateAsync(commentText);
    setCommentText('');
    toast.success('Reply submitted');
  };

  // Helper to resolve badge styles
  const getPriorityBadgeStyles = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
      case 'high':
        return 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400';
      case 'medium':
        return 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400';
      default:
        return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400';
    }
  };

  const getStatusBadgeStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400';
      case 'in_progress':
        return 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400';
      case 'resolved':
        return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400';
      default:
        return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-405';
    }
  };

  return (
    <div className="space-y-6 antialiased text-slate-850 dark:text-slate-200 font-inter w-full">
      {/* Page Header */}
      <header className="flex flex-col gap-4 border-b border-slate-100 pb-5 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <nav aria-label="breadcrumb" className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <span>Home</span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-slate-900 dark:text-slate-100">Support</span>
          </nav>
          
          <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            Support Request
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage client requests, issues, and support conversations.
          </p>
        </div>

        <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 h-10 rounded-lg shadow-sm">
          <Plus className="h-4 w-4 mr-1.5" />
          <span>Create Ticket</span>
        </Button>
      </header>

      {/* Main 2-Column Body Layout matching Screenshot 6 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Left column views sub-sidebar */}
        <aside className="lg:col-span-1 space-y-6" aria-label="Support Views Sidebar">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Ticket Views</span>
              <Settings className="h-3.5 w-3.5" />
            </h3>
            <nav className="flex flex-col gap-1" aria-label="Ticket view sub-navigation">
              {TICKET_VIEWS.map((view) => (
                <button
                  key={view.id}
                  type="button"
                  onClick={() => setActiveView(view.id)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 text-xs font-bold rounded-lg transition-colors border-none text-left w-full",
                    activeView === view.id
                      ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:text-slate-200 dark:hover:bg-slate-800/40"
                  )}
                >
                  <span>{view.label}</span>
                  <span className="text-[10px] opacity-70 font-semibold">{view.count}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Teams</h3>
            <nav className="flex flex-col gap-1" aria-label="Teams sub-navigation">
              {TEAMS.map((team, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="flex items-center justify-between px-3 py-2 text-xs font-bold rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:text-slate-200 dark:hover:bg-slate-800/40 border-none text-left w-full"
                >
                  <span>{team.label}</span>
                  <span className="text-[10px] opacity-70 font-semibold">{team.count}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Right column: Toolbar, Table, Pagination */}
        <section className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-5 shadow-sm space-y-4" aria-label="Support Tickets Queue">
          {/* Table Toolbar */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {/* Search ticket input */}
              <div className="relative w-full sm:w-[220px]">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search Ticket"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-9 text-xs rounded-lg border-slate-250 bg-white dark:bg-slate-950 dark:border-slate-800"
                />
              </div>

              {/* Date selection mock */}
              <div className="flex items-center gap-2 px-3 py-1.5 h-9 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-50">
                <span className="text-[11px]">Last 30 days</span>
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
              </div>

              {/* Priority Select */}
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="h-9 w-28 text-xs font-semibold rounded-lg border border-slate-200 bg-white px-2 dark:border-slate-800 dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="all">Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>

              {/* Action buttons matching Screenshot 6 */}
              <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs font-bold border-slate-200">
                <Filter className="h-3.5 w-3.5" />
                <span>Filter</span>
              </Button>
            </div>

            <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs font-bold border-slate-200">
              <Settings className="h-3.5 w-3.5" />
              <span>Manage Table</span>
            </Button>
          </div>

          {/* DataTable */}
          <div className="border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 dark:bg-slate-950/20">
                  <TableHead className="w-[50px]"><input type="checkbox" className="rounded" /></TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Ticket ID</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Subject</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Priority</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Customer</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Agent</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Date Created</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Last Activity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ticketsQuery.isLoading ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <TableRow key={idx} className="animate-pulse">
                      <TableCell colSpan={8} className="h-16 bg-slate-50/30 dark:bg-slate-900/10" />
                    </TableRow>
                  ))
                ) : tickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-36 text-center text-slate-400 font-medium">
                      <Inbox className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <span>No support tickets found.</span>
                    </TableCell>
                  </TableRow>
                ) : (
                  tickets.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      onClick={() => handleTicketClick(ticket.id)}
                      className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors cursor-pointer"
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="rounded" />
                      </TableCell>
                      <TableCell className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                        TD-{ticket.id.slice(0, 4).toUpperCase()}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        <div className="font-bold text-xs text-slate-900 dark:text-white">{ticket.subject}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-1">{ticket.description}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("border-none text-[9px] font-black rounded-md px-1.5 py-0.5 capitalize", getPriorityBadgeStyles(ticket.priority))}>
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-700">
                            {ticket.user_id ? 'U' : 'C'}
                          </div>
                          <span className="text-xs font-medium truncate max-w-[100px]">{ticket.user_id ? 'Client User' : 'Guest'}</span>
                        </div>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        {ticket.assignee_id ? (
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-indigo-55 flex items-center justify-center font-bold text-[10px] text-indigo-600">
                              A
                            </div>
                            <span className="text-xs font-medium truncate max-w-[100px]">Agent</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              const firstAgent = usersQuery.data?.items?.[0]?.id;
                              if (firstAgent) handleAssignAgent(ticket.id, firstAgent);
                            }}
                            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 underline border-none bg-transparent"
                          >
                            + Assign agent
                          </button>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-xs text-slate-500">{new Date(ticket.updated_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Custom Pagination Footer matching Screenshot 6 */}
          <footer className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
            <span className="text-xs text-slate-500 font-medium">Page 1 of 12</span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="h-8 border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 12].map((pNum) => (
                  <button
                    key={pNum}
                    type="button"
                    onClick={() => setCurrentPage(pNum)}
                    className={cn(
                      "h-8 w-8 rounded text-xs font-bold transition-all border-none bg-transparent",
                      currentPage === pNum
                        ? "bg-orange-500 text-white shadow-sm"
                        : "text-slate-650 hover:bg-slate-55 dark:text-slate-400 dark:hover:bg-slate-800"
                    )}
                  >
                    {pNum}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                className="h-8 border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              >
                Next
              </Button>
            </div>
          </footer>
        </section>
      </div>

      {/* Ticket Detail Right Drawer matching Screenshot 7 */}
      {isDrawerOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-xs flex justify-end">
          <div className="absolute inset-0" onClick={() => setIsDrawerOpen(false)} />
          
          <aside className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between border-l border-slate-200/60 dark:border-slate-850 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black text-slate-900 dark:text-white">
                    #TD-{selectedTicket.id.slice(0, 4).toUpperCase()}
                  </span>
                  <Badge className={cn("border-none text-[9px] font-black rounded px-2 py-0.5 uppercase", getStatusBadgeStyles(selectedTicket.status))}>
                    {selectedTicket.status}
                  </Badge>
                </div>
                <p className="text-[10px] text-slate-400 font-bold tracking-wider mt-1 uppercase">Ticket Details</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsDrawerOpen(false)} className="h-8 w-8 rounded-full border-none">
                <X className="h-4.5 w-4.5 text-slate-500" />
              </Button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Issued By client card */}
              <div className="flex items-center justify-between p-3.5 border border-slate-150 dark:border-slate-850 rounded-xl bg-slate-50/20">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                    B
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Brenda Kim</h4>
                    <p className="text-[10px] text-slate-400">brendakim@gmail.com</p>
                  </div>
                </div>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 border-none">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>

              {/* AI Summary and Confidence Score */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-indigo-650" />
                    <span>AI Summary</span>
                  </span>
                  <span className="text-indigo-650 text-[10px]">92% confidence</span>
                </div>
                <h3 className="text-sm font-black text-slate-950 dark:text-white leading-tight">
                  {selectedTicket.subject}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {selectedTicket.description}
                </p>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full w-[92%]" />
                </div>
              </div>

              {/* Suggested Resolution Checklist */}
              <div className="p-4 border border-indigo-100 dark:border-indigo-950 bg-indigo-50/20 dark:bg-indigo-950/10 rounded-xl space-y-3.5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Suggested Resolution</h4>
                <div className="space-y-2.5 text-xs">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="mt-0.5 rounded text-indigo-600" />
                    <span>Verify the duplicate transaction in system.</span>
                  </label>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" className="mt-0.5 rounded text-indigo-600" />
                    <span>Check if both charges were processed successfully.</span>
                  </label>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" className="mt-0.5 rounded text-indigo-600" />
                    <span>Initiate refund for the duplicate charge.</span>
                  </label>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" className="mt-0.5 rounded text-indigo-600" />
                    <span>Send confirmation email with refund timeline.</span>
                  </label>
                </div>
                <div className="flex flex-col gap-1.5 pt-2 text-[10px] font-bold text-slate-500">
                  <p>Knowledge base references</p>
                  <a href="#" className="text-indigo-600 hover:underline flex items-center gap-1">
                    <FileText className="h-3 w-3" /> KB-3041: Duplicate Payment Handling
                  </a>
                  <a href="#" className="text-indigo-600 hover:underline flex items-center gap-1">
                    <FileText className="h-3 w-3" /> KB-1B72: Refund Process
                  </a>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold">
                    Edit Before Sending
                  </Button>
                  <Button className="h-8 text-[10px] font-bold bg-indigo-650 text-white">
                    Apply as Reply
                  </Button>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Activity Timeline</h4>
                <div className="relative border-l border-slate-100 dark:border-slate-800 pl-4 ml-2.5 space-y-4 text-xs">
                  <div className="relative">
                    <span className="absolute -left-[25px] top-0 h-4 w-4 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-600 flex items-center justify-center">
                      <UserCheck className="h-2 w-2 text-indigo-600" />
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white">Assigned to John Doe</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Today, 10:45 AM</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[25px] top-0 h-4 w-4 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-600 flex items-center justify-center">
                      <Sparkles className="h-2 w-2 text-indigo-600" />
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white">AI generated summary and resolution</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Today, 10:32 AM</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[25px] top-0 h-4 w-4 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-600 flex items-center justify-center">
                      <Clock className="h-2 w-2 text-indigo-600" />
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white">Ticket created by Brenda Kim</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Today, 10:30 AM</p>
                  </div>
                </div>
              </div>

              {/* Replies Threads List & Response Compose Section */}
              <div className="space-y-4 pt-4 border-t border-slate-150">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4" />
                  <span>Discussion Conversation</span>
                </h4>
                <div className="space-y-3.5 max-h-48 overflow-y-auto">
                  {(detailQuery.data?.comments || []).length === 0 ? (
                    <p className="text-[10px] text-slate-400 text-center py-2">No comments posted yet.</p>
                  ) : (
                    (detailQuery.data?.comments || []).map((comm) => (
                      <div
                        key={comm.id}
                        className={cn(
                          "rounded-lg p-3 text-xs leading-normal max-w-[85%] border",
                          comm.is_staff
                            ? "bg-slate-50 border-slate-100 dark:bg-slate-800 ml-auto text-slate-900 dark:text-white"
                            : "bg-white border-slate-150 text-slate-700"
                        )}
                      >
                        <p>{comm.body}</p>
                        <span className="block mt-1.5 text-[9px] text-slate-450 text-right">
                          {comm.is_staff ? 'Staff' : 'Customer'} · {new Date(comm.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
                <div className="space-y-2">
                  <Textarea
                    placeholder="Type a reply to Brenda Kim..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="min-h-16 text-xs bg-slate-50/50"
                  />
                  <div className="flex justify-between items-center">
                    {/* Status inline selector */}
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span>Status:</span>
                      <select
                        value={selectedStatus}
                        onChange={(e) => handleUpdateStatus(selectedTicket.id, e.target.value)}
                        className="bg-transparent border border-slate-200 rounded px-1.5 py-0.5 text-xs font-semibold"
                      >
                        {STATUS_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    <Button
                      onClick={handleAddComment}
                      disabled={!commentText.trim() || commentMutation.isPending}
                      size="sm"
                      className="h-8 bg-indigo-650 hover:bg-indigo-750 text-white font-bold"
                    >
                      {commentMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3.5 w-3.5 mr-1" />}
                      <span>Send</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-150 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/10 flex items-center justify-between">
              <Button variant="outline" size="sm" className="h-9 font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 border-slate-200">
                Remove Ticket
              </Button>
              <Button onClick={() => setIsDrawerOpen(false)} className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 rounded-lg">
                Update Ticket
              </Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
export default AdminSupportTicketsPage;
