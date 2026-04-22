import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Shield, Zap, Globe } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function MarketingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-32 px-10 flex flex-col items-center text-center max-w-5xl mx-auto animate-in fade-in slide-in-from-top-6 duration-1000">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-10 shadow-sm border border-primary/5">
          <Sparkles className="w-3 h-3" />
          The future of IELTS preparation
        </div>

        <h1 className="text-6xl lg:text-[5rem] font-black leading-[1.1] tracking-tighter text-slate-900 mb-8 max-w-4xl">
           Experience an AI-Driven <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">IELTS Powerhouse</span>
        </h1>

        <p className="text-xl lg:text-2xl text-slate-500 font-medium max-w-2xl mb-12 leading-relaxed">
          The ultimate companion for your English proficiency journey. Master speaking, writing, and vocabulary with personalized AI feedback.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button asChild className="h-14 px-10 rounded-2xl bg-gradient-to-r from-primary to-secondary text-lg font-bold shadow-2xl shadow-primary/30">
            <Link to="/login" className="flex items-center gap-2">
              Start Your Free Trial <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </Button>

          <Button variant="outline" className="h-14 px-10 rounded-2xl bg-white/50 backdrop-blur-md text-lg font-bold border-slate-100 hover:bg-slate-50 transition-all">
            <Link to="/dashboard">View Live Demo</Link>
          </Button>
        </div>
      </section>

      {/* Feature Highlight Section */}
      <section className="w-full py-20 px-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl transition-all hover:translate-y-[-4px] hover:shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-6">
            <Zap className="w-6 h-6 fill-orange-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Real-time Feedback</h3>
          <p className="text-slate-500 font-medium leading-relaxed">Get instant, actionable insights on your speaking and writing from our advanced AI analysis engine.</p>
        </div>

        <div className="p-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl transition-all hover:translate-y-[-4px] hover:shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-6">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Academic Vocabulary</h3>
          <p className="text-slate-500 font-medium leading-relaxed">Expand your lexis with context-aware flashcards and high-frequency IELTS word decks.</p>
        </div>

        <div className="p-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl transition-all hover:translate-y-[-4px] hover:shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center mb-6">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Performance Analytics</h3>
          <p className="text-slate-500 font-medium leading-relaxed">Track your band score progression over time with detailed charts and historical task logs.</p>
        </div>
      </section>

      {/* Footer (Simplified) */}
      <footer className="w-full py-20 px-10 text-center border-t border-slate-100 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-6 opacity-60">
           <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-white">
             <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
           </div>
           <span className="font-black text-slate-900">eEnglish</span>
        </div>
        <p className="text-slate-400 text-sm font-bold tracking-widest uppercase">© 2026 COGNITIVE ATELIER. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}
