"use client";

import { useLearningStats } from "@/hooks/use-learning";
import { Mic, Pen, BarChart2, MessageSquare, Library, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, any> = {
  analytics: BarChart2,
  forum: MessageSquare,
  library_books: Library,
};

export function StatsOverview() {
  const { data: stats, isLoading } = useLearningStats();

  if (isLoading || !stats) {
    return <div className="animate-pulse h-64 bg-surface-container-lowest rounded-lg"></div>;
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <button className="p-6 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-all text-left group">
          <div className="w-10 h-10 rounded-xl bg-white mb-4 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Mic className="w-5 h-5 text-primary" />
          </div>
          <p className="font-bold">Speak</p>
          <p className="text-xs text-on-surface-variant">Practice Part 1-3</p>
        </button>
        <button className="p-6 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-all text-left group">
          <div className="w-10 h-10 rounded-xl bg-white mb-4 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
            <Pen className="w-5 h-5 text-secondary" />
          </div>
          <p className="font-bold">Write</p>
          <p className="text-xs text-on-surface-variant">Essay Correction</p>
        </button>
      </div>

      {/* Progress Chart Placeholder */}
      <div className="bg-surface-container-lowest rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="font-bold">Score Progression</h3>
            <p className="text-xs text-on-surface-variant">Last 30 days</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-primary">+0.5 Band</p>
            <p className="text-[10px] text-on-surface-variant">Estimated</p>
          </div>
        </div>

        <div className="h-32 flex items-end justify-between gap-2 px-2">
          {stats.scoreProgression.map((score, index) => (
            <div 
              key={index}
              className={cn(
                "w-full rounded-t-full transition-all",
                index === stats.scoreProgression.length - 1 
                  ? "bg-primary shadow-[0_0_15px_rgba(57,58,200,0.3)] hover:bg-primary-container"
                  : "bg-primary-fixed hover:bg-primary"
              )}
              style={{ height: `${score}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-3 px-1">
          <span className="text-[10px] text-on-surface-variant">Week 1</span>
          <span className="text-[10px] text-on-surface-variant">Week 2</span>
          <span className="text-[10px] text-on-surface-variant">Week 3</span>
          <span className="text-[10px] font-bold text-on-surface">Now</span>
        </div>
      </div>

      {/* AI Insights Card */}
      <div className="bg-gradient-to-br from-primary to-secondary p-6 rounded-lg text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
              AI Analysis
            </span>
          </div>
          <p className="text-sm font-medium leading-relaxed">
            {stats.aiFeedback}
          </p>
        </div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -left-2 -top-2 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
      </div>
    </div>
  );
}

export function RecentAssessments() {
  const { data: stats, isLoading } = useLearningStats();

  if (isLoading || !stats) {
    return <div className="space-y-4">Loading...</div>;
  }

  return (
    <section className="space-y-4">
      <h3 className="text-xl font-bold">Recent Assessments</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.recentAssessments.map(item => {
          const Icon = ICON_MAP[item.icon] || BarChart2;
          
          return (
            <div key={item.id} className="bg-white p-4 rounded-lg flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant">{item.type}</p>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm font-bold text-secondary">{item.score}</p>
              </div>
            </div>
          );
        })}

        {/* Action Empty State */}
        <div className="border-2 border-dashed border-outline-variant/30 rounded-lg flex items-center justify-center p-4 hover:bg-surface-container-low transition-colors cursor-pointer">
          <div className="flex flex-col items-center gap-1">
            <Plus className="text-on-surface-variant w-6 h-6" />
            <span className="text-xs font-bold text-on-surface-variant">START NEW TASK</span>
          </div>
        </div>
      </div>
    </section>
  );
}
