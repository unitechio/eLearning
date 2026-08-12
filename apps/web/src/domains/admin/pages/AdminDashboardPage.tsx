import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, MessageSquare, CreditCard, Clock, BookOpen, Layers,
  TrendingUp, Sparkles, Plus, Bell, Search, Check, Info, ArrowUpRight, ArrowDownRight,
  SunMoon, HelpCircle, FileText, ChevronRight, LogIn, LogOut
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/lib/utils';

// Mock stats matching Screenshot 2
const stats = [
  { label: 'All User', value: '200', change: '+12.5%', isPositive: true, icon: Users, color: 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/30' },
  { label: 'Conversations', value: '30.10k', change: '+8.2%', isPositive: true, icon: MessageSquare, color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30' },
  { label: '30 days sales', value: '80', change: '-2.4%', isPositive: false, icon: CreditCard, color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30' },
  { label: 'Avg time', value: '50m', change: '+15.3%', isPositive: true, icon: Clock, color: 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/30' },
  { label: 'Courses', value: '12', change: '+20%', isPositive: true, icon: BookOpen, color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30' },
  { label: 'Categories', value: '05', change: '0%', isPositive: true, icon: Layers, color: 'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-950/30' },
];

// Mock chart signup counts matching Screenshot 2
const chartData = [
  { date: '10 Nov', count: 18, signups: '02' },
  { date: '11 Nov', count: 68, signups: '03' }, // Peak on Screenshot 2
  { date: '12 Nov', count: 42, signups: '02' },
  { date: '13 Nov', count: 32, signups: '01' },
  { date: '14 Nov', count: 28, signups: '01' },
  { date: '15 Nov', count: 15, signups: '01' },
  { date: '16 Nov', count: 8, signups: '00' },
];

const blogPosts = [
  { title: 'How to Sell Online Course On Your Shopify Store', date: '2 days ago', isNew: true },
  { title: '16 Canva Black Friday templates for online course creators', date: '2 days ago', isNew: true },
  { title: 'The 14-Step Checklist to Prepare Your Online School For Black Friday', date: '2 days ago', isNew: false },
  { title: 'From Emergency Remote Training to Long Team Effective & Profitable Online Learning', date: '2 days ago', isNew: false },
];

const eventLogs = [
  { user: 'Mike Banner', action: 'Logged In', time: '2 hours ago', icon: LogIn, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
  { user: 'Nina Smith', action: 'Logged Out', time: '10 hours ago', icon: LogOut, color: 'text-slate-500 bg-slate-50 dark:bg-slate-900/30' },
  { user: 'Alex Simitsis', action: 'Logged In', time: '12 hours ago', icon: LogIn, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
  { user: 'Tony Stark', action: 'Logged Out', time: '15 hours ago', icon: LogOut, color: 'text-slate-500 bg-slate-50 dark:bg-slate-900/30' },
];

const onlineUsers = [
  { name: 'Sophia Williams', desc: 'Join 3 months ago', status: 'active' },
  { name: 'Arthur Taylor', desc: 'Join 4 months ago', status: 'active' },
  { name: 'David Smith', desc: 'Join 4 months ago', status: 'active' },
  { name: 'Harry Potter', desc: 'Join 4 months ago', status: 'active' },
  { name: 'Frank Gary', desc: 'Join 4 months ago', status: 'active' },
  { name: 'Matthew Johnson', desc: 'Join 4 months ago', status: 'active' },
  { name: 'John Henry', desc: 'Join 4 months ago', status: 'active' },
  { name: 'Ronald Richard', desc: 'Join 4 months ago', status: 'active' },
  { name: 'John Wick', desc: 'Join 4 months ago', status: 'active' },
];

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'signups' | 'revenue' | 'products' | 'learners'>('signups');

  return (
    <main className="p-6 space-y-6 flex flex-col w-full antialiased font-inter text-slate-800 dark:text-slate-200">
      {/* Header section matching Screenshot 2 */}
      <header className="flex flex-col gap-4 border-b border-slate-100 pb-5 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <nav aria-label="breadcrumb" className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <span>Home</span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-slate-900 dark:text-slate-100">Dashboard</span>
          </nav>
          
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
              Dashboard
            </h1>
            <a
              href="#"
              className="text-slate-400 hover:text-slate-600 dark:text-slate-650 dark:hover:text-slate-400 text-xs font-bold underline flex items-center gap-1"
            >
              <span>Learn more</span>
              <HelpCircle className="h-3 w-3" />
            </a>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Gain real-time insights into your school's analytics and activities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate('/admin/courses/create')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            <span>Create Course</span>
          </Button>
        </div>
      </header>

      {/* Grid wrapper for main content and right sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start w-full">
        {/* Main analytical blocks (3/4 width on wide screens) */}
        <section className="xl:col-span-3 space-y-6 flex flex-col" aria-label="Analytical panels">
          {/* Stats Cards Section */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-4 rounded-2xl flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className={cn("p-2.5 rounded-xl shrink-0", stat.color)}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                  <span className={cn(
                    "text-[10px] font-black px-1.5 py-0.5 rounded-md",
                    stat.isPositive
                      ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20"
                      : "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/20"
                  )}>
                    {stat.change}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-xl font-black text-slate-950 dark:text-white mt-0.5">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Bar Chart Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden p-6 space-y-6">
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              {/* Tab options */}
              <div className="flex flex-wrap border-b sm:border-b-0 border-slate-150 gap-4">
                {(['signups', 'revenue', 'products', 'learners'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "pb-2 text-sm font-bold border-b-2 capitalize transition-colors",
                      activeTab === tab
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    )}
                  >
                    {tab === 'signups' ? 'New signups' : tab === 'products' ? 'Product sales' : tab === 'learners' ? 'Active learners' : 'Revenue'}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                <span>Latest Activity</span>
                <Info className="h-3.5 w-3.5" />
              </div>
            </header>

            {/* Custom bar chart representation */}
            <div className="relative h-64 w-full flex flex-col justify-end">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none" aria-hidden="true">
                {[4, 3, 2, 1, 0].map((num) => (
                  <div key={num} className="w-full flex items-center gap-4">
                    <span className="text-[10px] font-bold text-slate-400 w-6 text-right">00{num}</span>
                    <hr className="flex-1 border-dashed border-slate-150 dark:border-slate-800" />
                  </div>
                ))}
              </div>

              {/* Bars container */}
              <div className="flex justify-around items-end h-48 pl-10 z-10 w-full">
                {chartData.map((data, idx) => {
                  const pct = (data.count / 80) * 100;
                  return (
                    <div key={idx} className="group relative flex flex-col items-center w-full">
                      {/* Tooltip on hover */}
                      <div className="absolute -top-12 scale-0 group-hover:scale-100 transition-transform origin-bottom bg-slate-950 text-white rounded-lg p-2 text-xs font-bold shadow-xl border border-slate-800 dark:bg-white dark:text-slate-950 whitespace-nowrap">
                        <p>{data.date}</p>
                        <p className="text-[10px] opacity-80">New Signups: {data.signups}</p>
                      </div>

                      {/* Bar div */}
                      <div
                        className={cn(
                          "w-12 md:w-16 rounded-t-lg bg-gradient-to-t from-indigo-500/80 to-indigo-600 transition-all duration-500",
                          data.date === '11 Nov' ? "from-indigo-600 to-violet-600 shadow-md shadow-indigo-200 dark:shadow-none" : ""
                        )}
                        style={{ height: `${pct}%` }}
                      />
                      <span className="mt-2 text-[10px] font-bold text-slate-500">{data.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Double Column: Blog + Events Log */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sell Courses blog */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col gap-4">
              <header className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">
                  How to sell Courses blog
                </h3>
                <Button variant="outline" size="sm" className="h-8 text-xs font-semibold rounded-lg">
                  See All
                </Button>
              </header>

              <div className="flex flex-col gap-4">
                {blogPosts.map((post, idx) => (
                  <article key={idx} className="flex gap-4 items-start cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-950/20 p-2 rounded-xl transition-colors">
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 leading-snug">
                          {post.title}
                        </h4>
                        {post.isNew && (
                          <Badge className="bg-blue-50 text-blue-600 border-none text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">{post.date}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 self-center" />
                  </article>
                ))}
              </div>
            </div>

            {/* Events Log */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col gap-4">
              <header className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">
                  Events Log
                </h3>
                <Button variant="outline" size="sm" className="h-8 text-xs font-semibold rounded-lg">
                  See All
                </Button>
              </header>

              <div className="flex flex-col gap-3">
                {eventLogs.map((log, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-850 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg", log.color)}>
                        <log.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{log.user}</p>
                        <p className="text-[10px] text-slate-450 mt-0.5">{log.action}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Right Sidebar - Users directories */}
        <aside className="space-y-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-5 rounded-2xl shadow-sm" aria-label="School Users Panel">
          <header className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">
              Users
            </h3>
            <Button variant="outline" size="sm" className="h-8 text-xs font-semibold rounded-lg">
              See All
            </Button>
          </header>

          {/* New User list section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">New User</h4>
            <div className="flex flex-col gap-3">
              {[
                { name: 'James Brown', desc: '2 days ago' },
                { name: 'Tony Stark', desc: '2 days ago' },
                { name: 'James Brown', desc: '2 days ago' },
                { name: 'Mike Banner', desc: '2 days ago' },
              ].map((user, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-950 dark:text-white">{user.name}</p>
                      <p className="text-[9px] text-slate-400">{user.desc}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 px-2.5 text-[10px] font-bold bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg">
                    Contact
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" aria-hidden="true" />

          {/* Online Users section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Online Users</h4>
            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
              {onlineUsers.map((user, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <div className="h-7 w-7 rounded-full bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center font-bold text-xs text-indigo-600 dark:text-indigo-400">
                        {user.name.charAt(0)}
                      </div>
                      <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-950 dark:text-white">{user.name}</p>
                      <p className="text-[9px] text-slate-400">{user.desc}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 px-2.5 text-[10px] font-bold bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg">
                    Contact
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};
export default AdminDashboardPage;
