import React, { useState } from 'react';
import { 
  AdminPageLayout, AdminCard, AdminCardHeader, AdminCardTitle, AdminCardContent, AdminDataTable, type AdminColumnDef 
} from '@/shared/components/admin';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/ui/dialog';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Textarea } from '@/shared/components/ui/textarea';
import { Plus, Edit, Trash2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { 
  useAmsSecurityPolicies, useCreateAmsSecurityPolicy, useUpdateAmsSecurityPolicy, useDeleteAmsSecurityPolicy,
  AmsSecurityPolicy
} from '@/domains/admin/api/ams';
import { cn } from '@/shared/lib/utils';

export function AdminSecurityPoliciesPage() {
  const [filterType, setFilterType] = useState<string>('all');
  const { data: listData, isLoading, error } = useAmsSecurityPolicies();
  const createMutation = useCreateAmsSecurityPolicy();
  const updateMutation = useUpdateAmsSecurityPolicy();
  const deleteMutation = useDeleteAmsSecurityPolicy();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<AmsSecurityPolicy | null>(null);
  const [deletingPolicyId, setDeletingPolicyId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    policy_type: 'auth' as 'auth' | 'step-up' | 'rate-limit',
    scope_type: 'global' as 'global' | 'client' | 'channel',
    target_client: '',
    target_channel: '',
    priority: 100,
    active: true,
    config_json: '{}'
  });

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      policy_type: 'auth',
      scope_type: 'global',
      target_client: '',
      target_channel: '',
      priority: 100,
      active: true,
      config_json: '{}'
    });
  };

  const handleCreate = async () => {
    try {
      const parsedConfig = JSON.parse(formData.config_json);
      await createMutation.mutateAsync({
        code: formData.code,
        name: formData.name,
        description: formData.description,
        policy_type: formData.policy_type,
        scope_type: formData.scope_type,
        target_client: formData.target_client || undefined,
        target_channel: formData.target_channel || undefined,
        priority: Number(formData.priority),
        active: formData.active,
        config_json: parsedConfig
      });
      toast.success('Security policy created');
      setIsCreateOpen(false);
      resetForm();
    } catch (err: any) {
      if (err instanceof SyntaxError) {
        toast.error('Invalid JSON configuration');
      } else {
        toast.error(err.message || 'Failed to create policy');
      }
    }
  };

  const handleUpdate = async () => {
    if (!editingPolicy) return;
    try {
      const parsedConfig = JSON.parse(formData.config_json);
      await updateMutation.mutateAsync({
        id: editingPolicy.id,
        payload: {
          code: formData.code,
          name: formData.name,
          description: formData.description,
          policy_type: formData.policy_type,
          scope_type: formData.scope_type,
          target_client: formData.target_client || undefined,
          target_channel: formData.target_channel || undefined,
          priority: Number(formData.priority),
          active: formData.active,
          config_json: parsedConfig
        }
      });
      toast.success('Security policy updated');
      setEditingPolicy(null);
    } catch (err: any) {
      if (err instanceof SyntaxError) {
        toast.error('Invalid JSON configuration');
      } else {
        toast.error(err.message || 'Failed to update policy');
      }
    }
  };

  const handleDelete = async () => {
    if (deletingPolicyId === null) return;
    try {
      await deleteMutation.mutateAsync(deletingPolicyId);
      toast.success('Security policy deleted');
      setDeletingPolicyId(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete policy');
    }
  };

  const toggleActive = async (policy: AmsSecurityPolicy) => {
    try {
      await updateMutation.mutateAsync({
        id: policy.id,
        payload: { active: !policy.active }
      });
      toast.success(`Policy ${!policy.active ? 'activated' : 'deactivated'}`);
    } catch (err: any) {
      toast.error('Failed to toggle policy status');
    }
  };

  const policyList = (listData?.data || []) as AmsSecurityPolicy[];
  const filteredPolicies = policyList.filter((p: AmsSecurityPolicy) => filterType === 'all' || p.policy_type === filterType);

  const columns: AdminColumnDef<AmsSecurityPolicy>[] = [
    {
      header: 'Code',
      cell: (policy) => <span className="font-mono text-xs text-muted-foreground">{policy.code}</span>,
      className: 'w-[180px]',
    },
    {
      header: 'Name',
      cell: (policy) => (
        <div>
          <span className="font-semibold text-foreground">{policy.name}</span>
          <div className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{policy.description}</div>
        </div>
      ),
    },
    {
      header: 'Type',
      cell: (policy) => (
        <Badge variant="outline" className="uppercase text-[11px] font-medium border-border/80 text-muted-foreground">
          {policy.policy_type}
        </Badge>
      ),
    },
    {
      header: 'Scope',
      cell: (policy) => (
        <Badge className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-muted-foreground uppercase text-[10px] font-semibold">
          {policy.scope_type}
        </Badge>
      ),
    },
    {
      header: 'Priority',
      cell: (policy) => <span className="font-mono text-xs text-muted-foreground">{policy.priority}</span>,
    },
    {
      header: 'Status',
      cell: (policy) => (
        <button type="button" onClick={() => toggleActive(policy)} className="focus:outline-none">
          <Badge className={cn("text-[11px] font-semibold cursor-pointer border-transparent hover:bg-opacity-80", policy.active ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-slate-500/10 text-slate-500')}>
            {policy.active ? 'Active' : 'Inactive'}
          </Badge>
        </button>
      ),
    },
    {
      header: 'Actions',
      cell: (policy) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => {
            setFormData({
              code: policy.code,
              name: policy.name,
              description: policy.description || '',
              policy_type: policy.policy_type,
              scope_type: policy.scope_type,
              target_client: policy.target_client || '',
              target_channel: policy.target_channel || '',
              priority: policy.priority,
              active: policy.active,
              config_json: JSON.stringify(policy.config_json, null, 2)
            });
            setEditingPolicy(policy);
          }}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => setDeletingPolicyId(policy.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
      className: 'text-right w-[120px]',
    },
  ];

  const rightActions = (
    <div className="flex items-center gap-2">
      <Select value={filterType} onValueChange={setFilterType}>
        <SelectTrigger className="w-[150px] h-10 rounded-[10px] text-xs font-semibold bg-slate-50/50">
          <SelectValue placeholder="Filter type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="auth">Auth</SelectItem>
          <SelectItem value="step-up">Step-up</SelectItem>
          <SelectItem value="rate-limit">Rate Limit</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={() => { resetForm(); setIsCreateOpen(true); }} className="h-10 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-3 text-xs gap-1.5 rounded-[10px] shadow-sm shrink-0">
        <Plus className="w-4 h-4" /> Create Policy
      </Button>
    </div>
  );

  return (
    <AdminPageLayout
      title="Security Policies"
      description="Manage core authentication rules, API rate limits, and multi-factor step-up challenge flows."
      icon={Plus}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <AdminCard>
          <AdminCardContent className="p-4">
            <div className="text-xs font-semibold text-muted-foreground">Total Policies</div>
            <div className="text-xl font-bold mt-1 tabular-nums">{policyList.length}</div>
          </AdminCardContent>
        </AdminCard>
        <AdminCard>
          <AdminCardContent className="p-4">
            <div className="text-xs font-semibold text-muted-foreground">Active Rules</div>
            <div className="text-xl font-bold mt-1 tabular-nums">{policyList.filter(p => p.active).length}</div>
          </AdminCardContent>
        </AdminCard>
        <AdminCard>
          <AdminCardContent className="p-4">
            <div className="text-xs font-semibold text-muted-foreground">MFA Step-up</div>
            <div className="text-xl font-bold mt-1 tabular-nums">{policyList.filter(p => p.policy_type === 'step-up').length}</div>
          </AdminCardContent>
        </AdminCard>
        <AdminCard>
          <AdminCardContent className="p-4">
            <div className="text-xs font-semibold text-muted-foreground">Rate Limits</div>
            <div className="text-xl font-bold mt-1 tabular-nums">{policyList.filter(p => p.policy_type === 'rate-limit').length}</div>
          </AdminCardContent>
        </AdminCard>
      </div>

      <AdminDataTable
        data={filteredPolicies}
        columns={columns}
        isLoading={isLoading}
        error={error}
        rightActions={rightActions}
        emptyTitle="No security policies match the current filter"
        emptyDescription="Try setting your type filters back to show all items."
      />

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateOpen || !!editingPolicy} onOpenChange={(open) => {
        if (!open) { setIsCreateOpen(false); setEditingPolicy(null); }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-semibold">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <span>{editingPolicy ? 'Edit Security Policy' : 'Create Security Policy'}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="grid gap-2 col-span-2">
              <Label className="text-xs font-semibold text-muted-foreground">Name</Label>
              <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-10 rounded-[10px]" />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-semibold text-muted-foreground">Code (Unique Identifier)</Label>
              <Input value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} disabled={!!editingPolicy} className="font-mono text-sm h-10 rounded-[10px]" />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-semibold text-muted-foreground">Priority (Lower runs first)</Label>
              <Input type="number" value={formData.priority} onChange={e => setFormData({...formData, priority: parseInt(e.target.value) || 100})} className="h-10 rounded-[10px]" />
            </div>
            <div className="grid gap-2 col-span-2">
              <Label className="text-xs font-semibold text-muted-foreground">Description</Label>
              <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="h-10 rounded-[10px]" />
            </div>
            
            <div className="grid gap-2">
              <Label className="text-xs font-semibold text-muted-foreground">Policy Type</Label>
              <Select value={formData.policy_type} onValueChange={(val) => setFormData({...formData, policy_type: val as 'auth' | 'step-up' | 'rate-limit'})}>
                <SelectTrigger className="h-10 rounded-[10px]"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="auth">Auth Rule</SelectItem>
                  <SelectItem value="step-up">Step-up / MFA</SelectItem>
                  <SelectItem value="rate-limit">Rate Limit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-semibold text-muted-foreground">Scope</Label>
              <Select value={formData.scope_type} onValueChange={(val) => setFormData({...formData, scope_type: val as 'global' | 'client' | 'channel'})}>
                <SelectTrigger className="h-10 rounded-[10px]"><SelectValue placeholder="Select scope" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="client">Client-specific</SelectItem>
                  <SelectItem value="channel">Channel-specific</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.scope_type === 'client' && (
              <div className="grid gap-2 col-span-2">
                <Label className="text-xs font-semibold text-muted-foreground">Target Client ID</Label>
                <Input value={formData.target_client} onChange={e => setFormData({...formData, target_client: e.target.value})} className="h-10 rounded-[10px]" />
              </div>
            )}
            
            {formData.scope_type === 'channel' && (
              <div className="grid gap-2 col-span-2">
                <Label className="text-xs font-semibold text-muted-foreground">Target Channel ID</Label>
                <Input value={formData.target_channel} onChange={e => setFormData({...formData, target_channel: e.target.value})} className="h-10 rounded-[10px]" />
              </div>
            )}

            <div className="grid gap-2 col-span-2 mt-2">
              <Label className="text-xs font-semibold text-muted-foreground">Configuration (JSON)</Label>
              <Textarea 
                value={formData.config_json} 
                onChange={e => setFormData({...formData, config_json: e.target.value})}
                className="min-h-[120px] font-mono text-sm rounded-[10px]"
              />
            </div>

            <div className="col-span-2 flex items-center gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-muted-foreground">
                <Checkbox checked={formData.active} onCheckedChange={checked => setFormData({...formData, active: !!checked})} />
                <span>Active</span>
              </label>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => { setIsCreateOpen(false); setEditingPolicy(null); }} className="h-10 rounded-[10px] text-sm font-semibold">Cancel</Button>
            <Button onClick={editingPolicy ? handleUpdate : handleCreate} disabled={createMutation.isPending || updateMutation.isPending} className="h-10 rounded-[10px] text-sm font-semibold">
              {editingPolicy ? 'Save Changes' : 'Create Policy'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deletingPolicyId !== null} onOpenChange={(open) => !open && setDeletingPolicyId(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-semibold text-red-500">
              <AlertTriangle className="w-5 h-5" /> 
              <span>Delete Security Policy</span>
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground leading-relaxed py-2">
            Are you sure you want to delete this policy? This may immediately alter authentication behaviors or rate limits.
          </p>
          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            <Button variant="outline" onClick={() => setDeletingPolicyId(null)} className="h-10 rounded-[10px] text-sm font-semibold">Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending} className="h-10 rounded-[10px] text-sm font-semibold">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  );
}

export default AdminSecurityPoliciesPage;
