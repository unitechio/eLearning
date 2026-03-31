import { DailyPlan } from "@/features/learning/components/daily-plan";
import { StatsOverview, RecentAssessments } from "@/features/learning/components/stats-overview";
import { Flame } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="w-full flex-1 p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Hero / Welcome Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-on-surface">Good morning, Alex.</h2>
          <p className="text-on-surface-variant text-lg">Your AI tutor has prepared a 45-minute focus session for your Writing Task 2.</p>
        </div>
        
        <div className="flex justify-end items-center gap-4">
          <div className="bg-surface-container-low p-4 rounded-lg flex items-center gap-3 shadow-sm">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Current Streak</p>
              <p className="text-2xl font-black text-secondary tracking-tight">14 Days</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
              <Flame className="w-6 h-6 fill-secondary" />
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
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
