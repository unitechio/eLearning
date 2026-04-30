import React, { useState } from 'react';
import { Flame, Trophy, Crown } from 'lucide-react';
import { useAchievements, useDailyActivitySeries, useGamificationProfile, useHeatmap, useLeaderboard, useMyLeaderboard } from '@/features/engagement';

export function AchievementsPage() {
  const [metric, setMetric] = useState<'xp' | 'time'>('xp');
  const profileQuery = useGamificationProfile();
  const achievementsQuery = useAchievements();
  const heatmapQuery = useHeatmap('6m');
  const dailyQuery = useDailyActivitySeries('30d');
  const leaderboardQuery = useLeaderboard({ type: 'weekly', metric });
  const myStandingQuery = useMyLeaderboard({ type: 'weekly', metric });

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Achievements & Activity</h1>
        <p className="mt-2 text-sm text-slate-500">Trang này lấy data thật từ `/gamification`, `/activity/*`, và `/leaderboard`.</p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <Flame className="h-6 w-6 text-orange-500" />
          <p className="mt-4 text-sm text-slate-500">Current streak</p>
          <p className="mt-1 text-3xl font-black text-slate-900">{profileQuery.data?.current_streak ?? 0}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <Trophy className="h-6 w-6 text-primary" />
          <p className="mt-4 text-sm text-slate-500">Total XP</p>
          <p className="mt-1 text-3xl font-black text-slate-900">{profileQuery.data?.total_xp ?? 0}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <Crown className="h-6 w-6 text-amber-500" />
          <p className="mt-4 text-sm text-slate-500">Badge</p>
          <p className="mt-1 text-2xl font-black text-slate-900">{profileQuery.data?.current_badge ?? 'Starter'}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <Trophy className="h-6 w-6 text-emerald-500" />
          <p className="mt-4 text-sm text-slate-500">Achievement progress</p>
          <p className="mt-1 text-3xl font-black text-slate-900">{profileQuery.data?.achievement_pct ?? 0}%</p>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.25fr,0.75fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">Activity heatmap</h2>
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">6 months</span>
          </div>
          <div className="mt-6 grid grid-cols-12 gap-2">
            {(heatmapQuery.data ?? []).slice(-72).map((item) => (
              <div
                key={item.date}
                className="aspect-square rounded-md"
                style={{ backgroundColor: item.count > 0 ? `rgba(57, 58, 200, ${Math.min(0.2 + item.count * 0.14, 1)})` : '#e5e7eb' }}
                title={`${item.date}: ${item.count} activities`}
              />
            ))}
          </div>
        </section>

        <aside className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">My standing</h2>
          <p className="mt-4 text-sm text-slate-500">Weekly {metric} ranking</p>
          <p className="mt-2 text-4xl font-black text-primary">#{myStandingQuery.data?.rank ?? 0}</p>
          <div className="mt-6 flex gap-2">
            <button className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider ${metric === 'xp' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`} onClick={() => setMetric('xp')} type="button">XP</button>
            <button className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider ${metric === 'time' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`} onClick={() => setMetric('time')} type="button">Time</button>
          </div>
        </aside>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.95fr,1.05fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">Achievements</h2>
          <div className="mt-6 space-y-4">
            {(achievementsQuery.data ?? []).map((item) => (
              <div key={item.code} className={`rounded-2xl border p-4 ${item.unlocked ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.description}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${item.unlocked ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {item.unlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">Leaderboard</h2>
          <div className="mt-6 space-y-3">
            {(leaderboardQuery.data ?? []).slice(0, 10).map((item) => (
              <div key={item.user_id} className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${item.is_current ? 'border-primary bg-primary/5' : 'border-slate-100 bg-slate-50'}`}>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-slate-900">#{item.rank}</span>
                  <div>
                    <p className="font-bold text-slate-900">{item.display_name}</p>
                    <p className="text-xs text-slate-500">{item.time_spent} mins • {item.xp} XP</p>
                  </div>
                </div>
                {item.is_current ? <span className="rounded-full bg-primary px-3 py-1 text-xs font-black uppercase tracking-wider text-white">You</span> : null}
              </div>
            ))}
          </div>

          <h3 className="mt-8 text-lg font-black text-slate-900">Daily activity</h3>
          <div className="mt-4 grid grid-cols-10 gap-2">
            {(dailyQuery.data ?? []).slice(-30).map((item) => (
              <div key={item.date} className="rounded-xl bg-slate-50 p-2 text-center">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{new Date(item.date).getDate()}</p>
                <p className="mt-2 text-xs font-bold text-slate-700">{item.xp}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
