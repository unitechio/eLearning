import React, { useState } from 'react';
import {
  Settings, User, Lock, Users, CreditCard, Bell, Cpu, Globe, Check, Info,
  Sliders, Link as LinkIcon, Chrome, Linkedin, Github, X, Plus, Calendar,
  Download, Eye, Trash2, ChevronLeft, ChevronRight, Inbox, HelpCircle
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { Label } from '@/shared/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { cn } from '@/shared/lib/utils';
import { toast } from 'sonner';

// Settings sub-sidebar items matching Screenshot 8
const menuGroups = [
  {
    label: 'Profile',
    items: [
      { id: 'general', label: 'General', icon: User },
      { id: 'edit-profile', label: 'Edit Profile', icon: User },
      { id: 'billings', label: 'Billings', icon: CreditCard },
      { id: 'calendar', label: 'Calendar', icon: Calendar },
    ],
  },
  {
    label: 'Preferences',
    items: [
      { id: 'themes', label: 'Themes', icon: Sliders },
      { id: 'messages', label: 'Message & Media', icon: Bell },
    ],
  },
  {
    label: 'Apps',
    items: [
      { id: 'apps-integration', label: 'Apps Integration', icon: Cpu },
      { id: 'social-media', label: 'Social Media', icon: Globe },
    ],
  },
];

const mockInvoices = [
  { id: 'INV-1002', name: 'Account Sale', date: 'Apr 14, 2004', amount: '$3,050', status: 'Pending', tracking: 'LM580405575CN', address: '313 Main Road, Sunderland' },
  { id: 'INV-1003', name: 'Account Sale', date: 'Jun 24, 2008', amount: '$1,050', status: 'Cancelled', tracking: 'AZ938540353US', address: '96 Grange Road, Peterborough' },
  { id: 'INV-1004', name: 'Netflix Subscription', date: 'Feb 28, 2004', amount: '$800', status: 'Refund', tracking: '3S331605504US', address: '2 New Street, Harrogate' },
];

export const AdminSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('themes');
  const [selectedTheme, setSelectedTheme] = useState<'white' | 'dark' | 'cosmic'>('white');

  // Integrations bindings states matching Screenshot 8
  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [indeedConnected, setIndeedConnected] = useState(false);
  const [githubConnected, setGithubConnected] = useState(true);

  // Billing state inputs matching Screenshot 9
  const [cardName, setCardName] = useState('Mayad Ahmed');
  const [cardExpiry, setCardExpiry] = useState('02 / 2028');
  const [cardNumber, setCardNumber] = useState('8269 9620 9292 2538');
  const [cardCvv, setCardCvv] = useState('••••');
  const [contactEmailOption, setContactEmailOption] = useState<'existing' | 'another'>('existing');

  const handleSaveTheme = () => {
    toast.success('Theme preferences saved');
  };

  const handleSaveBilling = () => {
    toast.success('Billing details updated');
  };

  return (
    <div className="space-y-6 antialiased text-slate-800 dark:text-slate-200 font-inter w-full">
      {/* Page Header */}
      <header className="flex flex-col gap-4 border-b border-slate-100 pb-5 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <nav aria-label="breadcrumb" className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <span>System Config</span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-slate-900 dark:text-slate-100">Settings</span>
          </nav>
          
          <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            Settings
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your account details, workspace preferences, and application themes.
          </p>
        </div>
      </header>

      {/* Main Sub-sidebar Layout matching Screenshot 8 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start w-full">
        {/* Left Sub-sidebar */}
        <aside className="lg:col-span-1 space-y-6" aria-label="Settings Categories Sidebar">
          <nav className="space-y-5" aria-label="Settings categories navigation">
            {menuGroups.map((group, idx) => (
              <div key={idx} className="space-y-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3">
                  {group.label}
                </h4>
                <div className="flex flex-col gap-1">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-colors border-none text-left w-full",
                        activeTab === item.id
                          ? "bg-slate-100 text-slate-900 dark:bg-slate-850 dark:text-white"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:text-slate-200 dark:hover:bg-slate-800/40"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Right Settings panel details */}
        <section className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-6 shadow-sm space-y-6" aria-label="Settings configuration area">
          {/* TAB 1: THEMES AND CONNECTIONS (Screenshot 8) */}
          {activeTab === 'themes' && (
            <div className="space-y-8">
              {/* Select Theme */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">
                    Select Theme
                  </h3>
                  <p className="text-xs text-slate-450 mt-1">
                    Customizing your workspace, make it more enjoyable and comfortable to work! <a href="#" className="text-indigo-650 hover:underline">Create custom theme</a>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Theme 1: White Theme */}
                  <label className={cn(
                    "border rounded-xl p-4 flex flex-col gap-3.5 cursor-pointer transition-all",
                    selectedTheme === 'white' ? "border-indigo-600 ring-2 ring-indigo-50 dark:ring-indigo-950/20" : "border-slate-150 hover:border-slate-300"
                  )}>
                    <div className="h-24 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-150">
                      <span className="text-[10px] font-bold text-slate-500">System (White Theme)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="theme"
                        checked={selectedTheme === 'white'}
                        onChange={() => setSelectedTheme('white')}
                        className="h-4 w-4 border-slate-350 text-indigo-600"
                      />
                      <span className="text-xs font-bold">System (White Theme)</span>
                    </div>
                  </label>

                  {/* Theme 2: Dark Theme */}
                  <label className={cn(
                    "border rounded-xl p-4 flex flex-col gap-3.5 cursor-pointer transition-all",
                    selectedTheme === 'dark' ? "border-indigo-600 ring-2 ring-indigo-50 dark:ring-indigo-950/20" : "border-slate-150 hover:border-slate-300"
                  )}>
                    <div className="h-24 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800">
                      <span className="text-[10px] font-bold text-slate-450">System (Dark Theme)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="theme"
                        checked={selectedTheme === 'dark'}
                        onChange={() => setSelectedTheme('dark')}
                        className="h-4 w-4 border-slate-350 text-indigo-600"
                      />
                      <span className="text-xs font-bold">System (Dark Theme)</span>
                    </div>
                  </label>

                  {/* Theme 3: Cosmic Blue Theme */}
                  <label className={cn(
                    "border rounded-xl p-4 flex flex-col gap-3.5 cursor-pointer transition-all",
                    selectedTheme === 'cosmic' ? "border-indigo-600 ring-2 ring-indigo-50 dark:ring-indigo-950/20" : "border-slate-150 hover:border-slate-300"
                  )}>
                    <div className="h-24 bg-indigo-905 rounded-lg flex items-center justify-center border border-indigo-950" style={{ backgroundColor: '#0B1528' }}>
                      <span className="text-[10px] font-bold text-indigo-400">Cosmic Soft Blue</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="theme"
                        checked={selectedTheme === 'cosmic'}
                        onChange={() => setSelectedTheme('cosmic')}
                        className="h-4 w-4 border-slate-350 text-indigo-600"
                      />
                      <span className="text-xs font-bold">Cosmic Soft Blue</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Apps and Integration connection panel */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">
                    Apps & Integration
                  </h3>
                  <p className="text-xs text-slate-450 mt-1">
                    Improve communication and productivity by utilizing social media share, Slack, and Github integration
                  </p>
                </div>

                <div className="space-y-3">
                  {/* LinkedIn Connect row */}
                  <div className="flex items-center justify-between p-3.5 border border-slate-150 dark:border-slate-850 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-650 flex items-center justify-center">
                        <Linkedin className="h-4.5 w-4.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Connect Linkedin Account</span>
                    </div>
                    <Button
                      onClick={() => {
                        setLinkedinConnected(!linkedinConnected);
                        toast.success(linkedinConnected ? 'Linkedin disconnected' : 'Linkedin connected');
                      }}
                      className={cn(
                        "h-8 text-xs font-bold rounded-lg px-4 border-none",
                        linkedinConnected ? "bg-rose-50 text-rose-600 hover:bg-rose-100" : "bg-indigo-600 hover:bg-indigo-750 text-white"
                      )}
                    >
                      {linkedinConnected ? 'Unbound ✕' : 'Connect →'}
                    </Button>
                  </div>

                  {/* Indeed Connect row */}
                  <div className="flex items-center justify-between p-3.5 border border-slate-150 dark:border-slate-850 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-50 text-slate-650 flex items-center justify-center">
                        <Chrome className="h-4.5 w-4.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Connect Indeed Account</span>
                    </div>
                    <Button
                      onClick={() => {
                        setIndeedConnected(!indeedConnected);
                        toast.success(indeedConnected ? 'Indeed disconnected' : 'Indeed connected');
                      }}
                      className={cn(
                        "h-8 text-xs font-bold rounded-lg px-4 border-none",
                        indeedConnected ? "bg-rose-50 text-rose-600 hover:bg-rose-100" : "bg-indigo-600 hover:bg-indigo-750 text-white"
                      )}
                    >
                      {indeedConnected ? 'Unbound ✕' : 'Connect →'}
                    </Button>
                  </div>

                  {/* GitHub Connect row */}
                  <div className="flex items-center justify-between p-3.5 border border-slate-150 dark:border-slate-850 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center">
                        <Github className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">@Erik_Garnacho</span>
                        <p className="text-[10px] text-slate-450">Erik Garnacho's Github</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        setGithubConnected(!githubConnected);
                        toast.success(githubConnected ? 'Github disconnected' : 'Github connected');
                      }}
                      className={cn(
                        "h-8 text-xs font-bold rounded-lg px-4 border-none",
                        githubConnected ? "bg-rose-50 text-rose-600 hover:bg-rose-100" : "bg-indigo-600 hover:bg-indigo-750 text-white"
                      )}
                    >
                      {githubConnected ? 'Unbound ✕' : 'Connect →'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BILLINGS AND INVOICES (Screenshot 9) */}
          {activeTab === 'billings' && (
            <div className="space-y-8">
              {/* Payment Method card details form */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">
                    Payment Method
                  </h3>
                  <p className="text-xs text-slate-450 mt-1">
                    Update your billing details and address.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 text-xs">
                  <div className="space-y-2">
                    <Label htmlFor="card-name">Name on your Card</Label>
                    <Input id="card-name" value={cardName} onChange={(e) => setCardName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-expiry">Expiry</Label>
                    <Input id="card-expiry" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input id="card-number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-cvv">CVV</Label>
                    <Input id="card-cvv" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} />
                  </div>
                </div>
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="h-9 font-bold text-xs border-slate-200">
                    + Add another card
                  </Button>
                </div>
              </div>

              {/* Contact Email radio inputs */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Contact email
                </h4>
                <p className="text-[10px] text-slate-455">Where should invoices be sent?</p>
                
                <div className="space-y-2.5 text-xs">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="billing-email"
                      checked={contactEmailOption === 'existing'}
                      onChange={() => setContactEmailOption('existing')}
                      className="h-4 w-4 text-indigo-600"
                    />
                    <span className="font-bold text-slate-800">Send to the existing email (mayadahmed@ofspace.co)</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="billing-email"
                      checked={contactEmailOption === 'another'}
                      onChange={() => setContactEmailOption('another')}
                      className="h-4 w-4 text-indigo-600"
                    />
                    <span className="font-bold text-slate-850">Add another email address</span>
                  </label>
                </div>
              </div>

              {/* Billing History table */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Billing History
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">See the transaction you made.</p>
                </div>

                <div className="border border-slate-150 rounded-lg overflow-hidden text-xs">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50">
                        <TableHead className="w-[50px]"><input type="checkbox" className="rounded" /></TableHead>
                        <TableHead className="font-bold text-slate-500 text-[10px]">Invoice</TableHead>
                        <TableHead className="font-bold text-slate-500 text-[10px]">Date</TableHead>
                        <TableHead className="font-bold text-slate-500 text-[10px]">Amount</TableHead>
                        <TableHead className="font-bold text-slate-500 text-[10px]">Status</TableHead>
                        <TableHead className="font-bold text-slate-500 text-[10px]">Tracking & Address</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockInvoices.map((invoice, idx) => (
                        <TableRow key={idx} className="hover:bg-slate-50/30">
                          <TableCell><input type="checkbox" className="rounded" /></TableCell>
                          <TableCell className="font-bold text-slate-905">{invoice.name}</TableCell>
                          <TableCell className="text-slate-500">{invoice.date}</TableCell>
                          <TableCell className="font-bold text-slate-900">{invoice.amount}</TableCell>
                          <TableCell>
                            <Badge className={cn(
                              "border-none text-[9px] font-black rounded px-2 py-0.5 uppercase",
                              invoice.status === 'Pending' ? "bg-yellow-50 text-yellow-605" :
                              invoice.status === 'Cancelled' ? "bg-red-50 text-red-600" :
                              "bg-emerald-50 text-emerald-600"
                            )}>
                              {invoice.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-bold text-indigo-650">{invoice.tracking}</div>
                            <div className="text-[10px] text-slate-450">{invoice.address}</div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Billing Save Footer */}
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <Button variant="outline" size="sm" className="h-9 px-4 rounded-lg font-bold border-slate-200">
                  Cancel
                </Button>
                <Button onClick={handleSaveBilling} size="sm" className="h-9 px-5 bg-indigo-600 hover:bg-indigo-755 text-white rounded-lg font-bold">
                  Save billing Changes
                </Button>
              </div>
            </div>
          )}

          {/* Under construction message for tabs that are mock */}
          {activeTab !== 'themes' && activeTab !== 'billings' && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Settings className="h-10 w-10 text-indigo-500 animate-bounce mb-4" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white capitalize">
                {activeTab.replace('-', ' ')} Settings Section
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-[280px]">
                This tab is currently mock. Please select "Themes" or "Billings" to view the implemented layouts.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
export default AdminSettingsPage;
