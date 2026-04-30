import React from 'react';
import { Navigate } from 'react-router-dom';
import { useBillingHistory, useBillingPlans, useSubscribePlan } from '@/features/billing/api/hooks';
import { useAuth } from '@/features/auth';

export function BillingPage() {
  const { accessProfile } = useAuth();
  const plansQuery = useBillingPlans();
  const historyQuery = useBillingHistory();
  const subscribeMutation = useSubscribePlan();

  if (!accessProfile) {
    return <Navigate replace to="/dashboard" />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Plans & premium</h1>
        <p className="mt-2 text-sm text-slate-500">Nâng cấp gói để mở khóa AI writing nâng cao, speaking realtime, vocab pro và các feature premium.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${accessProfile.is_premium ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
            {accessProfile.is_premium ? 'premium active' : 'free tier'}
          </span>
          {(accessProfile.features ?? []).map((feature) => (
            <span key={feature} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              {feature}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {(plansQuery.data ?? []).map((plan) => (
          <div key={plan.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-widest text-primary">{plan.currency}</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">{plan.name}</h2>
            <p className="mt-2 text-sm text-slate-500">{plan.description}</p>
            <p className="mt-6 text-4xl font-black text-slate-900">
              {plan.price}
              <span className="ml-2 text-sm font-semibold text-slate-400">{plan.currency}</span>
            </p>
            <button
              className="mt-6 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white"
              onClick={() => void subscribeMutation.mutateAsync(plan.id)}
              type="button"
            >
              {subscribeMutation.isPending ? 'Processing...' : `Choose ${plan.name}`}
            </button>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Billing history</h2>
        <div className="mt-6 space-y-3">
          {(historyQuery.data?.items ?? []).map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-900">{item.plan_name}</p>
                  <p className="text-sm text-slate-500">{item.created_at}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">{item.amount}</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
