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
  Lock,
  Mail,
  ArrowRight
} from "lucide-react";
import mascotReader from "@/assets/images/lms/auth/mascot_reader.png";

export function LmsLoginPage() {
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
    // Demo login integration
    setEmail("admin@eenglish.com");
    setPassword("AdminPass123!");
    setShowEmailForm(true);
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900 font-sans p-4 sm:p-8 md:p-12 relative overflow-hidden">
      {/* Background radial overlays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[55%] h-[55%] bg-red-50/40 dark:bg-red-950/10 blur-[130px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[55%] h-[55%] bg-blue-50/40 dark:bg-blue-950/10 blur-[130px] rounded-full"></div>
      </div>

      <section className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-slate-950 rounded-[32px] shadow-2xl border border-slate-150 dark:border-slate-850 overflow-hidden min-h-[580px]">
        {/* Left Form Box */}
        <article className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center border-r border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950">
          <header className="mb-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 text-white font-black text-2xl shadow-md">
                D
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white leading-none">DOL LMS</span>
                <span className="text-[9px] font-black tracking-widest text-slate-400 leading-none mt-1">ĐÌNH LỰC</span>
              </div>
              <hr className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2" aria-hidden="true" />
              <span className="text-[9px] font-black text-slate-500 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full uppercase tracking-wider">Học viên</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Cổng Học Viên superLMS</h1>
              <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                Đăng nhập tài khoản eEnglish / Google học viên để làm bài tập, nhận bài sửa, và học trực tuyến.
              </p>
            </div>
          </header>

          {error && (
            <aside className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 text-red-650 dark:text-red-400 text-xs font-bold flex items-center gap-2">
              <HelpCircle className="h-4.5 w-4.5 shrink-0" />
              <span>{error}</span>
            </aside>
          )}

          {!showEmailForm ? (
            <div className="space-y-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-2xl transition shadow-lg shadow-red-600/25"
              >
                <img alt="Google" className="w-5 h-5 bg-white rounded-full p-0.5" src="https://www.svgrepo.com/show/475656/google-color.svg" />
                Đăng nhập bằng tài khoản Google
              </button>

              <button
                type="button"
                onClick={() => setShowEmailForm(true)}
                className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-650 transition"
              >
                Hoặc sử dụng Email và Mật khẩu
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block space-y-1.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Địa chỉ Email</span>
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:border-red-500 text-slate-800 dark:text-white"
                    required
                  />
                </div>
              </label>

              <label className="block space-y-1.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Mật khẩu</span>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:border-red-500 text-slate-800 dark:text-white"
                    required
                  />
                </div>
              </label>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs rounded-2xl transition"
              >
                <span>Vào Học Phần</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowEmailForm(false)}
                className="w-full text-center text-xs font-semibold text-slate-400 hover:text-slate-650 transition mt-2"
              >
                Quay lại
              </button>
            </form>
          )}
        </article>

        {/* Right Info Box */}
        <article className="hidden lg:col-span-6 bg-slate-50 dark:bg-slate-900 p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-red-100/50 dark:bg-red-950/5 blur-[90px] rounded-full pointer-events-none"></div>

          <div className="space-y-4 relative z-10">
            <span className="text-[9px] font-black text-red-650 bg-red-50 dark:bg-red-950/40 px-3 py-1 rounded-full uppercase tracking-wider">
              superLMS Features
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
              Tối ưu lộ trình & phương pháp học tiếng Anh tại DOL
            </h2>
            <ul className="space-y-2 text-xs font-semibold text-slate-500 leading-relaxed">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Chữa bài viết Writing chi tiết với radar score & nhận xét âm thanh</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Luyện nói Speaking AI chấm sửa chuẩn xác từng âm vị</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Hệ thống chat realtime trao đổi trực tiếp với giáo viên đứng lớp</span>
              </li>
            </ul>
          </div>

          <figure className="relative max-h-56 mt-8 flex justify-center z-10" aria-label="DOL mascot reading image">
            <img
              alt="Mascot Reader"
              src={mascotReader}
              className="h-full object-contain max-h-48 drop-shadow-xl"
            />
          </figure>
        </article>
      </section>
    </main>
  );
}
