import React from "react";
import { DailyPlan, StatsOverview, RecentAssessments } from "@/features/learning";
import { Flame } from "lucide-react";

export function DashboardPage() {
  return (
    <div className="w-full flex-1 p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
      {/* Hero / Welcome Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-slate-100 dark:border-slate-800 pb-12">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full border border-secondary/20">
            <Flame className="w-4 h-4 text-secondary fill-secondary" />
            <span className="text-xs font-black text-secondary uppercase tracking-widest leading-none">14 Day Streak</span>
          </div>
          <h2 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-slate-50 leading-tight">Good morning, Alex.</h2>
          <p className="text-on-surface-variant text-xl font-medium opacity-60 leading-relaxed">
            Your AI tutor has prepared a specialized <span className="text-primary font-bold">45-minute focus session</span> for your Reasoning & Essay Structure.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl flex flex-col items-center justify-center gap-2 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 min-w-[200px]">
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-black opacity-40">IELTS Score</p>
            <p className="text-5xl font-black text-primary tracking-tight">8.5</p>
            <p className="text-xs font-bold text-secondary uppercase tracking-widest mt-1">Estimated</p>
          </div>
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-8">
        {/* Daily Roadmap (7 cols) */}
        <div className="col-span-12 lg:col-span-7">
          <DailyPlan />
        </div>

        {/* Quick Actions & Stats (5 cols) */}
        <div className="col-span-12 lg:col-span-5">
          <StatsOverview />
        </div>
      </div>

      {/* Bottom Section: Recent Performance */}
      <RecentAssessments />
    </div>
  );
}
