import React from "react";
import { Mic2, Edit3, BookOpen, Flame, Sparkles } from "lucide-react";

export const StatsOverview = () => {
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
          {[40, 55, 45, 70, 65, 85, 95].map((height, i) => (
            <div 
              key={i}
              style={{ height: `${height}%` }}
              className={`w-full rounded-t-xl transition-all duration-500 hover:opacity-100 cursor-pointer ${
                i === 6 
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
            &quot;Your coherence and cohesion scores are peaking. Focus on lexical resource—specifically topic-specific vocabulary—to break the Band 8 barrier.&quot;
          </p>
        </div>
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -left-4 -top-4 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
      </div>
    </div>
  );
};

export const RecentAssessments = () => {
  const assessments = [
    { type: "WRITING TASK 1", title: "Graph Description", score: "Band 7.5", icon: Edit3 },
    { type: "SPEAKING PART 3", title: "Urbanization Trends", score: "Band 8.0", icon: Mic2 },
    { type: "READING MOCK", title: "Academic Passage 2", score: "Band 9.0", icon: BookOpen },
  ];

  return (
    <section className="space-y-6 pt-4">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">Recent Assessments</h3>
        <button className="text-xs font-black text-primary uppercase tracking-widest hover:underline">View All</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {assessments.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl flex items-center gap-5 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer border border-slate-100/50 dark:border-slate-800/50 shadow-sm group">
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
