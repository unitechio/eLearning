import React, { useState, useEffect, useMemo } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Grid,
  Layers,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Zap,
} from 'lucide-react';
import { IntegrationApp, IntegrationCard } from './IntegrationCard';
import { IntegrationDrawer } from './IntegrationDrawer';
import { ConnectModal } from './ConnectModal';
import { AddViewPopover, ViewType, VIEW_OPTIONS } from '@/shared/components/common/AddViewPopover';

export function AdminIntegrationsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'connected' | 'disconnected' | 'expired'>('all');
  const [viewMode, setViewMode] = useState<'hub' | 'marketplace'>('hub');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // View selector states matching Images 1, 2, 3
  const [activeViews, setActiveViews] = useState<ViewType[]>(['list', 'board', 'simple', 'overview']);
  const [currentView, setCurrentView] = useState<ViewType>('list');

  const [selectedApp, setSelectedApp] = useState<IntegrationApp | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [connectModalApp, setConnectModalApp] = useState<IntegrationApp | null>(null);
  const [connectModalOpen, setConnectModalOpen] = useState(false);

  // Default initial apps list matching screenshots (Images 1, 2, 4)
  const [apps, setApps] = useState<IntegrationApp[]>([
    {
      id: '1',
      slug: 'gmail',
      name: 'Gmail',
      provider: 'By Google.com',
      category: 'communication',
      description: 'Automate inbox management, email syncing, and follow-up workflows with Gmail integration.',
      icon_url: 'https://api.iconify.design/logos:google-gmail.svg',
      developer: 'Google Inc.',
      status: 'connected',
      account_identifier: 'hello@filllo.com',
      is_enabled: true,
      features: ['Email Sync', 'Auto Replies', 'Inbox Flow', 'Smart Routing', 'Follow-Ups'],
      last_synced_ago: 'Synced 2 min ago',
      avatar_count: 3,
      steps_count: 4,
      overview_text: 'Utilize the Gmail API to generate messages, automate tasks, and create tailored workflows in your applications when specific actions occur in other platforms.',
      how_it_works_text: 'The Gmail API offers a ready-to-use solution for automation. Connect your workspace email to automatically sync customer correspondence, parse incoming support emails, and trigger notifications.',
    },
    {
      id: '2',
      slug: 'slack',
      name: 'Slack',
      provider: 'By Slack Technologies',
      category: 'communication',
      description: 'Keep teams aligned with real-time Slack notifications and collaboration automation.',
      icon_url: 'https://api.iconify.design/logos:slack-icon.svg',
      developer: 'Slack Tech',
      status: 'connected',
      account_identifier: 'Clients',
      is_enabled: true,
      features: ['Team Chat', 'Live Alerts', 'Channel Sync'],
      last_synced_ago: 'Syncing...',
      avatar_count: 5,
      steps_count: 3,
    },
    {
      id: '3',
      slug: 'notion',
      name: 'Notion',
      provider: 'By Notion Labs',
      category: 'productivity',
      description: 'Keep teams aligned with real-time Notion sprint tracking, bug reports, and dev workflows.',
      icon_url: 'https://api.iconify.design/logos:notion-icon.svg',
      developer: 'Notion Labs',
      status: 'connected',
      account_identifier: 'Filllo Product Team',
      is_enabled: true,
      features: ['Sprint Tracking', 'Bug Reports', 'Dev Workflow', 'Task Status', 'Agile Boards'],
      last_synced_ago: 'Syncing...',
      avatar_count: 2,
      steps_count: 4,
      is_new: true,
    },
    {
      id: '4',
      slug: 'skype',
      name: 'Skype',
      provider: 'By Microsoft',
      category: 'communication',
      description: 'Keep teams aligned with real-time Skype notifications and team collaboration.',
      icon_url: 'https://api.iconify.design/logos:skype.svg',
      developer: 'Microsoft',
      status: 'disconnected',
      account_identifier: 'Filllo Saas',
      is_enabled: false,
      features: ['Team Chat', 'Live Alerts'],
      last_synced_ago: 'Synced 12 hours ago',
      steps_count: 2,
    },
    {
      id: '5',
      slug: 'whatsapp',
      name: 'WhatsApp',
      provider: 'By Meta',
      category: 'communication',
      description: 'Centralize conversations and automate messaging workflows across your workspace.',
      icon_url: 'https://api.iconify.design/logos:whatsapp-icon.svg',
      developer: 'Meta',
      status: 'expired',
      account_identifier: '+880 1234 567 890',
      error_message: 'Authentication expired. Re-connect to restore sync',
      is_enabled: false,
      features: ['Team Chat', 'Live Alerts', 'Channel Sync'],
      last_synced_ago: 'Last synced a day ago',
      steps_count: 5,
      is_pro: true,
    },
    {
      id: '6',
      slug: 'linear',
      name: 'Linear',
      provider: 'By Linear',
      category: 'developer_tools',
      description: 'Linear.app: A streamlined project management tool designed for software teams.',
      icon_url: 'https://api.iconify.design/logos:linear-icon.svg',
      developer: 'Linear Inc.',
      status: 'disconnected',
      is_enabled: true,
      features: ['Issue Sync', 'Cycle Tracking'],
      steps_count: 4,
      is_new: true,
    },
    {
      id: '7',
      slug: 'github',
      name: 'GitHub',
      provider: 'By GitHub.com',
      category: 'developer_tools',
      description: 'Github: A platform for version control and collaboration for engineering teams.',
      icon_url: 'https://api.iconify.design/logos:github-icon.svg',
      developer: 'GitHub',
      status: 'disconnected',
      is_enabled: false,
      features: ['Repo Sync', 'CI/CD Webhooks'],
      steps_count: 2,
    },
    {
      id: '8',
      slug: 'zapier',
      name: 'Zapier',
      provider: 'By Zapier.com',
      category: 'automation',
      description: 'Zapier lets you connect 5,000+ apps to automate your work and increase productivity.',
      icon_url: 'https://api.iconify.design/logos:zapier-icon.svg',
      developer: 'Zapier',
      status: 'disconnected',
      is_enabled: true,
      features: ['5000+ Apps', 'Custom Zaps'],
      steps_count: 4,
    },
    {
      id: '9',
      slug: 'zendesk',
      name: 'Zendesk',
      provider: 'By Zendesk',
      category: 'crm',
      description: 'Zendesk: A customer service platform that helps businesses manage relationships.',
      icon_url: 'https://api.iconify.design/logos:zendesk-icon.svg',
      developer: 'Zendesk',
      status: 'disconnected',
      is_enabled: false,
      features: ['Ticket Routing', 'Live Chat'],
      steps_count: 4,
      is_pro: true,
    },
    {
      id: '10',
      slug: 'jira',
      name: 'Jira',
      provider: 'By Atlassian.com',
      category: 'developer_tools',
      description: 'Jira: A project management tool tailored for agile teams to plan and release software.',
      icon_url: 'https://api.iconify.design/logos:jira.svg',
      developer: 'Atlassian',
      status: 'disconnected',
      is_enabled: false,
      features: ['Agile Boards', 'Sprint Track'],
      steps_count: 4,
    },
  ]);

  // Try fetching dynamic integration status from Go API backend
  useEffect(() => {
    fetch('/api/v1/admin/integrations/hub')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.data && data.data.integrations) {
          setApps(data.data.integrations);
        }
      })
      .catch(() => {
        // Fallback to rich pre-seeded data if backend API is not running locally
      });
  }, []);

  // Filter calculations
  const connectedCount = useMemo(() => apps.filter((a) => a.status === 'connected').length, [apps]);
  const disconnectedCount = useMemo(() => apps.filter((a) => a.status === 'disconnected').length, [apps]);
  const expiredCount = useMemo(() => apps.filter((a) => a.status === 'expired').length, [apps]);

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      // Tab status filter
      if (activeTab === 'connected' && app.status !== 'connected') return false;
      if (activeTab === 'disconnected' && app.status !== 'disconnected') return false;
      if (activeTab === 'expired' && app.status !== 'expired') return false;

      // Category filter
      if (categoryFilter !== 'all' && app.category !== categoryFilter) return false;

      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          app.name.toLowerCase().includes(q) ||
          app.description.toLowerCase().includes(q) ||
          app.provider.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [apps, activeTab, categoryFilter, searchQuery]);

  // Handlers
  const handleOpenDrawer = (app: IntegrationApp) => {
    setSelectedApp(app);
    setDrawerOpen(true);
  };

  const handleOpenConnectModal = (app: IntegrationApp) => {
    setConnectModalApp(app);
    setConnectModalOpen(true);
  };

  const handleConfirmConnect = (app: IntegrationApp, accountIdentifier: string) => {
    setApps((prev) =>
      prev.map((a) =>
        a.id === app.id
          ? {
              ...a,
              status: 'connected',
              account_identifier: accountIdentifier,
              error_message: '',
              is_enabled: true,
              last_synced_ago: 'Just now',
            }
          : a
      )
    );
    // Call backend API in background
    fetch('/api/v1/admin/integrations/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: app.slug, account_identifier: accountIdentifier }),
    }).catch(() => {});
  };

  const handleReconnect = (app: IntegrationApp) => {
    handleOpenConnectModal(app);
  };

  const handleDisconnect = (app: IntegrationApp) => {
    setApps((prev) =>
      prev.map((a) =>
        a.id === app.id
          ? {
              ...a,
              status: 'disconnected',
              error_message: '',
              is_enabled: false,
            }
          : a
      )
    );
    fetch('/api/v1/admin/integrations/disconnect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: app.slug }),
    }).catch(() => {});
  };

  const handleTriggerSync = (app: IntegrationApp) => {
    setApps((prev) =>
      prev.map((a) =>
        a.id === app.id ? { ...a, last_synced_ago: 'Just now' } : a
      )
    );
    fetch('/api/v1/admin/integrations/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: app.slug }),
    }).catch(() => {});
  };

  const handleToggleEnable = (app: IntegrationApp, enabled: boolean) => {
    setApps((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, is_enabled: enabled } : a))
    );
  };

  const handleSaveConfig = (slug: string, config: Record<string, any>, isEnabled: boolean) => {
    setApps((prev) =>
      prev.map((a) => (a.slug === slug ? { ...a, config, is_enabled: isEnabled } : a))
    );
    setDrawerOpen(false);
  };

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 font-sans antialiased bg-gray-50/50 dark:bg-[#181C24]/50 min-h-screen">
      {/* Top Header Section (Images 1 & 2) */}
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Integrations
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Total {connectedCount} app{connectedCount === 1 ? '' : 's'} are connected
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'marketplace' ? 'hub' : 'marketplace')}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-2xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <span>{viewMode === 'marketplace' ? 'My Integrations' : 'Explore more Apps'}</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (apps.length > 0) handleOpenConnectModal(apps[0]);
            }}
            className="flex items-center gap-2 rounded-xl bg-[#181C24] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-gray-800 dark:bg-indigo-600 dark:hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            <span>Connect</span>
          </button>
        </div>
      </header>

      {/* View Selector Bar (Matching Images 1, 2, 3) */}
      <section className="mb-4 flex items-center justify-between gap-3 overflow-x-auto rounded-2xl border border-gray-200 bg-white p-2.5 shadow-2xs dark:border-gray-800 dark:bg-[#181C24] scrollbar-none">
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Views">
          {activeViews.map((viewId) => {
            const opt = VIEW_OPTIONS.find((v) => v.id === viewId);
            if (!opt) return null;
            const Icon = opt.icon;
            const isActive = currentView === viewId;

            return (
              <button
                key={viewId}
                role="tab"
                aria-selected={isActive}
                onClick={() => setCurrentView(viewId)}
                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold leading-normal transition-all ${
                  isActive
                    ? 'bg-gray-100 text-gray-900 shadow-2xs dark:bg-gray-800 dark:text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{opt.label}</span>
              </button>
            );
          })}

          <span className="mx-1 h-4 w-px bg-gray-200 dark:bg-gray-800" aria-hidden="true" />

          {/* Add a new view Popover Button (+ View) */}
          <AddViewPopover
            activeViews={activeViews}
            currentView={currentView}
            onSelectView={(v) => setCurrentView(v)}
            onAddView={(v) => setActiveViews((prev) => [...prev, v])}
          />
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
          <span className="rounded-lg bg-gray-100 px-2 py-1 font-mono text-[10px] font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {currentView.toUpperCase()} MODE
          </span>
        </div>
      </section>

      {/* Filter Tabs & Search Controls (Image 2) */}
      <section className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
        {/* Status Filter Pills */}
        <div className="flex overflow-x-auto gap-1.5 scrollbar-none" role="tablist">
          {[
            { key: 'all', label: 'All Integrations' },
            { key: 'connected', label: `Connected (${connectedCount})` },
            { key: 'disconnected', label: `Disconnected (${disconnectedCount})` },
            { key: 'expired', label: `Expired (${expiredCount})` },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.key as any)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold leading-normal transition-all ${
                  isActive
                    ? 'bg-[#181C24] text-white shadow-xs dark:bg-gray-800 dark:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Category & Search Input */}
        <div className="flex items-center gap-2">
          {/* Category Selector */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 focus:border-[#181C24] focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
          >
            <option value="all">All Categories</option>
            <option value="communication">Communication</option>
            <option value="productivity">Productivity</option>
            <option value="developer_tools">Developer Tools</option>
            <option value="automation">Automation</option>
            <option value="crm">CRM & Support</option>
          </select>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-40 rounded-xl border border-gray-200 bg-white py-1.5 pl-8 pr-3 text-xs text-gray-900 placeholder-gray-400 focus:border-[#181C24] focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 sm:w-56"
            />
          </div>
        </div>
      </section>

      {/* Integration Cards Grid Layout (Image 1, 2 & 4) */}
      <section aria-label="Integrations grid" className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {filteredApps.map((app) => (
          <IntegrationCard
            key={app.id}
            app={app}
            onOpenDrawer={handleOpenDrawer}
            onConnect={handleOpenConnectModal}
            onReconnect={handleReconnect}
            onDisconnect={handleDisconnect}
            onTriggerSync={handleTriggerSync}
            onToggleEnable={handleToggleEnable}
            isMarketplaceView={viewMode === 'marketplace'}
          />
        ))}

        {/* Promo Cross-sell Empty State Card (Bottom Right in Image 1) */}
        {viewMode === 'hub' && (
          <article className="flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-gray-300 bg-gradient-to-br from-gray-50 via-indigo-50/20 to-emerald-50/20 p-8 dark:border-gray-800 dark:from-gray-900/60 dark:via-gray-900/40 dark:to-gray-900/20">
            {/* Overlapping App Logo Circles */}
            <div className="mb-4 flex items-center -space-x-3">
              {['gmail', 'slack', 'notion', 'jira', 'whatsapp'].map((slug) => (
                <div
                  key={slug}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-white p-1.5 shadow-md dark:border-gray-900 dark:bg-gray-800"
                >
                  <img
                    src={`https://api.iconify.design/logos:${slug === 'jira' ? 'jira' : slug === 'whatsapp' ? 'whatsapp-icon' : slug === 'notion' ? 'notion-icon' : slug === 'slack' ? 'slack-icon' : 'google-gmail'}.svg`}
                    alt={slug}
                    className="h-5 w-5 object-contain"
                  />
                </div>
              ))}
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-bold text-gray-600 shadow-md dark:border-gray-900 dark:bg-gray-800 dark:text-gray-300">
                +8
              </div>
            </div>

            <h3 className="mb-2 text-base font-bold text-gray-900 dark:text-white">
              Connect more tools to unlock full context
            </h3>
            <p className="mb-5 max-w-sm text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              Link Gmail, Slack, Jira and Asana to automatically pull in all your team's communication in one place.
            </p>

            <button
              type="button"
              onClick={() => setViewMode('marketplace')}
              className="flex items-center gap-2 rounded-xl bg-[#181C24] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-gray-800 dark:bg-indigo-600 dark:hover:bg-indigo-700"
            >
              <span>Explore more Apps</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </article>
        )}
      </section>

      {/* Slide-over Detail Panel (Image 4) */}
      <IntegrationDrawer
        app={selectedApp}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSaveConfig={handleSaveConfig}
        onTriggerSync={handleTriggerSync}
      />

      {/* Connect Credentials Modal */}
      <ConnectModal
        app={connectModalApp}
        isOpen={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
        onConfirmConnect={handleConfirmConnect}
      />
    </main>
  );
}
