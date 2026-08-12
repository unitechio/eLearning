import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { useShareDocument, useRevokePermission, useGetPermissions } from '../hooks/useDocuments';
import { Document } from '../types';
import { Shield, Link, Copy, Check, Trash2, Globe, Lock } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface DocumentShareDialogProps {
  readonly document: Document | null;
  readonly open: boolean;
  readonly onClose: () => void;
}

export function DocumentShareDialog({
  document,
  open,
  onClose,
}: DocumentShareDialogProps) {
  const [emailInput, setEmailInput] = useState('');
  const [roleInput, setRoleInput] = useState<'viewer' | 'editor'>('viewer');
  const [copied, setCopied] = useState(false);

  const shareMutation = useShareDocument();
  const revokeMutation = useRevokePermission();
  const { data: permissions = [] } = useGetPermissions(document?.id);

  if (!document) return null;

  const handleShare = () => {
    if (!emailInput.trim()) return;
    shareMutation.mutate(
      {
        id: document.id,
        subject_type: 'user',
        subject_id: emailInput.trim(),
        permission: roleInput,
      },
      {
        onSuccess: () => {
          setEmailInput('');
        },
      }
    );
  };

  const handleRevoke = (permID: number) => {
    revokeMutation.mutate({ docID: document.id, permID });
  };

  const handleCopyLink = () => {
    const fileUrl = `${window.location.origin}/api/v1/public/media/serve?key=${document.current_version?.file_asset?.storage_key || ''}`;
    void navigator.clipboard.writeText(fileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md p-6 rounded-[24px] bg-white dark:bg-slate-900 border dark:border-slate-800 font-sans">
        <DialogHeader className="border-b pb-3 dark:border-slate-800">
          <DialogTitle className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
            <Lock className="h-5 w-5 text-blue-600" /> Share Document
          </DialogTitle>
        </DialogHeader>

        {/* Invite Area */}
        <div className="space-y-4 mt-4">
          <div>
            <label htmlFor="share-email" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Invite people
            </label>
            <div className="flex gap-2">
              <input
                id="share-email"
                type="email"
                placeholder="Enter email address..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <select
                aria-label="Permission level"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value as 'viewer' | 'editor')}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="viewer">Can View</option>
                <option value="editor">Can Edit</option>
              </select>
              <Button
                type="button"
                onClick={handleShare}
                disabled={shareMutation.isPending}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2"
              >
                Invite
              </Button>
            </div>
          </div>

          {/* Members List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Who has access
            </h4>
            <ul className="space-y-2 max-h-[180px] overflow-y-auto" role="list">
              <li className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Creator (Owner)</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Owner</span>
              </li>
              {permissions.map((p) => (
                <li key={p.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                      {p.subject_id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                      {p.permission}
                    </span>
                    <button
                      type="button"
                      aria-label="Remove access"
                      onClick={() => handleRevoke(p.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <footer className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <Button
            type="button"
            variant="ghost"
            className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
            onClick={handleCopyLink}
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy link'}
          </Button>

          <Button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold px-6 py-2"
          >
            Done
          </Button>
        </footer>
      </DialogContent>
    </Dialog>
  );
}
