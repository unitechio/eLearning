import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateFeatureFlag, useDeleteFeatureFlag, useFeatureFlags, useUpdateFeatureFlag } from '@/domains/admin/api/platform';
import { FeatureFlag } from '@/domains/admin/api/platform';
import { ToggleLeft, Plus, Trash2, Key, Sliders, Layers } from 'lucide-react';
import {
  AdminPageHeader,
  AdminCard,
  AdminCardHeader,
  AdminCardTitle,
  AdminCardDescription,
  AdminCardContent,
  AdminStatusBadge
} from '@/shared/components/admin';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { cn } from '@/shared/lib/utils';

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

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FlagFormValues>({
    resolver: zodResolver(flagFormSchema),
    defaultValues: { name: '', key: '', category: 'premium', required_tier: 'pro', enabled: true, description: '' }
  });

  const watchedEnabled = watch('enabled');

  const onSubmit = async (data: FlagFormValues) => {
    await createFlag.mutateAsync(data);
    reset({ name: '', key: '', category: 'premium', required_tier: 'pro', enabled: true, description: '' });
  };

  const toggleFlag = async (flag: FeatureFlag) => {
    await updateFlag.mutateAsync({ ...flag, enabled: !flag.enabled });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <AdminPageHeader
        title="Feature Flags & Gateways"
        description="Toggle live platform features, configure entitlement tiers, and provision beta modules."
        icon={ToggleLeft}
      />

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-10">
        {/* Create flag form */}
        <section className="lg:col-span-4" aria-label="Create Feature Flag">
          <AdminCard>
            <AdminCardHeader>
              <AdminCardTitle className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-primary" />
                <span>Create Feature Flag</span>
              </AdminCardTitle>
              <AdminCardDescription>Provision a new conditional gate on the application.</AdminCardDescription>
            </AdminCardHeader>
            <AdminCardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    <Label htmlFor="flag-tier">Required Subscription Tier</Label>
                    <select
                      id="flag-tier"
                      className="rounded-lg border border-input bg-card px-3 py-2 text-xs font-semibold h-[42px] w-full focus:outline-none"
                      {...register('required_tier')}
                    >
                      <option value="free">free</option>
                      <option value="starter">starter</option>
                      <option value="pro">pro</option>
                      <option value="enterprise">enterprise</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border p-3.5 bg-muted/20">
                  <div className="space-y-0.5">
                    <Label htmlFor="flag-enabled" className="text-xs font-bold text-foreground">Active on Launch</Label>
                    <p className="text-[10px] text-muted-foreground">Toggle if users can query this flag immediately.</p>
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

                <Button type="submit" disabled={createFlag.isPending} className="w-full h-10 gap-2 rounded-xl text-xs font-bold">
                  <Plus className="h-4 w-4" />
                  <span>{createFlag.isPending ? 'Creating...' : 'Create Flag'}</span>
                </Button>
              </form>
            </AdminCardContent>
          </AdminCard>
        </section>

        {/* Feature flags grid list */}
        <section className="lg:col-span-6 space-y-4" aria-label="Feature Flags Grid">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span>Provisioned Gates</span>
            </h2>
            <span className="text-xs font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded">
              {(flagsQuery.data ?? []).length} keys
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {(flagsQuery.data ?? []).map((flag) => (
              <AdminCard key={flag.id} className="hover:-translate-y-0 hover:shadow-xs transition-none">
                <AdminCardContent className="p-4 flex flex-col justify-between h-full space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-foreground truncate">{flag.name}</h3>
                        <p className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mt-0.5 truncate">{flag.key}</p>
                      </div>
                      <AdminStatusBadge state={flag.enabled ? 'active' : 'inactive'} label={flag.enabled ? 'enabled' : 'disabled'} />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2 h-8 leading-relaxed">
                      {flag.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-border/40">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="rounded bg-muted px-2 py-0.5 text-[9px] font-bold text-muted-foreground uppercase">{flag.category || 'general'}</span>
                      <span className="rounded bg-primary/10 border border-primary/15 px-2 py-0.5 text-[9px] font-bold text-primary uppercase">{flag.required_tier || 'free'}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => void toggleFlag(flag)}
                        className={cn(
                          "h-8 text-xs font-bold rounded-lg px-3",
                          flag.enabled ? "text-amber-600 hover:text-amber-700" : "text-emerald-600 hover:text-emerald-700"
                        )}
                      >
                        {flag.enabled ? 'Disable' : 'Enable'}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => void deleteFlag.mutateAsync(flag.id)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg"
                        aria-label={`Delete flag ${flag.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </AdminCardContent>
              </AdminCard>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
