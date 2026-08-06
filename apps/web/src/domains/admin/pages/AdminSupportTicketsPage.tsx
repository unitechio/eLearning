import React, { useEffect, useState } from 'react';
import { Loader2, MessageSquareText, Send, UserCheck, LifeBuoy } from 'lucide-react';
import {
  useAddAdminSupportTicketComment,
  useAdminSupportTicket,
  useAdminSupportTickets,
  useAssignSupportTicket,
  useUpdateSupportTicketStatus,
} from '@/domains/support/api/hooks';
import { useAdminUsers } from '@/domains/admin/api/users';
import {
  AdminPageHeader,
  AdminCard,
  AdminCardHeader,
  AdminCardTitle,
  AdminCardDescription,
  AdminCardContent,
  AdminStatusBadge
} from '@/shared/components/admin';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { cn } from '@/shared/lib/utils';

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
    <div className="space-y-6 sm:space-y-8">
      <AdminPageHeader
        title="Support Tickets"
        description="Monitor system reports, assign support handlers, and track operational issues to resolution."
        icon={LifeBuoy}
      />

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Ticket List Panel */}
        <section aria-label="Support Tickets List">
          <AdminCard>
            <AdminCardHeader>
              <AdminCardTitle>Tickets Queue</AdminCardTitle>
              <AdminCardDescription>Live incoming customer support requests.</AdminCardDescription>
            </AdminCardHeader>
            <AdminCardContent className="space-y-3 max-h-[700px] overflow-y-auto pr-2">
              {ticketsQuery.isLoading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="h-24 w-full rounded-xl bg-muted animate-pulse" />
                ))
              ) : (ticketsQuery.data?.items ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No tickets active.</p>
              ) : (
                (ticketsQuery.data?.items ?? []).map((ticket) => {
                  const active = selectedTicket?.id === ticket.id;
                  return (
                    <button
                      key={ticket.id}
                      className={cn(
                        "relative w-full rounded-xl border p-4 text-left transition-all flex flex-col gap-2.5",
                        active
                          ? "border-primary bg-primary/[0.04] pl-5"
                          : "border-border hover:bg-muted/10"
                      )}
                      onClick={() => {
                        setSelectedTicketId(ticket.id);
                        setStatus(ticket.status);
                        setAssigneeId(ticket.assignee_id ?? '');
                      }}
                      type="button"
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r bg-primary" />
                      )}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-bold text-sm text-foreground">{ticket.subject}</p>
                          <p className="mt-1 text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                            {ticket.category || 'general'} · {ticket.priority}
                          </p>
                        </div>
                        <AdminStatusBadge state={ticket.status} label={ticket.status} className="shrink-0" />
                      </div>
                      <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                        {ticket.description}
                      </p>
                    </button>
                  );
                })
              )}
            </AdminCardContent>
          </AdminCard>
        </section>

        {/* Selected Ticket Detail Panel */}
        <section aria-label="Ticket Conversation and Assignment">
          <AdminCard>
            {selectedTicket ? (
              <AdminCardContent className="space-y-6 pt-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <AdminStatusBadge state={selectedTicket.status} label={selectedTicket.status} />
                    <span className="rounded-full bg-muted border border-border px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                      {selectedTicket.priority}
                    </span>
                  </div>
                  <h2 className="mt-3 text-lg sm:text-xl font-bold text-foreground leading-snug">
                    {selectedTicket.subject}
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground bg-muted/20 p-3.5 rounded-xl border border-border/50">
                    {selectedTicket.description}
                  </p>
                </div>

                {/* Assignment Controls */}
                <div className="grid gap-3 sm:grid-cols-[1.2fr_1fr_auto_auto] items-end border-t border-border/50 pt-4">
                  <div className="space-y-1">
                    <label htmlFor="assignee-select" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Assignee</label>
                    <select
                      id="assignee-select"
                      className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs font-semibold h-10 focus:outline-none"
                      value={assigneeId}
                      onChange={(event) => setAssigneeId(event.target.value)}
                    >
                      <option value="">Select assignee</option>
                      {(usersQuery.data?.items ?? []).map((user) => (
                        <option key={user.id} value={user.id}>{user.email}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="status-select" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status</label>
                    <select
                      id="status-select"
                      className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs font-semibold h-10 focus:outline-none"
                      value={status || selectedTicket.status}
                      onChange={(event) => setStatus(event.target.value)}
                    >
                      {STATUS_OPTIONS.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={!assigneeId || !effectiveTicketId || assignMutation.isPending}
                    onClick={() => void assignMutation.mutateAsync({ id: effectiveTicketId, assigneeId })}
                    className="h-10 text-xs font-bold gap-2"
                  >
                    <UserCheck className="h-4 w-4" />
                    <span>Assign</span>
                  </Button>
                  <Button
                    type="button"
                    disabled={!effectiveTicketId || statusMutation.isPending}
                    onClick={() => void statusMutation.mutateAsync({ id: effectiveTicketId, status: status || selectedTicket.status })}
                    className="h-10 text-xs font-bold"
                  >
                    <span>Save</span>
                  </Button>
                </div>

                {/* Conversation replies thread */}
                <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-4">
                  <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                    <MessageSquareText className="h-4.5 w-4.5 text-primary" />
                    <span>Conversation Thread</span>
                  </div>

                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {detailQuery.isLoading ? (
                      <div className="space-y-2">
                        <div className="h-12 w-3/4 rounded-lg bg-muted animate-pulse" />
                        <div className="h-12 w-1/2 rounded-lg bg-muted animate-pulse self-end" />
                      </div>
                    ) : (detailQuery.data?.comments ?? []).length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">No conversation comments yet.</p>
                    ) : (
                      (detailQuery.data?.comments ?? []).map((item) => {
                        const isStaff = item.is_staff;
                        return (
                          <div
                            key={item.id}
                            className={cn(
                              "rounded-xl p-3 text-xs leading-relaxed max-w-[90%] border",
                              isStaff
                                ? "bg-primary/[0.04] border-primary/20 text-foreground ml-auto"
                                : "bg-card border-border text-foreground/90"
                            )}
                          >
                            <p>{item.body}</p>
                            <p className="mt-2 text-[9px] font-mono text-muted-foreground">
                              {isStaff ? 'Staff Handler' : 'Customer'} · {new Date(item.created_at).toLocaleString()}
                            </p>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Reply text area */}
                  <div className="grid gap-3 pt-2 border-t border-border/40">
                    <Textarea
                      placeholder="Compose a response..."
                      value={comment}
                      onChange={(event) => setComment(event.target.value)}
                      className="min-h-20 bg-card"
                      aria-label="Reply to ticket"
                    />
                    <Button
                      type="button"
                      disabled={!comment.trim() || !effectiveTicketId || commentMutation.isPending}
                      onClick={() => void commentMutation.mutateAsync(comment).then(() => setComment(''))}
                      className="h-10 text-xs font-bold gap-2 justify-self-end w-fit px-4"
                    >
                      {commentMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      <span>Send Reply</span>
                    </Button>
                  </div>
                </div>
              </AdminCardContent>
            ) : (
              <AdminCardContent className="py-16 text-center text-muted-foreground text-sm font-semibold">
                No support tickets loaded.
              </AdminCardContent>
            )}
          </AdminCard>
        </section>
      </div>
    </div>
  );
}
