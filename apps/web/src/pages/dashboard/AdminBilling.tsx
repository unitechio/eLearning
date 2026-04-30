import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  useAdminBillingPlans,
  useAdminBillingSubscriptions,
  useCancelAdminBillingSubscription,
  useCreateAdminBillingPlan,
  useDeleteAdminBillingPlan,
  useGrantPremiumSubscription,
  useUpdateAdminBillingSubscriptionStatus,
} from '@/features/admin/api/hooks';
import { useAdminUsers } from '@/features/admin/api/hooks';
import { useAuth } from '@/features/auth';

export function AdminBillingPage() {
  const { accessProfile } = useAuth();
  const plansQuery = useAdminBillingPlans();
  const subscriptionsQuery = useAdminBillingSubscriptions();
  const usersQuery = useAdminUsers({ page: 1, page_size: 100 });
  const createPlan = useCreateAdminBillingPlan();
  const deletePlan = useDeleteAdminBillingPlan();
  const updateSubscription = useUpdateAdminBillingSubscriptionStatus();
  const cancelSubscription = useCancelAdminBillingSubscription();
  const grantPremium = useGrantPremiumSubscription();
  const [planForm, setPlanForm] = useState({ name: '', code: '', price: 19, currency: 'USD', description: '', billing_cycle: 'monthly', is_active: true });
  const [grantForm, setGrantForm] = useState({ user_id: '', plan_id: '' });

  if (accessProfile && !accessProfile.is_admin) {
    return <Navigate replace to="/dashboard" />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Billing management</h1>
        <p className="mt-2 text-sm text-slate-500">Quản lý plan, subscription, và cấp premium thủ công cho user.</p>
      </section>

      <div className="grid gap-8 xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Create billing plan</h2>
          <form className="mt-6 grid gap-3" onSubmit={(e) => { e.preventDefault(); void createPlan.mutateAsync(planForm); }}>
            <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Name" value={planForm.name} onChange={(e) => setPlanForm((s) => ({ ...s, name: e.target.value }))} />
            <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Code" value={planForm.code} onChange={(e) => setPlanForm((s) => ({ ...s, code: e.target.value }))} />
            <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Price" type="number" value={planForm.price} onChange={(e) => setPlanForm((s) => ({ ...s, price: Number(e.target.value) }))} />
            <textarea className="min-h-24 rounded-2xl border border-slate-200 px-4 py-3" placeholder="Description" value={planForm.description} onChange={(e) => setPlanForm((s) => ({ ...s, description: e.target.value }))} />
            <button className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white" type="submit">{createPlan.isPending ? 'Creating...' : 'Create plan'}</button>
          </form>
          <div className="mt-6 space-y-3">
            {(plansQuery.data ?? []).map((plan) => (
              <div key={plan.id} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900">{plan.name}</p>
                    <p className="text-sm text-slate-500">{plan.code} • {plan.price} {plan.currency}</p>
                  </div>
                  <button className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600" onClick={() => void deletePlan.mutateAsync(plan.id)} type="button">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Grant premium</h2>
          <form className="mt-6 grid gap-3" onSubmit={(e) => { e.preventDefault(); void grantPremium.mutateAsync(grantForm); }}>
            <select className="rounded-2xl border border-slate-200 px-4 py-3" value={grantForm.user_id} onChange={(e) => setGrantForm((s) => ({ ...s, user_id: e.target.value }))}>
              <option value="">Select user</option>
              {(usersQuery.data?.items ?? []).map((user) => <option key={user.id} value={user.id}>{user.email}</option>)}
            </select>
            <select className="rounded-2xl border border-slate-200 px-4 py-3" value={grantForm.plan_id} onChange={(e) => setGrantForm((s) => ({ ...s, plan_id: e.target.value }))}>
              <option value="">Select plan</option>
              {(plansQuery.data ?? []).map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option>)}
            </select>
            <button className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white" type="submit">{grantPremium.isPending ? 'Granting...' : 'Grant premium'}</button>
          </form>
        </section>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Subscriptions</h2>
        <div className="mt-6 space-y-3">
          {(subscriptionsQuery.data?.items ?? []).map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-900">{item.user_email}</p>
                  <p className="text-sm text-slate-500">{item.plan_name} • {item.status}</p>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700" onClick={() => void updateSubscription.mutateAsync({ id: item.id, payload: { status: 'active' } })} type="button">Activate</button>
                  <button className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700" onClick={() => void cancelSubscription.mutateAsync(item.id)} type="button">Cancel</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
