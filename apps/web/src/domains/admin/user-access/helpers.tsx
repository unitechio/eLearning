import { Link, NavLink } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Shield, Users } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { AccessStatus } from './model';

const userPreviewLinks = [
  { to: '/preview/user', label: 'Tong quan' },
  { to: '/preview/user/users', label: 'Nguoi dung' },
  { to: '/preview/user/roles', label: 'Vai tro' },
  { to: '/preview/user/role-permission', label: 'Gan role' },
  { to: '/preview/user/permissions', label: 'Permission' },
  { to: '/preview/user/menu', label: 'Menu' },
];

export function UserPreviewShell({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6 md:p-8">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 px-6 py-8 text-white md:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <Badge className="w-fit border-white/20 bg-white/10 text-white hover:bg-white/10">
                Preview user access module
              </Badge>
              <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tight">{title}</h1>
                <p className="max-w-2xl text-sm text-slate-200">{description}</p>
              </div>
            </div>
            {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-slate-200 bg-slate-50 px-4 py-4 md:px-6">
          {userPreviewLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/preview/user'}
              className={({ isActive }) =>
                [
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100',
                ].join(' ')
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </section>

      {children}
    </div>
  );
}

export function SummaryCard({
  title,
  value,
  hint,
  icon,
}: {
  title: string;
  value: string;
  hint: string;
  icon: 'users' | 'roles' | 'permissions';
}) {
  const Icon = icon === 'users' ? Users : icon === 'roles' ? Shield : CheckCircle2;

  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-2">
          <CardDescription>{title}</CardDescription>
          <CardTitle className="text-3xl font-black text-slate-900">{value}</CardTitle>
        </div>
        <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-500">{hint}</p>
      </CardContent>
    </Card>
  );
}

export function StatusBadge({ status }: { status: AccessStatus }) {
  const className =
    status === 'active'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : 'border-slate-200 bg-slate-100 text-slate-500';

  return (
    <Badge variant="outline" className={className}>
      {status === 'active' ? 'Active' : 'Inactive'}
    </Badge>
  );
}

export function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function EmptyAction({ to, label }: { to: string; label: string }) {
  return (
    <Button asChild variant="outline" className="gap-2 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
      <Link to={to}>
        {label}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  );
}
