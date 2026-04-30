import { accessPermissions } from './mockData';
import { SectionCard, UserPreviewShell } from './helpers';

export function PermissionPage() {
  const groupedPermissions = accessPermissions.reduce<Record<string, typeof accessPermissions>>((acc, permission) => {
    if (!acc[permission.group]) {
      acc[permission.group] = [];
    }

    acc[permission.group].push(permission);
    return acc;
  }, {});

  return (
    <UserPreviewShell
      title="Permission catalog"
      description="Danh muc permission duoc tach khoi role de backend sau nay co the cap theo resource/action ro rang."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {Object.entries(groupedPermissions).map(([group, permissions]) => (
          <SectionCard
            key={group}
            title={group}
            description="Nhom quyen duoc hien thi theo chuc nang nghiep vu."
          >
            <div className="space-y-3">
              {permissions.map((permission) => (
                <div key={permission.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <h2 className="font-bold text-slate-900">{permission.name}</h2>
                      <p className="text-sm text-slate-500">{permission.description}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {permission.code}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        ))}
      </div>
    </UserPreviewShell>
  );
}
