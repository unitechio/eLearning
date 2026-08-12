import React, { useMemo, useState, useEffect } from 'react';
import {
  Check,
  Copy,
  FileText,
  Globe2,
  Link2,
  LockKeyhole,
  Trash2,
  UserPlus,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
} from '@/shared/components/ui/dialog';

import { Button } from '@/shared/components/ui/button';
import {
  useShareDocument,
  useRevokePermission,
  useGetPermissions,
  useUpdateDocument,
} from '../hooks/useDocuments';

import { Document } from '../types';
import { cn } from '@/shared/lib/utils';

interface DocumentShareDialogProps {
  readonly document: Document | null;
  readonly open: boolean;
  readonly onClose: () => void;
}

type ShareMode = 'private' | 'public';
type AccessMode = 'restricted' | 'invited' | 'anyone';
type PermissionRole = 'viewer' | 'editor';

const getInitials = (value: string) =>
  value
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

export function DocumentShareDialog({
  document,
  open,
  onClose,
}: DocumentShareDialogProps) {
  const [shareMode, setShareMode] = useState<ShareMode>('private');
  const [accessMode, setAccessMode] = useState<AccessMode>('restricted');

  const [emailInput, setEmailInput] = useState('');
  const [roleInput, setRoleInput] = useState<PermissionRole>('viewer');

  const [copied, setCopied] = useState(false);
  const [isPublic, setIsPublic] = useState(false);

  const shareMutation = useShareDocument();
  const revokeMutation = useRevokePermission();
  const updateDocMutation = useUpdateDocument();

  const { data: permissions = [], } = useGetPermissions(document?.id);

  // Sync state with document visibility
  useEffect(() => {
    if (document) {
      const isDocPublic = document.visibility === 'public';
      setIsPublic(isDocPublic);
      setShareMode(isDocPublic ? 'public' : 'private');
      setAccessMode(isDocPublic ? 'anyone' : 'restricted');
    }
  }, [document]);

  const storageKey = document?.current_version?.file_asset?.storage_key || '';

  const fileExtension = document?.current_version?.file_asset?.extension?.toUpperCase() || 'FILE';

  /**
   * IMPORTANT:
   * This is intentionally a share URL rather than the raw storage URL.
   *
   * Production backend should create a real share token:
   * POST /documents/:id/public-link
   *
   * Example:
   * https://app.example.com/share/abc123
   */
  const publicUrl = useMemo(() => {
    if (!document) return '';

    return `${window.location.origin}/share/${document.id}`;
  }, [document]);

  if (!document) return null;

  // ------------------------------------------------------------
  // Invite
  // ------------------------------------------------------------

  const handleShare = () => {
    const email = emailInput.trim();

    if (!email) return;

    shareMutation.mutate(
      {
        id: document.id,
        subject_type: 'user',
        subject_id: email,
        permission: roleInput,
      },
      {
        onSuccess: () => {
          setEmailInput('');
        },
      },
    );
  };

  // ------------------------------------------------------------
  // Revoke
  // ------------------------------------------------------------

  const handleRevoke = (permissionId: number) => {
    revokeMutation.mutate({
      docID: document.id,
      permID: permissionId,
    });
  };

  // ------------------------------------------------------------
  // Copy public link
  // ------------------------------------------------------------

  const handleCopyLink = async () => {
    if (!publicUrl) return;

    try {
      await navigator.clipboard.writeText(publicUrl);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  };

  // ------------------------------------------------------------
  // Public
  // ------------------------------------------------------------

  const handleMakePublic = () => {
    updateDocMutation.mutate(
      {
        id: document.id,
        title: document.title,
        visibility: 'public',
      },
      {
        onSuccess: () => {
          setIsPublic(true);
          setShareMode('public');
          setAccessMode('anyone');
          toast.success('Document is now public');
        },
        onError: (err) => {
          toast.error(`Failed to publish document: ${err.message}`);
        },
      }
    );
  };

  const handleMakePrivate = () => {
    updateDocMutation.mutate(
      {
        id: document.id,
        title: document.title,
        visibility: 'private',
      },
      {
        onSuccess: () => {
          setIsPublic(false);
          setShareMode('private');
          if (accessMode === 'anyone') {
            setAccessMode('restricted');
          }
          toast.success('Document is now private');
        },
        onError: (err) => {
          toast.error(`Failed to restrict document: ${err.message}`);
        },
      }
    );
  };

  // ------------------------------------------------------------
  // Access mode
  // ------------------------------------------------------------

  const handleAccessMode = (mode: AccessMode) => {
    setAccessMode(mode);

    if (mode === 'anyone') {
      handleMakePublic();
    }
  };

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent
        className="
          w-[calc(100vw-32px)]
          max-w-[520px]
          gap-0
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-0
          shadow-[0_24px_70px_rgba(15,23,42,0.18)]
          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        {/* ================================================== */}
        {/* TOP TABS */}
        {/* ================================================== */}

        <header className="flex h-14 shrink-0 items-center border-b border-slate-100 px-5 dark:border-slate-800">
          <div className="flex h-full items-center gap-6">
            {/* Private */}
            <button
              type="button"
              onClick={() => setShareMode('private')}
              className={cn(
                'relative flex h-full items-center gap-2 text-[12px] font-semibold transition-colors',
                shareMode === 'private'
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300',
              )}
            >
              <LockKeyhole className="h-4 w-4" />

              Share privately

              {shareMode === 'private' && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-red-600" />
              )}
            </button>

            {/* Public */}
            <button
              type="button"
              onClick={() => setShareMode('public')}
              className={cn(
                'relative flex h-full items-center gap-2 text-[12px] font-semibold transition-colors',
                shareMode === 'public'
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300',
              )}
            >
              <Globe2 className="h-4 w-4" />

              Publish online

              {shareMode === 'public' && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-red-600" />
              )}
            </button>
          </div>
        </header>

        {/* ================================================== */}
        {/* PRIVATE MODE */}
        {/* ================================================== */}

        {shareMode === 'private' && (
          <>
            <main className="px-5 py-5">
              {/* Heading */}
              <div className="mb-4">
                <h2 className="text-[17px] font-semibold tracking-tight text-slate-900 dark:text-white">
                  Share this document
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Choose who can access this document and what they can do.
                </p>
              </div>

              {/* Document summary */}
              <div className="mb-5 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-[0_1px_3px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-950">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
                  <FileText
                    className="h-5 w-5"
                    strokeWidth={1.8}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-slate-800 dark:text-slate-100">
                    {document.title}
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-400">
                    {fileExtension} document · Current version
                  </p>
                </div>

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-400 dark:border-slate-700">
                  <LockKeyhole className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Invite */}
              <section className="mb-5">
                <div className="mb-2.5">
                  <h3 className="text-[13px] font-semibold text-slate-800 dark:text-slate-100">
                    Invite people
                  </h3>

                  <p className="mt-0.5 text-[10px] text-slate-400">
                    Add people by email and choose their permission.
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition focus-within:border-slate-300 focus-within:ring-2 focus-within:ring-red-600/5 dark:border-slate-700 dark:bg-slate-950">
                  <UserPlus className="ml-2 h-4 w-4 shrink-0 text-slate-400" />

                  <input
                    id="share-email"
                    type="email"
                    value={emailInput}
                    onChange={(event) =>
                      setEmailInput(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        handleShare();
                      }
                    }}
                    placeholder="Email address"
                    className="
                      min-w-0
                      flex-1
                      bg-transparent
                      px-1
                      py-2
                      text-xs
                      text-slate-900
                      outline-none
                      placeholder:text-slate-400
                      dark:text-white
                    "
                  />

                  <select
                    aria-label="Permission level"
                    value={roleInput}
                    onChange={(event) =>
                      setRoleInput(
                        event.target.value as PermissionRole,
                      )
                    }
                    className="
                      h-8
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      px-2
                      text-[11px]
                      font-medium
                      text-slate-600
                      outline-none
                      dark:border-slate-700
                      dark:bg-slate-900
                      dark:text-slate-300
                    "
                  >
                    <option value="viewer">Can view</option>
                    <option value="editor">Can edit</option>
                  </select>

                  <Button
                    type="button"
                    onClick={handleShare}
                    disabled={
                      !emailInput.trim() ||
                      shareMutation.isPending
                    }
                    className="
                      h-8
                      rounded-lg
                      bg-red-600
                      px-3
                      text-[11px]
                      font-semibold
                      text-white
                      shadow-sm
                      hover:bg-red-700
                      disabled:opacity-50
                    "
                  >
                    {shareMutation.isPending
                      ? 'Adding…'
                      : 'Invite'}
                  </Button>
                </div>
              </section>

              {/* Access */}
              <section className="mb-5">
                <div className="mb-2.5">
                  <h3 className="text-[13px] font-semibold text-slate-800 dark:text-slate-100">
                    Who has access
                  </h3>

                  <p className="mt-0.5 text-[10px] text-slate-400">
                    Control how users can access this document.
                  </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                  {/* Restricted */}
                  <button
                    type="button"
                    onClick={() =>
                      handleAccessMode('restricted')
                    }
                    className={cn(
                      'flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition',
                      'border-b border-slate-100 dark:border-slate-800',
                      accessMode === 'restricted'
                        ? 'bg-slate-50/80 dark:bg-slate-800/40'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40',
                    )}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800">
                      <LockKeyhole className="h-4 w-4" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-medium text-slate-700 dark:text-slate-200">
                        Only people with access
                      </span>

                      <span className="mt-0.5 block text-[10px] text-slate-400">
                        Only invited people can access.
                      </span>
                    </span>

                    {accessMode === 'restricted' && (
                      <Check className="h-4 w-4 shrink-0 text-red-600" />
                    )}
                  </button>

                  {/* Invited */}
                  <button
                    type="button"
                    onClick={() =>
                      handleAccessMode('invited')
                    }
                    className={cn(
                      'flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition',
                      'border-b border-slate-100 dark:border-slate-800',
                      accessMode === 'invited'
                        ? 'bg-slate-50/80 dark:bg-slate-800/40'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40',
                    )}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800">
                      <Users className="h-4 w-4" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-medium text-slate-700 dark:text-slate-200">
                        Only people invited
                      </span>

                      <span className="mt-0.5 block text-[10px] text-slate-400">
                        Anyone you explicitly invite can access.
                      </span>
                    </span>

                    {accessMode === 'invited' && (
                      <Check className="h-4 w-4 shrink-0 text-red-600" />
                    )}
                  </button>

                  {/* Anyone */}
                  <button
                    type="button"
                    onClick={() =>
                      handleAccessMode('anyone')
                    }
                    className={cn(
                      'flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition',
                      accessMode === 'anyone'
                        ? 'bg-red-50/50 dark:bg-red-950/20'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40',
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                        accessMode === 'anyone'
                          ? 'bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800',
                      )}
                    >
                      <Link2 className="h-4 w-4" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-medium text-slate-700 dark:text-slate-200">
                        Anyone with the link
                      </span>

                      <span className="mt-0.5 block text-[10px] text-slate-400">
                        Anyone with the link can view it online.
                      </span>
                    </span>

                    {accessMode === 'anyone' && (
                      <Check className="h-4 w-4 shrink-0 text-red-600" />
                    )}
                  </button>
                </div>
              </section>

              {/* Members */}
              <section>
                <div className="mb-2.5 flex items-center justify-between">
                  <h3 className="text-[13px] font-semibold text-slate-800 dark:text-slate-100">
                    People with access
                  </h3>

                  <span className="text-[10px] font-medium tabular-nums text-slate-400">
                    {permissions.length + 1}
                  </span>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                  {/* Owner */}
                  <div className="flex items-center gap-3 border-b border-slate-100 px-3.5 py-2.5 dark:border-slate-800">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[9px] font-semibold text-white dark:bg-white dark:text-slate-900">
                      ME
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-slate-700 dark:text-slate-200">
                        You
                      </p>

                      <p className="text-[10px] text-slate-400">
                        Owner
                      </p>
                    </div>

                    <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      Owner
                    </span>
                  </div>

                  {/* Permissions */}
                  {permissions.map((permission) => {
                    const label =
                      permission.user_email || permission.subject_id || 'Unknown user';

                    const initials =
                      getInitials(label);

                    return (
                      <div
                        key={permission.id}
                        className="
                          group
                          flex
                          items-center
                          gap-3
                          border-b
                          border-slate-100
                          px-3.5
                          py-2.5
                          last:border-0
                          dark:border-slate-800
                        "
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-[9px] font-semibold text-red-600 dark:bg-red-950/30 dark:text-red-400">
                          {initials || (
                            <Users className="h-3.5 w-3.5" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-slate-700 dark:text-slate-200">
                            {label}
                          </p>

                          <p className="text-[10px] capitalize text-slate-400">
                            {permission.permission}
                          </p>
                        </div>

                        <span className="hidden rounded-md border border-slate-200 px-2 py-1 text-[10px] font-medium capitalize text-slate-500 sm:inline-flex dark:border-slate-700 dark:text-slate-400">
                          {permission.permission}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleRevoke(permission.id)
                          }
                          disabled={
                            revokeMutation.isPending
                          }
                          aria-label={`Remove access for ${label}`}
                          className="
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-md
                            text-slate-300
                            opacity-0
                            transition
                            hover:bg-red-50
                            hover:text-red-600
                            group-hover:opacity-100
                            focus:opacity-100
                            disabled:pointer-events-none
                            dark:hover:bg-red-950/30
                          "
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}

                  {!permissions.length && (
                    <div className="px-4 py-4 text-center">
                      <ShieldCheck className="mx-auto h-5 w-5 text-slate-300" />

                      <p className="mt-1.5 text-[10px] text-slate-400">
                        No additional people have access yet.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </main>

            {/* Private footer */}
            <footer className="flex h-14 shrink-0 items-center justify-between border-t border-slate-100 bg-slate-50/70 px-5 dark:border-slate-800 dark:bg-slate-950/50">
              {/* Make public */}
              <button
                type="button"
                onClick={handleMakePublic}
                className="
                  flex
                  h-8
                  items-center
                  gap-1.5
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  px-3
                  text-[11px]
                  font-medium
                  text-slate-600
                  shadow-sm
                  transition
                  hover:border-red-200
                  hover:bg-red-50
                  hover:text-red-600
                  dark:border-slate-700
                  dark:bg-slate-900
                  dark:text-slate-300
                  dark:hover:bg-red-950/30
                "
              >
                <Globe2 className="h-3.5 w-3.5" />
                Make public
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="
                    flex
                    h-8
                    items-center
                    gap-1.5
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    px-3
                    text-[11px]
                    font-medium
                    text-slate-600
                    shadow-sm
                    transition
                    hover:bg-slate-50
                    dark:border-slate-700
                    dark:bg-slate-900
                    dark:text-slate-300
                  "
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}

                  {copied ? 'Copied' : 'Copy link'}
                </button>

                <Button
                  type="button"
                  onClick={onClose}
                  className="
                    h-8
                    rounded-lg
                    bg-slate-900
                    px-4
                    text-[11px]
                    font-semibold
                    text-white
                    shadow-sm
                    hover:bg-slate-800
                    dark:bg-white
                    dark:text-slate-900
                    dark:hover:bg-slate-100
                  "
                >
                  Done
                </Button>
              </div>
            </footer>
          </>
        )}

        {/* ================================================== */}
        {/* PUBLIC MODE */}
        {/* ================================================== */}

        {shareMode === 'public' && (
          <>
            <main className="px-5 py-5">
              {/* Heading */}
              <div className="mb-4">
                <h2 className="text-[17px] font-semibold tracking-tight text-slate-900 dark:text-white">
                  Publish this document
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Make your document available online through a public link.
                </p>
              </div>

              {/* Document */}
              <div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
                  <FileText
                    className="h-5 w-5"
                    strokeWidth={1.8}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-slate-800 dark:text-slate-100">
                    {document.title}
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-400">
                    {fileExtension} document · Online publishing
                  </p>
                </div>

                <span
                  className={cn(
                    'rounded-full px-2 py-1 text-[10px] font-semibold',
                    isPublic
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
                  )}
                >
                  {isPublic ? 'Public' : 'Private'}
                </span>
              </div>

              {/* Public switch */}
              <button
                type="button"
                onClick={() =>
                  isPublic
                    ? handleMakePrivate()
                    : handleMakePublic()
                }
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition',
                  isPublic
                    ? 'border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/20'
                    : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50',
                )}
              >
                <span
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                    isPublic
                      ? 'bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800',
                  )}
                >
                  <Globe2 className="h-4 w-4" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold text-slate-800 dark:text-slate-100">
                    Public on the web
                  </span>

                  <span className="mt-0.5 block text-[10px] text-slate-400">
                    Anyone with the public link can view this document.
                  </span>
                </span>

                <span
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition',
                    isPublic
                      ? 'border-red-600 bg-red-600 text-white'
                      : 'border-slate-300 dark:border-slate-600',
                  )}
                >
                  {isPublic && (
                    <Check className="h-3 w-3" />
                  )}
                </span>
              </button>

              {/* Public URL */}
              {isPublic && (
                <div className="mt-4">
                  <label
                    htmlFor="public-share-url"
                    className="mb-1.5 block text-[11px] font-semibold text-slate-600 dark:text-slate-300"
                  >
                    Public URL
                  </label>

                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-700 dark:bg-slate-950">
                    <Link2 className="ml-2 h-4 w-4 shrink-0 text-slate-400" />

                    <input
                      id="public-share-url"
                      readOnly
                      value={publicUrl}
                      className="
                        min-w-0
                        flex-1
                        bg-transparent
                        px-1
                        py-1.5
                        text-[11px]
                        text-slate-600
                        outline-none
                        dark:text-slate-300
                      "
                    />

                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="
                        flex
                        h-8
                        shrink-0
                        items-center
                        gap-1.5
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        px-2.5
                        text-[10px]
                        font-semibold
                        text-slate-600
                        shadow-sm
                        transition
                        hover:bg-slate-50
                        dark:border-slate-700
                        dark:bg-slate-900
                        dark:text-slate-300
                      "
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}

                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2.5 dark:bg-slate-800/50">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />

                <p className="text-[10px] leading-4 text-slate-400">
                  {isPublic
                    ? 'Anyone with the public link can view this document. You can make it private at any time.'
                    : 'The document is currently private. Publishing it creates a public access link.'}
                </p>
              </div>
            </main>

            {/* Public footer */}
            <footer className="flex h-14 shrink-0 items-center justify-between border-t border-slate-100 bg-slate-50/70 px-5 dark:border-slate-800 dark:bg-slate-950/50">
              {/* Make private */}
              <button
                type="button"
                onClick={handleMakePrivate}
                disabled={!isPublic}
                className="
                  flex
                  h-8
                  items-center
                  gap-1.5
                  rounded-lg
                  px-3
                  text-[11px]
                  font-medium
                  text-slate-500
                  transition
                  hover:bg-white
                  hover:text-slate-800
                  disabled:pointer-events-none
                  disabled:opacity-40
                  dark:hover:bg-slate-900
                  dark:hover:text-white
                "
              >
                <LockKeyhole className="h-3.5 w-3.5" />
                Make private
              </button>

              <div className="flex items-center gap-2">
                {isPublic && (
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="
                      flex
                      h-8
                      items-center
                      gap-1.5
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      px-3
                      text-[11px]
                      font-medium
                      text-slate-600
                      shadow-sm
                      transition
                      hover:bg-slate-50
                      dark:border-slate-700
                      dark:bg-slate-900
                      dark:text-slate-300
                    "
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}

                    {copied ? 'Copied' : 'Copy link'}
                  </button>
                )}

                <Button
                  type="button"
                  onClick={onClose}
                  className="
                    h-8
                    rounded-lg
                    bg-slate-900
                    px-4
                    text-[11px]
                    font-semibold
                    text-white
                    shadow-sm
                    hover:bg-slate-800
                    dark:bg-white
                    dark:text-slate-900
                    dark:hover:bg-slate-100
                  "
                >
                  Done
                </Button>
              </div>
            </footer>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
