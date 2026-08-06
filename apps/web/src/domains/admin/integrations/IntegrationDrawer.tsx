import React, { useState } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Layers,
  MoreHorizontal,
  RefreshCw,
  Save,
  Send,
  Settings,
  ShieldCheck,
  X,
  Zap,
} from 'lucide-react';
import { IntegrationApp } from './IntegrationCard';

interface IntegrationDrawerProps {
  app: IntegrationApp | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveConfig: (slug: string, config: Record<string, any>, isEnabled: boolean) => void;
  onTriggerSync: (app: IntegrationApp) => void;
}

export function IntegrationDrawer({
  app,
  isOpen,
  onClose,
  onSaveConfig,
  onTriggerSync,
}: IntegrationDrawerProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'config'>('details');
  const [endpointUrl, setEndpointUrl] = useState('https://api.filllo.com/v1/webhooks/gmail');
  const [secretKey, setSecretKey] = useState('whsec_98f7a6b5c4d3e2f10987');
  const [syncFreq, setSyncFreq] = useState('realtime');
  const [enableEvents, setEnableEvents] = useState({
    incoming_email: true,
    outgoing_email: true,
    sync_contacts: false,
    auto_tagging: true,
  });

  if (!isOpen || !app) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Panel (Image 4) */}
      <aside
        aria-label={`Integration details for ${app.name}`}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col bg-white shadow-2xl transition-transform duration-300 dark:bg-[#181C24] font-sans antialiased"
      >
        {/* Panel Top Control Bar */}
        <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="hover:text-gray-900 dark:hover:text-white">Integrations</span>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
            <span className="font-semibold text-gray-900 dark:text-white">{app.name}</span>
          </nav>

          {/* Right Panel Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="More options"
              className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            <a
              href={`https://${app.slug}.com`}
              target="_blank"
              rel="noreferrer"
              aria-label="Open documentation"
              className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <button
              type="button"
              aria-label="Close detail panel"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Panel Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
          {/* Header Card: App Logo, Title, Configure Button */}
          <section className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-gray-50/50 p-5 dark:border-gray-800 dark:bg-gray-900/40">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-white p-2.5 shadow-xs dark:border-gray-700 dark:bg-gray-800">
                <img src={app.icon_url} alt={app.name} className="h-9 w-9 object-contain" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{app.name}</h2>
                <p className="text-xs text-gray-500">{app.provider}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="rounded-md bg-gray-200/80 px-2 py-0.5 text-[10px] font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    DEVELOPER TOOLS
                  </span>
                  <span className="rounded-md bg-gray-200/80 px-2 py-0.5 text-[10px] font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    {app.steps_count || 4} STEPS
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'config' ? 'details' : 'config')}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#181C24] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-gray-800 dark:bg-indigo-600 dark:hover:bg-indigo-700"
            >
              <Settings className="h-4 w-4" />
              <span>{activeTab === 'config' ? 'View Details' : 'Configure'}</span>
            </button>
          </section>

          {/* Description */}
          <p className="mb-6 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            {app.description}
          </p>

          {/* Image Preview Carousel Cards (Image 4) */}
          <section className="mb-8" aria-label="Integration previews">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
              Preview Screenshots
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {/* Card Preview 1 */}
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-rose-500 to-indigo-600 p-3 text-white shadow-xs">
                <div className="rounded-lg bg-white/20 p-2 backdrop-blur-md">
                  <p className="text-[10px] font-bold">Victory Group</p>
                  <p className="text-[9px] opacity-90">Notification: Payment received</p>
                  <div className="mt-2 rounded-sm bg-white/30 h-1.5 w-3/4" />
                </div>
              </div>

              {/* Card Preview 2 */}
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-amber-400 to-rose-500 p-3 text-white shadow-xs">
                <div className="rounded-lg bg-white/20 p-2 backdrop-blur-md">
                  <p className="text-[10px] font-bold">Synergy Squad</p>
                  <p className="text-[9px] opacity-90">Alert: Payment scheduled</p>
                  <div className="mt-2 rounded-sm bg-white/30 h-1.5 w-1/2" />
                </div>
              </div>

              {/* Card Preview 3 */}
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-blue-600 to-emerald-500 p-3 text-white shadow-xs">
                <div className="rounded-lg bg-white/20 p-2 backdrop-blur-md">
                  <p className="text-[10px] font-bold">MAILS</p>
                  <p className="text-[9px] opacity-90">Inbox Sync (12 new)</p>
                  <div className="mt-2 rounded-sm bg-white/30 h-1.5 w-full" />
                </div>
              </div>
            </div>
          </section>

          {/* Details Tab Content */}
          {activeTab === 'details' ? (
            <div className="space-y-6">
              {/* Section: Overview */}
              <section className="rounded-2xl border border-gray-200 bg-gray-50/50 p-5 dark:border-gray-800 dark:bg-gray-900/30">
                <h3 className="mb-2 text-sm font-bold text-gray-900 dark:text-white">Overview</h3>
                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                  {app.overview_text ||
                    `Utilize the ${app.name} API to generate messages, automate tasks, and create tailored workflows in your applications when specific actions occur in other platforms.`}{' '}
                  <a href="#" className="font-semibold text-indigo-600 hover:underline">
                    Documentation.
                  </a>
                </p>
              </section>

              {/* Section: How it works */}
              <section className="rounded-2xl border border-gray-200 bg-gray-50/50 p-5 dark:border-gray-800 dark:bg-gray-900/30">
                <h3 className="mb-2 text-sm font-bold text-gray-900 dark:text-white">How it works</h3>
                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                  {app.how_it_works_text ||
                    `The ${app.name} integration offers a ready-to-use solution for automation. While it allows extensive customization, it is quick to set up and requires no technical expertise.`}
                </p>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Automate creation, updating, and sync of records.</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Trigger real-time notifications on Slack, Webhooks, or Email.</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Generate custom alerts when specific forms are submitted.</span>
                  </div>
                </div>
              </section>

              {/* Section: Feature Tags */}
              <section>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                  Capabilities & Triggers
                </h3>
                <div className="flex flex-wrap gap-2">
                  {app.features.map((f) => (
                    <span
                      key={f}
                      className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-2xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    >
                      ⚡ {f}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            /* Configuration Tab Content */
            <div className="space-y-5 rounded-2xl border border-gray-200 bg-gray-50/50 p-5 dark:border-gray-800 dark:bg-gray-900/30">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Configuration & Webhooks Settings
              </h3>

              {/* Endpoint URL Input */}
              <div>
                <label htmlFor="endpoint-url" className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Webhook Endpoint URL
                </label>
                <input
                  id="endpoint-url"
                  type="url"
                  value={endpointUrl}
                  onChange={(e) => setEndpointUrl(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>

              {/* Secret Key Input */}
              <div>
                <label htmlFor="secret-key" className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Signing Secret Key
                </label>
                <input
                  id="secret-key"
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>

              {/* Sync Frequency Dropdown */}
              <div>
                <label htmlFor="sync-freq" className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Sync Frequency
                </label>
                <select
                  id="sync-freq"
                  value={syncFreq}
                  onChange={(e) => setSyncFreq(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                >
                  <option value="realtime">Realtime (Instant Webhook)</option>
                  <option value="5min">Every 5 minutes</option>
                  <option value="1hour">Hourly</option>
                  <option value="daily">Daily digest</option>
                </select>
              </div>

              {/* Event Subscriptions Checkboxes */}
              <div>
                <span className="mb-2 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Subscribed Events
                </span>
                <div className="space-y-2">
                  {Object.entries(enableEvents).map(([key, val]) => (
                    <label key={key} htmlFor={`evt-${key}`} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
                      <input
                        id={`evt-${key}`}
                        type="checkbox"
                        checked={val}
                        onChange={(e) =>
                          setEnableEvents({ ...enableEvents, [key]: e.target.checked })
                        }
                        className="rounded border-gray-300 text-[#181C24] focus:ring-0 dark:border-gray-700"
                      />
                      <span>{key.replace('_', ' ').toUpperCase()}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() =>
                    onSaveConfig(
                      app.slug,
                      { endpointUrl, secretKey, syncFreq, enableEvents },
                      true
                    )
                  }
                  className="flex items-center gap-2 rounded-xl bg-[#181C24] px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-800 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Configuration</span>
                </button>

                <button
                  type="button"
                  onClick={() => onTriggerSync(app)}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Test Connection</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
