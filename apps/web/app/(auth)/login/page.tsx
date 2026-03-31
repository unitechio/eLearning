"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/features/auth/api";
import { useAuthStore } from "@/lib/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const loginMutation = useLogin();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const data = await loginMutation.mutateAsync({ email, password });
      if (data && data.user) {
        setAuth(data.user, data.token);
        router.push("/dashboard");
      } else {
        setError("Invalid login credentials.");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-[450px] animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-xl shadow-primary/20">
          <Sparkles className="w-6 h-6" />
        </div>
      </div>

      <Card className="border-white/40 bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="space-y-1 text-center pb-8 pt-10">
          <CardTitle className="text-3xl font-black tracking-tight text-slate-800">Welcome Back</CardTitle>
          <CardDescription className="text-slate-500 font-medium text-base">
            Continue your journey to IELTS Band 8.5+
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="email"
                  placeholder="name@example.com"
                  className="pl-12 h-12 bg-white/50 border-slate-100 rounded-xl focus:ring-primary/20 transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                <Link href="#" className="text-xs font-bold text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-12 h-12 bg-white/50 border-slate-100 rounded-xl focus:ring-primary/20 transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
               <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold animate-in shake duration-300">
                  {error}
               </div>
            )}

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full h-14 bg-gradient-to-r from-primary to-secondary text-white text-base font-bold shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all rounded-2xl"
            >
              {loginMutation.isPending ? "Authenticating..." : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pb-10 pt-8 px-10">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-slate-400 font-bold">Or continue with</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-2 w-full">
            <Button variant="outline" className="h-12 border-slate-100 bg-white/50 hover:bg-slate-50 rounded-xl font-bold text-slate-600 transition-all">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 mr-3" alt="google" />
              Sign in with Google
            </Button>
          </div>
          
          <p className="text-center text-sm text-slate-500 font-medium">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary font-bold hover:underline">
              Sign up for free
            </Link>
          </p>
        </CardFooter>
      </Card>

      <p className="text-center mt-8 text-xs text-slate-400 font-medium px-8 leading-relaxed">
        By continuing, you agree to our Terms of Service and Privacy Policy. All rights reserved.
      </p>
    </div>
  );
}
