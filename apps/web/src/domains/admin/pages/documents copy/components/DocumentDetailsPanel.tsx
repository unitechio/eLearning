import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useGetVersions, useGetActivity, useGetPermissions } from '../hooks/useDocuments';
import { formatFileSize } from '../utils/file-utils';
import { Document } from '../types';
import { Calendar, User, Shield, Info, History, Clock } from 'lucide-react';

interface DocumentDetailsPanelProps {
  readonly document: Document | null;
  readonly open: boolean;
  readonly onClose: () => void;
}

export function DocumentDetailsPanel({
  document,
  open,
  onClose,
}: DocumentDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState('details');

  const { data: versions = [] } = useGetVersions(document?.id);
  const { data: activities = [] } = useGetActivity(document?.id);
  const { data: permissions = [] } = useGetPermissions(document?.id);

  if (!document) return null;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-[450px] sm:max-w-[450px] p-6 overflow-y-auto bg-white dark:bg-slate-900 border-l dark:border-slate-800">
        <SheetHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
          <SheetTitle className="text-xl font-black text-slate-800 dark:text-white truncate">
            {document.title}
          </SheetTitle>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-4 gap-1 rounded-xl bg-slate-50 dark:bg-slate-950 p-1">
            <TabsTrigger value="details" className="rounded-lg text-xs font-bold py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">
              Details
            </TabsTrigger>
            <TabsTrigger value="versions" className="rounded-lg text-xs font-bold py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">
              Versions
            </TabsTrigger>
            <TabsTrigger value="sharing" className="rounded-lg text-xs font-bold py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">
              Sharing
            </TabsTrigger>
            <TabsTrigger value="activity" className="rounded-lg text-xs font-bold py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">
              Activity
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6 mt-6">
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Properties</h3>
              <dl className="grid grid-cols-3 gap-y-4 text-xs">
                <dt className="text-slate-400 font-medium col-span-1">Type</dt>
                <dd className="text-slate-800 dark:text-slate-200 font-bold col-span-2 uppercase">
                  {document.current_version?.file_asset?.extension?.replace('.', '') || 'Unknown'}
                </dd>

                <dt className="text-slate-400 font-medium col-span-1">Size</dt>
                <dd className="text-slate-800 dark:text-slate-200 font-bold col-span-2">
                  {formatFileSize(document.current_version?.file_asset?.size || 0)}
                </dd>

                <dt className="text-slate-400 font-medium col-span-1">Owner</dt>
                <dd className="text-slate-800 dark:text-slate-200 font-bold col-span-2 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  {document.owner?.email || 'System'}
                </dd>

                <dt className="text-slate-400 font-medium col-span-1">Created</dt>
                <dd className="text-slate-800 dark:text-slate-200 font-bold col-span-2 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  {new Date(document.created_at).toLocaleDateString()}
                </dd>

                <dt className="text-slate-400 font-medium col-span-1">Updated</dt>
                <dd className="text-slate-800 dark:text-slate-200 font-bold col-span-2 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  {new Date(document.updated_at).toLocaleDateString()}
                </dd>

                <dt className="text-slate-400 font-medium col-span-1">Visibility</dt>
                <dd className="col-span-2">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize ${
                    document.visibility === 'public'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {document.visibility}
                  </span>
                </dd>
              </dl>
            </section>

            {document.description && (
              <section className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-950 p-3 rounded-xl">
                  {document.description}
                </p>
              </section>
            )}
          </TabsContent>

          {/* Versions Tab */}
          <TabsContent value="versions" className="mt-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Version History</h3>
            <ul className="space-y-3" role="list">
              {versions.map((ver) => (
                <li key={ver.id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <figure className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-600 flex items-center justify-center font-bold text-xs" aria-hidden="true">
                    V{ver.version_number}
                  </figure>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                      {ver.change_summary || 'No changelog entry'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      By {ver.creator?.email || 'Owner'} • {new Date(ver.created_at).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
              {versions.length === 0 && (
                <li className="text-center text-xs text-slate-400 py-8">No version history available</li>
              )}
            </ul>
          </TabsContent>

          {/* Sharing Tab */}
          <TabsContent value="sharing" className="mt-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Access Control</h3>
            <ul className="space-y-3" role="list">
              <li className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" />
                  <span className="font-bold text-slate-700 dark:text-slate-300">Owner (Creator)</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Full Access</span>
              </li>
              {permissions.map((p) => (
                <li key={p.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                      {p.subject_id}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                    {p.permission}
                  </span>
                </li>
              ))}
            </ul>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="mt-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Activity Log</h3>
            <ul className="space-y-4 relative pl-4 border-l border-slate-100 dark:border-slate-800" role="list">
              {activities.map((act) => (
                <li key={act.id} className="relative">
                  <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-blue-500 ring-4 ring-white dark:ring-slate-900" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800 dark:text-white capitalize">
                      {act.action}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      By {act.actor?.email || 'User'} • {new Date(act.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))}
              {activities.length === 0 && (
                <li className="text-center text-xs text-slate-400 py-8">No activity history recorded</li>
              )}
            </ul>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
