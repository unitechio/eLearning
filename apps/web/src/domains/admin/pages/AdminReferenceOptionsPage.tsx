import React, { useState } from 'react';
import { 
  AdminPageLayout, AdminCard, AdminCardContent, AdminCardHeader, AdminCardTitle, AdminDataTable, type AdminColumnDef 
} from '@/shared/components/admin';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/ui/dialog';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Plus, Edit, Trash2, Database } from 'lucide-react';
import { toast } from 'sonner';
import { 
  useAmsReferenceOptions, useCreateAmsReferenceOption, useUpdateAmsReferenceOption, useDeleteAmsReferenceOption,
  AmsReferenceOption
} from '@/domains/admin/api/ams';
import { cn } from '@/shared/lib/utils';

export function AdminReferenceOptionsPage() {
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const { data: listData, isLoading, error } = useAmsReferenceOptions();
  const createMutation = useCreateAmsReferenceOption();
  const updateMutation = useUpdateAmsReferenceOption();
  const deleteMutation = useDeleteAmsReferenceOption();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<AmsReferenceOption | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    label: '',
    group: '',
    sort_order: 1,
    active: true
  });

  const resetForm = () => {
    setFormData({
      code: '',
      label: '',
      group: '',
      sort_order: 1,
      active: true
    });
  };

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync({
        ...formData,
        sort_order: Number(formData.sort_order)
      });
      toast.success('Reference option created successfully');
      setIsCreateOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create option');
    }
  };

  const handleUpdate = async () => {
    if (!editingOption) return;
    try {
      await updateMutation.mutateAsync({
        id: editingOption.id,
        payload: {
          ...formData,
          sort_order: Number(formData.sort_order)
        }
      });
      toast.success('Reference option updated successfully');
      setEditingOption(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update option');
    }
  };

  const handleDelete = async () => {
    if (deletingId === null) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success('Reference option deleted successfully');
      setDeletingId(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete option');
    }
  };

  const openEdit = (option: AmsReferenceOption) => {
    setEditingOption(option);
    setFormData({
      code: option.code,
      label: option.label,
      group: option.group,
      sort_order: option.sort_order,
      active: option.active
    });
  };

  const options = (listData?.data || []) as AmsReferenceOption[];
  const groups = Array.from(new Set(options.map(o => o.group)));

  const filteredOptions = options.filter(option => {
    const matchesSearch = 
      option.label.toLowerCase().includes(search.toLowerCase()) ||
      option.code.toLowerCase().includes(search.toLowerCase()) ||
      option.group.toLowerCase().includes(search.toLowerCase());
    
    const matchesGroup = selectedGroup === 'all' || option.group === selectedGroup;

    return matchesSearch && matchesGroup;
  });

  const totalCount = options.length;
  const activeCount = options.filter(o => o.active).length;
  const groupsCount = groups.length;

  const columns: AdminColumnDef<AmsReferenceOption>[] = [
    {
      header: 'Group',
      cell: (option) => (
        <Badge variant="outline" className="text-[11px] font-semibold border-border/85 text-muted-foreground uppercase">
          {option.group}
        </Badge>
      ),
      className: 'w-[150px]',
    },
    {
      header: 'Code',
      cell: (option) => <span className="font-mono text-xs text-muted-foreground">{option.code}</span>,
    },
    {
      header: 'Label',
      cell: (option) => <span className="font-semibold text-foreground">{option.label}</span>,
    },
    {
      header: 'Sort Order',
      cell: (option) => <span className="font-mono text-xs text-muted-foreground">{option.sort_order}</span>,
    },
    {
      header: 'Status',
      cell: (option) => (
        <Badge className={cn("text-[11px] font-semibold border-transparent", option.active ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-slate-500/10 text-slate-500')}>
          {option.active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (option) => (
        <div className="flex justify-end gap-1">
          <Button onClick={() => openEdit(option)} variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground"><Edit className="w-4 h-4" /></Button>
          <Button onClick={() => setDeletingId(option.id)} variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-650 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></Button>
        </div>
      ),
      className: 'text-right w-[100px]',
    },
  ];

  const rightActions = (
    <div className="flex items-center gap-2">
      <Select value={selectedGroup} onValueChange={setSelectedGroup}>
        <SelectTrigger className="w-[160px] h-10 rounded-[10px] text-xs font-semibold bg-slate-50/50">
          <SelectValue placeholder="All Groups" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Groups</SelectItem>
          {groups.map(g => (
            <SelectItem key={g} value={g}>{g}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button onClick={() => { resetForm(); setIsCreateOpen(true); }} className="h-10 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-3 text-xs gap-1.5 rounded-[10px] shadow-sm shrink-0">
        <Plus className="w-4 h-4" /> Add Option
      </Button>
    </div>
  );

  return (
    <AdminPageLayout
      title="Reference Options"
      description="Configure core system dictionary options, labels, groups, and sorting rules."
      icon={Database}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <AdminCard>
          <AdminCardContent className="p-4">
            <div className="text-xs font-semibold text-muted-foreground">Total Options</div>
            <div className="text-xl font-bold mt-1 tabular-nums">{totalCount}</div>
          </AdminCardContent>
        </AdminCard>
        <AdminCard>
          <AdminCardContent className="p-4">
            <div className="text-xs font-semibold text-muted-foreground">Active Options</div>
            <div className="text-xl font-bold mt-1 tabular-nums">{activeCount}</div>
          </AdminCardContent>
        </AdminCard>
        <AdminCard>
          <AdminCardContent className="p-4">
            <div className="text-xs font-semibold text-muted-foreground">Option Groups</div>
            <div className="text-xl font-bold mt-1 tabular-nums">{groupsCount}</div>
          </AdminCardContent>
        </AdminCard>
      </div>

      <AdminDataTable
        data={filteredOptions}
        columns={columns}
        isLoading={isLoading}
        error={error}
        searchTerm={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search option, label or group..."
        rightActions={rightActions}
        emptyTitle="No reference options found"
        emptyDescription="Configure reference labels to build list dropdowns."
      />

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Add Reference Option</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-xs font-semibold text-muted-foreground" htmlFor="group">Group / Category</Label>
              <Input 
                id="group"
                value={formData.group} 
                onChange={e => setFormData({ ...formData, group: e.target.value })}
                placeholder="e.g. USER_STATUS" 
                className="h-10 rounded-[10px]"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-semibold text-muted-foreground" htmlFor="code">Option Code</Label>
              <Input 
                id="code"
                value={formData.code} 
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. ACTIVE" 
                className="h-10 rounded-[10px]"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-semibold text-muted-foreground" htmlFor="label">Display Label</Label>
              <Input 
                id="label"
                value={formData.label} 
                onChange={e => setFormData({ ...formData, label: e.target.value })}
                placeholder="e.g. Active" 
                className="h-10 rounded-[10px]"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-semibold text-muted-foreground" htmlFor="sort_order">Sort Order</Label>
              <Input 
                id="sort_order"
                type="number"
                value={formData.sort_order} 
                onChange={e => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                className="h-10 rounded-[10px]"
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Checkbox 
                id="active"
                checked={formData.active} 
                onCheckedChange={checked => setFormData({ ...formData, active: !!checked })}
              />
              <Label className="text-xs font-semibold text-muted-foreground cursor-pointer select-none" htmlFor="active">Active & Enabled</Label>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="h-10 rounded-[10px] text-sm font-semibold">Cancel</Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending} className="h-10 rounded-[10px] text-sm font-semibold">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingOption} onOpenChange={(open) => !open && setEditingOption(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Edit Reference Option</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-xs font-semibold text-muted-foreground" htmlFor="edit-group">Group / Category</Label>
              <Input 
                id="edit-group"
                value={formData.group} 
                onChange={e => setFormData({ ...formData, group: e.target.value })}
                className="h-10 rounded-[10px]"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-semibold text-muted-foreground" htmlFor="edit-code">Option Code</Label>
              <Input 
                id="edit-code"
                value={formData.code} 
                disabled
                className="h-10 rounded-[10px] bg-slate-50 text-slate-400"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-semibold text-muted-foreground" htmlFor="edit-label">Display Label</Label>
              <Input 
                id="edit-label"
                value={formData.label} 
                onChange={e => setFormData({ ...formData, label: e.target.value })}
                className="h-10 rounded-[10px]"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-semibold text-muted-foreground" htmlFor="edit-sort_order">Sort Order</Label>
              <Input 
                id="edit-sort_order"
                type="number"
                value={formData.sort_order} 
                onChange={e => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                className="h-10 rounded-[10px]"
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Checkbox 
                id="edit-active"
                checked={formData.active} 
                onCheckedChange={checked => setFormData({ ...formData, active: !!checked })}
              />
              <Label className="text-xs font-semibold text-muted-foreground cursor-pointer select-none" htmlFor="edit-active">Active & Enabled</Label>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setEditingOption(null)} className="h-10 rounded-[10px] text-sm font-semibold">Cancel</Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending} className="h-10 rounded-[10px] text-sm font-semibold">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-red-500">Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-2 text-xs text-muted-foreground leading-relaxed">
            <p>Are you sure you want to delete this reference option? This action cannot be undone and might break dependencies.</p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            <Button variant="outline" onClick={() => setDeletingId(null)} className="h-10 rounded-[10px] text-sm font-semibold">Cancel</Button>
            <Button onClick={handleDelete} variant="destructive" disabled={deleteMutation.isPending} className="h-10 rounded-[10px] text-sm font-semibold">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  );
}

export default AdminReferenceOptionsPage;
