import { accessMenuItems } from './mockData';
import { SectionCard, UserPreviewShell } from './helpers';

export function MenuManagementPage() {
  return (
    <UserPreviewShell
      title="Menu management"
      description="Ban preview menu nay giu data structure san sang cho drag-drop sau nay, nhung hien tai uu tien layout ro rang, de nhin va de map route."
    >
      <SectionCard
        title="Menu structure"
        description="Level va permissionCode da duoc model san. Khi can noi backend chi can bind them data va submit order."
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-4 py-3 font-semibold">Tieu de</th>
                <th className="px-4 py-3 font-semibold">Path</th>
                <th className="px-4 py-3 font-semibold">Icon</th>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Permission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {accessMenuItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-300">{item.level > 0 ? '└' : '•'}</span>
                      <div>
                        <p className="font-semibold text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-500">Level {item.level}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-sky-700">{item.path}</td>
                  <td className="px-4 py-4 text-slate-600">{item.icon}</td>
                  <td className="px-4 py-4 text-slate-600">{item.order}</td>
                  <td className="px-4 py-4 text-slate-600">{item.permissionCode ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </UserPreviewShell>
  );
}
