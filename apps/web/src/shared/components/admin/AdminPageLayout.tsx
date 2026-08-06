import React from 'react';
import { cn } from '@/shared/lib/utils';
import { AdminPageHeader } from './AdminPageHeader';
import { type LucideIcon } from 'lucide-react';

interface AdminPageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  eyebrow?: string;
}

export function AdminPageLayout({
  title,
  description,
  icon,
  action,
  eyebrow,
  className,
  children,
  ...props
}: AdminPageLayoutProps) {
  return (
    <section className={cn("flex flex-col gap-6 p-6", className)} {...props}>
      <AdminPageHeader
        title={title}
        description={description}
        icon={icon}
        action={action}
        eyebrow={eyebrow}
      />
      <div className="w-full flex flex-col gap-6">
        {children}
      </div>
    </section>
  );
}
