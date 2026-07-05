import { accessRoles, accessUsers } from './mockData';
import { SectionCard, StatusBadge, UserPreviewShell } from './helpers';

export function RolePermissionPage() {
  return (
    <UserPreviewShell
      title="User to role assignment"
      description="Trang nay mo phong man hinh gan role cho tung user. Muc tieu la de anh chot luong hien thi truoc khi lam submit/patch API."
    >
      <SectionCard
        title="Assignment matrix"
        description="Hang la user, cot la role. Hien tai la read-only preview de danh gia mat do thong tin."
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-4 py-3 font-semibold">Nguoi dung</th>
                <th className="px-4 py-3 font-semibold">Trang thai</th>
                {accessRoles.map((role) => (
                  <th key={role.id} className="px-4 py-3 font-semibold">
                    {role.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {accessUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-900">{user.fullName}</p>
                    <p className="text-xs text-slate-500">{user.employeeCode}</p>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={user.status} />
                  </td>
                  {accessRoles.map((role) => {
                    const assigned = user.roles.includes(role.name);

                    return (
                      <td key={`${user.id}-${role.id}`} className="px-4 py-4">
                        <span
                          className={[
                            'inline-flex rounded-full border px-3 py-1 text-xs font-semibold',
                            assigned
                              ? 'border-sky-200 bg-sky-50 text-sky-700'
                              : 'border-slate-200 bg-slate-50 text-slate-400',
                          ].join(' ')}
                        >
                          {assigned ? 'Assigned' : 'Empty'}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </UserPreviewShell>
  );
}
