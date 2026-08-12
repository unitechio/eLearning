import React, { useState } from 'react';
import {
  Search, Calendar, Download, Eye, Trash2, ChevronLeft, ChevronRight, Inbox,
  SlidersHorizontal, Check, RefreshCw
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Badge } from '@/shared/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { toast } from 'sonner';

interface LeadItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  widget: string;
  date: string;
}

const mockLeads: LeadItem[] = [
  { id: '1', name: 'Floyd Miles', email: 'curtis.weaver@example.com', phone: '(480) 555-0103', message: 'Text message will be here...', widget: 'Widget 1', date: '28 Oct, 2024' },
  { id: '2', name: 'Dianne Russell', email: 'michael.mitc@example.com', phone: '(316) 555-0116', message: 'Text message will be here...', widget: 'Widget 2', date: '28 Oct, 2024' },
  { id: '3', name: 'Darrell Steward', email: 'bill.sanders@example.com', phone: '(303) 555-0105', message: 'Text message will be here...', widget: 'Widget 3', date: '28 Oct, 2024' },
  { id: '4', name: 'Jane Cooper', email: 'sara.cruz@example.com', phone: '(505) 555-0125', message: 'Text message will be here...', widget: 'Widget 4', date: '28 Oct, 2024' },
  { id: '5', name: 'Wade Warren', email: 'jennings@example.com', phone: '(629) 555-0129', message: 'Text message will be here...', widget: 'Widget 5', date: '28 Oct, 2024' },
  { id: '6', name: 'Jerome Bell', email: 'felicia.reid@example.com', phone: '(603) 555-0123', message: 'Text message will be here...', widget: 'Widget 6', date: '28 Oct, 2024' },
  { id: '7', name: 'Devon Lane', email: 'kenzi.lawson@example.com', phone: '(684) 555-0102', message: 'Text message will be here...', widget: 'Widget 7', date: '28 Oct, 2024' },
  { id: '8', name: 'Leslie Alexander', email: 'tanya.hill@example.com', phone: '(205) 555-0100', message: 'Text message will be here...', widget: 'Widget 8', date: '28 Oct, 2024' },
  { id: '9', name: 'Savannah Nguyen', email: 'chambers@example.com', phone: '(209) 555-0104', message: 'Text message will be here...', widget: 'Widget 9', date: '28 Oct, 2024' },
  { id: '10', name: 'Esther Howard', email: 'debbie.baker@example.com', phone: '(302) 555-0121', message: 'Text message will be here...', widget: 'Widget 10', date: '28 Oct, 2024' },
  { id: '11', name: 'Cody Fisher', email: 'simmons@example.com', phone: '(308) 555-0121', message: 'Text message will be here...', widget: 'Widget 11', date: '28 Oct, 2024' },
  { id: '12', name: 'Robert Fox', email: 'debra.holt@example.com', phone: '(307) 555-0133', message: 'Text message will be here...', widget: 'Widget 12', date: '28 Oct, 2024' },
];

export const AdminLeadsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'contact-form' | 'contact-form-7'>('contact-form');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWidget, setSelectedWidget] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Row selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter leads based on search & widget
  const filteredLeads = mockLeads.filter((lead) => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lead.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWidget = selectedWidget === 'all' || lead.widget.toLowerCase() === selectedWidget.toLowerCase();
    return matchesSearch && matchesWidget;
  });

  const totalItems = filteredLeads.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedLeads.map((l) => l.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((rowId) => rowId !== id));
    }
  };

  const handleDeleteLead = (id: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      toast.success('Lead deleted successfully');
    }
  };

  const handleExportCSV = () => {
    toast.success('Leads exported successfully in CSV format');
  };

  return (
    <section className="p-6 space-y-6 flex flex-col w-full antialiased font-inter text-slate-800 dark:text-slate-200">
      {/* Header Panel */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <nav aria-label="breadcrumb" className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <span>Plugin & Addons</span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-slate-900 dark:text-slate-100">Contact Forms</span>
          </nav>
          
          <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            Contact Form Leads ({totalItems})
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage, review, and filter incoming submissions from your site contact forms.
          </p>
        </div>
      </div>

      {/* Tabs & Controls Toolbar matching Screenshot 1 */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between w-full">
        {/* Left Side: Form Tabs */}
        <div className="flex border border-slate-250 dark:border-slate-800 rounded-lg p-1 bg-slate-50/50 dark:bg-slate-950/20 max-w-max">
          <button
            type="button"
            onClick={() => { setActiveTab('contact-form'); setCurrentPage(1); }}
            className={cn(
              "px-4 py-1.5 rounded text-xs font-bold transition-all",
              activeTab === 'contact-form'
                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            )}
          >
            Contact Form
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('contact-form-7'); setCurrentPage(1); }}
            className={cn(
              "px-4 py-1.5 rounded text-xs font-bold transition-all",
              activeTab === 'contact-form-7'
                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            )}
          >
            Contact Form 7
          </button>
        </div>

        {/* Right Side: Filters Group */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search bar */}
          <div className="relative w-full sm:w-[220px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search leads"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="h-9 pl-9 text-xs rounded-lg border-slate-200 bg-white dark:bg-slate-950 dark:border-slate-800"
            />
          </div>

          {/* Export Button */}
          <Button
            variant="outline"
            onClick={handleExportCSV}
            size="sm"
            className="h-9 gap-1.5 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 font-semibold"
          >
            <Download className="h-3.5 w-3.5" />
            <span>CSV</span>
          </Button>

          {/* Widgets Filter */}
          <Select value={selectedWidget} onValueChange={(val) => { setSelectedWidget(val); setCurrentPage(1); }}>
            <SelectTrigger className="h-9 w-[130px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300">
              <SelectValue placeholder="All Widgets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Widgets</SelectItem>
              <SelectItem value="widget 1">Widget 1</SelectItem>
              <SelectItem value="widget 2">Widget 2</SelectItem>
              <SelectItem value="widget 3">Widget 3</SelectItem>
              <SelectItem value="widget 4">Widget 4</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Picker Range Mock */}
          <div className="flex items-center gap-2 px-3 py-1.5 h-9 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-50">
            <span className="text-[11px]">20/07/2024 - 24/06/2024</span>
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Leads Table Card matching Screenshot 1 */}
      <div className="border border-slate-200/60 dark:border-slate-800/60 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 dark:bg-slate-950/20">
              <TableHead className="w-[50px]">
                <input
                  type="checkbox"
                  checked={paginatedLeads.length > 0 && selectedIds.length === paginatedLeads.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Name</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Email</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Phone Number</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Message</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Widget</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Date</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-36 text-center text-slate-400 font-medium">
                  <Inbox className="h-8 w-8 mx-auto mb-2 opacity-55" />
                  <span>No leads found matching your search.</span>
                </TableCell>
              </TableRow>
            ) : (
              paginatedLeads.map((lead) => (
                <TableRow key={lead.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors">
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(lead.id)}
                      onChange={(e) => handleSelectRow(lead.id, e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900 dark:text-white text-xs">{lead.name}</TableCell>
                  <TableCell className="text-xs text-slate-600 dark:text-slate-400">{lead.email}</TableCell>
                  <TableCell className="text-xs text-slate-600 dark:text-slate-400">{lead.phone}</TableCell>
                  <TableCell className="text-xs text-slate-600 dark:text-slate-400 truncate max-w-[200px]">{lead.message}</TableCell>
                  <TableCell className="text-xs">
                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border-none font-bold text-[10px]">
                      {lead.widget}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 dark:text-slate-400">{lead.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-450 hover:text-slate-700 dark:hover:text-slate-200">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteLead(lead.id)} className="h-7 w-7 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        {totalItems > 0 && (
          <footer className="border-t border-slate-100 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>Showing</span>
              <Select value={pageSize.toString()} onValueChange={(val) => { setPageSize(Number(val)); setCurrentPage(1); }}>
                <SelectTrigger className="h-7 w-[60px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded">
                  <SelectValue placeholder="12" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                </SelectContent>
              </Select>
              <span>Items in one page</span>
            </div>

            <div className="text-xs font-bold text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors">
              Try all premium plugin for free
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="h-8 border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-0.5" />
                Previous
              </Button>
              <div className="flex items-center gap-1 px-1.5">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pNum = i + 1;
                  return (
                    <button
                      key={pNum}
                      type="button"
                      onClick={() => setCurrentPage(pNum)}
                      className={cn(
                        "h-8 w-8 rounded text-xs font-bold transition-all",
                        currentPage === pNum
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-slate-650 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                      )}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="h-8 border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
              </Button>
            </div>
          </footer>
        )}
      </div>
    </section>
  );
};
export default AdminLeadsPage;
