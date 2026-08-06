import React, { useState } from 'react';
import { 
  AdminPageLayout, AdminCard, AdminCardContent, AdminDataTable, type AdminColumnDef 
} from '@/shared/components/admin';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/ui/dialog';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Plus, Edit, Trash2, AlertTriangle, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { 
  useAmsSSOProviders, useCreateAmsSSOProvider, useUpdateAmsSSOProvider, useDeleteAmsSSOProvider 
} from '@/domains/admin/api/ams';
import { cn } from '@/shared/lib/utils';

interface SSOProvider {
  id: number;
  provider_id: string;
  name: string;
  type: 'oidc' | 'saml';
  client_id?: string;
  client_secret?: string;
  authorize_url?: string;
  token_url?: string;
  user_info_url?: string;
  redirect_uri?: string;
  scope?: string;
  saml_login_url?: string;
  enabled: boolean;
  allow_auto_provision: boolean;
}

export function AdminSSOProvidersPage() {
  const { data: providersResponse, isLoading, error } = useAmsSSOProviders();
  const createMutation = useCreateAmsSSOProvider();
  const updateMutation = useUpdateAmsSSOProvider();
  const deleteMutation = useDeleteAmsSSOProvider();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<SSOProvider | null>(null);
  const [deletingProviderId, setDeletingProviderId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    provider_id: '',
    name: '',
    type: 'oidc' as 'oidc' | 'saml',
    client_id: '',
    client_secret: '',
    authorize_url: '',
    token_url: '',
    user_info_url: '',
    redirect_uri: '',
    scope: '',
    saml_login_url: '',
    enabled: true,
    allow_auto_provision: true
  });

  const resetForm = () => {
    setFormData({
      provider_id: '',
      name: '',
      type: 'oidc',
      client_id: '',
      client_secret: '',
      authorize_url: '',
      token_url: '',
      user_info_url: '',
      redirect_uri: '',
      scope: '',
      saml_login_url: '',
      enabled: true,
      allow_auto_provision: true
    });
  };

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync({
        provider_id: formData.provider_id,
        name: formData.name,
        type: formData.type,
        client_id: formData.client_id,
        client_secret: formData.client_secret || undefined,
        authorize_url: formData.authorize_url || undefined,
        token_url: formData.token_url || undefined,
        user_info_url: formData.user_info_url || undefined,
        redirect_uri: formData.redirect_uri || undefined,
        scope: formData.scope || undefined,
        saml_login_url: formData.saml_login_url || undefined,
        enabled: formData.enabled,
        allow_auto_provision: formData.allow_auto_provision
      });
      toast.success('SSO provider created successfully');
      setIsCreateOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create provider');
    }
  };

  const handleUpdate = async () => {
    if (!editingProvider) return;
    try {
      await updateMutation.mutateAsync({
        id: editingProvider.id,
        payload: {
          provider_id: formData.provider_id,
          name: formData.name,
          type: formData.type,
          client_id: formData.client_id,
          client_secret: formData.client_secret || undefined,
          authorize_url: formData.authorize_url || undefined,
          token_url: formData.token_url || undefined,
          user_info_url: formData.user_info_url || undefined,
          redirect_uri: formData.redirect_uri || undefined,
          scope: formData.scope || undefined,
          saml_login_url: formData.saml_login_url || undefined,
          enabled: formData.enabled,
          allow_auto_provision: formData.allow_auto_provision
        }
      });
      toast.success('SSO provider updated successfully');
      setEditingProvider(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update provider');
    }
  };

  const handleDelete = async () => {
    if (deletingProviderId === null) return;
    try {
      await deleteMutation.mutateAsync(deletingProviderId);
      toast.success('SSO provider deleted');
      setDeletingProviderId(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete provider');
    }
  };

  const toggleEnabled = async (provider: SSOProvider) => {
    try {
      await updateMutation.mutateAsync({
        id: provider.id,
        payload: { enabled: !provider.enabled }
      });
      toast.success(`Provider ${!provider.enabled ? 'enabled' : 'disabled'}`);
    } catch (err: any) {
      toast.error('Failed to toggle provider status');
    }
  };

  const providers = (providersResponse || []) as SSOProvider[];

  const columns: AdminColumnDef<SSOProvider>[] = [
    {
      header: 'Provider ID',
      cell: (provider) => <span className="font-mono text-xs text-muted-foreground">{provider.provider_id}</span>,
      className: 'w-[180px]',
    },
    {
      header: 'Name',
      cell: (provider) => <span className="font-semibold text-foreground">{provider.name}</span>,
    },
    {
      header: 'Type',
      cell: (provider) => (
        <Badge variant="outline" className="text-[11px] font-medium border-border/80 text-muted-foreground uppercase">
          {provider.type}
        </Badge>
      ),
    },
    {
      header: 'Auto-provision',
      cell: (provider) => (
        provider.allow_auto_provision ? (
          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-transparent"><Check className="w-3.5 h-3.5 mr-1" /> Yes</Badge>
        ) : (
          <span className="text-slate-400 dark:text-slate-600"><X className="w-3.5 h-3.5" /></span>
        )
      ),
    },
    {
      header: 'Status',
      cell: (provider) => (
        <button 
          type="button"
          onClick={() => toggleEnabled(provider)}
          className="focus:outline-none"
        >
          <Badge className={cn("text-[11px] font-semibold cursor-pointer border-transparent hover:bg-opacity-80", provider.enabled ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-slate-500/10 text-slate-500')}>
            {provider.enabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </button>
      ),
    },
    {
      header: 'Actions',
      cell: (provider) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => {
            setFormData({
              provider_id: provider.provider_id,
              name: provider.name,
              type: provider.type,
              client_id: provider.client_id || '',
              client_secret: '', 
              authorize_url: provider.authorize_url || '',
              token_url: provider.token_url || '',
              user_info_url: provider.user_info_url || '',
              redirect_uri: provider.redirect_uri || '',
              scope: provider.scope || '',
              saml_login_url: provider.saml_login_url || '',
              enabled: provider.enabled,
              allow_auto_provision: provider.allow_auto_provision
            });
            setEditingProvider(provider);
          }}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => setDeletingProviderId(provider.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
      className: 'text-right w-[120px]',
    },
  ];

  const rightActions = (
    <Button onClick={() => { resetForm(); setIsCreateOpen(true); }} className="h-10 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-3 text-xs gap-1.5 rounded-[10px] shadow-sm shrink-0">
      <Plus className="w-4 h-4" /> Add Provider
    </Button>
  );

  return (
    <AdminPageLayout
      title="SSO Providers"
      description="Configure federated single sign-on (SAML 2.0 / OpenID Connect) enterprise integrations."
      icon={Plus}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <AdminCard>
          <AdminCardContent className="p-4">
            <div className="text-xs font-semibold text-muted-foreground">Total Providers</div>
            <div className="text-xl font-bold mt-1 tabular-nums">{providers.length}</div>
          </AdminCardContent>
        </AdminCard>
        <AdminCard>
          <AdminCardContent className="p-4">
            <div className="text-xs font-semibold text-muted-foreground">OIDC Connectors</div>
            <div className="text-xl font-bold mt-1 tabular-nums">{providers.filter(p => p.type === 'oidc').length}</div>
          </AdminCardContent>
        </AdminCard>
        <AdminCard>
          <AdminCardContent className="p-4">
            <div className="text-xs font-semibold text-muted-foreground">SAML 2.0 Links</div>
            <div className="text-xl font-bold mt-1 tabular-nums">{providers.filter(p => p.type === 'saml').length}</div>
          </AdminCardContent>
        </AdminCard>
        <AdminCard>
          <AdminCardContent className="p-4">
            <div className="text-xs font-semibold text-muted-foreground">Active Connectors</div>
            <div className="text-xl font-bold mt-1 tabular-nums">{providers.filter(p => p.enabled).length}</div>
          </AdminCardContent>
        </AdminCard>
      </div>

      <AdminDataTable
        data={providers}
        columns={columns}
        isLoading={isLoading}
        error={error}
        rightActions={rightActions}
        emptyTitle="No SSO providers configured"
        emptyDescription="Set up your enterprise SAML/OIDC identity providers to enable Single Sign-On."
      />

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateOpen || !!editingProvider} onOpenChange={(open) => {
        if (!open) { setIsCreateOpen(false); setEditingProvider(null); }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">{editingProvider ? 'Edit Provider' : 'Add Provider'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 grid gap-2">
              <Label className="text-xs font-semibold text-muted-foreground">Name</Label>
              <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Google Workspace" className="h-10 rounded-[10px]" />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-semibold text-muted-foreground">Provider ID</Label>
              <Input value={formData.provider_id} onChange={e => setFormData({...formData, provider_id: e.target.value})} placeholder="e.g. google" disabled={!!editingProvider} className="h-10 rounded-[10px]" />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-semibold text-muted-foreground">Type</Label>
              <Select value={formData.type} onValueChange={(val) => setFormData({...formData, type: val as 'oidc' | 'saml'})}>
                <SelectTrigger className="h-10 rounded-[10px]"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="oidc">OpenID Connect (OIDC)</SelectItem>
                  <SelectItem value="saml">SAML 2.0</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.type === 'oidc' ? (
              <>
                <div className="col-span-2 grid gap-1 mt-4 border-b border-border/40 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">OIDC Settings</h3>
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs font-semibold text-muted-foreground">Client ID</Label>
                  <Input value={formData.client_id} onChange={e => setFormData({...formData, client_id: e.target.value})} className="h-10 rounded-[10px]" />
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs font-semibold text-muted-foreground">Client Secret</Label>
                  <Input type="password" value={formData.client_secret} onChange={e => setFormData({...formData, client_secret: e.target.value})} placeholder={editingProvider ? "Leave blank to keep existing" : ""} className="h-10 rounded-[10px]" />
                </div>
                <div className="col-span-2 grid gap-2">
                  <Label className="text-xs font-semibold text-muted-foreground">Authorize URL</Label>
                  <Input value={formData.authorize_url} onChange={e => setFormData({...formData, authorize_url: e.target.value})} className="h-10 rounded-[10px]" />
                </div>
                <div className="col-span-2 grid gap-2">
                  <Label className="text-xs font-semibold text-muted-foreground">Token URL</Label>
                  <Input value={formData.token_url} onChange={e => setFormData({...formData, token_url: e.target.value})} className="h-10 rounded-[10px]" />
                </div>
                <div className="col-span-2 grid gap-2">
                  <Label className="text-xs font-semibold text-muted-foreground">User Info URL</Label>
                  <Input value={formData.user_info_url} onChange={e => setFormData({...formData, user_info_url: e.target.value})} className="h-10 rounded-[10px]" />
                </div>
                <div className="col-span-2 grid gap-2">
                  <Label className="text-xs font-semibold text-muted-foreground">Requested Scopes</Label>
                  <Input value={formData.scope} onChange={e => setFormData({...formData, scope: e.target.value})} placeholder="openid profile email" className="h-10 rounded-[10px]" />
                </div>
              </>
            ) : (
              <>
                <div className="col-span-2 grid gap-1 mt-4 border-b border-border/40 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">SAML 2.0 Settings</h3>
                </div>
                <div className="col-span-2 grid gap-2">
                  <Label className="text-xs font-semibold text-muted-foreground">SAML Login URL (IdP SSO URL)</Label>
                  <Input value={formData.saml_login_url} onChange={e => setFormData({...formData, saml_login_url: e.target.value})} className="h-10 rounded-[10px]" />
                </div>
              </>
            )}

            <div className="col-span-2 flex items-center gap-6 mt-4">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-muted-foreground">
                <Checkbox checked={formData.enabled} onCheckedChange={checked => setFormData({...formData, enabled: !!checked})} />
                <span>Enabled</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-muted-foreground">
                <Checkbox checked={formData.allow_auto_provision} onCheckedChange={checked => setFormData({...formData, allow_auto_provision: !!checked})} />
                <span>Allow Auto-Provisioning</span>
              </label>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => { setIsCreateOpen(false); setEditingProvider(null); }} className="h-10 rounded-[10px] text-sm font-semibold">Cancel</Button>
            <Button onClick={editingProvider ? handleUpdate : handleCreate} disabled={createMutation.isPending || updateMutation.isPending} className="h-10 rounded-[10px] text-sm font-semibold">
              {editingProvider ? 'Save Changes' : 'Add Provider'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deletingProviderId !== null} onOpenChange={(open) => !open && setDeletingProviderId(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-semibold text-red-500">
              <AlertTriangle className="w-5 h-5" /> 
              <span>Delete SSO Provider</span>
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground leading-relaxed py-2">
            Are you sure you want to delete this identity provider? Users will no longer be able to log in using this integration.
          </p>
          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            <Button variant="outline" onClick={() => setDeletingProviderId(null)} className="h-10 rounded-[10px] text-sm font-semibold">Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending} className="h-10 rounded-[10px] text-sm font-semibold">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  );
}

export default AdminSSOProvidersPage;
