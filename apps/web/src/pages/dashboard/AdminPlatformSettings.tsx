import React, { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  useCreateEnvironment,
  useCreateSystemSetting,
  useDeleteEnvironment,
  useDeleteSystemSetting,
  usePlatformEnvironments,
  useSystemSettings,
  useUpdateEnvironment,
  useUpdateSystemSetting,
} from '@/features/admin/api/hooks';
import { PlatformEnvironment, SystemSetting } from '@/features/admin/api/service';
import { useAuth } from '@/features/auth';

const emptyEnvironment = { name: '', slug: '', description: '', type: 'general', url: '', color: '', sort_order: 0, is_active: true };
const emptySetting = { key: '', value: '', type: 'string', category: 'general', description: '', is_public: false, is_editable: true };

export function AdminPlatformSettingsPage() {
  const { accessProfile } = useAuth();
  const environmentsQuery = usePlatformEnvironments();
  const settingsQuery = useSystemSettings();
  const createEnvironment = useCreateEnvironment();
  const updateEnvironment = useUpdateEnvironment();
  const deleteEnvironment = useDeleteEnvironment();
  const createSetting = useCreateSystemSetting();
  const updateSetting = useUpdateSystemSetting();
  const deleteSetting = useDeleteSystemSetting();
  const [environmentForm, setEnvironmentForm] = useState(emptyEnvironment);
  const [settingForm, setSettingForm] = useState(emptySetting);

  if (accessProfile && !accessProfile.is_admin) {
    return <Navigate replace to="/dashboard" />;
  }

  const sortedSettings = useMemo(() => (settingsQuery.data ?? []).slice(0, 30), [settingsQuery.data]);

  const submitEnvironment = async (e: React.FormEvent) => {
    e.preventDefault();
    await createEnvironment.mutateAsync(environmentForm);
    setEnvironmentForm(emptyEnvironment);
  };

  const submitSetting = async (e: React.FormEvent) => {
    e.preventDefault();
    await createSetting.mutateAsync(settingForm);
    setSettingForm(emptySetting);
  };

  const toggleEnvironment = async (item: PlatformEnvironment) => {
    await updateEnvironment.mutateAsync({
      id: item.id,
      payload: {
        name: item.name,
        slug: item.slug,
        description: item.description,
        type: item.type,
        url: item.url,
        color: item.color,
        sort_order: item.sort_order,
        is_active: !item.is_active,
      },
    });
  };

  const toggleSettingEditable = async (item: SystemSetting) => {
    await updateSetting.mutateAsync({
      id: item.id,
      payload: {
        key: item.key,
        value: item.value,
        type: item.type || 'string',
        category: item.category,
        description: item.description,
        is_public: item.is_public,
        is_editable: !item.is_editable,
      },
    });
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Platform settings</h1>
        <p className="mt-2 text-sm text-slate-500">Quản lý môi trường hệ thống và system settings bằng API admin platform thật.</p>
      </section>

      <div className="grid gap-8 xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Environments</h2>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{(environmentsQuery.data ?? []).length} items</span>
          </div>
          <form className="mt-6 grid gap-3" onSubmit={submitEnvironment}>
            <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Name" value={environmentForm.name} onChange={(e) => setEnvironmentForm((s) => ({ ...s, name: e.target.value }))} />
            <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Slug" value={environmentForm.slug} onChange={(e) => setEnvironmentForm((s) => ({ ...s, slug: e.target.value }))} />
            <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Type" value={environmentForm.type} onChange={(e) => setEnvironmentForm((s) => ({ ...s, type: e.target.value }))} />
            <textarea className="min-h-24 rounded-2xl border border-slate-200 px-4 py-3" placeholder="Description" value={environmentForm.description} onChange={(e) => setEnvironmentForm((s) => ({ ...s, description: e.target.value }))} />
            <button className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white" type="submit">
              {createEnvironment.isPending ? 'Creating...' : 'Create environment'}
            </button>
          </form>
          <div className="mt-6 space-y-4">
            {(environmentsQuery.data ?? []).map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-500">{item.description || 'No description.'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700" onClick={() => void toggleEnvironment(item)} type="button">
                      {item.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600" onClick={() => void deleteEnvironment.mutateAsync(item.id)} type="button">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">System settings</h2>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{(settingsQuery.data ?? []).length} keys</span>
          </div>
          <form className="mt-6 grid gap-3" onSubmit={submitSetting}>
            <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Key" value={settingForm.key} onChange={(e) => setSettingForm((s) => ({ ...s, key: e.target.value }))} />
            <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Type" value={settingForm.type} onChange={(e) => setSettingForm((s) => ({ ...s, type: e.target.value }))} />
            <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Category" value={settingForm.category} onChange={(e) => setSettingForm((s) => ({ ...s, category: e.target.value }))} />
            <textarea className="min-h-24 rounded-2xl border border-slate-200 px-4 py-3" placeholder="Value" value={settingForm.value} onChange={(e) => setSettingForm((s) => ({ ...s, value: e.target.value }))} />
            <button className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white" type="submit">
              {createSetting.isPending ? 'Creating...' : 'Create setting'}
            </button>
          </form>
          <div className="mt-6 space-y-3">
            {sortedSettings.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-100 px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{item.key}</p>
                    <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">{item.category || 'general'} • {item.type || 'string'}</p>
                    <p className="mt-2 break-all text-sm text-slate-600">{item.value}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700" onClick={() => void toggleSettingEditable(item)} type="button">
                      {item.is_editable ? 'Lock' : 'Unlock'}
                    </button>
                    <button className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600" onClick={() => void deleteSetting.mutateAsync(item.id)} type="button">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
