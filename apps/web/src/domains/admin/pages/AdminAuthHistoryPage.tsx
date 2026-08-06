import React, { useState } from 'react';
import { 
  AdminPageLayout, AdminDataTable, type AdminColumnDef 
} from '@/shared/components/admin';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/ui/dialog';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { History, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useAmsAuthHistory, useRevokeAmsDevice } from '@/domains/admin/api/ams';
import { cn } from '@/shared/lib/utils';

interface AuthHistoryItem {
  id: number;
  username: string;
  device_name: string;
  ip_address: string;
  user_agent: string;
  trusted: boolean;
  revoked: boolean;
  created_at: string;
}

export function AdminAuthHistoryPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusTab, setStatusTab] = useState<'all' | 'active' | 'revoked'>('all');
  
  const { data: listData, isLoading, error } = useAmsAuthHistory({
    page,
    page_size: 15,
    q: search || undefined,
    revoked: statusTab === 'all' ? undefined : statusTab === 'revoked'
  });

  const revokeMutation = useRevokeAmsDevice();
  const [revokingId, setRevokingId] = useState<number | null>(null);

  const handleRevoke = async () => {
    if (revokingId === null) return;
    try {
      await revokeMutation.mutateAsync(revokingId);
      toast.success('Session revoked successfully');
      setRevokingId(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to revoke session');
    }
  };

  const historyItems = (listData?.data || []) as AuthHistoryItem[];
  const total = listData?.total || 0;
  const totalPages = Math.ceil(total / 15);

  const tabs = [
    { value: 'all', label: 'All History' },
    { value: 'active', label: 'Active Sessions' },
    { value: 'revoked', label: 'Revoked' }
  ];

  const columns: AdminColumnDef<AuthHistoryItem>[] = [
    {
      header: 'Username',
      cell: (item) => <span className="font-semibold text-foreground">{item.username}</span>,
    },
    {
      header: 'Device Name',
      cell: (item) => <span className="text-muted-foreground">{item.device_name}</span>,
    },
    {
      header: 'IP Address',
      cell: (item) => <span className="font-mono text-xs text-muted-foreground">{item.ip_address}</span>,
    },
    {
      header: 'User Agent',
      cell: (item) => (
        <span className="text-xs text-muted-foreground truncate max-w-[200px] inline-block" title={item.user_agent}>
          {item.user_agent}
        </span>
      ),
    },
    {
      header: 'Trusted',
      cell: (item) => (
        <Badge className={cn("text-[11px] font-semibold border-transparent", item.trusted ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400')}>
          {item.trusted ? 'Trusted' : 'Untrusted'}
        </Badge>
      ),
    },
    {
      header: 'Status',
      cell: (item) => (
        <Badge className={cn("text-[11px] font-semibold border-transparent", item.revoked ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-green-500/10 text-green-600 dark:text-green-400')}>
          {item.revoked ? 'Revoked' : 'Active'}
        </Badge>
      ),
    },
    {
      header: 'Signed In',
      cell: (item) => (
        <span className="text-xs text-muted-foreground">
          {new Date(item.created_at).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (item) => (
        <div className="flex justify-end pr-2">
          {!item.revoked && (
            <Button 
              onClick={() => setRevokingId(item.id)}
              variant="outline" 
              size="sm"
              className="h-8 rounded-[10px] text-xs font-semibold text-red-500 border-red-500/20 hover:bg-red-500/10 hover:text-red-600"
            >
              Revoke
            </Button>
          )}
        </div>
      ),
      className: 'text-right w-[100px]',
    },
  ];

  return (
    <AdminPageLayout
      title="Auth History"
      icon={History}
      description="Monitor active user sessions and sign-in logs."
    >
      <AdminDataTable
        data={historyItems}
        columns={columns}
        isLoading={isLoading}
        error={error}
        searchTerm={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        searchPlaceholder="Search by username..."
        emptyTitle="No authentication history records found"
        emptyDescription="No sessions match your search filters."
        tabs={tabs}
        activeTab={statusTab}
        onTabChange={(val) => { setStatusTab(val as any); setPage(1); }}
        pagination={
          totalPages > 1
            ? {
                page,
                totalPages,
                totalItems: total,
                onPageChange: setPage,
              }
            : undefined
        }
      />

      {/* Revoke Confirmation */}
      <Dialog open={revokingId !== null} onOpenChange={(open) => !open && setRevokingId(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-semibold text-red-500">
              <AlertTriangle className="w-5 h-5" />
              <span>Revoke Active Session</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-2 text-xs text-muted-foreground leading-relaxed">
            <p>Are you sure you want to terminate this active session? The user will be immediately signed out from this device.</p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            <Button variant="outline" onClick={() => setRevokingId(null)} className="h-10 rounded-[10px] text-sm font-semibold">Cancel</Button>
            <Button onClick={handleRevoke} variant="destructive" disabled={revokeMutation.isPending} className="h-10 rounded-[10px] text-sm font-semibold">
              {revokeMutation.isPending ? 'Revoking...' : 'Confirm Revoke'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  );
}

export default AdminAuthHistoryPage;
