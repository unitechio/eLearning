import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminPermissions, useAdminRoles } from '@/features/admin/api/hooks';
import { useAuth } from '@/features/auth';

export function AdminAccessPage() {
  const { accessProfile } = useAuth();
  const rolesQuery = useAdminRoles();
  const permissionsQuery = useAdminPermissions();

  if (accessProfile && !accessProfile.is_admin) {
    return <Navigate replace to="/dashboard" />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Admin access control</h1>
        <p className="mt-2 text-sm text-slate-500">Browse live roles and permissions from the backend authorization system.</p>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Roles</h2>
          <div className="mt-6 space-y-4">
            {(rolesQuery.data ?? []).map((role) => (
              <div key={role.id} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{role.display_name || role.name}</p>
                    <p className="text-xs uppercase tracking-wider text-slate-400">{role.name}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    {role.permissions?.length ?? 0} permissions
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Permissions</h2>
          <div className="mt-6 space-y-3">
            {(permissionsQuery.data ?? []).slice(0, 80).map((permission) => (
              <div key={permission.id} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
                <div>
                  <p className="font-semibold text-slate-900">
                    {permission.resource}:{permission.action}
                  </p>
                  <p className="text-xs text-slate-400">
                    {[permission.module, permission.department, permission.service].filter(Boolean).join(' / ') || 'general'}
                  </p>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">{permission.action}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
