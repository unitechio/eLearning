import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  useCreateFeatureFlag,
  useDeleteFeatureFlag,
  useFeatureFlags,
  useUpdateFeatureFlag,
  FeatureFlag
} from '@/domains/admin/api/platform';
import {
  ToggleLeft, Plus, Trash2, Key, Sliders, Layers, Search, Eye, Edit,
  ShieldAlert, Settings, Info, Check, CheckCircle2, CircleDot, Inbox
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Badge } from '@/shared/components/ui/badge';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';

const flagFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  key: z.string().min(1, "Key is required"),
  category: z.string().min(1, "Category is required"),
  required_tier: z.string().min(1, "Tier is required"),
  enabled: z.boolean(),
  description: z.string().optional(),
});

type FlagFormValues = z.infer<typeof flagFormSchema>;

export function AdminFeatureFlagsPage() {
  const flagsQuery = useFeatureFlags();
  const createFlag = useCreateFeatureFlag();
  const updateFlag = useUpdateFeatureFlag();
  const deleteFlag = useDeleteFeatureFlag();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnv, setSelectedEnv] = useState('all');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [flagToToggle, setFlagToToggle] = useState<FeatureFlag | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FlagFormValues>({
    resolver: zodResolver(flagFormSchema),
    defaultValues: { name: '', key: '', category: 'premium', required_tier: 'pro', enabled: true, description: '' }
  });

  const watchedEnabled = watch('enabled');
  const flags = flagsQuery.data || [];

  const filteredFlags = flags.filter(flag => {
    const matchesSearch = flag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          flag.key.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const onSubmit = async (data: FlagFormValues) => {
    await createFlag.mutateAsync(data);
    reset({ name: '', key: '', category: 'premium', required_tier: 'pro', enabled: true, description: '' });
    toast.success('Feature flag provisioned successfully');
  };

  const handleToggleClick = (flag: FeatureFlag) => {
    setFlagToToggle(flag);
    setIsConfirmOpen(true);
  };

  const confirmToggleFlag = async () => {
    if (!flagToToggle) return;
    const updated = { ...flagToToggle, enabled: !flagToToggle.enabled };
    await updateFlag.mutateAsync(updated);
    setIsConfirmOpen(false);
    toast.success(`Feature ${updated.enabled ? 'enabled' : 'disabled'} successfully`);
  };

  return (
    <div className="space-y-6 antialiased text-slate-800 dark:text-slate-200 font-inter w-full">
      {/* Page Header */}
      <header className="flex flex-col gap-4 border-b border-slate-100 pb-5 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <nav aria-label="breadcrumb" className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <span>System Config</span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-slate-900 dark:text-slate-100">Feature Flags</span>
          </nav>
          
          <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            Feature Flags & Gateways
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Toggle live platform features, configure entitlement tiers, and provision beta modules.
          </p>
        </div>
      </header>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full">
        {/* Left Column: Form Section */}
        <section aria-label="Provision Gateways" className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="h-4.5 w-4.5 text-indigo-650" />
            <span>Create Feature Flag</span>
          </h3>
          <p className="text-xs text-slate-400 leading-normal">
            Provision a new conditional gate on the application across environments.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
            <div className="space-y-2">
              <Label htmlFor="flag-name">Flag Name</Label>
              <Input id="flag-name" placeholder="Beta Speaking Test Simulator" {...register('name')} />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="flag-key">Unique Key Identifier</Label>
              <Input id="flag-key" placeholder="feature.ielts.speaking-sim" {...register('key')} />
              {errors.key && (
                <p className="text-xs text-destructive">{errors.key.message}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="flag-category">Category</Label>
                <Input id="flag-category" placeholder="premium" {...register('category')} />
                {errors.category && (
                  <p className="text-xs text-destructive">{errors.category.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="flag-tier">Subscription Tier</Label>
                <select
                  id="flag-tier"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold h-[42px] w-full focus:outline-none dark:border-slate-800 dark:bg-slate-950"
                  {...register('required_tier')}
                >
                  <option value="free">free</option>
                  <option value="starter">starter</option>
                  <option value="pro">pro</option>
                  <option value="enterprise">enterprise</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-150 p-3.5 bg-slate-50/20 dark:border-slate-800">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 dark:text-white">Active on Launch</span>
                <p className="text-[10px] text-slate-400 leading-normal">Toggle if users can query this flag immediately.</p>
              </div>
              <Switch
                id="flag-enabled"
                checked={watchedEnabled}
                onCheckedChange={(checked) => setValue('enabled', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="flag-desc">Description</Label>
              <Textarea id="flag-desc" placeholder="Enables the AI speaking mock test simulator interface..." {...register('description')} className="min-h-20" />
            </div>

            <Button type="submit" disabled={createFlag.isPending} className="w-full h-10 gap-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-750 text-white shadow-sm">
              <Plus className="h-4 w-4" />
              <span>{createFlag.isPending ? 'Creating...' : 'Create Flag'}</span>
            </Button>
          </form>
        </section>

        {/* Right Column: DataTable & Matrix */}
        <section aria-label="Provisioned Feature flags list" className="lg:col-span-2 space-y-6">
          {/* Table Toolbar */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full sm:w-[260px]">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search feature flags"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 text-xs rounded-lg border-slate-200 bg-white dark:bg-slate-950 dark:border-slate-800"
              />
            </div>

            {/* Environments filter selectors */}
            <div className="flex items-center gap-1.5 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-lg p-1">
              {(['all', 'prod', 'staging', 'dev'] as const).map((env) => (
                <button
                  key={env}
                  type="button"
                  onClick={() => setSelectedEnv(env)}
                  className={cn(
                    "px-3 py-1 rounded text-xs font-bold capitalize transition-all border-none bg-transparent",
                    selectedEnv === env
                      ? "bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-850 dark:hover:text-slate-205"
                  )}
                >
                  {env}
                </button>
              ))}
            </div>
          </div>

          {/* DataTable */}
          <div className="border border-slate-200/60 dark:border-slate-800/60 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 dark:bg-slate-950/20">
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Feature</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Environment</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Availability / Tier</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</TableHead>
                  <TableHead className="w-[85px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flagsQuery.isLoading ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <TableRow key={idx} className="animate-pulse">
                      <TableCell colSpan={5} className="h-14 bg-slate-50/30 dark:bg-slate-900/10" />
                    </TableRow>
                  ))
                ) : filteredFlags.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-36 text-center text-slate-400 font-medium">
                      <Inbox className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <span>No feature flags configured.</span>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFlags.map((flag) => (
                    <TableRow key={flag.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors">
                      <TableCell>
                        <div className="font-bold text-slate-900 dark:text-white text-xs">{flag.name}</div>
                        <div className="font-mono text-[9px] text-slate-400 mt-0.5 tracking-wider uppercase">{flag.key}</div>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-350">
                          <CircleDot className="h-3 w-3 text-emerald-500 fill-emerald-500" /> Production
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border-none font-bold text-[9px]">
                          {flag.required_tier || 'free'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={flag.enabled}
                          onCheckedChange={() => handleToggleClick(flag)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => void deleteFlag.mutateAsync(flag.id)}
                            className="h-7 w-7 text-rose-500 hover:text-rose-650 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                            aria-label={`Delete flag ${flag.name}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Entitlement / Plan Matrix Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="h-4.5 w-4.5 text-indigo-650" />
                <span>Entitlement / Plan Matrix</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Summary of features provisioned to each tier plan.</p>
            </div>
            
            <div className="border border-slate-100 rounded-lg overflow-hidden text-xs">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead className="font-bold text-slate-500 text-[10px]">Feature</TableHead>
                    <TableHead className="font-bold text-slate-500 text-[10px] text-center">Free</TableHead>
                    <TableHead className="font-bold text-slate-500 text-[10px] text-center">Starter</TableHead>
                    <TableHead className="font-bold text-slate-500 text-[10px] text-center">Pro</TableHead>
                    <TableHead className="font-bold text-slate-500 text-[10px] text-center">Enterprise</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-bold">AI Speaking Simulator</TableCell>
                    <TableCell className="text-center text-slate-350">—</TableCell>
                    <TableCell className="text-center text-slate-350">—</TableCell>
                    <TableCell className="text-center text-emerald-500 font-bold"><Check className="h-3.5 w-3.5 mx-auto" /></TableCell>
                    <TableCell className="text-center text-emerald-500 font-bold"><Check className="h-3.5 w-3.5 mx-auto" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">Advanced Analytics</TableCell>
                    <TableCell className="text-center text-slate-350">—</TableCell>
                    <TableCell className="text-center text-slate-350">—</TableCell>
                    <TableCell className="text-center text-emerald-500 font-bold"><Check className="h-3.5 w-3.5 mx-auto" /></TableCell>
                    <TableCell className="text-center text-emerald-500 font-bold"><Check className="h-3.5 w-3.5 mx-auto" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">SSO Gateway Authentication</TableCell>
                    <TableCell className="text-center text-slate-350">—</TableCell>
                    <TableCell className="text-center text-slate-350">—</TableCell>
                    <TableCell className="text-center text-slate-350">—</TableCell>
                    <TableCell className="text-center text-emerald-500 font-bold"><Check className="h-3.5 w-3.5 mx-auto" /></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
      </div>

      {/* Confirmation Dialog on production flag change */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="max-w-[400px] rounded-2xl p-5 border bg-white dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-sm font-bold text-foreground">
              <ShieldAlert className="h-5 w-5 text-rose-500" />
              <span>Toggle Feature Flag?</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-2 leading-normal">
              You are about to change this feature status in <strong>Production</strong>. This change is high-impact and will propagate immediately to active clients.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 pt-2 border-t flex justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsConfirmOpen(false)}
              className="h-9 font-bold text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmToggleFlag}
              className="h-9 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4"
            >
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default AdminFeatureFlagsPage;
