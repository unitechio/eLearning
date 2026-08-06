import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Folder,
  Lock,
  MoreVertical,
  Plus,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  AdminPageLayout, AdminCard, AdminCardContent, AdminDataTable, type AdminColumnDef 
} from '@/shared/components/admin';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/lib/utils';

export interface CategoryRow {
  id: string;
  name: string;
  count?: number;
  folderColor?: string;
  accountType: 'OPEX' | 'COGS' | 'LIABILITY' | 'MIXED' | 'REVENUE';
  taxRules: string;
  rate: string;
  rptCode: string;
  status: 'Active' | 'Review' | 'Locked';
  date: string;
  children?: CategoryRow[];
}

const DEFAULT_CATEGORIES: CategoryRow[] = [
  {
    id: '1',
    name: 'IT Operations',
    count: 3,
    folderColor: 'text-blue-500',
    accountType: 'OPEX',
    taxRules: 'VAT Standard',
    rate: '11.0%',
    rptCode: '6000-ITO',
    status: 'Active',
    date: 'May 01, 2026',
    children: [
      {
        id: '1-1',
        name: 'Cloud Infrastructure',
        folderColor: 'text-gray-400',
        accountType: 'OPEX',
        taxRules: 'VAT Standard',
        rate: '11.0%',
        rptCode: '6100-AWS',
        status: 'Active',
        date: 'May 01, 2026',
      },
      {
        id: '1-2',
        name: 'SaaS Subscriptions',
        folderColor: 'text-gray-400',
        accountType: 'OPEX',
        taxRules: 'VAT Standard',
        rate: '11.0%',
        rptCode: '6100-AWS',
        status: 'Active',
        date: 'May 04, 2026',
      },
      {
        id: '1-3',
        name: 'Maintenance & Repairs',
        folderColor: 'text-gray-400',
        accountType: 'OPEX',
        taxRules: 'Tax Exempt',
        rate: '0.0%',
        rptCode: '6200-MNT',
        status: 'Active',
        date: 'May 10, 2026',
      },
    ],
  },
  {
    id: '2',
    name: 'Professional Svcs',
    count: 1,
    folderColor: 'text-amber-500',
    accountType: 'OPEX',
    taxRules: 'Withholding Tax',
    rate: '2.0%',
    rptCode: '7000-PRO',
    status: 'Review',
    date: 'May 02, 2026',
  },
  {
    id: '3',
    name: 'Fixed Assets',
    count: 1,
    folderColor: 'text-emerald-500',
    accountType: 'COGS',
    taxRules: 'Tax Exempt',
    rate: '11.0%',
    rptCode: '5100-MKT',
    status: 'Active',
    date: 'May 02, 2026',
  },
  {
    id: '4',
    name: 'Marketing & Sales',
    count: 1,
    folderColor: 'text-orange-500',
    accountType: 'OPEX',
    taxRules: 'VAT Standard',
    rate: '10.0%',
    rptCode: '5000-MKT',
    status: 'Active',
    date: 'May 02, 2026',
  },
  {
    id: '5',
    name: 'Long-term Debt',
    count: 1,
    folderColor: 'text-rose-500',
    accountType: 'LIABILITY',
    taxRules: 'PB1 (Local)',
    rate: '11.0%',
    rptCode: '2000-DBT',
    status: 'Active',
    date: 'May 04, 2026',
  },
  {
    id: '6',
    name: 'Human Resources',
    count: 2,
    folderColor: 'text-blue-500',
    accountType: 'OPEX',
    taxRules: 'Mixed Rates',
    rate: '2.5%',
    rptCode: '6300-HRM',
    status: 'Active',
    date: 'May 05, 2026',
  },
  {
    id: '7',
    name: 'Equity & Reserves',
    count: 2,
    folderColor: 'text-purple-500',
    accountType: 'MIXED',
    taxRules: 'Tax Exempt',
    rate: '0.0%',
    rptCode: '2500-EQT',
    status: 'Locked',
    date: 'May 05, 2026',
  },
  {
    id: '8',
    name: 'Operations',
    count: 2,
    folderColor: 'text-sky-500',
    accountType: 'OPEX',
    taxRules: 'Tax Exempt',
    rate: '0.0%',
    rptCode: '6400-OPR',
    status: 'Active',
    date: 'May 06, 2026',
  },
  {
    id: '9',
    name: 'Banking & Finance',
    count: 1,
    folderColor: 'text-indigo-500',
    accountType: 'REVENUE',
    taxRules: 'Tax Exempt',
    rate: '11.0%',
    rptCode: '4000-FIN',
    status: 'Active',
    date: 'May 06, 2026',
  },
  {
    id: '10',
    name: 'Cost of Goods Sold',
    count: 1,
    folderColor: 'text-amber-600',
    accountType: 'COGS',
    taxRules: 'Tax Exempt',
    rate: '11.0%',
    rptCode: '5300-CGS',
    status: 'Review',
    date: 'May 06, 2026',
  },
];

export function AdminInvoiceCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({ '1': true });

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredCategories = useMemo(() => {
    return DEFAULT_CATEGORIES.filter((cat) => {
      if (statusFilter !== 'all' && cat.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          cat.name.toLowerCase().includes(q) ||
          cat.rptCode.toLowerCase().includes(q) ||
          cat.accountType.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery, statusFilter]);

  // Flattened tree nodes for standard DataTable rendering
  const flattenedRows = useMemo(() => {
    const list: CategoryRow[] = [];
    filteredCategories.forEach(cat => {
      list.push(cat);
      if (expandedRows[cat.id] && cat.children) {
        cat.children.forEach(child => {
          list.push({ 
            ...child, 
            name: `└─ ${child.name}` 
          });
        });
      }
    });
    return list;
  }, [filteredCategories, expandedRows]);

  const columns: AdminColumnDef<CategoryRow>[] = [
    {
      header: 'Category Name & Vis',
      cell: (cat) => {
        const isChild = cat.id.includes('-');
        const parentId = isChild ? cat.id.split('-')[0] : cat.id;
        const hasChildren = cat.children && cat.children.length > 0;
        const isExpanded = expandedRows[parentId];
        
        return (
          <div className="flex items-center gap-2">
            {!isChild && hasChildren ? (
              <button 
                type="button" 
                onClick={() => toggleRow(parentId)}
                className="text-muted-foreground hover:text-foreground outline-none"
              >
                {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              </button>
            ) : (
              <span className="w-3.5 h-3.5 block shrink-0" />
            )}
            
            <Folder className={cn("h-4 w-4 shrink-0", isChild ? 'text-slate-400' : (cat.folderColor || 'text-amber-500'))} />
            <span className={cn(
              isChild ? 'text-xs text-muted-foreground/80 pl-2' : 'font-semibold text-foreground text-[13px]'
            )}>
              {cat.name}
            </span>
            {cat.count && (
              <Badge variant="outline" className="text-[10px] text-muted-foreground/80 font-bold bg-slate-50 dark:bg-slate-900 border-border/80">
                {cat.count}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      header: 'Account Type',
      cell: (cat) => (
        <Badge variant="outline" className="font-mono text-[10px] font-bold tracking-wider text-muted-foreground border-border/85">
          {cat.accountType}
        </Badge>
      ),
    },
    {
      header: 'Tax Rules',
      cell: (cat) => <span className="text-muted-foreground">{cat.taxRules}</span>,
    },
    {
      header: 'Rate',
      cell: (cat) => <span className="font-mono text-xs text-muted-foreground">{cat.rate}</span>,
    },
    {
      header: 'Rpt Code',
      cell: (cat) => <span className="font-mono text-xs font-semibold text-foreground">{cat.rptCode}</span>,
    },
    {
      header: 'Status',
      cell: (cat) => (
        <Badge className={cn(
          "text-[10px] font-bold border-transparent capitalize inline-flex items-center gap-1",
          cat.status === 'Active' && 'bg-green-500/10 text-green-600 dark:text-green-400',
          cat.status === 'Review' && 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
          cat.status === 'Locked' && 'bg-slate-100 text-slate-600 dark:bg-slate-900'
        )}>
          {cat.status === 'Active' && <CheckCircle2 className="h-3 w-3" />}
          {cat.status === 'Review' && <AlertCircle className="h-3 w-3" />}
          {cat.status === 'Locked' && <Lock className="h-3 w-3" />}
          {cat.status}
        </Badge>
      ),
    },
    {
      header: 'Date',
      cell: (cat) => <span className="text-muted-foreground text-xs">{cat.date}</span>,
    },
    {
      header: 'Actions',
      cell: () => (
        <div className="flex justify-end pr-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: 'text-right w-[80px]',
    },
  ];

  const rightActions = (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        className="h-10 text-xs font-semibold gap-1.5 border-[#EAECF0] dark:border-[#1E1F22] bg-slate-50/50 text-muted-foreground hover:text-foreground"
      >
        <Calendar className="h-3.5 w-3.5 text-gray-400" />
        <span>Last 30 days</span>
      </Button>

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[140px] h-10 rounded-[10px] text-xs font-semibold bg-slate-50/50">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Status: All</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="review">Review</SelectItem>
          <SelectItem value="locked">Locked</SelectItem>
        </SelectContent>
      </Select>

      <Button
        type="button"
        className="h-10 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-3 text-xs gap-1.5 rounded-[10px] shadow-sm shrink-0"
      >
        <Plus className="h-4 w-4" />
        <span>Create</span>
      </Button>
    </div>
  );

  return (
    <AdminPageLayout
      title="Invoice Categories"
      description="Manage chart of accounts, tax rules, report codes, and invoice category mappings."
      icon={Folder}
    >
      <AdminDataTable
        data={flattenedRows}
        columns={columns}
        isLoading={false}
        searchTerm={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search categories, codes..."
        rightActions={rightActions}
        emptyTitle="No invoice categories found"
        emptyDescription="Set up chart of account categories to classify expenses."
      />
    </AdminPageLayout>
  );
}

export default AdminInvoiceCategoriesPage;
