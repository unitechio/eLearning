import React, { useState } from 'react';
import { 
  AdminPageHeader, AdminCard, AdminCardContent 
} from '@/shared/components/admin';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/ui/dialog';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Monitor, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAmsDevices, useRevokeAmsDevice } from '@/domains/admin/api/ams';

export const AdminDevicesPage = () => {
  const [statusTab, setStatusTab] = useState<'all' | 'trusted' | 'revoked'>('all');
  
  const { data: listData, isLoading } = useAmsDevices({
    revoked: statusTab === 'all' ? undefined : statusTab === 'revoked'
  });

  const revokeMutation = useRevokeAmsDevice();
  const [revokingId, setRevokingId] = useState<number | null>(null);

  const handleRevoke = async () => {
    if (revokingId === null) return;
    try {
      await revokeMutation.mutateAsync(revokingId);
      toast.success('Device revoked successfully');
      setRevokingId(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to revoke device');
    }
  };

  const devices = listData?.data || [];

  const filteredDevices = devices.filter(d => {
    if (statusTab === 'trusted') return d.trusted && !d.revoked;
    return true;
  });

  return (
    <section className="flex flex-col gap-6 p-6">
      <AdminPageHeader 
        title="Trusted Devices"
        icon={Monitor}
        description="Manage secure devices authorized to sign in without step-up authentication."
      />

      <div className="flex gap-4 border-b border-slate-700/50 pb-px">
        {[
          { id: 'all', label: 'All Devices' },
          { id: 'trusted', label: 'Trusted Only' },
          { id: 'revoked', label: 'Revoked' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
              statusTab === tab.id 
                ? 'border-red-500 text-slate-100 font-semibold' 
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : filteredDevices.length === 0 ? (
        <div className="text-center py-12 text-slate-400 bg-slate-900/50 rounded-lg border border-slate-700/50">
          No devices found matching this filter.
        </div>
      ) : (
        <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevices.map(device => (
            <AdminCard key={device.id} className="relative overflow-hidden">
              <AdminCardContent className="p-6 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      {device.device_name}
                    </h3>
                    <div className="font-mono text-[10px] text-slate-500 mt-1 truncate max-w-[200px]" title={device.device_fingerprint}>
                      FP: {device.device_fingerprint}
                    </div>
                  </div>
                  <Monitor className="text-slate-400 w-8 h-8 opacity-60" />
                </div>

                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">IP Address</span>
                    <span className="font-mono text-xs">{device.ip_address}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Trust State</span>
                    <Badge className={device.trusted && !device.revoked ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}>
                      {device.trusted && !device.revoked ? 'Trusted' : 'Untrusted'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Status</span>
                    <Badge className={device.revoked ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}>
                      {device.revoked ? 'Revoked' : 'Active'}
                    </Badge>
                  </div>
                  {device.last_used_at && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Last Used</span>
                      <span className="text-xs text-slate-400">{new Date(device.last_used_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {!device.revoked && (
                  <div className="pt-4 border-t border-slate-700/50 mt-2">
                    <Button 
                      onClick={() => setRevokingId(device.id)}
                      variant="destructive" 
                      className="w-full h-8 rounded-lg flex items-center justify-center gap-2"
                    >
                      <AlertTriangle className="w-4 h-4" /> Revoke Trust
                    </Button>
                  </div>
                )}
              </AdminCardContent>
            </AdminCard>
          ))}
        </article>
      )}

      {/* Revoke Confirmation */}
      <Dialog open={revokingId !== null} onOpenChange={(open) => !open && setRevokingId(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span>Revoke Device Trust</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-300">Are you sure you want to revoke trust for this device? The user will need to confirm authorization on their next sign-in from this browser.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokingId(null)}>Cancel</Button>
            <Button onClick={handleRevoke} variant="destructive" disabled={revokeMutation.isPending}>
              {revokeMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Revoke Trust
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};
