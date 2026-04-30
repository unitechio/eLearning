import React, { useEffect, useState } from 'react';
import { Loader2, Wand2, Save } from 'lucide-react';
import { useGeneratePlanner, usePlanner, useUpdatePlanner } from '@/features/engagement';

export function PlannerPage() {
  const plannerQuery = usePlanner();
  const generatePlanner = useGeneratePlanner();
  const updatePlanner = useUpdatePlanner();
  const [focusArea, setFocusArea] = useState('academy-english');
  const [weeklyTarget, setWeeklyTarget] = useState(5);
  const [tasksText, setTasksText] = useState('');

  useEffect(() => {
    if (plannerQuery.data) {
      setFocusArea(plannerQuery.data.focus_area);
      setWeeklyTarget(plannerQuery.data.weekly_target);
      setTasksText((plannerQuery.data.tasks ?? []).join('\n'));
    }
  }, [plannerQuery.data]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 p-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Study Planner</h1>
        <p className="mt-2 text-sm text-slate-500">Planner này dùng API thật từ `/planner`, không còn route giả nên sẽ không bị out về trang `/` nữa.</p>
      </section>

      {plannerQuery.isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-3xl border border-slate-200 bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-wrap gap-3">
              <button
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-black uppercase tracking-wider text-white"
                onClick={() => generatePlanner.mutate()}
                type="button"
              >
                {generatePlanner.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                Generate planner
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black uppercase tracking-wider text-white"
                onClick={() =>
                  updatePlanner.mutate({
                    focus_area: focusArea,
                    weekly_target: weeklyTarget,
                    tasks: tasksText.split('\n').map((item) => item.trim()).filter(Boolean),
                  })
                }
                type="button"
              >
                {updatePlanner.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save planner
              </button>
            </div>

            <div className="mt-8 grid gap-5">
              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">Focus area</span>
                <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" onChange={(e) => setFocusArea(e.target.value)} value={focusArea} />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">Weekly target</span>
                <input className="w-full rounded-2xl border border-slate-200 px-4 py-3" min={1} onChange={(e) => setWeeklyTarget(Number(e.target.value))} type="number" value={weeklyTarget} />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">Tasks</span>
                <textarea className="min-h-72 w-full rounded-2xl border border-slate-200 px-4 py-3" onChange={(e) => setTasksText(e.target.value)} value={tasksText} />
              </label>
            </div>
          </section>

          <aside className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-black text-slate-900">Current roadmap</h2>
            <div className="mt-6 space-y-4">
              {(plannerQuery.data?.tasks ?? []).map((task, index) => (
                <div key={`${task}-${index}`} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-wider text-primary">Task {index + 1}</p>
                  <p className="mt-2 font-semibold text-slate-900">{task}</p>
                </div>
              ))}
              {(plannerQuery.data?.tasks ?? []).length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No planner tasks yet. Generate one to start.</div>
              ) : null}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
