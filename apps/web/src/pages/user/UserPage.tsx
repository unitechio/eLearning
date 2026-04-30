import { Link } from 'react-router-dom';
import { ArrowRight, KeyRound, Network, ShieldCheck, Users } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { accessPermissions, accessRoles, accessUsers } from './mockData';
import { EmptyAction, SummaryCard, UserPreviewShell } from './helpers';

const previewModules = [
  {
    title: 'Nguoi dung',
    description: 'Danh sach user mock, trang thai hoat dong va role dang duoc gan.',
    to: '/preview/user/users',
    icon: Users,
  },
  {
    title: 'Vai tro',
    description: 'Bo cuc role list, quick stats va gom nhom permission de test UI.',
    to: '/preview/user/roles',
    icon: ShieldCheck,
  },
  {
    title: 'Permission catalog',
    description: 'Danh muc quyen va ma permission se duoc map lai voi backend sau.',
    to: '/preview/user/permissions',
    icon: KeyRound,
  },
  {
    title: 'Menu access',
    description: 'Preview dieu huong theo phan quyen va thu tu menu noi bo.',
    to: '/preview/user/menu',
    icon: Network,
  },
];

export function UserPage() {
  return (
    <UserPreviewShell
      title="User access preview"
      description="Cum giao dien nay da duoc tach khoi backend that de anh test UI/UX truoc. Toan bo du lieu hien tai la mock data typed, sau nay chi can thay datasource va handler."
      actions={<EmptyAction to="/preview/user/users" label="Mo danh sach nguoi dung" />}
    >
      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Tong nguoi dung"
          value={String(accessUsers.length)}
          hint="Dang hien thi du lieu mock de danh gia layout, spacing va hierarchy."
          icon="users"
        />
        <SummaryCard
          title="Tong vai tro"
          value={String(accessRoles.length)}
          hint="Role se la diem noi dau tien khi tich hop API auth backend."
          icon="roles"
        />
        <SummaryCard
          title="Tong permission"
          value={String(accessPermissions.length)}
          hint="Code permission da tach rieng de map backend response de dang hon."
          icon="permissions"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {previewModules.map((module) => {
          const Icon = module.icon;

          return (
            <Card key={module.to} className="rounded-3xl border-slate-200 shadow-sm">
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Button asChild variant="ghost" className="gap-2 text-slate-600">
                    <Link to={module.to}>
                      Xem page
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900">{module.title}</CardTitle>
                  <CardDescription className="mt-2">{module.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500">
                  Route preview nay nen duoc dung de chot giao dien truoc khi noi voi API that.
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </UserPreviewShell>
  );
}
