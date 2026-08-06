import React, { useState } from 'react';
import { 
  AdminPageHeader, AdminCard, AdminCardHeader, AdminCardTitle, AdminCardContent 
} from '@/shared/components/admin';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/ui/dialog';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Plus, Edit, Trash2, Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { 
  useAmsLoginChannels, useCreateAmsLoginChannel, useUpdateAmsLoginChannel, useDeleteAmsLoginChannel 
} from '@/domains/admin/api/ams';

export const AdminLoginChannelsPage = () => {
  const { data: channels, isLoading } = useAmsLoginChannels();
  const createMutation = useCreateAmsLoginChannel();
  const updateMutation = useUpdateAmsLoginChannel();
  const deleteMutation = useDeleteAmsLoginChannel();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<any>(null);
  const [deletingChannelId, setDeletingChannelId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    channel_id: '',
    type: 'web',
    enabled: true,
    mfa_required: false
  });

  const resetForm = () => {
    setFormData({
      name: '',
      channel_id: '',
      type: 'web',
      enabled: true,
      mfa_required: false
    });
  };

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync(formData);
      toast.success('Login channel created');
      setIsCreateOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create channel');
    }
  };

  const handleUpdate = async () => {
    if (!editingChannel) return;
    try {
      await updateMutation.mutateAsync({
        id: editingChannel.id,
        payload: formData
      });
      toast.success('Login channel updated');
      setEditingChannel(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update channel');
    }
  };

  const handleDelete = async () => {
    if (deletingChannelId === null) return;
    try {
      await deleteMutation.mutateAsync(deletingChannelId);
      toast.success('Login channel deleted');
      setDeletingChannelId(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete channel');
    }
  };

  const toggleEnabled = async (channel: any) => {
    try {
      await updateMutation.mutateAsync({
        id: channel.id,
        payload: { enabled: !channel.enabled }
      });
      toast.success(`Channel ${!channel.enabled ? 'enabled' : 'disabled'}`);
    } catch (error: any) {
      toast.error('Failed to toggle channel status');
    }
  };

  return (
    <section className="flex flex-col gap-6 p-6">
      <AdminPageHeader 
        title="Login Channels" 
        description="Configure entry points for user authentication."
        action={
          <Button onClick={() => { resetForm(); setIsCreateOpen(true); }} className="h-9">
            <Plus className="w-4 h-4 mr-2" /> New Channel
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading channels...
        </div>
      ) : !channels?.length ? (
        <div className="text-center py-12 text-slate-400 bg-slate-900/50 rounded-xl border border-slate-700/50">
          No login channels configured.
        </div>
      ) : (
        <article className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {channels.map((channel) => (
            <AdminCard key={channel.id} className="relative overflow-hidden group">
              <AdminCardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <AdminCardTitle className="text-lg">{channel.name}</AdminCardTitle>
                    <div className="font-mono text-xs text-slate-400 mt-1">{channel.channel_id}</div>
                  </div>
                  <button 
                    onClick={() => toggleEnabled(channel)}
                    className="focus:outline-none"
                  >
                    <Badge className={channel.enabled ? 'bg-green-500/10 text-green-500 cursor-pointer hover:bg-green-500/20' : 'bg-slate-500/10 text-slate-500 cursor-pointer hover:bg-slate-500/20'}>
                      {channel.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </button>
                </div>
              </AdminCardHeader>
              <AdminCardContent>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Type</span>
                    <Badge variant="outline" className="uppercase text-muted-foreground">{channel.type}</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">MFA</span>
                    {channel.mfa_required ? (
                      <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                        <ShieldCheck className="w-3 h-3 mr-1" /> Required
                      </Badge>
                    ) : (
                      <span className="text-slate-500">Optional</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="h-8" onClick={() => {
                    setFormData({
                      name: channel.name,
                      channel_id: channel.channel_id,
                      type: channel.type,
                      enabled: channel.enabled,
                      mfa_required: channel.mfa_required
                    });
                    setEditingChannel(channel);
                  }}>
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => setDeletingChannelId(channel.id)}>
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </Button>
                </div>
              </AdminCardContent>
            </AdminCard>
          ))}
        </article>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateOpen || !!editingChannel} onOpenChange={(open) => {
        if (!open) { setIsCreateOpen(false); setEditingChannel(null); }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingChannel ? 'Edit Channel' : 'New Channel'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Mobile App" />
            </div>
            <div className="grid gap-2">
              <Label>Channel ID</Label>
              <Input value={formData.channel_id} onChange={e => setFormData({...formData, channel_id: e.target.value})} placeholder="e.g. mobile_ios" disabled={!!editingChannel} className="font-mono text-sm" />
            </div>
            <div className="grid gap-2">
              <Label>Type</Label>
              <Input value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} placeholder="e.g. web, mobile, desktop" />
            </div>
            <div className="flex items-center gap-6 mt-2">
              <Label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.enabled} onChange={e => setFormData({...formData, enabled: e.target.checked})} className="rounded bg-slate-900 border-slate-700" />
                Enabled
              </Label>
              <Label className="flex items-center gap-2 cursor-pointer text-red-400">
                <input type="checkbox" checked={formData.mfa_required} onChange={e => setFormData({...formData, mfa_required: e.target.checked})} className="rounded bg-slate-900 border-red-900" />
                <ShieldCheck className="w-4 h-4" /> Require MFA
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateOpen(false); setEditingChannel(null); }}>Cancel</Button>
            <Button onClick={editingChannel ? handleUpdate : handleCreate} disabled={createMutation.isPending || updateMutation.isPending}>
              {editingChannel ? 'Save Changes' : 'Create Channel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deletingChannelId} onOpenChange={(open) => !open && setDeletingChannelId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="w-5 h-5" /> Delete Channel
            </DialogTitle>
          </DialogHeader>
          <p className="py-4 text-sm text-slate-300">Are you sure you want to delete this channel? Logins from this channel will be rejected.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingChannelId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </section>
  );
};
