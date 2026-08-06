import React, { useState } from 'react';
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
import { Textarea } from '@/shared/components/ui/textarea';
import { Search, Plus, Edit, Trash2, Key } from 'lucide-react';
import { toast } from 'sonner';
import { 
  useAmsAuthClients, useCreateAmsAuthClient, useUpdateAmsAuthClient, 
  useDeleteAmsAuthClient, useRotateAmsClientSecret, AmsAuthClient 
} from '@/domains/admin/api/ams';
import { cn } from '@/shared/lib/utils';

export function AdminAuthClientsPage() {
  const [search, setSearch] = useState('');
  const { data: clientsResponse, isLoading, error } = useAmsAuthClients();
  const createMutation = useCreateAmsAuthClient();
  const updateMutation = useUpdateAmsAuthClient();
  const deleteMutation = useDeleteAmsAuthClient();
  const rotateMutation = useRotateAmsClientSecret();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<AmsAuthClient | null>(null);
  const [deletingClientId, setDeletingClientId] = useState<number | null>(null);
  const [rotatingSecretId, setRotatingSecretId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'confidential' as 'confidential' | 'public' | 'service',
    allowed_grants: ['authorization_code'],
    redirect_uris: '',
    allowed_scopes: '',
    pkce_required: true,
    active: true
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'confidential',
      allowed_grants: ['authorization_code'],
      redirect_uris: '',
      allowed_scopes: '',
      pkce_required: true,
      active: true
    });
  };

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync({
        name: formData.name,
        type: formData.type,
        allowed_grants: formData.allowed_grants,
        redirect_uris: formData.redirect_uris.split('\n').filter(Boolean),
        allowed_scopes: formData.allowed_scopes.split(',').map(s => s.trim()).filter(Boolean),
        pkce_required: formData.pkce_required
      });
      toast.success('Auth client created successfully');
      setIsCreateOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create auth client');
    }
  };

  const handleUpdate = async () => {
    if (!editingClient) return;
    try {
      await updateMutation.mutateAsync({
        id: editingClient.id,
        payload: {
          name: formData.name,
          type: formData.type,
          allowed_grants: formData.allowed_grants,
          redirect_uris: formData.redirect_uris.split('\n').filter(Boolean),
          allowed_scopes: formData.allowed_scopes.split(',').map(s => s.trim()).filter(Boolean),
          pkce_required: formData.pkce_required
        }
      });
      toast.success('Auth client updated successfully');
      setEditingClient(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update auth client');
    }
  };

  const handleDelete = async () => {
    if (deletingClientId === null) return;
    try {
      await deleteMutation.mutateAsync(deletingClientId);
      toast.success('Auth client deleted');
      setDeletingClientId(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete client');
    }
  };

  const handleRotateSecret = async () => {
    if (rotatingSecretId === null) return;
    try {
      const res = await rotateMutation.mutateAsync(rotatingSecretId);
      toast.success(`Client secret rotated successfully! New secret: ${res.client_secret || '(hidden)'}`, {
        duration: 8000
      });
      setRotatingSecretId(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to rotate client secret');
    }
  };

  const clients = (clientsResponse?.data || []) as AmsAuthClient[];

  const filteredClients = clients.filter(client => {
    if (!search) return true;
    return client.name.toLowerCase().includes(search.toLowerCase()) || 
           client.client_id.toLowerCase().includes(search.toLowerCase());
  });

  const columns: AdminColumnDef<AmsAuthClient>[] = [
    {
      header: 'Client ID',
      cell: (client) => <span className="font-mono text-xs text-muted-foreground">{client.client_id}</span>,
      className: 'w-[200px]',
    },
    {
      header: 'Name',
      cell: (client) => <span className="font-semibold text-foreground">{client.name}</span>,
    },
    {
      header: 'Type',
      cell: (client) => (
        <Badge variant="outline" className="text-[11px] font-medium border-border/80 text-muted-foreground capitalize">
          {client.type}
        </Badge>
      ),
    },
    {
      header: 'Grants',
      cell: (client) => <span className="text-xs text-muted-foreground">{client.allowed_grants?.join(', ')}</span>,
    },
    {
      header: 'PKCE',
      cell: (client) => (
        client.pkce_required 
          ? <Badge variant="outline" className="text-[10px] text-primary/80 border-primary/20 bg-primary/[0.02]">Required</Badge> 
          : <span className="text-slate-400 dark:text-slate-600">-</span>
      ),
    },
    {
      header: 'Status',
      cell: (client) => (
        <Badge className={cn("text-[11px] font-semibold", client.active ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-transparent' : 'bg-slate-500/10 text-slate-500 border-transparent')}>
          {client.active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (client) => (
        <div className="flex justify-end gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-orange-400 hover:text-orange-500 hover:bg-orange-500/10" 
            onClick={() => setRotatingSecretId(client.id)} 
            title="Rotate Secret"
          >
            <Key className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-foreground" 
            onClick={() => {
              setFormData({
                name: client.name,
                type: client.type,
                allowed_grants: client.allowed_grants || [],
                redirect_uris: client.redirect_uris?.join('\n') || '',
                allowed_scopes: client.allowed_scopes?.join(', ') || '',
                pkce_required: client.pkce_required,
                active: client.active
              });
              setEditingClient(client);
            }}
            title="Edit Client"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10" 
            onClick={() => setDeletingClientId(client.id)}
            title="Delete Client"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
      className: 'text-right w-[120px]',
    },
  ];

  const rightActions = (
    <Button
      type="button"
      onClick={() => { resetForm(); setIsCreateOpen(true); }}
      className="h-10 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-3 text-xs gap-1.5 rounded-[10px] shadow-sm shrink-0"
    >
      <Plus className="h-3.5 w-3.5" />
      <span>Add Client</span>
    </Button>
  );

  return (
    <AdminPageLayout
      title="Auth Clients"
      description="Manage OAuth2 / OpenID Connect application credentials, redirect scopes, and client capabilities."
      icon={Search}
    >
      <AdminDataTable
        data={filteredClients}
        columns={columns}
        isLoading={isLoading}
        error={error}
        searchTerm={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search clients..."
        rightActions={rightActions}
        emptyTitle="No authentication clients found"
        emptyDescription="No registered OAuth2 application clients match your filter criteria."
      />

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateOpen || !!editingClient} onOpenChange={(open) => {
        if (!open) { setIsCreateOpen(false); setEditingClient(null); }
      }}>
        <DialogContent className="max-w-xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">{editingClient ? 'Edit Client' : 'Create Client'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-xs font-semibold text-muted-foreground">Name</Label>
              <Input 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="My Client App" 
                className="h-10 rounded-[10px] text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-semibold text-muted-foreground">Type</Label>
              <Select value={formData.type} onValueChange={(val) => setFormData({...formData, type: val as 'confidential' | 'public' | 'service'})}>
                <SelectTrigger className="h-10 rounded-[10px] text-sm"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public (SPA/Mobile)</SelectItem>
                  <SelectItem value="confidential">Confidential (Web/Backend)</SelectItem>
                  <SelectItem value="service">Service Account</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-semibold text-muted-foreground">Allowed Scopes (comma separated)</Label>
              <Input 
                value={formData.allowed_scopes} 
                onChange={e => setFormData({...formData, allowed_scopes: e.target.value})} 
                placeholder="openid, profile, email" 
                className="h-10 rounded-[10px] text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-semibold text-muted-foreground">Redirect URIs (one per line)</Label>
              <Textarea 
                value={formData.redirect_uris} 
                onChange={e => setFormData({...formData, redirect_uris: e.target.value})}
                placeholder="https://app.example.com/callback"
                className="min-h-[80px] rounded-[10px]"
              />
            </div>
            <div className="flex items-center gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-muted-foreground">
                <Checkbox 
                  checked={formData.pkce_required} 
                  onCheckedChange={checked => setFormData({...formData, pkce_required: !!checked})} 
                />
                <span>Require PKCE</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-muted-foreground">
                <Checkbox 
                  checked={formData.active} 
                  onCheckedChange={checked => setFormData({...formData, active: !!checked})} 
                />
                <span>Active</span>
              </label>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => { setIsCreateOpen(false); setEditingClient(null); }} className="h-10 rounded-[10px] text-sm font-semibold">Cancel</Button>
            <Button onClick={editingClient ? handleUpdate : handleCreate} disabled={createMutation.isPending || updateMutation.isPending} className="h-10 rounded-[10px] text-sm font-semibold">
              {editingClient ? 'Save Changes' : 'Create Client'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deletingClientId !== null} onOpenChange={(open) => { if (!open) setDeletingClientId(null); }}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground leading-relaxed py-2">
            Are you sure you want to delete this auth client? This action is permanent and will revoke access for all applications using this client credential.
          </p>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeletingClientId(null)} className="h-10 rounded-[10px] text-sm font-semibold">Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending} className="h-10 rounded-[10px] text-sm font-semibold">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rotate Secret Confirmation */}
      <Dialog open={rotatingSecretId !== null} onOpenChange={(open) => { if (!open) setRotatingSecretId(null); }}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Rotate Client Secret</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground leading-relaxed py-2">
            Are you sure you want to rotate the secret for this client? Any existing application relying on the current secret will stop working immediately until configured with the new secret.
          </p>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setRotatingSecretId(null)} className="h-10 rounded-[10px] text-sm font-semibold">Cancel</Button>
            <Button onClick={handleRotateSecret} disabled={rotateMutation.isPending} className="h-10 rounded-[10px] text-sm font-semibold">
              Rotate Secret
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  );
}

export default AdminAuthClientsPage;
