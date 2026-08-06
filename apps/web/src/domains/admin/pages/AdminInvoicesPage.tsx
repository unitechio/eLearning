import React, { useState } from 'react';
import { Receipt, CreditCard, Send, Plus, Upload, Landmark } from 'lucide-react';
import { AdminPageLayout, AdminDataTable, AdminStatusBadge, type AdminColumnDef } from '@/shared/components/admin';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

interface BillingInvoice {
  id: string;
  dueDate: string;
  status: 'completed' | 'overdue' | 'not_due_yet';
  recipient: {
    name: string;
    hasCard: boolean;
  };
  amount: string;
  invoiceNo: string;
  lastUpdate: string;
}

interface PaymentRequest {
  id: string;
  createdOn: string;
  contact: {
    name: string;
    avatar: string;
  };
  amount: string;
  status: 'active' | 'canceled';
  account: string;
}

const mockInvoices: BillingInvoice[] = [
  { id: '1', dueDate: 'Oct 28-2026', status: 'completed', recipient: { name: 'Amazon Purchase', hasCard: true }, amount: '$129.00', invoiceNo: '9876543456', lastUpdate: '2026-08-12 11:00 AM' },
  { id: '2', dueDate: 'Oct 28-2026', status: 'overdue', recipient: { name: 'Amazon Purchase', hasCard: true }, amount: '$289.00', invoiceNo: '2345678956', lastUpdate: '2026-08-12 11:00 AM' },
  { id: '3', dueDate: 'Oct 28-2026', status: 'completed', recipient: { name: 'Amazon Purchase', hasCard: true }, amount: '$659.00', invoiceNo: '2345678654', lastUpdate: '2026-08-12 11:00 AM' },
  { id: '4', dueDate: 'Oct 28-2026', status: 'overdue', recipient: { name: 'Amazon Purchase', hasCard: true }, amount: '$289.00', invoiceNo: '2345678956', lastUpdate: '2026-08-12 11:00 AM' },
  { id: '5', dueDate: 'Oct 28-2026', status: 'not_due_yet', recipient: { name: 'Amazon Purchase', hasCard: true }, amount: '$659.00', invoiceNo: '2345678654', lastUpdate: '2026-08-12 11:00 AM' },
  { id: '6', dueDate: 'Oct 28-2026', status: 'completed', recipient: { name: 'Amazon Purchase', hasCard: true }, amount: '$659.00', invoiceNo: '2345678654', lastUpdate: '2026-08-12 11:00 AM' },
  { id: '7', dueDate: 'Oct 28-2026', status: 'completed', recipient: { name: 'Amazon Purchase', hasCard: true }, amount: '$659.00', invoiceNo: '2345678654', lastUpdate: '2026-08-12 11:00 AM' },
  { id: '8', dueDate: 'Oct 28-2026', status: 'not_due_yet', recipient: { name: 'Amazon Purchase', hasCard: true }, amount: '$659.00', invoiceNo: '2345678654', lastUpdate: '2026-08-12 11:00 AM' },
  { id: '9', dueDate: 'Oct 28-2026', status: 'overdue', recipient: { name: 'Amazon Purchase', hasCard: true }, amount: '$289.00', invoiceNo: '2345678956', lastUpdate: '2026-08-12 11:00 AM' },
  { id: '10', dueDate: 'Oct 28-2026', status: 'completed', recipient: { name: 'Amazon Purchase', hasCard: true }, amount: '$659.00', invoiceNo: '2345678654', lastUpdate: '2026-08-12 11:00 AM' },
  { id: '11', dueDate: 'Oct 28-2026', status: 'completed', recipient: { name: 'Amazon Purchase', hasCard: true }, amount: '$659.00', invoiceNo: '2345678654', lastUpdate: '2026-08-12 11:00 AM' },
  { id: '12', dueDate: 'Oct 28-2026', status: 'not_due_yet', recipient: { name: 'Amazon Purchase', hasCard: true }, amount: '$289.00', invoiceNo: '2345678654', lastUpdate: '2026-08-12 11:00 AM' },
];

const mockRequests: PaymentRequest[] = [
  { id: '1', createdOn: 'Oct 28-2026', contact: { name: 'Michael Scott', avatar: 'MS' }, amount: '$129.00', status: 'active', account: 'Checking ...23456' },
  { id: '2', createdOn: 'Oct 28-2026', contact: { name: 'Daniel James', avatar: 'DJ' }, amount: '$289.00', status: 'canceled', account: 'Checking ...23456' },
  { id: '3', createdOn: 'Oct 28-2026', contact: { name: 'David John', avatar: 'DJ' }, amount: '$659.00', status: 'active', account: 'Checking ...23456' },
  { id: '4', createdOn: 'Oct 28-2026', contact: { name: 'Ryan Thomas', avatar: 'RT' }, amount: '$289.00', status: 'canceled', account: 'Checking ...23456' },
  { id: '5', createdOn: 'Oct 28-2026', contact: { name: 'Mark Anthony', avatar: 'MA' }, amount: '$659.00', status: 'canceled', account: 'Checking ...23456' },
  { id: '6', createdOn: 'Oct 28-2026', contact: { name: 'Luke Andrew', avatar: 'LA' }, amount: '$659.00', status: 'active', account: 'Checking ...23456' },
  { id: '7', createdOn: 'Oct 28-2026', contact: { name: 'Leo Thomas', avatar: 'LT' }, amount: '$659.00', status: 'active', account: 'Checking ...23456' },
  { id: '8', createdOn: 'Oct 28-2026', contact: { name: 'Jack William', avatar: 'JW' }, amount: '$659.00', status: 'canceled', account: 'Checking ...23456' },
  { id: '9', createdOn: 'Oct 28-2026', contact: { name: 'Noah James', avatar: 'NJ' }, amount: '$289.00', status: 'canceled', account: 'Checking ...23456' },
  { id: '10', createdOn: 'Oct 28-2026', contact: { name: 'Leo Thomas', avatar: 'LT' }, amount: '$659.00', status: 'active', account: 'Checking ...23456' },
  { id: '11', createdOn: 'Oct 28-2026', contact: { name: 'Oliver James', avatar: 'OJ' }, amount: '$659.00', status: 'active', account: 'Checking ...23456' },
  { id: '12', createdOn: 'Oct 28-2026', contact: { name: 'Matthew Clark', avatar: 'MC' }, amount: '$289.00', status: 'canceled', account: 'Checking ...23456' },
  { id: '13', createdOn: 'Oct 28-2026', contact: { name: 'John Paul', avatar: 'JP' }, amount: '$289.00', status: 'active', account: 'Checking ...23456' },
];

export function AdminInvoicesPage() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'transactions'>('invoices');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');

  const displayTitle = activeTab === 'invoices' ? 'Payments' : 'Requests';
  const displayDesc = 'Manage your accounts, outbound invoices, and live payment settlements.';

  const filteredInvoices = mockInvoices.filter(inv => {
    const matchesSearch = inv.recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) || inv.invoiceNo.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredRequests = mockRequests.filter(req => {
    const matchesSearch = req.contact.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  const invoiceColumns: AdminColumnDef<BillingInvoice>[] = [
    {
      header: '',
      cell: (item) => (
        <Checkbox
          checked={selectedIds.includes(item.id)}
          onCheckedChange={(checked) => handleSelectOne(item.id, !!checked)}
          aria-label={`Select invoice ${item.invoiceNo}`}
        />
      ),
      className: 'w-10 pl-4',
    },
    {
      header: 'Due date',
      cell: (inv) => <span className="text-muted-foreground">{inv.dueDate}</span>,
    },
    {
      header: 'Status',
      cell: (inv) => {
        let state = 'active';
        if (inv.status === 'overdue') state = 'failed';
        if (inv.status === 'not_due_yet') state = 'inactive';
        return <AdminStatusBadge state={state} label={inv.status.replace(/_/g, ' ')} />;
      },
    },
    {
      header: 'Recipient',
      cell: (inv) => (
        <div className="flex items-center gap-2">
          <Landmark className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="font-semibold text-foreground text-xs">{inv.recipient.name}</span>
        </div>
      ),
    },
    {
      header: 'Amount',
      cell: (inv) => <span className="font-bold text-foreground">{inv.amount}</span>,
    },
    {
      header: 'Invoice no',
      cell: (inv) => <span className="text-muted-foreground font-mono text-[11px]">{inv.invoiceNo}</span>,
    },
    {
      header: 'Last Update',
      cell: (inv) => <span className="text-muted-foreground text-[10px] font-medium font-mono">{inv.lastUpdate}</span>,
    },
  ];

  const requestColumns: AdminColumnDef<PaymentRequest>[] = [
    {
      header: '',
      cell: (item) => (
        <Checkbox
          checked={selectedIds.includes(item.id)}
          onCheckedChange={(checked) => handleSelectOne(item.id, !!checked)}
          aria-label={`Select request ${item.id}`}
        />
      ),
      className: 'w-10 pl-4',
    },
    {
      header: 'Created on',
      cell: (req) => <span className="text-muted-foreground">{req.createdOn}</span>,
    },
    {
      header: 'Contact',
      cell: (req) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-7 w-7 border border-border">
            <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
              {req.contact.avatar}
            </AvatarFallback>
          </Avatar>
          <span className="font-semibold text-foreground text-xs">{req.contact.name}</span>
        </div>
      ),
    },
    {
      header: 'Amount',
      cell: (req) => <span className="font-bold text-foreground">{req.amount}</span>,
    },
    {
      header: 'Status',
      cell: (req) => (
        <AdminStatusBadge state={req.status === 'active' ? 'active' : 'failed'} label={req.status} />
      ),
    },
    {
      header: 'Account',
      cell: (req) => <span className="text-muted-foreground font-mono text-[11px]">{req.account}</span>,
    },
  ];

  const tabs = [
    { value: 'invoices' as const, label: 'Payments', icon: Receipt },
    { value: 'transactions' as const, label: 'Requests', icon: CreditCard },
  ];

  // Dynamic header action buttons (Image 5 & 6)
  const headerActions = activeTab === 'invoices' ? (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        className="h-10 rounded-[10px] px-3.5 text-xs font-semibold gap-1.5 border-[#EAECF0] dark:border-[#1E1F22] bg-slate-50/50 text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
      >
        <Send className="h-3.5 w-3.5" />
        <span>Send Money</span>
      </Button>
      <Button
        className="h-10 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-4 text-xs gap-1.5 rounded-[10px] shadow-sm"
      >
        <Upload className="h-3.5 w-3.5" />
        <span>Upload Bill</span>
      </Button>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        className="h-10 rounded-[10px] px-3.5 text-xs font-semibold gap-1.5 border-[#EAECF0] dark:border-[#1E1F22] bg-slate-50/50 text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
      >
        <Plus className="h-3.5 w-3.5" />
        <span>Create Invoice</span>
      </Button>
      <Button
        className="h-10 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-4 text-xs gap-1.5 rounded-[10px] shadow-sm"
      >
        <Send className="h-3.5 w-3.5" />
        <span>Request Payment</span>
      </Button>
    </div>
  );

  const rightActions = (
    <div className="flex items-center gap-2">
      <Select 
        value={statusFilter} 
        onValueChange={(val) => {
          setStatusFilter(val);
          setSelectedIds([]);
        }}
      >
        <SelectTrigger className="w-[150px] h-10 rounded-[10px] text-xs font-semibold bg-slate-50/50">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {activeTab === 'invoices' ? (
            <>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="not_due_yet">Not due yet</SelectItem>
            </>
          ) : (
            <>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <AdminPageLayout
      title={displayTitle}
      description={displayDesc}
      icon={activeTab === 'invoices' ? Receipt : CreditCard}
      action={headerActions}
    >
      {activeTab === 'invoices' ? (
        <AdminDataTable
          data={filteredInvoices}
          columns={invoiceColumns}
          isLoading={false}
          searchTerm={searchTerm}
          onSearchChange={(val) => {
            setSearchTerm(val);
            setSelectedIds([]);
          }}
          searchPlaceholder="Filter by recipient..."
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab as 'invoices' | 'transactions');
            setSelectedIds([]);
            setStatusFilter('all');
            setSearchTerm('');
          }}
          rightActions={rightActions}
          emptyTitle="No payments found"
          emptyDescription="No transaction histories match your current filters."
        />
      ) : (
        <AdminDataTable
          data={filteredRequests}
          columns={requestColumns}
          isLoading={false}
          searchTerm={searchTerm}
          onSearchChange={(val) => {
            setSearchTerm(val);
            setSelectedIds([]);
          }}
          searchPlaceholder="Filter by contact..."
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab as 'invoices' | 'transactions');
            setSelectedIds([]);
            setStatusFilter('all');
            setSearchTerm('');
          }}
          rightActions={rightActions}
          emptyTitle="No requests found"
          emptyDescription="No transaction histories match your current filters."
        />
      )}
    </AdminPageLayout>
  );
}

export default AdminInvoicesPage;
