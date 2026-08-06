import React from 'react';
import { cn } from '@/shared/lib/utils';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Pencil, 
  Info,
  HelpCircle
} from 'lucide-react';

export type BadgeVariant = 'success' | 'danger' | 'info' | 'pending' | 'signature' | 'muted';

interface AdminStatusBadgeProps {
  state: BadgeVariant | string;
  label?: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: BadgeVariant;
  className?: string;
}

const variantMap: Record<BadgeVariant, { container: string; icon: React.ComponentType<{ className?: string }> }> = {
  success: {
    container: "bg-[#E6F4EA] dark:bg-green-950/20 text-[#0F6B38] dark:text-green-400 border-[#B3E6C9] dark:border-green-900/30",
    icon: CheckCircle2,
  },
  danger: {
    container: "bg-[#FCE8E6] dark:bg-red-950/20 text-[#C5221F] dark:text-red-400 border-[#FAD2CF] dark:border-red-900/30",
    icon: AlertCircle,
  },
  info: {
    container: "bg-[#E8F0FE] dark:bg-blue-950/20 text-[#1A73E8] dark:text-blue-400 border-[#D2E3FC] dark:border-blue-900/30",
    icon: Clock,
  },
  pending: {
    container: "bg-[#E8F0FE] dark:bg-blue-950/20 text-[#1A73E8] dark:text-blue-400 border-[#D2E3FC] dark:border-blue-900/30",
    icon: Clock,
  },
  signature: {
    container: "bg-[#F3E8FF] dark:bg-purple-950/20 text-[#7C3AED] dark:text-purple-400 border-[#E9D5FF] dark:border-purple-900/30",
    icon: Pencil,
  },
  muted: {
    container: "bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-850",
    icon: Info,
  },
};

function normalizeState(state: string): BadgeVariant {
  const s = state.toLowerCase().replace(/_/g, ' ');
  
  if (
    s === 'repaid' || 
    s === 'payout sent' || 
    s === 'paid' || 
    s === 'success' || 
    s === 'completed' || 
    s === 'active' || 
    s === 'true' ||
    s === 'allowed'
  ) {
    return 'success';
  }
  
  if (
    s === 'invoice overdue' || 
    s === 'overdue' || 
    s === 'failed' || 
    s === 'suspended' || 
    s === 'danger' || 
    s === 'error' || 
    s === 'destructive' ||
    s === 'denied'
  ) {
    return 'danger';
  }
  
  if (
    s === 'invoice sent' || 
    s === 'sent' || 
    s === 'info'
  ) {
    return 'info';
  }
  
  if (
    s === 'payout processing' || 
    s === 'processing' || 
    s === 'pending' || 
    s === 'warning' || 
    s === 'approval needed'
  ) {
    return 'pending';
  }
  
  if (
    s === 'signature required' || 
    s === 'signature' || 
    s === 'review'
  ) {
    return 'signature';
  }
  
  return 'muted';
}

export function AdminStatusBadge({ state, label, icon, variant, className }: AdminStatusBadgeProps) {
  const normVariant = variant || normalizeState(state);
  const cfg = variantMap[normVariant] || variantMap.muted;
  const ActiveIcon = icon || cfg.icon || HelpCircle;
  const displayLabel = label || state;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-3 py-0.5 rounded-full text-[11px] font-semibold tracking-wide capitalize transition-colors select-none",
        cfg.container,
        className
      )}
    >
      <ActiveIcon className="h-3.5 w-3.5 shrink-0 stroke-[2.25]" aria-hidden="true" />
      <span>{displayLabel}</span>
    </span>
  );
}

export default AdminStatusBadge;
