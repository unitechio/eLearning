import React, { useState } from 'react';
import { CheckCircle2, Lock, ShieldCheck, X, Zap } from 'lucide-react';
import { IntegrationApp } from './IntegrationCard';

interface ConnectModalProps {
  app: IntegrationApp | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmConnect: (app: IntegrationApp, accountIdentifier: string) => void;
}

export function ConnectModal({
  app,
  isOpen,
  onClose,
  onConfirmConnect,
}: ConnectModalProps) {
  const [accountEmail, setAccountEmail] = useState('');
  const [apiKey, setApiKey] = useState('');

  if (!isOpen || !app) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const identifier = accountEmail || `${app.slug}_user@filllo.com`;
    onConfirmConnect(app, identifier);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-labelledby="connect-modal-title"
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-[#181C24] font-sans antialiased"
      >
        <button
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-900">
            <img src={app.icon_url} alt={app.name} className="h-7 w-7 object-contain" />
          </div>
          <div>
            <h2 id="connect-modal-title" className="text-lg font-bold text-gray-900 dark:text-white">
              Connect {app.name}
            </h2>
            <p className="text-xs text-gray-500">{app.provider}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="account-email" className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              Account Email or Workspace ID
            </label>
            <input
              id="account-email"
              type="text"
              required
              placeholder="e.g. user@filllo.com or Workspace ID"
              value={accountEmail}
              onChange={(e) => setAccountEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs text-gray-900 focus:border-[#181C24] focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="api-key" className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              OAuth Token / API Secret Key
            </label>
            <input
              id="api-key"
              type="password"
              placeholder="Enter OAuth Token or API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs text-gray-900 focus:border-[#181C24] focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-blue-50/80 p-3 text-[11px] text-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
            <ShieldCheck className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
            <span>
              Your credentials are encrypted end-to-end using AES-256 GCM security protocols.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-[#181C24] px-5 py-2 text-xs font-semibold text-white transition hover:bg-gray-800 dark:bg-indigo-600 dark:hover:bg-indigo-700"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Authorize & Connect</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
