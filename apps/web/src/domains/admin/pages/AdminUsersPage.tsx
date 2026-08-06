import React, { useState, useMemo } from 'react';
import { Users, Plus, Edit, Eye, MoreVertical, FileUp } from 'lucide-react';
import { AdminPageLayout, AdminDataTable, AdminStatusBadge, type AdminColumnDef } from '@/shared/components/admin';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Checkbox } from '@/shared/components/ui/checkbox';

type ContactItem = {
  id: string;
  name: string;
  avatar: string;
  company: {
    name: string;
    logoLetter: string;
    logoBg: string;
  };
  email: string;
  phone: string;
  status: 'active' | 'lead' | 'lost';
  lastContacted: string;
};

const mockContacts: ContactItem[] = [
  {
    id: '1',
    name: 'Mason Thompson',
    avatar: 'MT',
    company: { name: 'Stripe', logoLetter: 'S', logoBg: 'bg-indigo-600 text-white' },
    email: 'hompson@gmail.com',
    phone: '+1 (555) 234-5678',
    status: 'active',
    lastContacted: 'Dec 28, 2025',
  },
  {
    id: '2',
    name: 'Logan Mitchell',
    avatar: 'LM',
    company: { name: 'Dzen.ru', logoLetter: 'D', logoBg: 'bg-black text-white' },
    email: 'logan@gmail.com',
    phone: '+1 (555) 345-6789',
    status: 'active',
    lastContacted: 'Dec 30, 2025',
  },
  {
    id: '3',
    name: 'Lucas Anderson',
    avatar: 'LA',
    company: { name: 'Invision', logoLetter: 'I', logoBg: 'bg-rose-500 text-white' },
    email: 'lucas@gmail.com',
    phone: '+1 (555) 456-7890',
    status: 'lead',
    lastContacted: 'Dec 15, 2025',
  },
  {
    id: '4',
    name: 'Jackson Brooks',
    avatar: 'JB',
    company: { name: 'Halo Collar', logoLetter: 'H', logoBg: 'bg-amber-500 text-black' },
    email: 'jackson@gmail.com',
    phone: '+1 (555) 456-7890',
    status: 'lost',
    lastContacted: 'Dec 29, 2025',
  },
  {
    id: '5',
    name: 'Aiden Parker',
    avatar: 'AP',
    company: { name: 'Patreon', logoLetter: 'P', logoBg: 'bg-rose-600 text-white' },
    email: 'aiden@gmail.com',
    phone: '+1 (555) 678-9012',
    status: 'lost',
    lastContacted: 'Nov 20, 2025',
  },
  {
    id: '6',
    name: 'Caleb Reed',
    avatar: 'CR',
    company: { name: 'Google', logoLetter: 'G', logoBg: 'bg-blue-500 text-white font-serif' },
    email: 'caleb@gmail.com',
    phone: '+1 (555) 789-0123',
    status: 'lead',
    lastContacted: 'Dec 25, 2025',
  },
  {
    id: '7',
    name: 'Elijah Harris',
    avatar: 'EH',
    company: { name: 'Ok', logoLetter: 'O', logoBg: 'bg-orange-500 text-white' },
    email: 'elijah@gmail.com',
    phone: '+1 (555) 890-1234',
    status: 'active',
    lastContacted: 'Dec 25, 2025',
  },
  {
    id: '8',
    name: 'Benjamin Scott',
    avatar: 'BS',
    company: { name: 'Discord', logoLetter: 'D', logoBg: 'bg-indigo-500 text-white' },
    email: 'benjamin@gmail.com',
    phone: '+1 (555) 456-7890',
    status: 'active',
    lastContacted: 'Dec 31, 2025',
  },
  {
    id: '9',
    name: 'William Young',
    avatar: 'WY',
    company: { name: 'Foursquare', logoLetter: 'F', logoBg: 'bg-rose-400 text-white' },
    email: 'william@gmail.com',
    phone: '+1 (555) 890-1234',
    status: 'lead',
    lastContacted: 'Dec 25, 2025',
  },
  {
    id: '10',
    name: 'Joshua Murphy',
    avatar: 'JM',
    company: { name: 'Loom', logoLetter: 'L', logoBg: 'bg-indigo-600 text-white' },
    email: 'joshua@gmail.com',
    phone: '+1 (555) 234-5678',
    status: 'lost',
    lastContacted: 'Dec 18, 2025',
  },
  {
    id: '11',
    name: 'Isaac Wood',
    avatar: 'IW',
    company: { name: 'TikTok', logoLetter: 'T', logoBg: 'bg-black text-white font-mono' },
    email: 'isaac@gmail.com',
    phone: '+1 (555) 901-2345',
    status: 'active',
    lastContacted: 'Dec 18, 2025',
  },
  {
    id: '12',
    name: 'Jonathan Perry',
    avatar: 'JP',
    company: { name: 'LinkedIn', logoLetter: 'L', logoBg: 'bg-sky-600 text-white' },
    email: 'jonathan@gmail.com',
    phone: '+1 (555) 456-7890',
    status: 'active',
    lastContacted: 'Dec 18, 2025',
  },
  {
    id: '13',
    name: 'Aaron Butler',
    avatar: 'AB',
    company: { name: 'Notion', logoLetter: 'N', logoBg: 'bg-zinc-800 text-white' },
    email: 'aaron@gmail.com',
    phone: '+1 (555) 678-9012',
    status: 'active',
    lastContacted: 'Dec 18, 2025',
  },
  {
    id: '14',
    name: 'Nathan Phillips',
    avatar: 'NP',
    company: { name: 'Pinterest', logoLetter: 'P', logoBg: 'bg-red-600 text-white' },
    email: 'nathan@gmail.com',
    phone: '+1 (555) 456-7890',
    status: 'active',
    lastContacted: 'John Smith',
  },
  {
    id: '15',
    name: 'Hunter Brooks',
    avatar: 'HB',
    company: { name: 'Paypal', logoLetter: 'P', logoBg: 'bg-blue-600 text-white font-sans' },
    email: 'hunter@gmail.com',
    phone: '+1 (555) 234-5678',
    status: 'active',
    lastContacted: 'John Smith',
  },
  {
    id: '16',
    name: 'Sebastian Gray',
    avatar: 'SG',
    company: { name: 'Shopify', logoLetter: 'S', logoBg: 'bg-emerald-600 text-white' },
    email: 'sebastian@gmail.com',
    phone: '+1 (555) 456-7890',
    status: 'active',
    lastContacted: 'John Smith',
  },
];

export function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const filteredContacts = useMemo(() => {
    return mockContacts.filter((contact) => {
      const matchesSearch =
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === '' || contact.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredContacts.map(c => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  const allSelected = filteredContacts.length > 0 && selectedIds.length === filteredContacts.length;

  const columns: AdminColumnDef<ContactItem>[] = [
    {
      header: '',
      cell: (item) => (
        <Checkbox
          checked={selectedIds.includes(item.id)}
          onCheckedChange={(checked) => handleSelectOne(item.id, !!checked)}
          aria-label={`Select contact ${item.name}`}
        />
      ),
      className: 'w-10 pl-4',
    },
    {
      header: 'Name',
      cell: (item) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border border-border">
            <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
              {item.avatar}
            </AvatarFallback>
          </Avatar>
          <span className="font-semibold text-foreground text-[13px]">{item.name}</span>
        </div>
      ),
    },
    {
      header: 'Company',
      cell: (item) => (
        <div className="flex items-center gap-2">
          <span className={`flex h-5 w-5 items-center justify-center rounded text-[9px] font-extrabold ${item.company.logoBg}`}>
            {item.company.logoLetter}
          </span>
          <span className="font-medium text-foreground/80">{item.company.name}</span>
        </div>
      ),
    },
    {
      header: 'Email',
      cell: (item) => <span className="text-muted-foreground font-mono text-xs">{item.email}</span>,
    },
    {
      header: 'Phone',
      cell: (item) => <span className="text-muted-foreground">{item.phone}</span>,
    },
    {
      header: 'Status',
      cell: (item) => {
        let state = 'active';
        if (item.status === 'lead') state = 'pending';
        if (item.status === 'lost') state = 'failed';
        return <AdminStatusBadge state={state} label={item.status} />;
      },
    },
    {
      header: 'Last Contacted',
      cell: (item) => <span className="text-muted-foreground">{item.lastContacted}</span>,
    },
    {
      header: 'Actions',
      cell: (item) => (
        <div className="flex items-center gap-1.5 justify-end pr-4">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg" aria-label={`Edit ${item.name}`}>
            <Edit className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg" aria-label={`View ${item.name}`}>
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg" aria-label={`More options for ${item.name}`}>
            <MoreVertical className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  // Active filters selector card
  const filters = (
    <div className="grid gap-4 sm:grid-cols-4 max-w-xl">
      <div className="space-y-1">
        <label htmlFor="filter-status" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Contact Status</label>
        <select
          id="filter-status"
          className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs font-semibold h-10 focus:outline-none"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setSelectedIds([]);
          }}
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="lead">Lead</option>
          <option value="lost">Lost</option>
        </select>
      </div>
    </div>
  );

  const rightActions = (
    <>
      <Button
        type="button"
        variant="outline"
        className="h-10 rounded-[10px] px-3 text-xs font-semibold gap-1.5 border-[#EAECF0] dark:border-[#1E1F22] bg-slate-50/50 text-muted-foreground hover:text-foreground hover:bg-slate-100 transition-colors"
      >
        <FileUp className="h-3.5 w-3.5" />
        <span>Import</span>
      </Button>

      <Button
        type="button"
        className="h-10 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-3 text-xs gap-1.5 rounded-[10px] shadow-sm"
      >
        <Plus className="h-3.5 w-3.5" />
        <span>Add Contact</span>
      </Button>
    </>
  );

  return (
    <AdminPageLayout
      title="Contacts"
      description="Monitor system accounts, pipeline state stages, corporate entitlements, and outreach touchpoints."
      icon={Users}
    >
      <AdminDataTable
        data={filteredContacts}
        columns={columns}
        isLoading={false}
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setSelectedIds([]);
        }}
        searchPlaceholder="Search contacts..."
        rightActions={rightActions}
        onExport={() => alert('Exporting contacts to CSV...')}
        exportLabel="Export"
        filters={filters}
        emptyTitle="No contacts found"
        emptyDescription="No pipeline prospects matched your search terms or active status filters."
      />
    </AdminPageLayout>
  );
}
