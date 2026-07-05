import React, { useMemo, useState } from 'react';
import { Edit2, GripVertical, Plus, Save, Search, Trash2 } from 'lucide-react';

type MenuItem = {
  id: string;
  menuTitle: string;
  menuUrl: string;
  order: number;
  icon: string;
  level: number;
  parentId?: string;
};

const initialMenus: MenuItem[] = [
  { id: 'dashboard', menuTitle: 'Dashboard', menuUrl: '/dashboard', order: 1000, icon: 'layout-dashboard', level: 0 },
  { id: 'ielts', menuTitle: 'IELTS Admin', menuUrl: '#', order: 900, icon: 'book-open', level: 0 },
  { id: 'ielts-content', menuTitle: 'IELTS Content', menuUrl: '/admin/ielts-content', order: 890, icon: 'book-check', level: 1, parentId: 'ielts' },
  { id: 'billing', menuTitle: 'Billing Admin', menuUrl: '/admin/billing', order: 800, icon: 'credit-card', level: 0 },
  { id: 'support', menuTitle: 'Support Tickets', menuUrl: '/admin/support-tickets', order: 700, icon: 'message-circle', level: 0 },
];

export function MenuPage() {
  const [menus, setMenus] = useState<MenuItem[]>(initialMenus);
  const [search, setSearch] = useState('');

  const filteredMenus = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return menus;
    return menus.filter((item) => `${item.menuTitle} ${item.menuUrl} ${item.icon}`.toLowerCase().includes(keyword));
  }, [menus, search]);

  const moveItem = (id: string, direction: 'up' | 'down') => {
    setMenus((current) => {
      const index = current.findIndex((item) => item.id === id);
      const nextIndex = direction === 'up' ? index - 1 : index + 1;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(nextIndex, 0, item);
      return next.map((menu, idx) => ({ ...menu, order: (next.length - idx) * 10 }));
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">Admin menu</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Menu configuration</h1>
              <p className="mt-2 text-sm text-slate-500">Quản lý nhanh các đường dẫn dashboard và admin.</p>
            </div>
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700" type="button">
                <Save className="h-4 w-4" />
                Save order
              </button>
              <button className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-bold text-white" type="button">
                <Plus className="h-4 w-4" />
                Add menu
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-red-300"
              placeholder="Search menu title, url, icon"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-100">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="w-16 px-4 py-3">Move</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">URL</th>
                  <th className="px-4 py-3">Icon</th>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMenus.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-slate-400">
                        <GripVertical className="h-4 w-4" />
                        <button className="text-xs font-bold text-slate-500" onClick={() => moveItem(item.id, 'up')} type="button">Up</button>
                        <button className="text-xs font-bold text-slate-500" onClick={() => moveItem(item.id, 'down')} type="button">Down</button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-950" style={{ paddingLeft: item.level * 16 }}>{item.menuTitle}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-blue-700">{item.menuUrl}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{item.icon}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">{item.order}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button className="rounded-xl bg-blue-50 p-2 text-blue-700" type="button"><Edit2 className="h-4 w-4" /></button>
                        <button className="rounded-xl bg-red-50 p-2 text-red-700" type="button"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default MenuPage;
