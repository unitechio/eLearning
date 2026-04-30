import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useEmailLogs, useSendPlatformEmail } from '@/features/admin/api/hooks';
import { useAuth } from '@/features/auth';

export function AdminEmailLogsPage() {
  const { accessProfile } = useAuth();
  const emailLogsQuery = useEmailLogs();
  const sendEmail = useSendPlatformEmail();
  const [form, setForm] = useState({ to: '', subject: '', body: '' });

  if (accessProfile && !accessProfile.is_admin) {
    return <Navigate replace to="/dashboard" />;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendEmail.mutateAsync({
      to: form.to.split(',').map((item) => item.trim()).filter(Boolean),
      subject: form.subject,
      body: form.body,
    });
    setForm({ to: '', subject: '', body: '' });
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Email logs</h1>
        <p className="mt-2 text-sm text-slate-500">Gửi mail quản trị nhanh và xem trạng thái delivery từ hệ thống.</p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <form className="grid gap-3" onSubmit={submit}>
          <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="To (comma separated)" value={form.to} onChange={(e) => setForm((s) => ({ ...s, to: e.target.value }))} />
          <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Subject" value={form.subject} onChange={(e) => setForm((s) => ({ ...s, subject: e.target.value }))} />
          <textarea className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3" placeholder="Body" value={form.body} onChange={(e) => setForm((s) => ({ ...s, body: e.target.value }))} />
          <button className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white" type="submit">
            {sendEmail.isPending ? 'Sending...' : 'Send email'}
          </button>
        </form>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          {(emailLogsQuery.data?.items ?? []).map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-900">{item.subject}</p>
                  <p className="text-sm text-slate-500">{item.from} → {item.to}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{item.status}</span>
              </div>
              <p className="mt-2 text-xs text-slate-400">{item.created_at || item.sent_at || ''}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
