import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAccessProfile, useAuth, useMe, useUpdateProfile } from '@/features/auth';
import { useBillingHistory } from '@/features/billing/api/hooks';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

export function ProfilePage() {
  const { user, setUser, accessProfile, setAccessProfile } = useAuth();
  const meQuery = useMe(true);
  const accessQuery = useAccessProfile(true);
  const updateProfile = useUpdateProfile();
  const billingHistory = useBillingHistory();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    avatar: '',
  });

  useEffect(() => {
    if (meQuery.data) {
      setUser(meQuery.data);
      setForm({
        first_name: meQuery.data.first_name ?? '',
        last_name: meQuery.data.last_name ?? '',
        avatar: meQuery.data.avatar ?? '',
      });
    }
  }, [meQuery.data, setUser]);

  useEffect(() => {
    if (accessQuery.data) {
      setAccessProfile(accessQuery.data);
    }
  }, [accessQuery.data, setAccessProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await updateProfile.mutateAsync(form);
    setUser(updated);
  };
  const latestBilling = billingHistory.data?.items?.[0];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 p-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Profile</h1>
        <p className="mt-2 text-sm text-slate-500">Manage your academy account, identity, and role access.</p>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.5fr,1fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Personal information</h2>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="First name" value={form.first_name} onChange={(e) => setForm((s) => ({ ...s, first_name: e.target.value }))} />
              <Input placeholder="Last name" value={form.last_name} onChange={(e) => setForm((s) => ({ ...s, last_name: e.target.value }))} />
            </div>
            <Input disabled value={user?.email ?? ''} />
            <Input placeholder="Avatar URL" value={form.avatar} onChange={(e) => setForm((s) => ({ ...s, avatar: e.target.value }))} />
            <Button disabled={updateProfile.isPending} type="submit">
              {updateProfile.isPending ? 'Saving...' : 'Save profile'}
            </Button>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Access profile</h2>
          <div className="mt-6 space-y-4 text-sm">
            <div>
              <p className="text-slate-400">Tenant</p>
              <p className="font-semibold text-slate-900">{accessProfile?.tenant_id || user?.tenant_id || 'n/a'}</p>
            </div>
            <div>
              <p className="text-slate-400">Roles</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(accessProfile?.roles ?? []).map((role) => (
                  <span key={role} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-700">
                    {role}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-slate-400">Features</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(accessProfile?.features ?? []).map((feature) => (
                  <span key={feature} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-slate-400">Plan</p>
              <p className="font-semibold text-slate-900">{accessProfile?.is_premium ? 'Premium active' : 'Free plan'}</p>
              {latestBilling ? (
                <p className="mt-2 text-xs text-slate-500">
                  Latest billing event: {latestBilling.plan_name} • {latestBilling.status} • {new Date(latestBilling.created_at).toLocaleDateString()}
                </p>
              ) : null}
              <Link className="mt-3 inline-flex rounded-full bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white" to="/billing">
                Manage plan
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
