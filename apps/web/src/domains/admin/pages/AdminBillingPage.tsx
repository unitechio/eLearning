import React, { useState } from 'react';
import { CreditCard, Trash2, Plus } from 'lucide-react';
import { 
  AdminPageLayout, AdminCard, AdminCardHeader, AdminCardTitle, AdminCardContent, AdminDataTable, type AdminColumnDef 
} from '@/shared/components/admin';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Badge } from '@/shared/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { toast } from 'sonner';
import {
  useAdminBillingPlans,
  useAdminBillingInvoices,
  useAdminPaymentTransactions,
  useAdminBillingSubscriptions,
  useCancelAdminBillingSubscription,
  useCreateAdminBillingPlan,
  useDeleteAdminBillingPlan,
  useUpdateAdminBillingSubscriptionStatus,
  useGrantPremiumSubscription,
} from '@/domains/admin/api/billing';
import { useAdminUsers } from '@/domains/admin/api/users';

export function AdminBillingPage() {
  const plansQuery = useAdminBillingPlans();
  const subscriptionsQuery = useAdminBillingSubscriptions();
  const invoicesQuery = useAdminBillingInvoices();
  const paymentsQuery = useAdminPaymentTransactions();
  const usersQuery = useAdminUsers({ page: 1, page_size: 100 });
  
  const createPlan = useCreateAdminBillingPlan();
  const deletePlan = useDeleteAdminBillingPlan();
  const updateSubscription = useUpdateAdminBillingSubscriptionStatus();
  const cancelSubscription = useCancelAdminBillingSubscription();
  const grantPremium = useGrantPremiumSubscription();

  const [planForm, setPlanForm] = useState({ 
    name: '', 
    code: '', 
    price: 19, 
    currency: 'USD', 
    description: '', 
    billing_cycle: 'monthly', 
    is_active: true 
  });
  
  const [grantForm, setGrantForm] = useState({ user_id: '', plan_id: '' });

  const handleCreatePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPlan.mutateAsync(planForm);
      toast.success('Billing plan created successfully');
      setPlanForm({ name: '', code: '', price: 19, currency: 'USD', description: '', billing_cycle: 'monthly', is_active: true });
    } catch (err: any) {
      toast.error(err.message || 'Failed to create plan');
    }
  };

  const handleGrantPremiumSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await grantPremium.mutateAsync(grantForm);
      toast.success('Premium subscription granted successfully');
      setGrantForm({ user_id: '', plan_id: '' });
    } catch (err: any) {
      toast.error(err.message || 'Failed to grant premium');
    }
  };

  // Invoices Columns
  const invoiceColumns: AdminColumnDef<any>[] = [
    {
      header: 'Invoice',
      cell: (item) => <span className="font-semibold text-foreground">{item.invoice_no}</span>,
    },
    {
      header: 'Amount',
      cell: (item) => <span className="text-muted-foreground">{item.amount} {item.currency}</span>,
    },
    {
      header: 'Status',
      cell: (item) => (
        <Badge variant="outline" className="text-[11px] font-semibold capitalize border-border/80 text-muted-foreground">
          {item.status}
        </Badge>
      ),
    },
    {
      header: 'Created',
      cell: (item) => <span className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</span>,
    },
  ];

  // Payments Columns
  const paymentColumns: AdminColumnDef<any>[] = [
    {
      header: 'Provider',
      cell: (item) => <span className="font-semibold text-foreground">{item.provider}</span>,
    },
    {
      header: 'Reference',
      cell: (item) => (
        <span className="font-mono text-xs text-muted-foreground truncate max-w-[120px] inline-block">
          {item.provider_reference || item.id}
        </span>
      ),
    },
    {
      header: 'Amount',
      cell: (item) => <span className="text-muted-foreground">{item.amount} {item.currency}</span>,
    },
    {
      header: 'Status',
      cell: (item) => (
        <Badge className="text-[11px] font-semibold capitalize border-transparent">
          {item.status}
        </Badge>
      ),
    },
  ];

  return (
    <AdminPageLayout
      title="Billing Management"
      description="Configure core plans, audit dynamic user subscriptions, and issue manual overrides."
      icon={CreditCard}
    >
      <div className="grid gap-6 xl:grid-cols-2 w-full">
        {/* Create Billing Plan */}
        <AdminCard>
          <AdminCardHeader>
            <AdminCardTitle>Create Billing Plan</AdminCardTitle>
          </AdminCardHeader>
          <AdminCardContent>
            <form className="grid gap-4" onSubmit={handleCreatePlanSubmit}>
              <div className="grid gap-2">
                <Input 
                  placeholder="Plan Name (e.g. Premium)" 
                  value={planForm.name} 
                  onChange={(e) => setPlanForm((s) => ({ ...s, name: e.target.value }))} 
                  className="h-10 rounded-[10px] text-sm"
                />
              </div>
              <div className="grid gap-2">
                <Input 
                  placeholder="Code (e.g. plan_premium)" 
                  value={planForm.code} 
                  onChange={(e) => setPlanForm((s) => ({ ...s, code: e.target.value }))} 
                  className="h-10 rounded-[10px] text-sm"
                />
              </div>
              <div className="grid gap-2">
                <Input 
                  placeholder="Price" 
                  type="number" 
                  value={planForm.price} 
                  onChange={(e) => setPlanForm((s) => ({ ...s, price: Number(e.target.value) }))} 
                  className="h-10 rounded-[10px] text-sm"
                />
              </div>
              <div className="grid gap-2">
                <Textarea 
                  placeholder="Description" 
                  value={planForm.description} 
                  onChange={(e) => setPlanForm((s) => ({ ...s, description: e.target.value }))} 
                  className="min-h-[80px] rounded-[10px] text-sm"
                />
              </div>
              <Button type="submit" disabled={createPlan.isPending} className="h-10 rounded-[10px] text-sm font-semibold">
                {createPlan.isPending ? 'Creating...' : 'Create Plan'}
              </Button>
            </form>

            <div className="mt-6 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Catalog Plans</h3>
              {(plansQuery.data ?? []).length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">No billing plans defined yet.</p>
              ) : (
                (plansQuery.data ?? []).map((plan) => (
                  <div key={plan.id} className="rounded-xl border border-border/60 bg-slate-50/20 dark:bg-slate-900/10 p-3.5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[13px] font-semibold text-foreground">{plan.name}</p>
                      <p className="text-xs text-muted-foreground">{plan.code} • {plan.price} {plan.currency}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg"
                      onClick={() => void deletePlan.mutateAsync(plan.id)} 
                      type="button"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </AdminCardContent>
        </AdminCard>

        {/* Grant Premium */}
        <AdminCard>
          <AdminCardHeader>
            <AdminCardTitle>Grant Premium Manually</AdminCardTitle>
          </AdminCardHeader>
          <AdminCardContent>
            <form className="grid gap-4" onSubmit={handleGrantPremiumSubmit}>
              <div className="grid gap-2">
                <Select value={grantForm.user_id} onValueChange={(val) => setGrantForm((s) => ({ ...s, user_id: val }))}>
                  <SelectTrigger className="h-10 rounded-[10px] text-sm"><SelectValue placeholder="Select user" /></SelectTrigger>
                  <SelectContent>
                    {(usersQuery.data?.items ?? []).map((user) => (
                      <SelectItem key={user.id} value={user.id}>{user.email}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Select value={grantForm.plan_id} onValueChange={(val) => setGrantForm((s) => ({ ...s, plan_id: val }))}>
                  <SelectTrigger className="h-10 rounded-[10px] text-sm"><SelectValue placeholder="Select plan" /></SelectTrigger>
                  <SelectContent>
                    {(plansQuery.data ?? []).map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={grantPremium.isPending} className="h-10 rounded-[10px] text-sm font-semibold">
                {grantPremium.isPending ? 'Granting...' : 'Grant Premium'}
              </Button>
            </form>
          </AdminCardContent>
        </AdminCard>
      </div>

      {/* Subscriptions */}
      <AdminCard className="w-full">
        <AdminCardHeader>
          <AdminCardTitle>Active User Subscriptions</AdminCardTitle>
        </AdminCardHeader>
        <AdminCardContent className="space-y-3">
          {(subscriptionsQuery.data?.items ?? []).length === 0 ? (
            <p className="text-xs text-muted-foreground py-6 text-center">No active user subscriptions tracked.</p>
          ) : (
            (subscriptionsQuery.data?.items ?? []).map((item) => (
              <div key={item.id} className="rounded-xl border border-border/60 bg-slate-50/20 dark:bg-slate-900/10 p-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[13px] font-semibold text-foreground">{item.user_email}</p>
                  <p className="text-xs text-muted-foreground">{item.plan_name} • <span className="font-semibold">{item.status}</span></p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="button"
                    variant="outline"
                    className="h-8 text-xs font-semibold rounded-lg px-3"
                    onClick={() => void updateSubscription.mutateAsync({ id: item.id, payload: { status: 'active' } })}
                  >
                    Activate
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    className="h-8 text-xs font-semibold text-red-500 border-red-500/20 hover:bg-red-500/10 rounded-lg px-3"
                    onClick={() => void cancelSubscription.mutateAsync(item.id)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ))
          )}
        </AdminCardContent>
      </AdminCard>

      {/* Tables Row: Invoices and Payment transactions */}
      <div className="grid gap-6 xl:grid-cols-2 w-full">
        {/* Invoices */}
        <AdminCard>
          <AdminCardHeader>
            <AdminCardTitle>Invoices</AdminCardTitle>
          </AdminCardHeader>
          <AdminCardContent className="p-0 border-t border-border/50">
            <AdminDataTable
              data={invoicesQuery.data?.items ?? []}
              columns={invoiceColumns}
              isLoading={invoicesQuery.isLoading}
              emptyTitle="No invoices found"
              emptyDescription="No customer billing invoices have been generated yet."
            />
          </AdminCardContent>
        </AdminCard>

        {/* Payments */}
        <AdminCard>
          <AdminCardHeader>
            <AdminCardTitle>Payment Transactions</AdminCardTitle>
          </AdminCardHeader>
          <AdminCardContent className="p-0 border-t border-border/50">
            <AdminDataTable
              data={paymentsQuery.data?.items ?? []}
              columns={paymentColumns}
              isLoading={paymentsQuery.isLoading}
              emptyTitle="No payment transactions found"
              emptyDescription="No payment processor webhook records exist."
            />
          </AdminCardContent>
        </AdminCard>
      </div>
    </AdminPageLayout>
  );
}

export default AdminBillingPage;
