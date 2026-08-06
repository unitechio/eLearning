import React, { useState } from 'react';
import { 
  AdminPageLayout, AdminCard, AdminCardHeader, AdminCardTitle, AdminCardContent, AdminDataTable, type AdminColumnDef 
} from '@/shared/components/admin';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/ui/dialog';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { ShieldCheck, Plus, Edit, Trash2, ShieldAlert, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { 
  useAmsRoles, useCreateAmsRole, useUpdateAmsRole, useDeleteAmsRole, 
  useAmsPermissions, useAssignRolePermissions, AmsRole 
} from '@/domains/admin/api/ams';
import { cn } from '@/shared/lib/utils';

export function AdminAccessPage() {
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions' | 'assign'>('roles');
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  const { data: roles, isLoading: rolesLoading, error: rolesError } = useAmsRoles();
  const { data: permissions, isLoading: permissionsLoading } = useAmsPermissions();
  const roleList = (roles?.data || []) as AmsRole[];
  
  const createRole = useCreateAmsRole();
  const updateRole = useUpdateAmsRole();
  const deleteRole = useDeleteAmsRole();
  const assignPermissions = useAssignRolePermissions();

  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<AmsRole | null>(null);
  const [deletingRoleId, setDeletingRoleId] = useState<number | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const [roleForm, setRoleForm] = useState({ name: '', description: '' });

  // Group permissions
  const groupedPermissions = React.useMemo(() => {
    if (!permissions) return {};
    return permissions.reduce((acc: any, perm: any) => {
      const group = perm.group_name || 'General';
      if (!acc[group]) acc[group] = [];
      acc[group].push(perm);
      return acc;
    }, {});
  }, [permissions]);

  const handleRoleSubmit = async () => {
    try {
      if (editingRole) {
        await updateRole.mutateAsync({ id: editingRole.id, payload: roleForm });
        toast.success('Role updated');
      } else {
        await createRole.mutateAsync(roleForm);
        toast.success('Role created');
      }
      setIsRoleDialogOpen(false);
      setEditingRole(null);
    } catch (e: any) {
      toast.error(e.message || 'Failed to save role');
    }
  };

  const handleDeleteRole = async () => {
    if (deletingRoleId === null) return;
    try {
      await deleteRole.mutateAsync(deletingRoleId);
      toast.success('Role deleted');
      setDeletingRoleId(null);
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete role');
    }
  };

  const handleAssignPermissionsClick = (roleId: number) => {
    setSelectedRoleId(roleId);
    setActiveTab('assign');
  };

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  // Columns for Roles Table
  const roleColumns: AdminColumnDef<AmsRole>[] = [
    {
      header: 'Role Name',
      cell: (role) => <span className="font-semibold text-foreground">{role.name}</span>,
    },
    {
      header: 'Description',
      cell: (role) => <span className="text-muted-foreground">{role.description}</span>,
    },
    {
      header: 'Actions',
      cell: (role) => (
        <div className="flex justify-end gap-1.5 items-center pr-2">
          <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs font-semibold" onClick={() => handleAssignPermissionsClick(role.id)}>
            Assign Permissions
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => { setRoleForm({name: role.name, description: role.description}); setEditingRole(role); }}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-650 hover:bg-red-500/10" onClick={() => setDeletingRoleId(role.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
      className: 'text-right w-[260px]',
    },
  ];

  const tabs = [
    { value: 'roles', label: 'System Roles' },
    { value: 'permissions', label: 'Permissions Registry' },
    { value: 'assign', label: 'Assign Matrix' }
  ];

  const rolesRightActions = (
    <Button size="sm" className="h-10 rounded-[10px] text-xs font-semibold" onClick={() => { setRoleForm({name: '', description: ''}); setIsRoleDialogOpen(true); }}>
      <Plus className="w-4 h-4 mr-1.5"/> Add Role
    </Button>
  );

  return (
    <AdminPageLayout
      title="Access & Roles" 
      description="Manage Role-Based Access Control (RBAC) scopes, policy parameters, and assignment matrices."
      icon={ShieldCheck}
    >
      {/* Access Settings Tabs */}
      <nav aria-label="Access Settings Tabs" className="flex gap-1 border-b border-border/60 pb-px">
        {tabs.map(tab => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value as any)}
            className={cn(
              "px-4 py-2 text-xs font-semibold border-b-2 transition-colors relative -mb-px",
              activeTab === tab.value 
                ? 'border-primary text-foreground' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="w-full">
        {activeTab === 'roles' && (
          <AdminDataTable
            data={roleList}
            columns={roleColumns}
            isLoading={rolesLoading}
            error={rolesError}
            rightActions={rolesRightActions}
            emptyTitle="No roles found"
            emptyDescription="Create authorization roles to allocate access groups."
          />
        )}
        
        {activeTab === 'permissions' && (
          <AdminCard>
            <AdminCardHeader>
              <AdminCardTitle>Permissions Registry</AdminCardTitle>
            </AdminCardHeader>
            <AdminCardContent>
              {permissionsLoading ? (
                <div className="flex justify-center py-12 text-muted-foreground"><Plus className="animate-spin w-5 h-5 mr-2" /> Loading registry...</div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(groupedPermissions).map(([group, perms]: any) => (
                    <div key={group} className="border border-border/80 rounded-xl overflow-hidden bg-slate-50/20 dark:bg-slate-900/10">
                      <button 
                        type="button"
                        className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-900/50 text-left font-semibold text-xs transition-colors"
                        onClick={() => toggleGroup(group)}
                      >
                        <span className="flex items-center gap-2 text-foreground">
                          {expandedGroups[group] ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                          {group}
                          <Badge variant="outline" className="text-[10px] text-muted-foreground">{perms.length}</Badge>
                        </span>
                      </button>
                      {expandedGroups[group] && (
                        <div className="p-0 border-t border-border/60">
                          <table className="w-full text-sm text-left">
                            <tbody>
                              {perms.map((p: any) => (
                                <tr key={p.id} className="border-b border-border/40 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900/20">
                                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground w-1/3">{p.code}</td>
                                  <td className="px-4 py-3 text-[13px] text-foreground/80">{p.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </AdminCardContent>
          </AdminCard>
        )}

        {activeTab === 'assign' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <AdminCard className="md:col-span-1">
              <AdminCardHeader>
                <AdminCardTitle>Select Role</AdminCardTitle>
              </AdminCardHeader>
              <AdminCardContent className="p-0 border-t border-border/40">
                <div className="flex flex-col divide-y divide-border/50">
                  {roleList.map((role: AmsRole) => (
                    <button 
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRoleId(role.id)}
                      className={cn(
                        "p-4 text-left text-xs transition-colors relative outline-none",
                        selectedRoleId === role.id 
                          ? 'bg-[#EEF2FF]/80 text-[#111827] dark:bg-[#1e1b4b]/60 dark:text-white' 
                          : 'hover:bg-slate-50/50 dark:hover:bg-slate-900/30'
                      )}
                    >
                      {selectedRoleId === role.id && (
                        <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#6366F1] dark:bg-[#818cf8]" />
                      )}
                      <div className="font-semibold text-[13px]">{role.name}</div>
                      <div className="text-muted-foreground mt-1 truncate max-w-[160px]">{role.description}</div>
                    </button>
                  ))}
                </div>
              </AdminCardContent>
            </AdminCard>
            <AdminCard className="md:col-span-3">
              <AdminCardHeader className="flex flex-row justify-between items-center">
                <AdminCardTitle>
                  {selectedRoleId 
                    ? `Permission Matrix — ${roleList.find((r: AmsRole) => r.id === selectedRoleId)?.name}` 
                    : 'Permission Matrix'}
                </AdminCardTitle>
                {selectedRoleId && (
                  <Button size="sm" className="h-9 rounded-lg font-semibold text-xs" onClick={() => toast.success('Permissions saved')}>
                    Save Changes
                  </Button>
                )}
              </AdminCardHeader>
              <AdminCardContent className="border-t border-border/40 pt-4">
                {!selectedRoleId ? (
                  <div className="text-center py-16 text-muted-foreground border border-dashed border-border/80 rounded-2xl">
                    Select a role from the left panel to configure its permissions.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(groupedPermissions).map(([group, perms]: any) => (
                      <div key={group} className="space-y-2">
                        <h4 className="font-bold text-[10px] tracking-[0.12em] text-[#98A2B3] dark:text-[#71717a] uppercase mb-3 pl-1">{group}</h4>
                        <div className="grid gap-2">
                          {perms.map((p: any) => (
                            <div key={p.id} className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-slate-50/10 dark:bg-slate-900/10 hover:bg-slate-50/20">
                              <div>
                                <div className="text-[13px] font-semibold text-foreground">{p.name || p.code}</div>
                                <div className="text-[11px] text-muted-foreground font-mono mt-0.5">{p.code}</div>
                              </div>
                              <Select defaultValue="none">
                                <SelectTrigger className="w-[140px] h-9 text-xs rounded-lg bg-slate-50/50">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">None</SelectItem>
                                  <SelectItem value="self">Self</SelectItem>
                                  <SelectItem value="dept">Department</SelectItem>
                                  <SelectItem value="global">Global</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </AdminCardContent>
            </AdminCard>
          </div>
        )}
      </div>

      {/* Role Dialog */}
      <Dialog open={isRoleDialogOpen || !!editingRole} onOpenChange={(open) => {
        if (!open) { setIsRoleDialogOpen(false); setEditingRole(null); }
      }}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">{editingRole ? 'Edit Role' : 'Create Role'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-xs font-semibold text-muted-foreground">Role Name</Label>
              <Input 
                value={roleForm.name} 
                onChange={e => setRoleForm({...roleForm, name: e.target.value})} 
                placeholder="e.g. Content Manager" 
                className="h-10 rounded-[10px]"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-semibold text-muted-foreground">Description</Label>
              <Input 
                value={roleForm.description} 
                onChange={e => setRoleForm({...roleForm, description: e.target.value})} 
                placeholder="Role purpose..." 
                className="h-10 rounded-[10px]"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => { setIsRoleDialogOpen(false); setEditingRole(null); }} className="h-10 rounded-[10px] text-sm font-semibold">Cancel</Button>
            <Button onClick={handleRoleSubmit} disabled={createRole.isPending || updateRole.isPending} className="h-10 rounded-[10px] text-sm font-semibold">
              {editingRole ? 'Save Changes' : 'Create Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Role Dialog */}
      <Dialog open={deletingRoleId !== null} onOpenChange={(open) => !open && setDeletingRoleId(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-semibold text-red-500">
              <ShieldAlert className="w-5 h-5" /> 
              <span>Delete Role</span>
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground leading-relaxed py-2">
            Are you sure you want to delete this role? Users assigned to this role will lose associated permissions.
          </p>
          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            <Button variant="outline" onClick={() => setDeletingRoleId(null)} className="h-10 rounded-[10px] text-sm font-semibold">Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteRole} disabled={deleteRole.isPending} className="h-10 rounded-[10px] text-sm font-semibold">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  );
}

export default AdminAccessPage;
