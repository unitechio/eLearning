import React, { useState } from 'react';
import {
  FileCode2,
  FolderPlus,
  Layers,
  Plus,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';

export function AdminBlueprintLibraryPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [blueprintName, setBlueprintName] = useState('');
  const [blueprintType, setBlueprintType] = useState('onboarding');
  const [blueprints, setBlueprints] = useState<Array<{ id: string; name: string; type: string; created: string }>>([]);

  const handleCreateBlueprint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blueprintName.trim()) return;
    setBlueprints((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: blueprintName,
        type: blueprintType,
        created: 'Just now',
      },
    ]);
    setBlueprintName('');
    setCreateModalOpen(false);
  };

  return (
    <main className="flex-1 p-6 lg:p-10 font-sans antialiased bg-[#0d1017] text-white min-h-screen">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          Blueprint Library
        </h1>
        <p className="text-sm text-gray-400 max-w-2xl leading-normal">
          Turn repeatable launches, onboarding flows, and reports into reusable project blueprints.
        </p>
      </header>

      {/* Main Content Area */}
      {blueprints.length === 0 ? (
        /* Empty State Card (Matching Image 1 input_file_0.png) */
        <section
          aria-label="Empty blueprint state"
          className="mx-auto my-12 flex max-w-3xl flex-col items-center justify-center rounded-2xl border border-gray-800 bg-[#161b26] p-10 sm:p-14 shadow-2xl transition-all"
        >
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* 3D Stacked Card Icon Graphic */}
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
              {/* Back Layer */}
              <div className="absolute h-16 w-16 -translate-x-3 -translate-y-2 rotate-[-8deg] rounded-xl border border-gray-700 bg-gray-800/80 shadow-md" />
              {/* Middle Layer */}
              <div className="absolute h-16 w-16 -translate-x-1.5 -translate-y-1 rotate-[-4deg] rounded-xl border border-gray-700 bg-gray-800 shadow-md" />
              {/* Front Layer */}
              <div className="relative flex h-16 w-16 items-center justify-center rounded-xl border border-gray-600 bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl">
                <Layers className="h-7 w-7 text-white" />
              </div>
            </div>

            {/* Text & Actions */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-white mb-2">
                No blueprints yet
              </h2>
              <p className="text-sm text-gray-400 mb-6 max-w-md leading-relaxed">
                Create a reusable starting point so every new project starts structured.
              </p>

              {/* Action Buttons (Matching Image 1 input_file_0.png) */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-gray-900 shadow-md transition hover:bg-gray-100 focus:outline-none"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create blueprint</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCreateModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl border border-gray-700 bg-[#212836] px-5 py-2.5 text-xs font-bold text-gray-200 shadow-sm transition hover:bg-gray-800 focus:outline-none"
                >
                  <Upload className="h-4 w-4" />
                  <span>Import blueprint</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* Blueprints Grid when created */
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {blueprints.map((bp) => (
            <article
              key={bp.id}
              className="rounded-2xl border border-gray-800 bg-[#161b26] p-5 shadow-lg transition hover:border-gray-700"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="rounded-lg bg-indigo-950/80 border border-indigo-800/50 px-2.5 py-1 text-[10px] font-bold text-indigo-400 uppercase">
                  {bp.type}
                </span>
                <span className="text-[10px] text-gray-500">{bp.created}</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">{bp.name}</h3>
              <p className="text-xs text-gray-400">Reusable project blueprint framework.</p>
            </article>
          ))}
        </section>
      )}

      {/* Create Blueprint Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setCreateModalOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md rounded-2xl border border-gray-800 bg-[#161b26] p-6 shadow-2xl text-white">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="text-lg font-bold mb-1">Create Project Blueprint</h2>
            <p className="text-xs text-gray-400 mb-4">Set up a reusable structure for your team.</p>

            <form onSubmit={handleCreateBlueprint} className="space-y-4">
              <div>
                <label htmlFor="bp-name" className="block text-xs font-semibold text-gray-300 mb-1">
                  Blueprint Name
                </label>
                <input
                  id="bp-name"
                  type="text"
                  required
                  placeholder="e.g. Q4 Product Launch Workflow"
                  value={blueprintName}
                  onChange={(e) => setBlueprintName(e.target.value)}
                  className="w-full rounded-xl border border-gray-700 bg-[#0d1017] px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="bp-type" className="block text-xs font-semibold text-gray-300 mb-1">
                  Category
                </label>
                <select
                  id="bp-type"
                  value={blueprintType}
                  onChange={(e) => setBlueprintType(e.target.value)}
                  className="w-full rounded-xl border border-gray-700 bg-[#0d1017] px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="onboarding">Onboarding Flow</option>
                  <option value="launch">Product Launch</option>
                  <option value="reporting">Sprint Report</option>
                  <option value="automation">CI/CD Pipeline</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="rounded-xl border border-gray-700 bg-[#212836] px-4 py-2 text-xs font-semibold text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-white px-5 py-2 text-xs font-bold text-gray-900 hover:bg-gray-100"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
