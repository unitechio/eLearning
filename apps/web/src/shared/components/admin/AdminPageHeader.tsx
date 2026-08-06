import React from 'react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
  eyebrow?: string;
}

export function AdminPageHeader({
  title,
  description,
  icon: Icon,
  action,
  className,
  eyebrow,
}: AdminPageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between pb-6 border-b border-border/60", className)}>
      <div className="min-w-0 space-y-1">
        {eyebrow && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary/80">{eyebrow}</p>
        )}
        <div className="flex items-center gap-3">
          {Icon && (
            <span className="text-muted-foreground/60" aria-hidden="true">
              <Icon className="h-5 w-5" />
            </span>
          )}
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">{description}</p>
        )}
      </div>
      {action && (
        <div className="flex shrink-0 items-center gap-2 pt-1 sm:pt-0 self-start sm:self-start">
          {action}
        </div>
      )}
    </header>
  );
}
