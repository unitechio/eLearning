import React, { useState } from 'react';
import {
  Copy,
  Plus,
  Palette,
  MessageSquare,
  Edit2,
  MoreHorizontal,
} from 'lucide-react';
import { 
  AdminPageLayout, AdminCard, AdminCardContent, AdminDataTable, type AdminColumnDef 
} from '@/shared/components/admin';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Badge } from '@/shared/components/ui/badge';
import { toast } from 'sonner';

export interface BioPageItem {
  id: string;
  name: string;
  url: string;
  logo: string;
  views: string;
  clicksCount: number;
  marketingChannel: string;
  clientName: string;
  widgetsUsed: string;
  creationDate: string;
}

const INITIAL_BIO_PAGES: BioPageItem[] = [
  {
    id: '1',
    name: 'Royal Suite',
    url: 'https://www.example.com/s/royal-suite',
    logo: 'https://api.iconify.design/logos:crown.svg',
    views: '02',
    clicksCount: 128,
    marketingChannel: 'Social Media',
    clientName: 'Acme Corp',
    widgetsUsed: 'Newly Added',
    creationDate: '2024-05-01',
  },
  {
    id: '2',
    name: 'Darrell Steward',
    url: 'https://www.example.com/s/darrell-steward',
    logo: 'https://api.iconify.design/logos:nasa.svg',
    views: '04',
    clicksCount: 256,
    marketingChannel: 'Email Campaign',
    clientName: 'Globex Inc',
    widgetsUsed: 'Newly Added',
    creationDate: '2024-05-03',
  },
  {
    id: '3',
    name: 'Dianne Russell',
    url: 'https://www.example.com/s/dianne-russell',
    logo: 'https://api.iconify.design/logos:pg.svg',
    views: '09',
    clicksCount: 342,
    marketingChannel: 'Affiliate Network',
    clientName: 'Initech',
    widgetsUsed: 'Newly Added',
    creationDate: '2024-05-05',
  },
  {
    id: '4',
    name: 'Jerome Bell',
    url: 'https://www.example.com/s/jerome-bell',
    logo: 'https://api.iconify.design/logos:panda.svg',
    views: '45',
    clicksCount: 198,
    marketingChannel: 'Direct Traffic',
    clientName: 'Umbrella Co',
    widgetsUsed: 'Newly Added',
    creationDate: '2024-05-07',
  },
  {
    id: '5',
    name: 'Jane Cooper',
    url: 'https://www.example.com/s/jane-cooper',
    logo: 'https://api.iconify.design/logos:dyson.svg',
    views: '76',
    clicksCount: 412,
    marketingChannel: 'Referral Links',
    clientName: 'Hooli',
    widgetsUsed: 'Newly Added',
    creationDate: '2024-05-09',
  },
  {
    id: '6',
    name: 'Cameron Williamson',
    url: 'https://www.example.com/s/cameron-williamson',
    logo: 'https://api.iconify.design/logos:tree.svg',
    views: '08',
    clicksCount: 523,
    marketingChannel: 'Paid Ads',
    clientName: 'Stark Industries',
    widgetsUsed: 'Newly Added',
    creationDate: '2024-05-11',
  },
  {
    id: '7',
    name: 'Eleanor Pena',
    url: 'https://www.example.com/s/eleanor-pena',
    logo: 'https://api.iconify.design/logos:beats.svg',
    views: '78',
    clicksCount: 389,
    marketingChannel: 'Organic Search',
    clientName: 'Wayne Enterprises',
    widgetsUsed: 'Newly Added',
    creationDate: '2024-05-13',
  },
  {
    id: '8',
    name: 'Kathryn Murphy',
    url: 'https://www.example.com/s/kathryn-murphy',
    logo: 'https://api.iconify.design/logos:circle.svg',
    views: '78',
    clicksCount: 389,
    marketingChannel: 'Organic Search',
    clientName: 'Wayne Enterprises',
    widgetsUsed: 'Newly Added',
    creationDate: '2024-05-13',
  },
];

export function AdminBioPagesPage() {
  const [bioPages, setBioPages] = useState<BioPageItem[]>(INITIAL_BIO_PAGES);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newBioName, setNewBioName] = useState('');
  const [newClientName, setNewClientName] = useState('');

  const handleCopyLink = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('Link copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(bioPages.map((b) => b.id));
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

  const handleCreateBio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBioName.trim()) return;
    const newItem: BioPageItem = {
      id: String(Date.now()),
      name: newBioName,
      url: `https://www.example.com/s/${newBioName.toLowerCase().replace(/\s+/g, '-')}`,
      logo: 'https://api.iconify.design/lucide:sparkles.svg',
      views: '01',
      clicksCount: 0,
      marketingChannel: 'Direct Traffic',
      clientName: newClientName || 'Acme Corp',
      widgetsUsed: 'Newly Added',
      creationDate: new Date().toISOString().split('T')[0],
    };
    setBioPages([newItem, ...bioPages]);
    setNewBioName('');
    setNewClientName('');
    setCreateModalOpen(false);
    toast.success('Bio landing page created!');
  };

  const allSelected = bioPages.length > 0 && selectedIds.length === bioPages.length;

  const columns: AdminColumnDef<BioPageItem>[] = [
    {
      header: '',
      cell: (bio) => (
        <Checkbox
          checked={selectedIds.includes(bio.id)}
          onCheckedChange={(checked) => toggleSelectOne(bio.id, !!checked)}
          aria-label={`Select ${bio.name}`}
        />
      ),
      className: 'w-10 pl-4',
    },
    {
      header: 'Bio Page',
      cell: (bio) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-slate-50 dark:bg-slate-900 p-1">
            <img
              src={bio.logo}
              alt={bio.name}
              className="h-5 w-5 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://api.iconify.design/lucide:globe.svg';
              }}
            />
          </div>

          <div>
            <p className="font-semibold text-foreground text-[13px]">{bio.name}</p>
            <p className="text-[10px] text-muted-foreground">{bio.url}</p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleCopyLink(bio.id, bio.url)}
            className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
            title="Copy URL"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
    {
      header: 'Views',
      cell: (bio) => <span className="font-mono text-xs text-muted-foreground">{bio.views}</span>,
    },
    {
      header: 'Clicks',
      cell: (bio) => <span className="font-mono text-xs text-foreground font-semibold">{bio.clicksCount}</span>,
    },
    {
      header: 'Marketing Channel',
      cell: (bio) => <span className="text-muted-foreground">{bio.marketingChannel}</span>,
    },
    {
      header: 'Client Name',
      cell: (bio) => <span className="text-foreground">{bio.clientName}</span>,
    },
    {
      header: 'Widgets Used',
      cell: (bio) => (
        <Badge variant="outline" className="text-[10px] text-muted-foreground font-medium border-border/80">
          {bio.widgetsUsed}
        </Badge>
      ),
    },
    {
      header: 'Creation Date',
      cell: (bio) => <span className="font-mono text-xs text-muted-foreground">{bio.creationDate}</span>,
    },
    {
      header: 'Actions',
      cell: (bio) => (
        <div className="flex items-center justify-end pr-2 gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground"><MessageSquare className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground"><Edit2 className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
        </div>
      ),
      className: 'text-right w-[120px]',
    },
  ];

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        className="h-10 rounded-[10px] text-xs font-semibold gap-1.5 border-[#EAECF0] dark:border-[#1E1F22]"
      >
        <Palette className="h-4 w-4 text-purple-500" />
        <span>My Themes</span>
      </Button>

      <Button
        type="button"
        onClick={() => setCreateModalOpen(true)}
        className="h-10 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-3 text-xs gap-1.5 rounded-[10px] shadow-sm shrink-0"
      >
        <Plus className="h-4 w-4" />
        <span>Create Bio</span>
      </Button>
    </div>
  );

  return (
    <AdminPageLayout
      title="Bio Pages"
      description="Create and manage customized link-in-bio target templates for social outreach."
      icon={Palette}
      action={headerActions}
    >
      <AdminDataTable
        data={bioPages}
        columns={columns}
        isLoading={false}
        emptyTitle="No bio pages configured"
        emptyDescription="Set up a customized landing page for your brand portfolio and links."
      />

      {/* Create Bio Dialog */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Create Link-in-Bio Page</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateBio} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-xs font-semibold text-muted-foreground" htmlFor="bio-name">Bio Page Title</Label>
              <Input
                id="bio-name"
                required
                placeholder="e.g. Royal Suite Portfolio"
                value={newBioName}
                onChange={(e) => setNewBioName(e.target.value)}
                className="h-10 rounded-[10px]"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-xs font-semibold text-muted-foreground" htmlFor="client-name">Client Name</Label>
              <Input
                id="client-name"
                placeholder="e.g. Acme Corp"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                className="h-10 rounded-[10px]"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateModalOpen(false)}
                className="h-10 rounded-[10px] text-sm font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-10 rounded-[10px] text-sm font-semibold"
              >
                Publish Bio Page
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  );
}

export default AdminBioPagesPage;
