import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Award,
  CheckCircle2,
  Compass,
  HelpCircle,
  Clock,
  GraduationCap
} from "lucide-react";
import astronautImg from "@/assets/images/astronaut.jpg";

export function NotStudentPage() {
  const [searchParams] = useSearchParams();
  // Get email from query param or fallback to the mock one from the design
  const email = searchParams.get("email") || "phamtiendat34567@gmail.com";

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900 font-sans p-4 sm:p-8 md:p-12 relative overflow-hidden">
      {/* Background radial overlays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[55%] h-[55%] bg-red-50/40 dark:bg-red-950/10 blur-[130px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[55%] h-[55%] bg-blue-50/40 dark:bg-blue-950/10 blur-[130px] rounded-full"></div>
      </div>

      <section className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-slate-950 rounded-[32px] shadow-2xl border border-slate-150 dark:border-slate-850 overflow-hidden min-h-[580px]">

        {/* Left Column - Content & Error Message */}
        <article className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center bg-white dark:bg-slate-950">
          <header className="mb-6">
            {/* DOL IELTS ĐÌNH LỰC Logo */}
            <div className="flex items-center gap-3">
              <svg className="w-10 h-10 text-red-600" viewBox="0 0 100 100" fill="currentColor">
                {/* Custom stylized wing/D shape in red */}
                <path d="M15 20 C35 20, 65 30, 75 50 C80 60, 75 75, 60 80 C50 83, 30 83, 20 75 C10 68, 8 50, 10 35 Z" fill="url(#logoGrad)" />
                <path d="M25 35 C40 35, 55 42, 60 55 C62 60, 58 70, 48 72 C40 73, 30 70, 25 60 Z" fill="white" />
                <defs>
                  <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e11d48" />
                    <stop offset="100%" stopColor="#be123c" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none">DOL IELTS</span>
                <span className="text-[10px] font-black tracking-widest text-red-650 leading-none mt-1">ĐÌNH LỰC</span>
              </div>
            </div>
          </header>

          <main className="space-y-6">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Email bạn sử dụng không phải là học viên của DOL!
            </h1>

            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
              Email bạn vừa đăng nhập <span className="text-slate-800 dark:text-slate-200 font-bold">"{email}"</span> không nằm trong khóa học. Vui lòng sử dụng đúng email đã đăng ký với DOL. Nếu bạn là học viên nhưng email không hợp lệ thì hãy liên hệ với DOL ngay nhé &lt;3.
            </p>

            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span>Quay lại đăng nhập</span>
              </Link>
            </div>
          </main>
        </article>

        {/* Right Column - Visual Mockup with Astronaut */}
        <article className="lg:col-span-6 bg-slate-50/50 dark:bg-slate-900/50 p-8 sm:p-12 flex flex-col justify-center items-center relative overflow-visible border-l border-slate-100 dark:border-slate-850">
          <div className="absolute inset-0 bg-gradient-to-br from-red-100/10 to-blue-100/10 dark:from-red-950/5 dark:to-blue-950/5 pointer-events-none"></div>

          {/* Card Group Container */}
          <div className="w-full max-w-sm space-y-4 relative z-10">

            {/* Top Floating Badge */}
            <div className="flex justify-start">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-red-650 bg-red-50 dark:bg-red-950/40 border border-red-100/50 dark:border-red-900/30 shadow-sm animate-pulse">
                <Clock className="h-3 w-3" />
                Theo dõi quá trình học
              </span>
            </div>

            {/* Card 1: Active Courses */}
            <div className="bg-white dark:bg-slate-950 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-850 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-450">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-slate-850 dark:text-slate-100 truncate">
                    Bạn đang theo học 2 khóa học
                  </p>
                </div>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full w-[35%]"></div>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span> Điểm danh
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span> Luyện tập
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span> Test
                </span>
              </div>
            </div>

            {/* Card 2: Upcoming Courses */}
            <div className="bg-white dark:bg-slate-950 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-850 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-655 dark:text-slate-400">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-slate-850 dark:text-slate-100 truncate">
                    Bạn có 1 khóa học sắp diễn ra
                  </p>
                </div>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-slate-400 dark:bg-slate-600 h-full rounded-full w-[10%]"></div>
              </div>
            </div>

            {/* Card 3: Finished Courses */}
            <div className="bg-white dark:bg-slate-950 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-850 space-y-3 relative overflow-visible">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-450">
                  <Award className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-slate-850 dark:text-slate-100 truncate">
                    Bạn đã học xong 2 khóa học
                  </p>
                </div>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full rounded-full w-[90%]"></div>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                <span className="flex items-center gap-1">
                  Đi học <strong className="text-green-600 dark:text-green-400 font-extrabold">80</strong> buổi
                </span>
                <span className="flex items-center gap-1">
                  Luyện tập <strong className="text-green-600 dark:text-green-400 font-extrabold">122</strong> bài
                </span>
              </div>
            </div>

            {/* Astronaut Mascot overlapping Card 3 */}
            <div className="absolute right-[-45px] bottom-[-25px] w-[140px] h-[140px] pointer-events-none select-none z-20">
              <img
                src={astronautImg}
                alt="DOL Astronaut Mascot"
                className="w-full h-full object-contain drop-shadow-2xl animate-bounce"
                style={{ animationDuration: '6s' }}
              />
            </div>
          </div>

          {/* Red pagination dot indicator */}
          <div className="flex gap-1.5 justify-center mt-6 relative z-10">
            <span className="h-2 w-2 rounded-full bg-red-600"></span>
          </div>

        </article>
      </section>
    </main>
  );
}
