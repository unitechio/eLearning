import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Sparkles } from 'lucide-react';
import { useAuth } from '@/features/auth';

export function usePremiumAccess(featureKey?: string) {
  const { accessProfile } = useAuth();
  const isPremium = Boolean(accessProfile?.is_premium);
  const hasFeature = !featureKey || Boolean(accessProfile?.features?.some((item) => item === featureKey || item === 'premium'));
  return {
    isPremium,
    unlocked: isPremium && hasFeature,
    features: accessProfile?.features ?? [],
  };
}

export function PremiumBadge({ unlocked }: { unlocked: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black uppercase tracking-widest ${unlocked ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
      {unlocked ? <Sparkles className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
      {unlocked ? 'Premium Unlocked' : 'Premium Locked'}
    </span>
  );
}

export function PremiumLockCard({
  title,
  description,
  featureKey,
}: {
  title: string;
  description: string;
  featureKey?: string;
}) {
  const { unlocked } = usePremiumAccess(featureKey);
  if (unlocked) return null;
  return (
    <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <PremiumBadge unlocked={false} />
          <h3 className="mt-4 text-xl font-black text-slate-900">{title}</h3>
          <p className="mt-2 text-sm text-slate-600">{description}</p>
        </div>
        <Lock className="h-6 w-6 text-amber-500" />
      </div>
      <Link className="mt-5 inline-flex rounded-full bg-slate-900 px-4 py-2 text-xs font-black uppercase tracking-wider text-white" to="/billing">
        Upgrade plan
      </Link>
    </div>
  );
}
