import React, { useEffect, useState } from 'react';
import { Loader2, MessageSquareText, Send, UserCheck } from 'lucide-react';
import {
  useAddAdminSupportTicketComment,
  useAdminSupportTicket,
  useAdminSupportTickets,
  useAssignSupportTicket,
  useUpdateSupportTicketStatus,
} from '@/domains/support/api/hooks';
import { useAdminUsers } from '@/domains/admin/api/users';
import { HeaderLoadingBar } from '@/shared/components';

const STATUS_OPTIONS = ['open', 'in_progress', 'resolved', 'closed'];

export function AdminSupportTicketsPage() {
  const [selectedTicketId, setSelectedTicketId] = useState('');
  const [status, setStatus] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [comment, setComment] = useState('');

  const ticketsQuery = useAdminSupportTickets({ page: 1, page_size: 50 });
  const usersQuery = useAdminUsers({ page: 1, page_size: 100 });
  const detailQuery = useAdminSupportTicket(selectedTicketId);
  const assignMutation = useAssignSupportTicket();
  const statusMutation = useUpdateSupportTicketStatus();
  const commentMutation = useAddAdminSupportTicketComment(selectedTicketId);

  const selectedTicket = detailQuery.data?.ticket ?? ticketsQuery.data?.items.find((item) => item.id === selectedTicketId) ?? ticketsQuery.data?.items[0];
  const isBusy = ticketsQuery.isLoading || detailQuery.isLoading || assignMutation.isPending || statusMutation.isPending || commentMutation.isPending;

  useEffect(() => {
    const firstTicket = ticketsQuery.data?.items[0];
    if (!selectedTicketId && firstTicket) {
      setSelectedTicketId(firstTicket.id);
      setStatus(firstTicket.status);
      setAssigneeId(firstTicket.assignee_id ?? '');
    }
  }, [selectedTicketId, ticketsQuery.data?.items]);

  const effectiveTicketId = selectedTicket?.id ?? selectedTicketId;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-6">
      {isBusy ? <HeaderLoadingBar /> : null}
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">Support</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Ticket assignment</h1>
        <p className="mt-2 text-sm text-slate-500">Quản trị ticket lỗi thanh toán, bài học, tài khoản và assign cho nhân sự xử lý.</p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="px-2 text-lg font-black text-slate-950">Tickets</h2>
          <div className="mt-4 space-y-3">
            {(ticketsQuery.data?.items ?? []).map((ticket) => (
              <button
                key={ticket.id}
                className={`w-full rounded-2xl border p-4 text-left transition ${selectedTicket?.id === ticket.id ? 'border-red-300 bg-red-50' : 'border-slate-100 hover:border-slate-300'}`}
                onClick={() => {
                  setSelectedTicketId(ticket.id);
                  setStatus(ticket.status);
                  setAssigneeId(ticket.assignee_id ?? '');
                }}
                type="button"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-black text-slate-950">{ticket.subject}</p>
                    <p className="mt-1 text-xs text-slate-500">{ticket.category || 'general'} • {ticket.priority}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-700">{ticket.status}</span>
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-slate-600">{ticket.description}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {selectedTicket ? (
            <div className="space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">{selectedTicket.status}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{selectedTicket.priority}</span>
                </div>
                <h2 className="mt-3 text-2xl font-black text-slate-950">{selectedTicket.subject}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{selectedTicket.description}</p>
              </div>

              <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                <select className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" value={assigneeId} onChange={(event) => setAssigneeId(event.target.value)}>
                  <option value="">Select assignee</option>
                  {(usersQuery.data?.items ?? []).map((user) => <option key={user.id} value={user.id}>{user.email}</option>)}
                </select>
                <select className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" value={status || selectedTicket.status} onChange={(event) => setStatus(event.target.value)}>
                  {STATUS_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <div className="flex gap-2">
                  <button className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white disabled:opacity-50" disabled={!assigneeId || !effectiveTicketId} onClick={() => void assignMutation.mutateAsync({ id: effectiveTicketId, assigneeId })} type="button">
                    <UserCheck className="h-4 w-4" /> Assign
                  </button>
                  <button className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50" disabled={!effectiveTicketId} onClick={() => void statusMutation.mutateAsync({ id: effectiveTicketId, status: status || selectedTicket.status })} type="button">Save</button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-2 font-black text-slate-950"><MessageSquareText className="h-4 w-4" /> Conversation</div>
                <div className="mt-4 space-y-3">
                  {(detailQuery.data?.comments ?? []).map((item) => (
                    <div key={item.id} className={`rounded-2xl p-3 text-sm ${item.is_staff ? 'bg-red-50 text-red-950' : 'bg-white text-slate-700'}`}>
                      <p>{item.body}</p>
                      <p className="mt-2 text-[11px] font-bold uppercase text-slate-400">{item.is_staff ? 'Staff' : 'User'} • {new Date(item.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid gap-2 md:grid-cols-[1fr_auto]">
                  <textarea className="min-h-24 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" placeholder="Reply to ticket" value={comment} onChange={(event) => setComment(event.target.value)} />
                  <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-50" disabled={!comment.trim() || !effectiveTicketId} onClick={() => void commentMutation.mutateAsync(comment).then(() => setComment(''))} type="button">
                    {commentMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No support tickets found.</p>
          )}
        </section>
      </div>
    </div>
  );
}
