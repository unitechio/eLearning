import React, { useState } from 'react';
import { 
  Tag, 
  Plus, 
  Trash2, 
  Calendar, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { 
  AdminPageLayout, AdminDataTable, type AdminColumnDef 
} from '@/shared/components/admin';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/ui/dialog';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils';

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
  const { data: vouchers, isLoading, error } = useQuery({
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
      toast.success('Mã giảm giá đã được tạo!');
      void queryClient.invalidateQueries({ queryKey: ['admin-vouchers'] });
      setShowAddModal(false);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Lỗi tạo Voucher');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/admin/billing/vouchers/${id}`);
    },
    onSuccess: () => {
      toast.success('Đã xóa Voucher');
      void queryClient.invalidateQueries({ queryKey: ['admin-vouchers'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Lỗi xóa Voucher');
    }
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const voucherList = vouchers || [];

  const columns: AdminColumnDef<VoucherItem>[] = [
    {
      header: 'Mã giảm giá (Code)',
      cell: (v) => <span className="font-mono text-xs font-semibold text-foreground uppercase tracking-wider">{v.code}</span>,
    },
    {
      header: 'Mức ưu đãi',
      cell: (v) => <span className="font-semibold text-foreground">{v.type === 'percent' ? `${v.discount}%` : `$${v.discount.toFixed(2)}`}</span>,
    },
    {
      header: 'Phân loại',
      cell: (v) => <span className="text-muted-foreground capitalize">{v.type} discount</span>,
    },
    {
      header: 'Ngày hết hạn',
      cell: (v) => (
        <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground/60" />
          {new Date(v.expires_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Trạng thái',
      cell: (v) => (
        <Badge className={cn("text-[11px] font-semibold border-transparent", v.is_active ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-500')}>
          {v.is_active ? 'Active' : 'Expired'}
        </Badge>
      ),
    },
    {
      header: 'Thao tác',
      cell: (v) => (
        <div className="flex justify-end pr-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-red-500 hover:text-red-650 hover:bg-red-500/10" 
            onClick={() => void deleteMutation.mutateAsync(v.id)}
            title="Xóa"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
      className: 'text-right w-[80px]',
    },
  ];

  const rightActions = (
    <Button
      type="button"
      onClick={() => {
        setFormData({
          code: '',
          discount: 20,
          type: 'percent',
          expires_at: new Date(Date.now() + 30*24*60*60*1000).toISOString().slice(0, 10),
          is_active: true
        });
        setShowAddModal(true);
      }}
      className="h-10 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-3 text-xs gap-1.5 rounded-[10px] shadow-sm shrink-0"
    >
      <Plus className="h-4 w-4" />
      <span>Tạo mã Voucher</span>
    </Button>
  );

  return (
    <AdminPageLayout
      title="Voucher Management"
      description="Quản lý và tạo mã giảm giá ưu đãi học phí cho học viên."
      icon={Tag}
      action={rightActions}
    >
      <AdminDataTable
        data={voucherList}
        columns={columns}
        isLoading={isLoading}
        error={error}
        emptyTitle="Không tìm thấy mã voucher nào"
        emptyDescription="Tạo mã voucher để cung cấp mã ưu đãi cho chiến dịch marketing."
      />

      {/* Add Voucher Dialog */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Tạo mã Voucher mới</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label className="text-xs font-semibold text-muted-foreground" htmlFor="code">Mã giảm giá (Code)</Label>
              <Input 
                id="code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                placeholder="e.g. AUTUMN30"
                className="h-10 rounded-[10px] font-mono text-sm uppercase"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-xs font-semibold text-muted-foreground" htmlFor="discount">Mức giảm (Discount)</Label>
                <Input 
                  id="discount"
                  type="number" 
                  value={formData.discount}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount: Number(e.target.value) }))}
                  className="h-10 rounded-[10px]"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label className="text-xs font-semibold text-muted-foreground">Loại giảm giá</Label>
                <Select value={formData.type} onValueChange={(val) => setFormData(prev => ({ ...prev, type: val }))}>
                  <SelectTrigger className="h-10 rounded-[10px]"><SelectValue placeholder="Loại" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">Phần trăm (%)</SelectItem>
                    <SelectItem value="fixed">Số tiền mặt ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="text-xs font-semibold text-muted-foreground" htmlFor="expires_at">Ngày hết hạn</Label>
              <Input 
                id="expires_at"
                type="date" 
                value={formData.expires_at}
                onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
                className="h-10 rounded-[10px]"
                required
              />
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Checkbox 
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={checked => setFormData(prev => ({ ...prev, is_active: !!checked }))}
              />
              <Label htmlFor="is_active" className="text-xs text-muted-foreground font-semibold cursor-pointer select-none">
                Kích hoạt sử dụng ngay
              </Label>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 mt-4">
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="h-10 rounded-[10px] text-sm font-semibold">Hủy</Button>
              <Button type="submit" disabled={createMutation.isPending} className="h-10 rounded-[10px] text-sm font-semibold">
                {createMutation.isPending ? 'Đang lưu...' : 'Lưu mã giảm giá'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  );
}

export default AdminVouchersPage;
