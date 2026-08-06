import React, { useState } from 'react';
import {
  AlarmClock,
  Clock,
  Copy,
  CreditCard,
  Edit2,
  Headphones,
  History,
  Phone,
  PhoneCall,
  X,
} from 'lucide-react';
import { 
  AdminPageLayout, AdminCard, AdminCardContent, AdminDataTable, type AdminColumnDef 
} from '@/shared/components/admin';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet";
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Badge } from '@/shared/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils';

export interface CallLog {
  id: string;
  type: string;
  duration: string;
  outcome: 'Customer Ended Call' | 'Silence Timeout' | 'Completed';
  callFlow: string;
  timeDate: string;
  summary: string;
}

const DEFAULT_CALLS: CallLog[] = [
  {
    id: '1',
    type: 'Web Call',
    duration: '01:11',
    outcome: 'Customer Ended Call',
    callFlow: 'Answer business questions',
    timeDate: '07:32 PM Jun 26, 2026',
    summary: 'The assistant repeatedly asked the caller what they wanted to know about pricing...',
  },
  {
    id: '2',
    type: 'Web Call',
    duration: '02:12',
    outcome: 'Silence Timeout',
    callFlow: 'Greeting Hangup',
    timeDate: '03:36 PM Jun 25, 2026',
    summary: 'The assistant exchanged brief farewell messages, ending after 2 minutes of silence...',
  },
  {
    id: '3',
    type: 'Web Call',
    duration: '03:33',
    outcome: 'Customer Ended Call',
    callFlow: 'End Call',
    timeDate: '12:52 PM Jun 24, 2026',
    summary: 'The assistant asked the caller how it could help and twice answered questions...',
  },
  {
    id: '4',
    type: 'Web Call',
    duration: '02:12',
    outcome: 'Silence Timeout',
    callFlow: 'Greeting Hangup',
    timeDate: '10:41 AM Jun 23, 2026',
    summary: 'The assistant repeatedly asked the caller what question they had regarding billing...',
  },
  {
    id: '5',
    type: 'Web Call',
    duration: '01:14',
    outcome: 'Silence Timeout',
    callFlow: 'Answer business questions',
    timeDate: '08:32 PM Jun 21, 2026',
    summary: 'The assistant repeatedly prompted the caller to ask a question about course content...',
  },
  {
    id: '6',
    type: 'Web Call',
    duration: '01:14',
    outcome: 'Silence Timeout',
    callFlow: 'Greeting Hangup',
    timeDate: '08:32 PM Jun 21, 2026',
    summary: 'The assistant repeatedly prompted the caller to ask a question about account setup...',
  },
  {
    id: '7',
    type: 'Web Call',
    duration: '02:12',
    outcome: 'Silence Timeout',
    callFlow: 'Answer business questions',
    timeDate: '11:36 PM Jun 20, 2026',
    summary: 'The assistant repeatedly prompted the caller for their question, but connection dropped...',
  },
];

export function AdminCallHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [billDrawerOpen, setBillDrawerOpen] = useState(false);
  const [cashModalOpen, setCashModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('435.00');

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(DEFAULT_CALLS.map((b) => b.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const columns: AdminColumnDef<CallLog>[] = [
    {
      header: '',
      cell: (call) => (
        <Checkbox
          checked={selectedIds.includes(call.id)}
          onCheckedChange={(checked) => toggleSelectOne(call.id, !!checked)}
          aria-label={`Select call ${call.id}`}
        />
      ),
      className: 'w-10 pl-4',
    },
    {
      header: 'Type',
      cell: (call) => (
        <span className="font-semibold text-foreground">{call.type}</span>
      ),
    },
    {
      header: 'Duration',
      cell: (call) => <span className="font-mono text-xs text-muted-foreground">{call.duration}</span>,
    },
    {
      header: 'Outcome',
      cell: (call) => (
        <Badge className={cn(
          "text-[10px] font-bold border-transparent capitalize",
          call.outcome === 'Completed' && 'bg-green-500/10 text-green-600 dark:text-green-400',
          call.outcome === 'Silence Timeout' && 'bg-slate-100 text-slate-600 dark:bg-slate-900',
          call.outcome === 'Customer Ended Call' && 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400'
        )}>
          {call.outcome}
        </Badge>
      ),
    },
    {
      header: 'Call Flow',
      cell: (call) => <span className="font-semibold text-foreground/80">{call.callFlow}</span>,
    },
    {
      header: 'Time & Date',
      cell: (call) => <span className="font-mono text-xs text-muted-foreground">{call.timeDate}</span>,
    },
    {
      header: 'Summary',
      cell: (call) => (
        <span className="text-muted-foreground truncate max-w-xs inline-block" title={call.summary}>
          {call.summary}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (call) => (
        <div className="flex items-center justify-end gap-1 pr-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => toast.success('Note editor opened')}><Edit2 className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => { navigator.clipboard.writeText(call.summary); toast.success('Copied transcript'); }}><Copy className="h-3.5 w-3.5" /></Button>
        </div>
      ),
      className: 'text-right w-[100px]',
    },
  ];

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => setBillDrawerOpen(true)}
        className="h-10 text-xs font-semibold text-red-500 border-red-500/20 hover:bg-red-500/10 rounded-[10px]"
      >
        <CreditCard className="h-4 w-4 mr-1.5" />
        <span>Pay Bill ($435.00)</span>
      </Button>
    </div>
  );

  return (
    <AdminPageLayout
      title="Call History"
      description="Browse real-time agent transcripts, outcomes, voice logs, and customer interactions."
      icon={Phone}
      action={headerActions}
    >
      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 w-full">
        {[
          { label: 'Total Calls', value: '370', change: '↑ +24.3%', note: 'Last 7 days', icon: Phone },
          { label: 'Answered Calls', value: '210', change: '↑ +67.2%', note: 'Total answered', icon: PhoneCall },
          { label: 'Avg. Duration', value: '02:13', change: '↓ +12.5%', note: 'Average call length', icon: Clock },
          { label: 'Silence Timeout', value: '67', change: '↑ +25.2%', note: 'Timeouts', icon: AlarmClock },
          { label: 'Customer Ended', value: '76', change: '↑ +37.5%', note: 'Self hangup', icon: Headphones },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <AdminCard key={card.label}>
              <AdminCardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground">{card.label}</span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 border border-border/80">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold tracking-tight text-foreground">{card.value}</span>
                  <span className="text-[10px] font-semibold text-green-600 dark:text-green-400">{card.change}</span>
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground">{card.note}</p>
              </AdminCardContent>
            </AdminCard>
          );
        })}
      </div>

      <AdminDataTable
        data={DEFAULT_CALLS}
        columns={columns}
        isLoading={false}
        searchTerm={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search call notes..."
        emptyTitle="No call records exist"
        emptyDescription="Your voice agents haven't captured any outbound or inbound calls yet."
      />

      {/* Bill Details Drawer */}
      <Sheet open={billDrawerOpen} onOpenChange={setBillDrawerOpen}>
        <SheetContent className="w-full max-w-md bg-white p-6 shadow-2xl dark:bg-[#09090b] border-l border-border/80 flex flex-col justify-between overflow-y-auto">
          <div>
            <SheetHeader className="pb-4 border-b border-border/60">
              <div className="flex items-center justify-between w-full">
                <div>
                  <SheetTitle className="text-base font-bold text-foreground">Bill ID #BILL00124</SheetTitle>
                  <span className="text-xs font-bold text-red-500">UNPAID</span>
                </div>
                <Button variant="outline" className="h-8 text-xs font-semibold gap-1 rounded-lg">
                  <History className="h-3.5 w-3.5" /> History
                </Button>
              </div>
            </SheetHeader>

            <div className="mt-6 space-y-4 text-xs">
              <div>
                <span className="block text-muted-foreground font-semibold mb-1">BILL TO</span>
                <p className="font-semibold text-foreground text-[13px]">Esther Howard</p>
                <p className="text-muted-foreground leading-relaxed mt-0.5">Jl. Pulo Raya V No.14, Kebayoran Baru, Jakarta Selatan 12170</p>
              </div>

              {/* Bill Items */}
              <div className="rounded-xl border border-border/80 bg-slate-50/30 dark:bg-slate-900/10 p-4">
                <div className="flex justify-between border-b border-border/60 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <span>Item Name</span>
                  <span>Amount</span>
                </div>
                <div className="space-y-2 py-2 text-foreground font-semibold">
                  <div className="flex justify-between">
                    <span>Treatment (2)</span>
                    <span className="font-mono font-medium">$300.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Component used (1)</span>
                    <span className="font-mono font-medium">$120.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medicine (1)</span>
                    <span className="font-mono font-medium">$15.00</span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-1.5 border-t border-border/60 pt-3">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold">$435.00</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span className="font-mono font-semibold">$0.00</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-foreground pt-1">
                  <span>Total</span>
                  <span className="font-mono">$435.00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Selection Options */}
          <div className="mt-6 space-y-2 pt-4 border-t border-border/60">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Select Payment Method
            </span>

            <Button
              type="button"
              variant="outline"
              onClick={() => setCashModalOpen(true)}
              className="w-full h-12 justify-between px-4 rounded-xl border border-border bg-slate-50/50 text-foreground"
            >
              <div className="flex items-center gap-2.5 font-semibold text-xs">
                <span>💵</span>
                <span>Cash</span>
              </div>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 justify-between px-4 rounded-xl border border-border bg-white text-muted-foreground"
            >
              <div className="flex items-center gap-2.5 font-semibold text-xs text-foreground">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span>Credit Card</span>
              </div>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Cash Payment Dialog */}
      <Dialog open={cashModalOpen} onOpenChange={setCashModalOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Cash Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Total Payment</span>
              <span className="text-xl font-bold text-foreground font-mono">$435.00</span>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground" htmlFor="input-amount">Input Amount</Label>
              <Input
                id="input-amount"
                type="text"
                value={`$ ${paymentAmount}`}
                onChange={(e) => setPaymentAmount(e.target.value.replace('$ ', ''))}
                className="h-10 rounded-[10px] font-bold text-sm"
              />

              {/* Quick Presets */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                {['20.00', '30.00', '50.00', '100.00'].map((amt) => (
                  <Button
                    key={amt}
                    type="button"
                    variant="outline"
                    onClick={() => setPaymentAmount(amt)}
                    className="h-8 rounded-lg text-xs font-semibold text-muted-foreground border-border/80"
                  >
                    ${amt}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button
              type="button"
              onClick={() => {
                setCashModalOpen(false);
                setBillDrawerOpen(false);
                toast.success('Bill paid successfully via cash!');
              }}
              className="w-full h-10 rounded-[10px]"
            >
              Pay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  );
}

export default AdminCallHistoryPage;
