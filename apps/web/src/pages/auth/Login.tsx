import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLogin, useAuthStore } from "@/features/auth";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Sparkles, ArrowRight, HelpCircle, Check } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const loginMutation = useLogin();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const data = await loginMutation.mutateAsync({ email, password });
      if (data && data.user) {
        setAuth(data);
        navigate("/dashboard");
      } else {
        setError("Invalid login credentials.");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center relative px-6 py-12 mesh-gradient overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full"></div>
      </div>

      {/* Auth Container */}
      <div className="w-full max-w-[1100px] grid grid-cols-1 md:grid-cols-2 glass-card rounded-lg overflow-hidden shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-700">
        
        {/* Left Side: Visual/Editorial */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-black/5 relative overflow-hidden">
          <div className="relative z-20">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Sparkles className="w-5 h-5 fill-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tighter text-on-surface">eEnglish</span>
            </div>
            
            <h1 className="text-4xl font-headline font-bold leading-tight tracking-tight mb-6 text-on-surface">
              Master the art of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">cognitive insight.</span>
            </h1>
            
            <p className="text-on-surface-variant body-lg max-w-md opacity-80 leading-relaxed">
              The world&apos;s most advanced IELTS research engine, designed for those who seek clarity in a world of noise.
            </p>
          </div>

          <div className="relative z-20 mt-12 p-6 bg-surface-container-low/50 backdrop-blur-md rounded-2xl border border-white/20">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-secondary fill-secondary" />
              <span className="label-md font-bold uppercase tracking-widest text-secondary">New Feature</span>
            </div>
            <p className="text-on-surface body-md font-medium italic opacity-90">
              &quot;The way eEnglish organizes unstructured thoughts into logical frameworks has completely changed how our team approach research.&quot;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden border border-white/40">
                <img 
                  alt="Testimonial User" 
                  className="w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop" 
                />
              </div>
              <span className="label-md font-semibold text-on-surface-variant">Elena Vance, Head of R&amp;D</span>
            </div>
          </div>

          {/* Decorative Background Pattern */}
          <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
             <div className="w-[500px] h-[500px] border-[50px] border-primary rounded-full translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="p-8 md:p-16 flex flex-col justify-center bg-white/40 backdrop-blur-md">
          <div className="mb-10">
            <h2 className="text-2xl font-headline font-semibold mb-2">Welcome back</h2>
            <p className="text-on-surface-variant body-md">Enter your details to access your atelier.</p>
          </div>

          {/* Social Login Cluster */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Button variant="outline" className="flex items-center justify-center gap-3 py-6 bg-surface-container-low hover:bg-surface-container-high transition-all rounded-xl border-none shadow-sm">
              <img alt="Google" className="w-5 h-5" src="https://www.svgrepo.com/show/475656/google-color.svg" />
              <span className="label-md font-bold text-on-surface">Google</span>
            </Button>
            <Button variant="outline" className="flex items-center justify-center gap-3 py-6 bg-surface-container-low hover:bg-surface-container-high transition-all rounded-xl border-none shadow-sm">
              <img alt="Apple" className="w-5 h-5" src="https://www.svgrepo.com/show/442921/apple.svg" />
              <span className="label-md font-bold text-on-surface">Apple</span>
            </Button>
          </div>

          <div className="relative flex items-center mb-8">
            <div className="flex-grow border-t border-outline-variant/30"></div>
            <span className="flex-shrink mx-4 text-outline label-md uppercase tracking-widest font-bold opacity-50">or continue with email</span>
            <div className="flex-grow border-t border-outline-variant/30"></div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block label-md font-bold text-on-surface mb-2 px-1 opacity-70" htmlFor="email">Email address</label>
              <Input 
                className="w-full px-4 py-6 bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all rounded-xl placeholder:text-outline/40 font-medium" 
                id="email" 
                type="email" 
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2 px-1">
                <label className="block label-md font-bold text-on-surface opacity-70" htmlFor="password">Password</label>
                <Link className="label-md text-primary hover:text-secondary transition-colors font-bold" to="#">Forgot password?</Link>
              </div>
              <Input 
                className="w-full px-4 py-6 bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all rounded-xl placeholder:text-outline/40 font-medium" 
                id="password" 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center gap-3 px-1">
              <div className="relative flex items-center">
                <input 
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-outline-variant/30 transition-all checked:bg-primary checked:border-primary" 
                  id="remember" 
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <Check className="absolute w-3.5 h-3.5 text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
              </div>
              <label className="label-md text-on-surface-variant font-medium cursor-pointer" htmlFor="remember">Remember me for 30 days</label>
            </div>

            {error && (
               <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold animate-in shake duration-300">
                  {error}
               </div>
            )}

            <Button 
              className="w-full py-8 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-full shadow-xl shadow-primary/20 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300" 
              type="submit"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Authenticating..." : "Sign in to account"}
            </Button>
          </form>

          <p className="mt-10 text-center text-on-surface-variant label-md font-medium">
            Don&apos;t have an account? 
            <Link className="text-primary font-bold hover:underline underline-offset-4 ml-1" to="/register">Create an account</Link>
          </p>

          {/* Footer Links */}
          <div className="mt-auto pt-10 flex justify-center gap-6 text-outline label-md font-bold opacity-40">
            <Link className="hover:text-on-surface-variant transition-colors" to="#">Privacy Policy</Link>
            <Link className="hover:text-on-surface-variant transition-colors" to="#">Terms of Service</Link>
          </div>
        </div>
      </div>

      {/* Floating Support Action */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-white text-on-surface rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group">
        <HelpCircle className="w-6 h-6 group-hover:text-primary transition-colors" />
      </button>
    </main>
  );
}
