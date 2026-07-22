import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Flame, 
  Headphones, 
  BookOpen, 
  PenSquare, 
  Mic, 
  Trophy, 
  Calendar, 
  CheckCircle2, 
  User, 
  ChevronRight, 
  Sparkles,
  Bell,
  Sun,
  Moon,
  Bookmark,
  Award,
  GraduationCap,
  ClipboardList,
  Compass,
  Menu,
  X,
  Dumbbell
} from 'lucide-react';
import { useTheme } from '@/shared/hooks/useTheme';
import { useMyLmsDashboard } from '../api/hooks';
import { cn } from '@/shared/lib';

function ProgressRing({ value, label, subtitle }: { value: number; label: string; subtitle?: string }) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <article className="rounded-2xl bg-white dark:bg-slate-950 p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center">
      <div 
        className="flex h-24 w-24 items-center justify-center rounded-full bg-[conic-gradient(#3b82f6_var(--progress),#f1f5f9_0)] dark:bg-[conic-gradient(#3b82f6_var(--progress),#1e293b_0)]" 
        style={{ ['--progress' as string]: `${safeValue * 3.6}deg` }}
      >
        <div className="flex h-18 w-18 flex-col items-center justify-center rounded-full bg-white dark:bg-slate-900 shadow-inner">
          <span className="text-lg font-black text-slate-900 dark:text-white">{safeValue}%</span>
        </div>
      </div>
      <h4 className="mt-4 text-center text-sm font-black text-slate-800 dark:text-slate-200">{label}</h4>
      {subtitle && <p className="text-[10px] text-slate-400 mt-1">{subtitle}</p>}
    </article>
  );
}

export function LmsDashboardPage() {
  const { theme, toggleTheme } = useTheme();
  const dashboardQuery = useMyLmsDashboard();
  const [activeTab, setActiveTab] = useState<'overview' | 'course-details' | 'ai-practice'>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const data = dashboardQuery.data;
  const dashboard = data?.dashboard ?? {
    current_streak: 22,
    attendance_rate: 98,
    practice_rate: 68,
    assignment_rate: 80,
    overall_progress: 66,
  };

  const menuItems = [
    { label: "Home", icon: ClipboardList, active: true },
    { label: "Hall of fame", icon: Trophy },
    { label: "Ký yếu", icon: BookOpen },
    { label: "DOL Linearculture", icon: Sparkles },
    { label: "In-progress courses", icon: Calendar },
    { label: "Upcoming courses", icon: Calendar },
    { label: "Completed courses", icon: Calendar },
    { label: "Extra courses", icon: Calendar },
    { label: "Test history", icon: Compass },
    { label: "Certifications", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans flex flex-col">
      
      {/* 1. Header component */}
      <header aria-label="DOL LMS Top bar" className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            type="button" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white font-black text-xl shadow-md">
              D
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tight leading-none text-slate-900 dark:text-white">DOL IELTS</span>
              <span className="text-[9px] font-black tracking-widest text-slate-400 dark:text-slate-500 leading-none mt-1">ĐÌNH LỰC</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Toggle theme"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-orange-400" /> : <Moon className="h-4 w-4 text-slate-500" />}
          </button>

          {/* Notifications */}
          <button 
            type="button" 
            className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              2
            </span>
          </button>

          {/* Avatar Profile */}
          <figure aria-label="Student profile" className="h-9 w-9 rounded-full overflow-hidden border border-red-500 shadow-sm cursor-pointer">
            <img 
              alt="Dang Hoang Linh Avatar" 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&h=100" 
              className="h-full w-full object-cover"
            />
          </figure>
        </div>
      </header>

      {/* Main layout frame */}
      <div className="flex-1 flex">
        
        {/* 2. Left Sidebar Navigation */}
        <aside 
          aria-label="LMS navigation menu" 
          className={cn(
            "fixed inset-y-0 left-0 top-[73px] z-30 w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-4 transition-transform lg:translate-x-0 lg:static lg:z-0 lg:h-auto",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <nav aria-label="Main sidebar navigation" className="space-y-1">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-2xl transition-all",
                    item.active 
                      ? "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400" 
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-800 dark:hover:text-slate-200"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Backdrop for mobile navigation drawer */}
        {mobileMenuOpen && (
          <button 
            type="button"
            className="fixed inset-0 top-[73px] bg-slate-900/40 backdrop-blur-sm z-20 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu backdrop"
          />
        )}

        {/* 3. Main Dashboard Body */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-8 overflow-y-auto max-w-5xl mx-auto w-full">
          
          {/* Header Action Row */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-xl font-black uppercase text-slate-800 dark:text-white tracking-wider">
              Quá trình học của bạn
            </h1>
            
            {/* Tab Toggle buttons */}
            <nav aria-label="Dashboard filter" className="flex items-center gap-2 bg-slate-200/60 dark:bg-slate-800/60 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-black transition",
                  activeTab === 'overview' 
                    ? "bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                )}
              >
                Tổng quan
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('course-details')}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-black transition",
                  activeTab === 'course-details' 
                    ? "bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                )}
              >
                Chi tiết khóa học
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ai-practice')}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-black transition",
                  activeTab === 'ai-practice' 
                    ? "bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                )}
              >
                AI Practice
              </button>
            </nav>
          </header>

          {/* ──── TAB 1: OVERVIEW ──── */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Side: Course states highlights */}
                <div className="lg:col-span-8 space-y-4">
                  
                  {/* Banner 1: In progress */}
                  <article className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 flex items-start gap-4 hover:shadow-md transition">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-500 flex items-center justify-center shrink-0">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-base font-black text-slate-800 dark:text-white">Bạn đang theo học 2 khóa học</h3>
                        <Link to="#" className="text-xs font-black text-blue-600 dark:text-blue-400 hover:underline">
                          Inprogress courses &gt;
                        </Link>
                      </div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Phát triển kỹ năng của bạn qua khóa học IELTS, SAT
                      </p>
                      {/* Rates Row */}
                      <div className="flex flex-wrap gap-4 pt-1">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800">
                          <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" /> Attendance 98%
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800">
                          <CheckCircle2 className="h-3.5 w-3.5 text-orange-500" /> Practice 68%
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> Assignment 80%
                        </span>
                      </div>
                    </div>
                  </article>

                  {/* Banner 2: Upcoming courses */}
                  <article className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 flex items-start gap-4 hover:shadow-md transition">
                    <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-500 flex items-center justify-center shrink-0">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-base font-black text-slate-800 dark:text-white">Bạn có 1 khóa học sắp diễn ra</h3>
                        <Link to="#" className="text-xs font-black text-purple-600 dark:text-purple-400 hover:underline">
                          Upcoming courses &gt;
                        </Link>
                      </div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Chuẩn bị sẵn sàng cho khóa học IELTS sắp tới
                      </p>
                    </div>
                  </article>

                  {/* Banner 3: Completed courses */}
                  <article className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 flex items-start gap-4 hover:shadow-md transition">
                    <div className="h-10 w-10 rounded-xl bg-green-50 dark:bg-green-950/30 text-green-500 flex items-center justify-center shrink-0">
                      <Award className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-base font-black text-slate-800 dark:text-white">Bạn đã học xong 2 khóa học</h3>
                        <Link to="#" className="text-xs font-black text-green-600 dark:text-green-400 hover:underline">
                          Completed courses &gt;
                        </Link>
                      </div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Xem lại khóa học IELTS, SAT của bạn tại DOL
                      </p>
                      {/* Stats Badges */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 px-3 py-1 rounded-xl">
                          Đi học 200 buổi
                        </span>
                        <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 px-3 py-1 rounded-xl">
                          Luyện tập 122 bài
                        </span>
                        <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 px-3 py-1 rounded-xl">
                          Hoàn thành 22 assignment
                        </span>
                      </div>
                    </div>
                  </article>

                </div>

                {/* Right Side: Stats column widgets */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Streak Card Widget */}
                  <article className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 flex items-center justify-between shadow-sm hover:shadow-md transition">
                    <div className="space-y-1">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                        Đạt được {dashboard.current_streak} ngày
                      </h3>
                      <p className="text-xs font-black text-orange-500">streak cao nhất</p>
                      <p className="text-[10px] font-semibold text-slate-400 leading-tight pt-1 max-w-[150px]">
                        Số streak cao nhất mà bạn có thuộc khóa học IELTS 5.0
                      </p>
                    </div>
                    {/* Flame Badge */}
                    <div className="h-16 w-12 bg-orange-50 dark:bg-orange-950/30 rounded-2xl border border-orange-100 dark:border-orange-900 flex flex-col items-center justify-center shrink-0">
                      <Flame className="h-7 w-7 text-orange-500 fill-orange-500 animate-pulse" />
                      <span className="text-xs font-black text-orange-600 mt-1">{dashboard.current_streak}</span>
                    </div>
                  </article>

                  {/* Course Progress circles */}
                  <article className="grid grid-cols-2 gap-4">
                    <ProgressRing label="IELTS 5.0" value={66} subtitle="Tân Bình - 02/04" />
                    <ProgressRing label="SAT 700" value={98} subtitle="Tân Bình - 02/04" />
                  </article>

                  {/* Certifications Widget */}
                  <article className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm space-y-4">
                    <header>
                      <h3 className="text-sm font-black text-slate-800 dark:text-white">Chứng chỉ bạn vừa đạt!</h3>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">Chúc mừng! Bạn đã hoàn thành rất tốt khóa học IELTS 5.0.</p>
                    </header>
                    
                    {/* Simulated digital certificate */}
                    <figure className="border border-amber-200/80 rounded-2xl bg-amber-50/20 p-4 text-center space-y-3 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-amber-100/50 rounded-full blur-xl" />
                      <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block">Linear Certificate</span>
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200 block mt-1">IELTS 5.0</span>
                      </div>
                      <div className="border-t border-slate-100 dark:border-slate-800 pt-2 flex items-center justify-between text-[8px] font-black text-slate-400 uppercase">
                        <span>Đặng Hoàng Linh</span>
                        <span>02/04/2022</span>
                      </div>
                    </figure>
                  </article>

                </div>

              </div>

              {/* Bottom Section: Active courses details cards */}
              <section className="space-y-4">
                <h3 className="text-sm font-black text-slate-500 uppercase tracking-wider">Khóa đang học</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  {[
                    { title: "IELTS 5.0 - Tân Bình - 02/04/2022", time: "14:30 - 15:30", type: "IELTS" },
                    { title: "SAT - Tân Bình - 02/04/2022", time: "14:30 - 15:30", type: "SAT" }
                  ].map((course, idx) => (
                    <article key={idx} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 flex flex-col justify-between space-y-4 shadow-sm hover:border-red-300 transition">
                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded-md">
                          {course.type}
                        </span>
                        <h4 className="text-base font-black text-slate-800 dark:text-white leading-snug">{course.title}</h4>
                        <p className="text-xs font-semibold text-slate-400">Thời gian: {course.time}</p>
                      </div>
                      <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between">
                        <span className="text-xs font-black text-slate-500 dark:text-slate-400">Tân Bình Center</span>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </div>
                    </article>
                  ))}
                </div>
              </section>

            </div>
          )}

          {/* ──── TAB 2: COURSE DETAILS ──── */}
          {activeTab === 'course-details' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Core metrics and stats block */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 4 circular progress stats */}
                <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <ProgressRing label="Course progress" value={66} subtitle="22+2 / 27 buổi học" />
                  <ProgressRing label="Attendance" value={98} subtitle="20 / 27 buổi" />
                  <ProgressRing label="Practice" value={68} subtitle="30 / 50 bài luyện tập" />
                  <ProgressRing label="Assignment" value={80} subtitle="11 / 12 bài chấm" />
                </div>

                {/* Orange Streak box */}
                <div className="lg:col-span-4">
                  <article className="h-full rounded-3xl border border-orange-200 dark:border-orange-950 bg-orange-50/50 dark:bg-orange-950/20 p-6 flex flex-col justify-between space-y-4 shadow-sm">
                    <div className="space-y-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-500 shrink-0">
                        <Flame className="h-6 w-6 fill-current" />
                      </div>
                      <h3 className="text-base font-black text-slate-800 dark:text-white leading-snug">Bạn đang có chuỗi 16 ngày streak</h3>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                        Hãy tiếp tục luyện tập đều đặn mỗi ngày để giữ vững phong độ học tập tốt nhé!
                      </p>
                    </div>
                    <button 
                      type="button" 
                      className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-xl shadow transition active:scale-[0.99]"
                    >
                      Duy trì Streak ngay
                    </button>
                  </article>
                </div>

              </div>

              {/* Weekly exercises and lesson outlines */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Lessons checklist */}
                <div className="lg:col-span-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm space-y-6">
                  <header>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">Kho bài tập được soạn riêng cho từng khóa học</h3>
                    <p className="text-xs text-slate-400 font-semibold mt-1">Giúp học viên ôn luyện đúng phương pháp được học trên lớp</p>
                  </header>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { title: "Tuần 1 - Speaking", assignments: 2, test: 2, exercise: 1, vocab: 3, blog: 4 },
                      { title: "Tuần 1 - Writing", assignments: 2, test: 2, exercise: 1, vocab: 3, blog: 4 },
                      { title: "Tuần 1 - Reading", assignments: 5, test: 3, exercise: 2, vocab: 4, blog: 4 },
                      { title: "Tuần 1 - Listening", assignments: 5, test: 2, exercise: 3, vocab: 2, blog: 4 }
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-3 hover:border-red-100 transition">
                        <h4 className="font-black text-slate-800 dark:text-white text-sm">{item.title}</h4>
                        <div className="grid grid-cols-3 gap-2 text-[9px] font-black text-slate-400 uppercase">
                          <span>{item.assignments} assignment</span>
                          <span>{item.test} test</span>
                          <span>{item.exercise} exercise</span>
                          <span>{item.vocab} vocab</span>
                          <span>{item.blog} blog</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Outline details box */}
                <div className="lg:col-span-4 space-y-4">
                  
                  {/* Next session card */}
                  <article className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 space-y-3 shadow-sm">
                    <span className="text-[9px] font-black tracking-wider uppercase bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md">
                      Buổi học tiếp theo
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">Buổi 13 • Extra</h4>
                      <p className="text-xs text-slate-400 font-semibold">Thứ hai, 12/10 | 14:30 - 15:30</p>
                      <p className="text-xs text-slate-400 font-semibold">Cơ sở 3/2 • Phòng 103</p>
                    </div>
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-2 text-[10px] text-slate-500 font-bold">
                      Bài học: W8 - Reading - 5.0 - Luyện tập nâng cao
                    </div>
                  </article>

                  {/* Previous session card */}
                  <article className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 space-y-3 shadow-sm">
                    <span className="text-[9px] font-black tracking-wider uppercase bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 px-2 py-1 rounded-md">
                      Buổi học gần nhất
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">Buổi 12 • Standard</h4>
                      <p className="text-xs text-slate-400 font-semibold">Thứ sáu, 09/10 | 14:30 - 15:30</p>
                      <p className="text-xs text-green-600 font-black">✓ Có mặt lớp học</p>
                    </div>
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-2 text-[10px] text-slate-500 font-bold">
                      Giáo viên: Hoàng Đức Toàn
                    </div>
                  </article>

                </div>

              </section>

            </div>
          )}

          {/* ──── TAB 3: AI PRACTICE ──── */}
          {activeTab === 'ai-practice' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Visual Speaking feedback simulation widget */}
                <div className="lg:col-span-7 rounded-3xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm space-y-6">
                  
                  {/* Styled spoken word box */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 relative space-y-3">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      Đề xuất lỗi trong bài nói của bạn
                    </p>
                    <div className="text-sm font-semibold tracking-wide leading-relaxed text-slate-800 dark:text-slate-200">
                      Well, I <span className="text-red-500 underline decoration-dotted font-bold">was planning</span> to <span className="text-red-500 underline decoration-dotted font-bold">make</span> a delicious chocolate cake for the party tonight...
                    </div>

                    {/* Phoneme tooltip popup mock */}
                    <div className="w-56 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-4 space-y-3 absolute top-6 right-6 z-10 animate-in fade-in zoom-in-95">
                      <div className="flex items-center gap-4 text-slate-500">
                        <button type="button" aria-label="Play original pronunciation" className="text-red-500 hover:scale-105 transition">
                          <Volume2 className="h-4 w-4" />
                        </button>
                        <button type="button" aria-label="Play student voice" className="text-green-500 hover:scale-105 transition">
                          <Volume2 className="h-4 w-4" />
                        </button>
                      </div>
                      <table className="w-full text-xs font-black text-left">
                        <thead>
                          <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-850">
                            <th className="pb-1">Syllable</th>
                            <th className="pb-1">Phone</th>
                            <th className="pb-1">Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-50 dark:border-slate-900/40">
                            <td rowSpan={3} className="py-2 align-middle">make</td>
                            <td className="py-1 text-green-500">M</td>
                            <td className="py-1 text-green-500">Good</td>
                          </tr>
                          <tr className="border-b border-slate-55 dark:border-slate-900/40">
                            <td className="py-1 text-green-500">EY</td>
                            <td className="py-1 text-green-500">Good</td>
                          </tr>
                          <tr>
                            <td className="py-1 text-red-500">K</td>
                            <td className="py-1 text-red-500">Missing</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      AI Writing & Speaking mock test áp dụng trí tuệ nhân tạo
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                      Giúp học viên luyện tập thêm W/S được chấm chữa chi tiết và gần như tức thì.
                    </p>
                  </div>
                </div>

                {/* Right side: Mock test options */}
                <div className="lg:col-span-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-slate-800 dark:text-white">Giao diện thi thật 4 kỹ năng</h3>
                  
                  <div className="grid gap-3">
                    {[
                      { skill: "Kỹ năng Nghe", desc: "40 câu hỏi • 40 phút", icon: Headphones },
                      { skill: "Kỹ năng Đọc", desc: "20 câu hỏi • 40 phút", icon: BookOpen },
                      { skill: "Kỹ năng Viết", desc: "2 bài viết • 70 phút", icon: PenSquare },
                      { skill: "Kỹ năng Nói", desc: "2 bài nói • 70 phút", icon: Mic }
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div key={idx} className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-red-300 transition flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="text-xs font-black text-slate-800 dark:text-white">{item.skill}</h4>
                              <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{item.desc}</p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Highlight benefits section */}
              <section className="grid gap-6 md:grid-cols-3">
                <article className="p-6 bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm space-y-2">
                  <span className="text-xs font-black text-blue-500">◎ Giúp theo dõi việc học sát sao</span>
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                    Nền tảng DOL superLMS số hóa mọi loại nội dung, giúp học viên biết cần làm gì mỗi ngày và giáo viên theo sát học viên.
                  </p>
                </article>
                <article className="p-6 bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm space-y-2">
                  <span className="text-xs font-black text-orange-500">✍ Giúp nhận bài chấm chi tiết hơn</span>
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                    Bài Writing và Speaking được chấm sửa chi tiết, kèm giải thích bằng giọng nói thêm trong hệ thống.
                  </p>
                </article>
                <article className="p-6 bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-850 shadow-sm space-y-2">
                  <span className="text-xs font-black text-green-500">📖 Giúp luyện tập không giới hạn</span>
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                    Mỗi bài tập đều được kèm giải thích chi tiết, giúp học viên luyện tập mọi lúc thậm chí khi không có thầy cô bên cạnh.
                  </p>
                </article>
              </section>

            </div>
          )}

        </main>

      </div>

    </div>
  );
}
