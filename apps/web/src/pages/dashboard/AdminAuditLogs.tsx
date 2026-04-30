import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuditLogs, useCleanupAuditLogs } from '@/features/admin/api/hooks';
import { useAuth } from '@/features/auth';

export function AdminAuditLogsPage() {
  const { accessProfile } = useAuth();
  const auditQuery = useAuditLogs();
  const cleanupMutation = useCleanupAuditLogs();
  const [retentionDays, setRetentionDays] = useState(90);

  if (accessProfile && !accessProfile.is_admin) {
    return <Navigate replace to="/dashboard" />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Audit logs</h1>
            <p className="mt-2 text-sm text-slate-500">Luồng hành động nhạy cảm lấy từ audit API thật.</p>
          </div>
          <div className="flex gap-3">
            <input
              className="rounded-2xl border border-slate-200 px-4 py-3"
              min={1}
              type="number"
              value={retentionDays}
              onChange={(e) => setRetentionDays(Number(e.target.value))}
            />
            <button className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white" onClick={() => void cleanupMutation.mutateAsync(retentionDays)} type="button">
              {cleanupMutation.isPending ? 'Cleaning...' : 'Cleanup old logs'}
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          {(auditQuery.data?.items ?? []).map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{item.action}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{item.resource}</span>
                <span className="text-xs text-slate-400">{item.method} {item.path}</span>
              </div>
              <p className="mt-3 text-sm text-slate-700">{item.description || 'No description.'}</p>
              <p className="mt-2 text-xs text-slate-400">{item.ip_address || 'unknown ip'} • {item.created_at}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
