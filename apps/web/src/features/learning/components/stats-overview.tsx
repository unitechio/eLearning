import React from "react";
import { Mic2, Edit3, BookOpen, Flame, Sparkles, Loader2, BarChart3, MessageSquare, Library } from "lucide-react";
import { useLearningStats } from "../api/hooks";

const ICON_MAP: Record<string, any> = {
  analytics: BarChart3,
  forum: MessageSquare,
  library_books: Library,
  mic: Mic2,
  edit: Edit3,
  book: BookOpen,
};

export const StatsOverview = () => {
  const { data: stats, isLoading } = useLearningStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-40 flex items-center justify-center bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100/50">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <button className="p-6 bg-surface-container-low/50 border border-slate-200/20 rounded-3xl hover:bg-white dark:hover:bg-slate-800 transition-all text-left group shadow-sm hover:shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 mb-6 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm">
            <Mic2 className="w-6 h-6" />
          </div>
          <p className="font-bold text-slate-900 dark:text-slate-50">Speak</p>
          <p className="text-xs text-on-surface-variant opacity-60">Practice Part 1-3</p>
        </button>
        <button className="p-6 bg-surface-container-low/50 border border-slate-200/20 rounded-3xl hover:bg-white dark:hover:bg-slate-800 transition-all text-left group shadow-sm hover:shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 mb-6 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform shadow-sm">
            <Edit3 className="w-6 h-6" />
          </div>
          <p className="font-bold text-slate-900 dark:text-slate-50">Write</p>
          <p className="text-xs text-on-surface-variant opacity-60">Essay Correction</p>
        </button>
      </div>

      {/* Progress Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100/50 dark:border-slate-800/50">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-50">Score Progression</h3>
            <p className="text-xs text-on-surface-variant opacity-60">Estimated Band Score</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-primary">+0.5 Band</p>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tight opacity-40">Last 30 days</p>
          </div>
        </div>
        
        <div className="h-40 flex items-end justify-between gap-2 px-1">
          {stats?.scoreProgression.map((height, i) => (
            <div 
              key={i}
              style={{ height: `${height}%` }}
              className={`w-full rounded-t-xl transition-all duration-500 hover:opacity-100 cursor-pointer ${
                i === stats.scoreProgression.length - 1 
                  ? "bg-primary shadow-[0_0_20px_rgba(57,58,200,0.3)] opacity-100" 
                  : "bg-primary/20 opacity-60"
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-4 px-1">
          <span className="text-[10px] font-bold text-on-surface-variant opacity-40">W1</span>
          <span className="text-[10px] font-bold text-on-surface-variant opacity-40">W2</span>
          <span className="text-[10px] font-bold text-on-surface-variant opacity-40">W3</span>
          <span className="text-[10px] font-black text-primary uppercase tracking-wider">NOW</span>
        </div>
      </div>

      {/* AI Insights Card */}
      <div className="bg-gradient-to-br from-primary to-secondary p-8 rounded-3xl text-white relative overflow-hidden shadow-xl shadow-primary/20">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 fill-white" />
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">AI Analysis</p>
          </div>
          <p className="text-sm font-medium leading-relaxed italic opacity-90">
            {stats?.aiFeedback}
          </p>
        </div>
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -left-4 -top-4 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
      </div>
    </div>
  );
};

export const RecentAssessments = () => {
  const { data: stats, isLoading } = useLearningStats();

  if (isLoading) {
    return (
      <div className="pt-8 flex justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <section className="space-y-6 pt-4">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">Recent Assessments</h3>
        <button className="text-xs font-black text-primary uppercase tracking-widest hover:underline">View All</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats?.recentAssessments.map((item) => {
          const Icon = ICON_MAP[item.icon] || BookOpen;
          return (
            <div key={item.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl flex items-center gap-5 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer border border-slate-100/50 dark:border-slate-800/50 shadow-sm group">
              <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-60 mb-1">{item.type}</p>
                <p className="font-bold text-slate-900 dark:text-slate-50 truncate">{item.title}</p>
                <p className="text-sm font-black text-secondary mt-1">{item.score}</p>
              </div>
            </div>
          );
        })}
        
        <div className="border-2 border-dashed border-slate-200/50 dark:border-slate-800/50 rounded-3xl flex items-center justify-center p-6 hover:bg-surface-container-low/50 hover:border-primary/30 transition-all cursor-pointer group min-h-[100px]">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-60">New Task</span>
          </div>
        </div>
      </div>
    </section>
  );
};

