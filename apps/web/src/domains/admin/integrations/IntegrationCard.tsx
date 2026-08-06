import React, { useState, useRef, useEffect } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  MoreVertical,
  RefreshCw,
  Settings,
  ShieldAlert,
  Zap,
} from 'lucide-react';

export interface IntegrationApp {
  id: string;
  slug: string;
  name: string;
  provider: string;
  category: string;
  description: string;
  icon_url: string;
  developer: string;
  status: 'connected' | 'disconnected' | 'expired';
  account_identifier?: string;
  error_message?: string;
  is_enabled: boolean;
  features: string[];
  last_synced_ago?: string;
  avatar_count?: number;
  steps_count?: number;
  is_pro?: boolean;
  is_new?: boolean;
  overview_text?: string;
  how_it_works_text?: string;
  config?: Record<string, any>;
}

interface IntegrationCardProps {
  app: IntegrationApp;
  onOpenDrawer: (app: IntegrationApp) => void;
  onConnect: (app: IntegrationApp) => void;
  onReconnect: (app: IntegrationApp) => void;
  onDisconnect: (app: IntegrationApp) => void;
  onTriggerSync: (app: IntegrationApp) => void;
  onToggleEnable: (app: IntegrationApp, enabled: boolean) => void;
  isMarketplaceView?: boolean;
}

export function IntegrationCard({
  app,
  onOpenDrawer,
  onConnect,
  onReconnect,
  onDisconnect,
  onTriggerSync,
  onToggleEnable,
  isMarketplaceView = false,
}: IntegrationCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const isConnected = app.status === 'connected';
  const isExpired = app.status === 'expired';
  const isDisconnected = app.status === 'disconnected';

  return (
    <article
      className="group relative flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-2xs transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-[#181C24] dark:hover:border-gray-700 font-sans"
    >
      {/* Card Header: Icon, Name, Status Badge & Dropdown */}
      <div>
        <header className="flex items-start justify-between gap-3 pb-3">
          <div className="flex items-center gap-3">
            {/* App Logo */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 p-2 shadow-2xs dark:border-gray-800 dark:bg-gray-900">
              <img
                src={app.icon_url}
                alt={`${app.name} logo`}
                className="h-7 w-7 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://api.iconify.design/lucide:box.svg';
                }}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  {app.name}
                </h3>

                {/* Status Pill Badge */}
                {isConnected && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    CONNECTED
                  </span>
                )}
                {isExpired && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                    <AlertCircle className="h-3 w-3" />
                    EXPIRED
                  </span>
                )}
                {isDisconnected && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    DISCONNECTED
                  </span>
                )}

                {app.is_pro && (
                  <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                    PRO
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-400 dark:text-gray-500">{app.provider}</p>
            </div>
          </div>

          {/* Right Action: Menu or Marketplace Toggle Switch */}
          <div className="flex items-center gap-2">
            {isMarketplaceView ? (
              <label
                htmlFor={`toggle-${app.id}`}
                className="relative inline-flex cursor-pointer items-center"
              >
                <input
                  id={`toggle-${app.id}`}
                  type="checkbox"
                  checked={app.is_enabled}
                  onChange={(e) => onToggleEnable(app, e.target.checked)}
                  className="peer sr-only"
                />
                <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#181C24] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-800 dark:peer-checked:bg-indigo-600" />
              </label>
            ) : (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  aria-label={`Options for ${app.name}`}
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>

                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-800 dark:bg-[#181C24]"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onOpenDrawer(app);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>View details</span>
                    </button>
                    {isConnected && (
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          onTriggerSync(app);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>Sync now</span>
                      </button>
                    )}
                    {(isConnected || isExpired) && (
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          onDisconnect(app);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                      >
                        <span>Disconnect app</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Description */}
        <p className="mb-4 text-xs font-normal leading-relaxed text-gray-600 dark:text-gray-300">
          {app.description}
        </p>

        {/* Feature Tag Pills */}
        <div className="mb-4 flex flex-wrap gap-1.5" aria-label="Features">
          {app.features.map((feature) => (
            <span
              key={feature}
              className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer: Account Info / Alert Box & Primary Action Button */}
      <footer className="mt-2 space-y-3 pt-3 border-t border-gray-100 dark:border-gray-800/80">
        {/* Connected Account Details Box (Image 1 & 2) */}
        {app.account_identifier && !isExpired && (
          <div className="flex items-center justify-between rounded-xl bg-gray-50/90 px-3 py-2 text-xs dark:bg-gray-900/60">
            <div className="truncate">
              <p className="truncate font-semibold text-gray-800 dark:text-gray-200">
                {app.account_identifier}
              </p>
              <p className="text-[10px] text-gray-400">
                {app.last_synced_ago || 'Synced recently'}
              </p>
            </div>

            {/* Avatar Stack Pill */}
            {app.avatar_count ? (
              <div className="flex items-center -space-x-1.5">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-gray-900">
                  U
                </span>
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-gray-900">
                  A
                </span>
                <span className="inline-flex h-5 items-center justify-center rounded-full bg-gray-200 px-1.5 text-[9px] font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  +{app.avatar_count}
                </span>
              </div>
            ) : null}
          </div>
        )}

        {/* Warning Alert Box for Expired Apps (WhatsApp in Image 1) */}
        {isExpired && (
          <div className="flex items-start gap-2.5 rounded-xl border border-rose-100 bg-rose-50/80 p-2.5 text-xs text-rose-800 dark:border-rose-950/60 dark:bg-rose-950/30 dark:text-rose-300">
            <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
            <div>
              <p className="font-bold text-xs">Authentication expired</p>
              <p className="text-[11px] text-rose-700/80 dark:text-rose-300/80">
                {app.error_message || 'Re-connect to restore sync'}
              </p>
            </div>
          </div>
        )}

        {/* Bottom Action Buttons */}
        <div className="flex items-center gap-2">
          {isConnected && (
            <button
              type="button"
              onClick={() => onOpenDrawer(app)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2 text-xs font-semibold text-gray-700 shadow-2xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Manage</span>
            </button>
          )}

          {isExpired && (
            <button
              type="button"
              onClick={() => onReconnect(app)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#181C24] py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-gray-800 dark:bg-indigo-600 dark:hover:bg-indigo-700"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Re-connect</span>
            </button>
          )}

          {isDisconnected && (
            <button
              type="button"
              onClick={() => onConnect(app)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 py-2 text-xs font-semibold text-gray-800 transition hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Connect App</span>
            </button>
          )}
        </div>
      </footer>
    </article>
  );
}
