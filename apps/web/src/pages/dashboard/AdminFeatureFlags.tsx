import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useCreateFeatureFlag, useDeleteFeatureFlag, useFeatureFlags, useUpdateFeatureFlag } from '@/features/admin/api/hooks';
import { FeatureFlag } from '@/features/admin/api/service';
import { useAuth } from '@/features/auth';

const emptyFlag = { name: '', key: '', description: '', category: 'premium', enabled: true, required_tier: 'pro' };

export function AdminFeatureFlagsPage() {
  const { accessProfile } = useAuth();
  const flagsQuery = useFeatureFlags();
  const createFlag = useCreateFeatureFlag();
  const updateFlag = useUpdateFeatureFlag();
  const deleteFlag = useDeleteFeatureFlag();
  const [form, setForm] = useState(emptyFlag);

  if (accessProfile && !accessProfile.is_admin) {
    return <Navigate replace to="/dashboard" />;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createFlag.mutateAsync(form);
    setForm(emptyFlag);
  };

  const toggleFlag = async (flag: FeatureFlag) => {
    await updateFlag.mutateAsync({ ...flag, enabled: !flag.enabled });
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Feature flags</h1>
        <p className="mt-2 text-sm text-slate-500">Tạo, bật tắt, và dọn feature premium hoặc pro trực tiếp từ dashboard admin.</p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <form className="grid gap-3 md:grid-cols-2 xl:grid-cols-6" onSubmit={submit}>
          <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
          <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Key" value={form.key} onChange={(e) => setForm((s) => ({ ...s, key: e.target.value }))} />
          <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Category" value={form.category} onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))} />
          <select className="rounded-2xl border border-slate-200 px-4 py-3" value={form.required_tier} onChange={(e) => setForm((s) => ({ ...s, required_tier: e.target.value }))}>
            <option value="free">free</option>
            <option value="starter">starter</option>
            <option value="pro">pro</option>
            <option value="enterprise">enterprise</option>
          </select>
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
            <input checked={form.enabled} onChange={(e) => setForm((s) => ({ ...s, enabled: e.target.checked }))} type="checkbox" />
            enabled
          </label>
          <button className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white" type="submit">
            {createFlag.isPending ? 'Creating...' : 'Create flag'}
          </button>
          <textarea className="min-h-24 rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2 xl:col-span-6" placeholder="Description" value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} />
        </form>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(flagsQuery.data ?? []).map((flag) => (
            <div key={flag.id} className="rounded-2xl border border-slate-100 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-900">{flag.name}</p>
                  <p className="text-xs uppercase tracking-wider text-slate-400">{flag.key}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${flag.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  {flag.enabled ? 'enabled' : 'disabled'}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-500">{flag.description || 'No description.'}</p>
              <div className="mt-4 flex gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{flag.category || 'general'}</span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{flag.required_tier || 'free'}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700" onClick={() => void toggleFlag(flag)} type="button">
                  {flag.enabled ? 'Disable' : 'Enable'}
                </button>
                <button className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600" onClick={() => void deleteFlag.mutateAsync(flag.id)} type="button">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
