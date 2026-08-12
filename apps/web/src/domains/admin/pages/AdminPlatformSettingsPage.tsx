import React, { useState, useMemo } from 'react';
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
import {
  Settings, Plus, Lock, Unlock, Trash2, Layers, Cpu,
  User, Shield, Users, CreditCard, Bell, Cpu as IntegrationsIcon, Globe,
  Check, Info, Sparkles
} from 'lucide-react';
import { AdminPageHeader, AdminCard, AdminCardHeader, AdminCardTitle, AdminCardDescription, AdminCardContent } from '@/shared/components/admin';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Badge } from '@/shared/components/ui/badge';
import { toast } from 'sonner';

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

type SettingsTab =
  | 'details'
  | 'profile'
  | 'password'
  | 'team'
  | 'billing'
  | 'notifications'
  | 'integrations'
  | 'system';

export function AdminPlatformSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('notifications');

  // React hook query for environments & system settings
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
    toast.success('Environment created successfully');
  };

  const onSettingSubmit = async (data: SettingFormValues) => {
    await createSetting.mutateAsync({
      ...data,
      description: '',
      is_public: false,
      is_editable: true,
    });
    setForm.reset({ key: '', type: 'string', category: 'general', value: '' });
    toast.success('System setting created successfully');
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
    toast.success(`Environment ${item.is_active ? 'deactivated' : 'activated'}`);
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
    toast.success(`Setting locked status toggled`);
  };

  // Notification tab settings states matching Screenshot 3
  const [notifyNews, setNotifyNews] = useState(true);
  const [notifyTips, setNotifyTips] = useState(true);
  const [notifyResearch, setNotifyResearch] = useState(false);

  const [commentPref, setCommentPref] = useState<'none' | 'mentions' | 'all'>('all');
  const [reminderPref, setReminderPref] = useState<'none' | 'important' | 'all'>('all');
  const [activityPref, setActivityPref] = useState<'none' | 'all'>('none');

  const handleSaveNotifications = () => {
    toast.success('Notification preferences updated');
  };

  // Left sub-sidebar navigation items config
  const navItems = [
    { id: 'details', label: 'My details', icon: User },
    { id: 'profile', label: 'Profile', icon: Shield },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: '10' },
    { id: 'integrations', label: 'Integrations', icon: IntegrationsIcon },
    { id: 'system', label: 'System Config', icon: Globe },
  ] as const;

  return (
    <div className="space-y-6 sm:space-y-8 text-slate-800 dark:text-slate-200 antialiased font-inter">
      <AdminPageHeader
        title="Settings"
        description="Configure your personal options, team workspace settings, and system parameters."
        icon={Settings}
      />

      {/* Main settings panel with sub-sidebar layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start w-full">
        {/* Left Sub-Sidebar (1/4 Column) */}
        <aside className="lg:col-span-1 flex flex-col gap-6" aria-label="Settings categories">
          <nav className="flex flex-col gap-1" aria-label="Settings sub-navigation">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex items-center justify-between px-3 py-2 text-xs font-bold rounded-lg transition-colors border-none text-left w-full",
                  activeTab === item.id
                    ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:text-slate-200 dark:hover:bg-slate-800/40"
                )}
              >
                <span className="flex items-center gap-2.5">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </span>
                {'badge' in item && item.badge && (
                  <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold border-none text-[9px]">
                    {item.badge}
                  </Badge>
                )}
              </button>
            ))}
          </nav>

          {/* New features available card matching Screenshot 3 */}
          <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-4 space-y-3.5 shadow-sm">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">New features available!</h4>
            <p className="text-[11px] text-slate-500 leading-normal">
              Check out the new dashboard view. Pages and exports now load faster.
            </p>
            <div className="h-24 overflow-hidden rounded bg-slate-100 dark:bg-slate-800 relative">
              <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                <Sparkles className="h-8 w-8 stroke-[1.2] text-indigo-500" />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1 text-[11px] font-bold">
              <button type="button" className="text-slate-500 hover:text-slate-800">Dismiss</button>
              <button type="button" className="text-indigo-600 hover:text-indigo-700">What's new?</button>
            </div>
          </div>
        </aside>

        {/* Right Content Pane (3/4 Column) */}
        <section className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/65 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-6" aria-label="Settings configuration panel">
          {/* Tab 1: Notifications Settings matching Screenshot 3 */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <header className="border-b border-slate-100 pb-4 dark:border-slate-800">
                <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">
                  Email notifications
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Get emails to find out what's going on when you're not online. You can turn them off anytime.
                </p>
              </header>

              <div className="space-y-6 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {/* 1. Notifications from us */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 first:pt-0">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Notifications from us</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                      Receive the latest news, updates and industry tutorials from us.
                    </p>
                  </div>
                  <div className="md:col-span-2 space-y-3.5">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyNews}
                        onChange={(e) => setNotifyNews(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-350 text-indigo-650 focus:ring-indigo-500"
                      />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">News and updates</span>
                        <p className="text-[10px] text-slate-500 mt-0.5">News about product and feature updates.</p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyTips}
                        onChange={(e) => setNotifyTips(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-350 text-indigo-650 focus:ring-indigo-500"
                      />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">Tips and tutorials</span>
                        <p className="text-[10px] text-slate-500 mt-0.5">Tips on getting more out of platform.</p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyResearch}
                        onChange={(e) => setNotifyResearch(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-350 text-indigo-650 focus:ring-indigo-500"
                      />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">User research</span>
                        <p className="text-[10px] text-slate-500 mt-0.5">Get involved in our beta testing program or participate in paid user research.</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* 2. Comments options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Comments</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                      These are notifications for comments on your posts and replies to your comments.
                    </p>
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="comments"
                        checked={commentPref === 'none'}
                        onChange={() => setCommentPref('none')}
                        className="h-4 w-4 border-slate-350 text-indigo-650 focus:ring-indigo-500"
                      />
                      <span className="font-bold text-slate-800 dark:text-slate-300">Do not notify me</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="comments"
                        checked={commentPref === 'mentions'}
                        onChange={() => setCommentPref('mentions')}
                        className="h-4 w-4 border-slate-350 text-indigo-650 focus:ring-indigo-500"
                      />
                      <span className="font-bold text-slate-800 dark:text-slate-300">Mentions only</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="comments"
                        checked={commentPref === 'all'}
                        onChange={() => setCommentPref('all')}
                        className="h-4 w-4 border-slate-350 text-indigo-650 focus:ring-indigo-500"
                      />
                      <span className="font-bold text-slate-800 dark:text-slate-300">All comments</span>
                    </label>
                  </div>
                </div>

                {/* 3. Reminders options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Reminders</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                      These are notifications to remind you of updates you might have missed.
                    </p>
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="reminders"
                        checked={reminderPref === 'none'}
                        onChange={() => setReminderPref('none')}
                        className="h-4 w-4 border-slate-350 text-indigo-650 focus:ring-indigo-500"
                      />
                      <span className="font-bold text-slate-800 dark:text-slate-300">Do not notify me</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="reminders"
                        checked={reminderPref === 'important'}
                        onChange={() => setReminderPref('important')}
                        className="h-4 w-4 border-slate-350 text-indigo-650 focus:ring-indigo-500"
                      />
                      <span className="font-bold text-slate-800 dark:text-slate-300">Important reminders only</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="reminders"
                        checked={reminderPref === 'all'}
                        onChange={() => setReminderPref('all')}
                        className="h-4 w-4 border-slate-350 text-indigo-650 focus:ring-indigo-500"
                      />
                      <span className="font-bold text-slate-800 dark:text-slate-300">All reminders</span>
                    </label>
                  </div>
                </div>

                {/* 4. More activity about you */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">More activity about you</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                      These are notifications for posts on your profile, likes and other reactions.
                    </p>
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="activity"
                        checked={activityPref === 'none'}
                        onChange={() => setActivityPref('none')}
                        className="h-4 w-4 border-slate-350 text-indigo-650 focus:ring-indigo-500"
                      />
                      <span className="font-bold text-slate-800 dark:text-slate-300">Do not notify me</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="activity"
                        checked={activityPref === 'all'}
                        onChange={() => setActivityPref('all')}
                        className="h-4 w-4 border-slate-350 text-indigo-650 focus:ring-indigo-500"
                      />
                      <span className="font-bold text-slate-800 dark:text-slate-300">All reminders</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Footer */}
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <Button variant="outline" size="sm" className="h-9 px-4 rounded-lg font-bold border-slate-200">
                  Cancel
                </Button>
                <Button onClick={handleSaveNotifications} size="sm" className="h-9 px-5 bg-indigo-600 hover:bg-indigo-750 text-white rounded-lg font-bold">
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {/* Original Platform Environments and System Config forms */}
          {activeTab === 'system' && (
            <div className="space-y-8">
              <header className="border-b border-slate-100 pb-4 dark:border-slate-800">
                <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">
                  System Variables & Environments
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Manage application environments, global variables, and active system properties.
                </p>
              </header>

              <div className="grid gap-6 xl:grid-cols-2">
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
          )}

          {/* Under construction message for tabs that are mock */}
          {activeTab !== 'notifications' && activeTab !== 'system' && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Bell className="h-10 w-10 text-indigo-500 animate-bounce mb-4" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white capitalize">
                {activeTab.replace('_', ' ')} settings section
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-[280px]">
                This tab is currently mock. Please select "Notifications" or "System Config" for complete features.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
export default AdminPlatformSettingsPage;
