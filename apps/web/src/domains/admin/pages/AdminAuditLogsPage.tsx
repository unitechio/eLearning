import React, { useState } from 'react';
import { useAmsAuditLogs } from '@/domains/admin/api/ams';
import { useCleanupAuditLogs } from '@/domains/admin/api/platform';
import { History, Trash2, FileSearch } from 'lucide-react';
import { AdminPageLayout, AdminDataTable, type AdminColumnDef } from '@/shared/components/admin';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/shared/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils';

interface AuditLog {
  id: string | number;
  created_at: string;
  username: string;
  action: string;
  resource: string;
  resource_id?: string;
  ip_address: string;
  allowed: boolean;
}

export function AdminAuditLogsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [retentionDays, setRetentionDays] = useState(90);

  const { data: listData, isLoading, error } = useAmsAuditLogs({
    page,
    page_size: 15,
    q: search || undefined
  });

  const cleanupMutation = useCleanupAuditLogs();

  const handleCleanup = async () => {
    try {
      await cleanupMutation.mutateAsync(retentionDays);
      toast.success(`Successfully cleaned up logs older than ${retentionDays} days`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to cleanup audit logs');
    }
  };

  const auditLogs = (listData?.data || []) as unknown as AuditLog[];
  const total = listData?.total || 0;
  const totalPages = Math.ceil(total / 15);

  const headerAction = (
    <div className="flex items-center gap-2">
      <Label htmlFor="retention-days" className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Retention Days:</Label>
      <Input
        id="retention-days"
        type="number"
        min={1}
        value={retentionDays}
        onChange={(e) => setRetentionDays(Number(e.target.value))}
        className="w-16 h-8 bg-slate-50/50 border-[#EAECF0] dark:border-[#1E1F22] text-xs font-semibold"
      />
      <Button
        type="button"
        onClick={handleCleanup}
        disabled={cleanupMutation.isPending}
        className="h-8 rounded-[10px] text-xs font-semibold shrink-0"
      >
        <Trash2 className="w-3.5 h-3.5 mr-1" />
        {cleanupMutation.isPending ? 'Cleaning...' : 'Cleanup logs'}
      </Button>
    </div>
  );

  const columns: AdminColumnDef<AuditLog>[] = [
    {
      header: 'Timestamp',
      cell: (log) => (
        <span className="text-xs text-muted-foreground">
          {new Date(log.created_at).toLocaleString()}
        </span>
      ),
      className: 'w-[180px]',
    },
    {
      header: 'Username',
      cell: (log) => <span className="font-semibold text-foreground">{log.username}</span>,
    },
    {
      header: 'Action',
      cell: (log) => (
        <span className="font-mono text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded text-muted-foreground">
          {log.action}
        </span>
      ),
    },
    {
      header: 'Resource',
      cell: (log) => (
        <Badge variant="outline" className="text-[11px] font-medium border-border/80 text-muted-foreground">
          {log.resource}
        </Badge>
      ),
    },
    {
      header: 'Resource ID',
      cell: (log) => (
        <span className="font-mono text-xs text-muted-foreground truncate max-w-[120px] inline-block">
          {log.resource_id || '-'}
        </span>
      ),
    },
    {
      header: 'IP Address',
      cell: (log) => <span className="font-mono text-xs text-muted-foreground">{log.ip_address}</span>,
    },
    {
      header: 'Status',
      cell: (log) => (
        <Badge className={cn("text-[11px] font-semibold", log.allowed ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-transparent' : 'bg-red-500/10 text-red-600 dark:text-red-400 border-transparent')}>
          {log.allowed ? 'Allowed' : 'Denied'}
        </Badge>
      ),
    },
  ];

  return (
    <AdminPageLayout
      title="Audit Logs"
      description="Browse current platform system events, operator actions, and sensitive security audit traces."
      icon={History}
      action={headerAction}
    >
      <AdminDataTable
        data={auditLogs}
        columns={columns}
        isLoading={isLoading}
        error={error}
        searchTerm={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        searchPlaceholder="Search audit trail..."
        emptyTitle="No audit logs captured"
        emptyDescription="No platform system events matched your current search criteria."
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
    </AdminPageLayout>
  );
}

export default AdminAuditLogsPage;
