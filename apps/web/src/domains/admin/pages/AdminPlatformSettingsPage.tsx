import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { cn } from '@/shared/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  useCreateEnvironment,
  useCreateSystemSetting,
  useDeleteEnvironment,
  useDeleteSystemSetting,
  usePlatformEnvironments,
  useSystemSettings,
  useUpdateEnvironment,
  useUpdateSystemSetting,
} from '@/domains/admin/api/platform';
import { PlatformEnvironment, SystemSetting } from '@/domains/admin/api/platform';
import { Settings, Plus, Lock, Unlock, Trash2, Layers, Cpu } from 'lucide-react';
import { AdminPageHeader, AdminCard, AdminCardHeader, AdminCardTitle, AdminCardDescription, AdminCardContent } from '@/shared/components/admin';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';

// Zod schemas for validation
const environmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  type: z.string().min(1, "Type is required"),
  description: z.string().optional(),
});

type EnvironmentFormValues = z.infer<typeof environmentSchema>;

const settingSchema = z.object({
  key: z.string().min(1, "Key is required"),
  type: z.string().min(1, "Type is required"),
  category: z.string().min(1, "Category is required"),
  value: z.string().min(1, "Value is required"),
});

type SettingFormValues = z.infer<typeof settingSchema>;

export function AdminPlatformSettingsPage() {
  const environmentsQuery = usePlatformEnvironments();
  const settingsQuery = useSystemSettings();

  const createEnvironment = useCreateEnvironment();
  const updateEnvironment = useUpdateEnvironment();
  const deleteEnvironment = useDeleteEnvironment();

  const createSetting = useCreateSystemSetting();
  const updateSetting = useUpdateSystemSetting();
  const deleteSetting = useDeleteSystemSetting();

  // Environment form
  const envForm = useForm<EnvironmentFormValues>({
    resolver: zodResolver(environmentSchema),
    defaultValues: { name: '', slug: '', type: 'general', description: '' }
  });

  // Setting form
  const setForm = useForm<SettingFormValues>({
    resolver: zodResolver(settingSchema),
    defaultValues: { key: '', type: 'string', category: 'general', value: '' }
  });

  const sortedSettings = useMemo(() => (settingsQuery.data ?? []).slice(0, 30), [settingsQuery.data]);

  const onEnvironmentSubmit = async (data: EnvironmentFormValues) => {
    await createEnvironment.mutateAsync({
      ...data,
      color: '',
      sort_order: 0,
      is_active: true,
    });
    envForm.reset({ name: '', slug: '', type: 'general', description: '' });
  };

  const onSettingSubmit = async (data: SettingFormValues) => {
    await createSetting.mutateAsync({
      ...data,
      description: '',
      is_public: false,
      is_editable: true,
    });
    setForm.reset({ key: '', type: 'string', category: 'general', value: '' });
  };

  const toggleEnvironment = async (item: PlatformEnvironment) => {
    await updateEnvironment.mutateAsync({
      id: item.id,
      payload: {
        name: item.name,
        slug: item.slug,
        description: item.description,
        type: item.type,
        url: item.url,
        color: item.color,
        sort_order: item.sort_order,
        is_active: !item.is_active,
      },
    });
  };

  const toggleSettingEditable = async (item: SystemSetting) => {
    await updateSetting.mutateAsync({
      id: item.id,
      payload: {
        key: item.key,
        value: item.value,
        type: item.type || 'string',
        category: item.category,
        description: item.description,
        is_public: item.is_public,
        is_editable: !item.is_editable,
      },
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <AdminPageHeader
        title="Platform Settings"
        description="Configure application environments, global variables, and active system properties."
        icon={Settings}
      />

      <div className="grid gap-6 lg:gap-8 xl:grid-cols-2">
        {/* Environments section */}
        <AdminCard>
          <AdminCardHeader>
            <div className="flex items-center justify-between">
              <div>
                <AdminCardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  <span>Environments</span>
                </AdminCardTitle>
                <AdminCardDescription>Manage application hosting environments and states.</AdminCardDescription>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
                {(environmentsQuery.data ?? []).length} items
              </span>
            </div>
          </AdminCardHeader>
          <AdminCardContent className="space-y-6">
            {/* Create form */}
            <form onSubmit={envForm.handleSubmit(onEnvironmentSubmit)} className="space-y-4 bg-muted/30 p-4 rounded-xl border border-border">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">New Environment</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="env-name">Name</Label>
                  <Input id="env-name" placeholder="Production" {...envForm.register('name')} />
                  {envForm.formState.errors.name && (
                    <p className="text-xs text-destructive">{envForm.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="env-slug">Slug</Label>
                  <Input id="env-slug" placeholder="prod" {...envForm.register('slug')} />
                  {envForm.formState.errors.slug && (
                    <p className="text-xs text-destructive">{envForm.formState.errors.slug.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="env-type">Type</Label>
                <Input id="env-type" placeholder="general" {...envForm.register('type')} />
                {envForm.formState.errors.type && (
                  <p className="text-xs text-destructive">{envForm.formState.errors.type.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="env-desc">Description</Label>
                <Textarea id="env-desc" placeholder="Core hosting platform for user traffic" {...envForm.register('description')} className="min-h-20" />
              </div>
              <Button type="submit" className="w-full h-10 gap-2 rounded-xl text-xs font-bold" disabled={createEnvironment.isPending}>
                <Plus className="h-4 w-4" />
                <span>{createEnvironment.isPending ? 'Creating...' : 'Create Environment'}</span>
              </Button>
            </form>

            {/* List */}
            <section className="space-y-3" aria-label="Environment List">
              {(environmentsQuery.data ?? []).map((item) => (
                <div key={item.id} className="rounded-xl border border-border bg-card hover:bg-muted/10 p-4 transition-colors flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.description || 'No description provided.'}</p>
                    <span className="inline-block mt-2 rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground uppercase">{item.type}</span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void toggleEnvironment(item)}
                      className={cn("h-8 text-xs font-bold rounded-lg", item.is_active ? "text-amber-600 hover:text-amber-700" : "text-emerald-600 hover:text-emerald-700")}
                    >
                      {item.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => void deleteEnvironment.mutateAsync(item.id)}
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg"
                      aria-label={`Delete environment ${item.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </section>
          </AdminCardContent>
        </AdminCard>

        {/* Settings section */}
        <AdminCard>
          <AdminCardHeader>
            <div className="flex items-center justify-between">
              <div>
                <AdminCardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-primary" />
                  <span>System Settings</span>
                </AdminCardTitle>
                <AdminCardDescription>Browse and modify application system attributes.</AdminCardDescription>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
                {(settingsQuery.data ?? []).length} keys
              </span>
            </div>
          </AdminCardHeader>
          <AdminCardContent className="space-y-6">
            {/* Create form */}
            <form onSubmit={setForm.handleSubmit(onSettingSubmit)} className="space-y-4 bg-muted/30 p-4 rounded-xl border border-border">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">New Setting Key</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="set-key">Key Name</Label>
                  <Input id="set-key" placeholder="api.timeout" {...setForm.register('key')} />
                  {setForm.formState.errors.key && (
                    <p className="text-xs text-destructive">{setForm.formState.errors.key.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="set-category">Category</Label>
                  <Input id="set-category" placeholder="network" {...setForm.register('category')} />
                  {setForm.formState.errors.category && (
                    <p className="text-xs text-destructive">{setForm.formState.errors.category.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="set-type">Value Type</Label>
                <Input id="set-type" placeholder="number" {...setForm.register('type')} />
                {setForm.formState.errors.type && (
                  <p className="text-xs text-destructive">{setForm.formState.errors.type.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="set-value">Setting Value</Label>
                <Textarea id="set-value" placeholder="3000" {...setForm.register('value')} className="min-h-20" />
                {setForm.formState.errors.value && (
                  <p className="text-xs text-destructive">{setForm.formState.errors.value.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full h-10 gap-2 rounded-xl text-xs font-bold" disabled={createSetting.isPending}>
                <Plus className="h-4 w-4" />
                <span>{createSetting.isPending ? 'Creating...' : 'Create Setting'}</span>
              </Button>
            </form>

            {/* List */}
            <section className="space-y-3" aria-label="System Settings List">
              {sortedSettings.map((item) => (
                <div key={item.id} className="rounded-xl border border-border bg-card hover:bg-muted/10 p-4 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-foreground truncate">{item.key}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                        {item.category || 'general'} · {item.type || 'string'}
                      </p>
                      <p className="mt-2 font-mono text-xs bg-muted/65 p-2 rounded-lg break-all border border-border/40 text-foreground/80">
                        {item.value}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => void toggleSettingEditable(item)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
                        aria-label={item.is_editable ? "Lock setting" : "Unlock setting"}
                      >
                        {item.is_editable ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => void deleteSetting.mutateAsync(item.id)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg"
                        aria-label={`Delete setting ${item.key}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </AdminCardContent>
        </AdminCard>
      </div>
    </div>
  );
}
