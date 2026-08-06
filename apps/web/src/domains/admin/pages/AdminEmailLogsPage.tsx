import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEmailLogs, useSendPlatformEmail } from '@/domains/admin/api/platform';
import { Mail, Send, CheckCircle2, AlertCircle, Clock, Eye, Info } from 'lucide-react';
import {
  AdminPageLayout,
  AdminCard,
  AdminCardHeader,
  AdminCardTitle,
  AdminCardDescription,
  AdminCardContent,
  AdminDataTable,
  AdminStatusBadge,
  type AdminColumnDef
} from '@/shared/components/admin';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';

const emailFormSchema = z.object({
  to: z.string().min(1, "Recipient email is required"),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
});

type EmailFormValues = z.infer<typeof emailFormSchema>;

export function AdminEmailLogsPage() {
  const emailLogsQuery = useEmailLogs();
  const sendEmail = useSendPlatformEmail();

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { to: '', subject: '', body: '' }
  });

  const watchedSubject = watch('subject', '');
  const watchedBody = watch('body', '');
  const watchedTo = watch('to', '');

  const onSubmit = async (data: EmailFormValues) => {
    await sendEmail.mutateAsync({
      to: data.to.split(',').map((item) => item.trim()).filter(Boolean),
      subject: data.subject,
      body: data.body,
    });
    reset();
  };

  const columns: AdminColumnDef<any>[] = [
    {
      header: "Subject",
      cell: (item) => <span className="font-semibold text-foreground">{item.subject}</span>,
    },
    {
      header: "Recipients",
      cell: (item) => <span className="text-muted-foreground">{item.from} → {item.to}</span>,
    },
    {
      header: "Status",
      cell: (item) => <AdminStatusBadge state={item.status} label={item.status} />,
    },
    {
      header: "Sent At",
      cell: (item) => <span className="text-muted-foreground font-mono text-[10px]">{item.created_at || item.sent_at || 'N/A'}</span>,
    },
  ];

  return (
    <AdminPageLayout
      title="Email Platform Logs"
      description="Compose administrative notices, preview system templates, and audit outbound delivery status."
      icon={Mail}
    >
      {/* KPI Stats Row */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full" aria-label="KPI Stats Row">
        <AdminCard>
          <AdminCardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Queued Emails</p>
              <h3 className="text-xl font-bold text-foreground mt-1">0</h3>
            </div>
            <div className="rounded-lg bg-slate-100 dark:bg-slate-800 p-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
          </AdminCardContent>
        </AdminCard>
        <AdminCard>
          <AdminCardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Sent Today</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-xl font-bold text-foreground">145</h3>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1 rounded">+8%</span>
              </div>
            </div>
            <div className="rounded-lg bg-emerald-100 dark:bg-emerald-950/20 p-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
          </AdminCardContent>
        </AdminCard>
        <AdminCard>
          <AdminCardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Bounces & Failed</p>
              <h3 className="text-xl font-bold text-foreground mt-1">2</h3>
            </div>
            <div className="rounded-lg bg-rose-100 dark:bg-rose-950/20 p-2">
              <AlertCircle className="h-4 w-4 text-rose-500" />
            </div>
          </AdminCardContent>
        </AdminCard>
        <AdminCard>
          <AdminCardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Delivery Rate</p>
              <h3 className="text-xl font-bold text-foreground mt-1">98.6%</h3>
            </div>
            <div className="rounded-lg bg-blue-100 dark:bg-blue-950/20 p-2">
              <Send className="h-4 w-4 text-blue-500" />
            </div>
          </AdminCardContent>
        </AdminCard>
      </section>

      {/* Main Split Layout */}
      <div className="grid gap-6 lg:gap-8 lg:grid-cols-10 w-full items-start">
        {/* Compose Form */}
        <section className="lg:col-span-7" aria-label="Compose Outbound Email">
          <AdminCard>
            <AdminCardHeader>
              <AdminCardTitle>Compose Outbound Email</AdminCardTitle>
              <AdminCardDescription>Broadcast platform announcements or direct alerts to user inboxes.</AdminCardDescription>
            </AdminCardHeader>
            <AdminCardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-to">Recipient Emails (comma separated)</Label>
                  <Input
                    id="email-to"
                    placeholder="student@example.com, manager@example.com"
                    {...register('to')}
                  />
                  {errors.to && (
                    <p className="text-xs text-destructive">{errors.to.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-subject">Subject</Label>
                  <Input
                    id="email-subject"
                    placeholder="Notice: Scheduled Maintenance on System"
                    {...register('subject')}
                  />
                  {errors.subject && (
                    <p className="text-xs text-destructive">{errors.subject.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-body">HTML / Body Content</Label>
                  <Textarea
                    id="email-body"
                    placeholder="Enter message body here..."
                    {...register('body')}
                    className="min-h-48"
                  />
                  {errors.body && (
                    <p className="text-xs text-destructive">{errors.body.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={sendEmail.isPending}
                  className="w-full sm:w-fit h-10 px-5 gap-2 rounded-[10px] text-xs font-semibold self-end"
                >
                  <Send className="h-4 w-4" />
                  <span>{sendEmail.isPending ? 'Sending...' : 'Send Broadcast'}</span>
                </Button>
              </form>
            </AdminCardContent>
          </AdminCard>
        </section>

        {/* Live Preview Panel */}
        <aside className="lg:col-span-3 space-y-6" aria-label="Template Live Preview">
          <AdminCard>
            <AdminCardHeader>
              <AdminCardTitle className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                <span>Live Preview</span>
              </AdminCardTitle>
              <AdminCardDescription>Outbound email rendering mockup.</AdminCardDescription>
            </AdminCardHeader>
            <AdminCardContent className="space-y-4">
              <div className="rounded-xl border border-border p-4 bg-muted/10 font-sans space-y-3 text-xs max-h-64 overflow-y-auto">
                <div>
                  <span className="font-bold text-muted-foreground uppercase tracking-wider text-[9px]">To:</span>
                  <p className="text-foreground/80 font-medium truncate mt-0.5">{watchedTo || 'No recipient specified'}</p>
                </div>
                <hr className="border-border/60" aria-hidden="true" />
                <div>
                  <span className="font-bold text-muted-foreground uppercase tracking-wider text-[9px]">Subject:</span>
                  <p className="text-foreground font-bold mt-0.5">{watchedSubject || '(No Subject)'}</p>
                </div>
                <hr className="border-border/60" aria-hidden="true" />
                <div>
                  <span className="font-bold text-muted-foreground uppercase tracking-wider text-[9px]">Body:</span>
                  <p className="text-foreground/90 mt-1 whitespace-pre-wrap leading-relaxed">{watchedBody || 'Enter message body content to view preview.'}</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start bg-muted/40 p-3 rounded-xl border border-border/40 text-xs text-muted-foreground">
                <Info className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">Global Variables Supported</p>
                  <p className="text-[10px] leading-relaxed">
                    Use `{`{{first_name}}`}` or `{`{{email}}`}` to inject recipient-specific values.
                  </p>
                </div>
              </div>
            </AdminCardContent>
          </AdminCard>
        </aside>
      </div>

      {/* History log table below */}
      <section className="space-y-4 w-full" aria-label="Recent deliveries">
        <h2 className="text-lg font-bold text-foreground">Recent Deliveries</h2>
        <AdminDataTable
          data={emailLogsQuery.data?.items ?? []}
          columns={columns}
          isLoading={emailLogsQuery.isLoading}
          error={emailLogsQuery.error}
          searchPlaceholder="Search email subject..."
          emptyTitle="No emails sent"
          emptyDescription="The platform email queue has not dispatched any notices yet."
        />
      </section>
    </AdminPageLayout>
  );
}

export default AdminEmailLogsPage;
