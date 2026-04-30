import { accessPermissions, accessRoles, rolePermissionMap } from './mockData';
import { SectionCard, StatusBadge, UserPreviewShell } from './helpers';

export function RoleManagementPage() {
  return (
    <UserPreviewShell
      title="Role management"
      description="Page nay giu bo cuc role-first de phu hop quy trinh phan quyen: tao role, xem tong quan, roi moi gan permission."
    >
      <div className="grid gap-4 xl:grid-cols-[1.1fr,1.4fr]">
        <SectionCard
          title="Danh sach vai tro"
          description="Mock data duoc viet typed de sau nay doi sang API response ma khong can doi layout."
        >
          <div className="space-y-3">
            {accessRoles.map((role) => (
              <div key={role.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-bold text-slate-900">{role.name}</h2>
                      <StatusBadge status={role.status} />
                    </div>
                    <p className="text-sm text-slate-500">{role.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm md:min-w-48">
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-slate-500">Thanh vien</p>
                      <p className="text-xl font-black text-slate-900">{role.memberCount}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-slate-500">Permission</p>
                      <p className="text-xl font-black text-slate-900">{role.permissionCount}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Permission mapping"
          description="Xem nhanh permission dang gan cho tung role. UI nay se doi sang checkbox tree khi noi backend."
        >
          <div className="space-y-5">
            {accessRoles.map((role) => (
              <div key={role.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900">{role.name}</h3>
                    <p className="text-sm text-slate-500">{role.createdAt}</p>
                  </div>
                  <p className="text-sm font-medium text-slate-500">
                    {(rolePermissionMap[role.name] ?? []).length} quyen
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {accessPermissions.map((permission) => {
                    const active = (rolePermissionMap[role.name] ?? []).includes(permission.code);

                    return (
                      <span
                        key={`${role.id}-${permission.id}`}
                        className={[
                          'rounded-full border px-3 py-1 text-xs font-semibold',
                          active
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 bg-slate-50 text-slate-400',
                        ].join(' ')}
                      >
                        {permission.code}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </UserPreviewShell>
  );
}
