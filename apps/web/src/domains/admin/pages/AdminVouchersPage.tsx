import React, { useState } from 'react';
import { 
  Tag, 
  Plus, 
  Trash2, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { cn } from '@/shared/lib';

interface VoucherItem {
  id: string;
  code: string;
  discount: number;
  type: 'fixed' | 'percent';
  expires_at: string;
  is_active: boolean;
}

export function AdminVouchersPage() {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discount: 20,
    type: 'percent',
    expires_at: new Date(Date.now() + 30*24*60*60*1000).toISOString().slice(0, 10), // 30 days from now
    is_active: true
  });

  // Query Vouchers
  const { data: vouchers, isLoading } = useQuery({
    queryKey: ['admin-vouchers'],
    queryFn: async () => {
      try {
        const res = await apiClient.get<{ data: VoucherItem[] }>('/admin/billing/vouchers');
        return res.data.data;
      } catch {
        // Fallback Mock Data
        return [
          { id: "v_1", code: "SUMMER20", discount: 20, type: "percent", expires_at: "2026-08-31T23:59:59Z", is_active: true },
          { id: "v_2", code: "FIXED50", discount: 50, type: "fixed", expires_at: "2026-09-30T23:59:59Z", is_active: true }
        ] as VoucherItem[];
      }
    }
  });

  const createMutation = useMutation({
    mutationFn: async (payload: typeof formData) => {
      const res = await apiClient.post('/admin/billing/vouchers', payload);
      return res.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-vouchers'] });
      setShowAddModal(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/admin/billing/vouchers/${id}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-vouchers'] });
    }
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 p-6 lg:p-8 text-slate-800 dark:text-slate-100 font-sans">
      {/* Header banner */}
      <header className="rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8 text-white shadow-xl flex items-center justify-between flex-wrap gap-4">
        <section className="flex items-center gap-4">
          <figure className="rounded-2xl bg-white/20 p-3" aria-hidden="true">
            <Tag className="h-8 w-8" />
          </figure>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Voucher Management</h1>
            <p className="mt-1 text-violet-100">
              Quản lý và tạo mã giảm giá ưu đãi học phí cho học viên
            </p>
          </div>
        </section>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-white text-indigo-600 hover:bg-slate-50 font-black text-xs px-5 py-3 rounded-2xl transition shadow-md shrink-0"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Tạo mã Voucher</span>
        </button>
      </header>

      {/* Main card list */}
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm overflow-hidden" aria-label="Vouchers list">
        <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4">Danh sách mã giảm giá</h2>

        {isLoading ? (
          <div className="py-20 text-center text-slate-400 font-bold">Đang tải danh sách voucher...</div>
        ) : !vouchers || vouchers.length === 0 ? (
          <div className="py-20 text-center text-slate-450 font-bold">Không tìm thấy mã voucher nào</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold min-w-[600px]">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-black uppercase tracking-wider border-b border-slate-100 dark:border-slate-850">
                <tr>
                  <th className="px-4 py-3">Mã giảm giá (Code)</th>
                  <th className="px-4 py-3">Mức ưu đãi</th>
                  <th className="px-4 py-3">Phân loại</th>
                  <th className="px-4 py-3">Ngày hết hạn</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                {vouchers.map(v => (
                  <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-900 transition">
                    <td className="px-4 py-4 font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">
                      {v.code}
                    </td>
                    <td className="px-4 py-4 font-black">
                      {v.type === 'percent' ? `${v.discount}%` : `$${v.discount.toFixed(2)}`}
                    </td>
                    <td className="px-4 py-4 capitalize">{v.type} discount</td>
                    <td className="px-4 py-4 text-slate-500 flex items-center gap-1.5 mt-3 border-none">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(v.expires_at).toLocaleDateString()}</span>
                    </td>
                    <td className="px-4 py-4">
                      {v.is_active ? (
                        <span className="inline-flex items-center gap-1 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full text-[10px] font-black">
                          <CheckCircle className="h-3 w-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full text-[10px] font-black">
                          <XCircle className="h-3 w-3" />
                          <span>Expired</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => void deleteMutation.mutateAsync(v.id)}
                        className="p-2 hover:bg-rose-50 dark:hover:bg-rose-955/20 text-slate-500 hover:text-rose-600 rounded-xl transition"
                        aria-label="Delete voucher"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Add Voucher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <article 
            className="w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 relative max-h-[85vh] overflow-y-auto flex flex-col gap-4 text-slate-800 dark:text-slate-100 font-sans"
            role="dialog"
            aria-modal="true"
            aria-label="Voucher generator modal"
          >
            <button 
              type="button" 
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-650"
              aria-label="Close"
            >
              ✕
            </button>

            <header>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Tạo mã Voucher mới</h3>
            </header>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold">
              <label className="block space-y-1">
                <span className="text-slate-550">Mã giảm giá (Code)</span>
                <input 
                  type="text" 
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g. AUTUMN30"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-400"
                  required
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block space-y-1">
                  <span className="text-slate-555">Mức giảm (Discount)</span>
                  <input 
                    type="number" 
                    value={formData.discount}
                    onChange={(e) => setFormData(prev => ({ ...prev, discount: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs focus:outline-none"
                    required
                  />
                </label>

                <label className="block space-y-1">
                  <span className="text-slate-555">Loại giảm giá</span>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-855 bg-white dark:bg-slate-900 px-3 py-2.5 focus:outline-none"
                  >
                    <option value="percent">Phần trăm (%)</option>
                    <option value="fixed">Số tiền mặt ($)</option>
                  </select>
                </label>
              </div>

              <label className="block space-y-1">
                <span className="text-slate-555">Ngày hết hạn</span>
                <input 
                  type="date" 
                  value={formData.expires_at}
                  onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs focus:outline-none"
                  required
                />
              </label>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  id="isActive"
                  type="checkbox" 
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-200 text-indigo-650"
                />
                <label htmlFor="isActive" className="text-xs text-slate-500 font-semibold cursor-pointer">
                  Kích hoạt sử dụng ngay
                </label>
              </div>

              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3.5 transition flex items-center justify-center gap-2 shadow-md"
              >
                {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Lưu mã giảm giá</span>
              </button>
            </form>
          </article>
        </div>
      )}
    </main>
  );
}
