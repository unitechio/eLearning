import { Input } from '@/shared/components/ui/input';
import { accessUsers } from './mockData';
import { SectionCard, StatusBadge, UserPreviewShell } from './helpers';

export function CustomerManagementPage() {
  return (
    <UserPreviewShell
      title="User management"
      description="Danh sach user duoc dung de test bang du lieu, bo loc, nhan trang thai va kha nang nhin nhanh role assignment truoc khi gan API that."
    >
      <SectionCard
        title="Bo loc mock"
        description="Chua co handler backend. Cac control duoc dat san de anh test composition va spacing."
      >
        <div className="grid gap-3 md:grid-cols-3">
          <Input placeholder="Tim theo ten hoac ma nhan vien" />
          <Input placeholder="Phong ban" />
          <Input placeholder="Role" />
        </div>
      </SectionCard>

      <SectionCard
        title="Danh sach nguoi dung"
        description="Bang nay giu cau truc don gian de de thay bang component table/backend query sau nay."
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-4 py-3 font-semibold">Nhan vien</th>
                <th className="px-4 py-3 font-semibold">Lien he</th>
                <th className="px-4 py-3 font-semibold">Phong ban</th>
                <th className="px-4 py-3 font-semibold">Vai tro</th>
                <th className="px-4 py-3 font-semibold">Trang thai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {accessUsers.map((user) => (
                <tr key={user.id} className="bg-white">
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-semibold text-slate-900">{user.fullName}</p>
                      <p className="text-xs text-slate-500">{user.employeeCode}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{user.email}</td>
                  <td className="px-4 py-4 text-slate-600">{user.department}</td>
                  <td className="px-4 py-4 text-slate-600">{user.roles.join(', ')}</td>
                  <td className="px-4 py-4">
                    <StatusBadge status={user.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </UserPreviewShell>
  );
}
