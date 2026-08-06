import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLogin, useAuthStore } from "@/domains/auth";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Sparkles,
  HelpCircle,
  Check,
  ClipboardList,
  Volume2,
  BookMarked,
  Dumbbell,
  PenTool,
  BookOpen,
  Compass,
  GraduationCap,
  Award,
  Lock
} from "lucide-react";
import mascotReader from "@/assets/images/lms/auth/mascot_reader.png";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);

  const loginMutation = useLogin();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const data = await loginMutation.mutateAsync({ email, password });
      if (data && data.user) {
        setAuth(data);
        navigate("/lms");
      } else {
        setError("Thông tin đăng nhập không hợp lệ.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  const handleGoogleLogin = () => {
    setEmail("admin@eenglish.com");
    setPassword("AdminPass123!");
    setShowEmailForm(true);
  };

  const practiceFeatures = [
    { name: "Online tests", icon: ClipboardList },
    { name: "Dictation", icon: Volume2 },
    { name: "Vocabulary", icon: BookMarked },
    { name: "Exercises", icon: Dumbbell },
    { name: "Sample W/S", icon: PenTool },
    { name: "Blogs", icon: BookOpen },
    { name: "AI mock test", icon: Sparkles },
    { name: "Extra road", icon: Compass },
    { name: "Assignments", icon: GraduationCap },
    { name: "Final...", icon: Award },
  ];

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-slate-50 font-sans p-4 sm:p-8 md:p-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-red-50/60 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-blue-50/60 blur-[150px] rounded-full"></div>
      </div>

      <section className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden min-h-[600px]">

        {/* Left Side: Auth Forms */}
        <article className="lg:col-span-6 p-8 sm:p-12 md:p-16 flex flex-col justify-center border-r border-slate-100">
          <header className="mb-8 space-y-6">
            {/* UNI Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white font-black text-2xl shadow-md">
                D
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black tracking-tight text-slate-900 leading-none">UNI IELTS</span>
                <span className="text-[10px] font-black tracking-widest text-slate-400 leading-none mt-1">UNITECH </span>
              </div>
              <hr className="h-6 w-px bg-slate-200 mx-2" aria-hidden="true" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">Super LMS</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Đăng nhập vào UNI superLMS</h1>
              <p className="text-sm font-semibold text-slate-500 leading-relaxed">
                Vui lòng đăng nhập bằng Gmail bạn đã đăng ký khóa học tại UNI English để vào khóa học.
              </p>
            </div>
          </header>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-black" role="alert">
              {error}
            </div>
          )}

          {/* Primary Action: Google Login */}
          {!showEmailForm ? (
            <div className="space-y-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-4 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-black text-sm rounded-lg transition shadow-lg shadow-red-600/20"
              >
                <img alt="Google" className="w-5 h-5 bg-white rounded-full p-0.5" src="https://www.svgrepo.com/show/475656/google-color.svg" />
                Sign in with Google
              </button>

              <button
                type="button"
                onClick={() => setShowEmailForm(true)}
                className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-600 transition"
              >
                Hoặc sử dụng tài khoản Email / Mật khẩu
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2 px-1" htmlFor="email">
                  Địa chỉ Email
                </label>
                <Input
                  className="w-full px-4 py-3 rounded-md border border-slate-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition font-semibold text-slate-800 text-sm"
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2 px-1" htmlFor="password">
                  Mật khẩu
                </label>
                <Input
                  className="w-full px-4 py-3 rounded-md border border-slate-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition font-semibold text-slate-800 text-sm"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-black text-sm rounded-md transition shadow-lg shadow-red-600/20"
                >
                  {loginMutation.isPending ? "Đang xác thực..." : "Đăng nhập ngay"}
                </Button>

                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="px-6 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-black text-sm rounded-md transition"
                >
                  Quay lại
                </button>
              </div>
            </form>
          )}

          <footer className="mt-12 pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400">
            <span>© {new Date().getFullYear()} UNI English</span>
            <div className="flex gap-4">
              <Link to="#" className="hover:text-slate-600 transition">Điều khoản</Link>
              <Link to="#" className="hover:text-slate-600 transition">Bảo mật</Link>
            </div>
          </footer>
        </article>

        {/* Right Side: Features showcase & Mascot */}
        <article className="lg:col-span-6 bg-slate-50/50 p-8 sm:p-12 md:p-16 flex flex-col justify-between relative overflow-hidden">

          <header className="space-y-6">
            {/* Tag badge */}
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-4 py-1.5 text-xs font-black text-red-600 border border-red-100">
                <Sparkles className="h-3.5 w-3.5 fill-red-600/20 animate-pulse" /> Hơn 10 tính năng luyện tập
              </span>
            </div>

            {/* Grid layout for features */}
            <div className="grid grid-cols-2 gap-3" role="list">
              {practiceFeatures.map((feat) => {
                const IconComponent = feat.icon;
                return (
                  <div
                    key={feat.name}
                    className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-red-500/20 transition-all duration-300 group"
                    role="listitem"
                  >
                    <div className="h-9 w-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-black text-slate-700 tracking-tight">{feat.name}</span>
                  </div>
                );
              })}
            </div>
          </header>

          {/* Mascot Illustration */}
          <figure className="relative z-20 mt-12 flex justify-end items-end h-48 sm:h-56">
            <img
              alt="UNI superLMS Space Mascot Reading Book"
              src={mascotReader}
              className="h-full object-contain drop-shadow-2xl animate-bounce-slow"
            />
          </figure>

        </article>

      </section>

      {/* Floating help action */}
      <button
        type="button"
        title="Trợ giúp"
        aria-label="Help Button"
        className="fixed bottom-8 right-8 w-12 h-12 bg-white text-slate-700 border border-slate-200 rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all group"
      >
        <HelpCircle className="w-5 h-5 group-hover:text-red-600 transition" />
      </button>
    </main>
  );
}
