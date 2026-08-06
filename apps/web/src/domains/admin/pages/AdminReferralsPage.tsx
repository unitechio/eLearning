import React, { useState } from 'react';
import { Heart, Send, Copy, Check, Users, Gift, Share2 } from 'lucide-react';
import { AdminPageLayout, AdminDataTable, AdminStatusBadge, type AdminColumnDef } from '@/shared/components/admin';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils';

type ReferralItem = {
  id: string;
  name: string;
  email: string;
  date: string;
  status: 'pending' | 'activated' | 'failed';
  reward: string;
};

const mockReferrals: ReferralItem[] = [
  { id: '1', name: 'Albus Dumbledore', email: 'albus@hogwarts.edu', date: 'Jan 15, 2027', status: 'activated', reward: '20% discount applied' },
  { id: '2', name: 'Minerva McGonagall', email: 'minerva@hogwarts.edu', date: 'Jan 20, 2027', status: 'activated', reward: '$50.00 credit' },
  { id: '3', name: 'Severus Snape', email: 'severus@potions.academy', date: 'Jan 25, 2027', status: 'pending', reward: 'Pending activation' },
  { id: '4', name: 'Rubeus Hagrid', email: 'hagrid@careofcreatures.org', date: 'Jan 28, 2027', status: 'failed', reward: 'Expired / Invalid' },
];

export function AdminReferralsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://eenglish.org/join?ref=admin_38a2");
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setInviteEmail('');
      setInviteName('');
      toast.success(`Invitation sent successfully to ${inviteEmail}`);
    }, 1000);
  };

  const columns: AdminColumnDef<ReferralItem>[] = [
    {
      header: 'Referree Name',
      cell: (item) => (
        <span className="font-semibold text-foreground text-xs">{item.name}</span>
      ),
    },
    {
      header: 'Email',
      cell: (item) => (
        <span className="text-muted-foreground font-mono text-[11px]">{item.email}</span>
      ),
    },
    {
      header: 'Date Invited',
      cell: (item) => <span className="text-muted-foreground">{item.date}</span>,
    },
    {
      header: 'Status',
      cell: (item) => {
        let state = 'active';
        if (item.status === 'pending') state = 'pending';
        if (item.status === 'failed') state = 'failed';
        return <AdminStatusBadge state={state} label={item.status} />;
      },
    },
    {
      header: 'Reward Earned',
      cell: (item) => (
        <span className={cn(
          "font-semibold text-xs",
          item.status === 'activated' ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
        )}>
          {item.reward}
        </span>
      ),
    },
  ];

  const filteredReferrals = mockReferrals.filter(ref =>
    ref.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ref.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminPageLayout
      title="Referrals & Rewards"
      description="Invite fellow language center operators and school administrators to eEnglish. Earn subscription credits."
      icon={Heart}
    >
      {/* Top statistics Row */}
      <section className="grid gap-4 sm:grid-cols-3 w-full" aria-label="Referral metrics row">
        <article className="p-5 border border-border/80 bg-card rounded-2xl shadow-2xs flex flex-col justify-between h-28">
          <header className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Total Referred</span>
            <Users className="h-4 w-4 text-muted-foreground" />
          </header>
          <div className="mt-2">
            <p className="text-2xl font-black text-foreground">14 signups</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">+3 this month</p>
          </div>
        </article>

        <article className="p-5 border border-border/80 bg-card rounded-2xl shadow-2xs flex flex-col justify-between h-28">
          <header className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Conversion Rate</span>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </header>
          <div className="mt-2">
            <p className="text-2xl font-black text-foreground">78.5%</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">Above industry average</p>
          </div>
        </article>

        <article className="p-5 border border-border/80 bg-card rounded-2xl shadow-2xs flex flex-col justify-between h-28 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 border-indigo-500/15">
          <header className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-500">Rewards Earned</span>
            <Gift className="h-4 w-4 text-indigo-500" />
          </header>
          <div className="mt-2">
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">$560.00 USD</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">Applied to your next billing invoices</p>
          </div>
        </article>
      </section>

      {/* Main panel - 2 Columns */}
      <div className="grid gap-6 lg:gap-8 xl:grid-cols-3 w-full items-start">
        {/* Left column: Direct sharing link and form */}
        <section className="xl:col-span-1 space-y-6">
          {/* Share Box */}
          <article className="p-5 border border-border/80 bg-card rounded-2xl shadow-2xs space-y-4">
            <header>
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-[0.12em] text-muted-foreground">Share Invite Link</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Copy and send this unique referral link to operators.</p>
            </header>
            <div className="flex gap-2">
              <Input
                readOnly
                value="https://eenglish.org/join?ref=admin_38a2"
                className="h-10 border-border/60 bg-muted/20 rounded-[10px] text-xs font-mono text-muted-foreground"
              />
              <Button
                type="button"
                onClick={handleCopyLink}
                className="h-10 px-3 shrink-0 rounded-[10px] text-xs font-semibold gap-1.5"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </Button>
            </div>
          </article>

          {/* Email Invite form */}
          <article className="p-5 border border-border/80 bg-card rounded-2xl shadow-2xs">
            <header className="mb-4">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-[0.12em] text-muted-foreground">Invite via Email</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">We will send a welcome onboarding guide to their inbox.</p>
            </header>
            <form onSubmit={handleSendInvite} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="ref-name" className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/80">Operator Name</Label>
                <Input
                  id="ref-name"
                  placeholder="John Smith"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="h-10 border-border/60 rounded-[10px] text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ref-mail" className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/80">Email Address</Label>
                <Input
                  id="ref-mail"
                  type="email"
                  required
                  placeholder="name@school.edu"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="h-10 border-border/60 rounded-[10px] text-xs"
                />
              </div>

              <Button
                type="submit"
                disabled={isSending || !inviteEmail}
                className="w-full h-10 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-[10px] shadow-sm gap-1.5 text-xs mt-2"
              >
                {isSending ? (
                  "Sending invitation..."
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Send Invitation</span>
                  </>
                )}
              </Button>
            </form>
          </article>
        </section>

        {/* Right column: Recent invitations table */}
        <section className="xl:col-span-2">
          <AdminDataTable
            data={filteredReferrals}
            columns={columns}
            isLoading={false}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search referred users..."
            emptyTitle="No referrals found"
            emptyDescription="You haven't referred any users yet. Try copying your referral link or sending an email invite."
          />
        </section>
      </div>
    </AdminPageLayout>
  );
}

export default AdminReferralsPage;
