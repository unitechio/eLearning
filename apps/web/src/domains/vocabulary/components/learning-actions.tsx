"use client";

import { CheckCircle, Bookmark, RefreshCw, ChevronRight, ChevronLeft } from "lucide-react";

export function LearningActions() {
  return (
    <>
      <div className="bg-slate-50/80 backdrop-blur-md rounded-2xl p-8 space-y-8 border border-slate-100 shadow-sm">
        <div>
          <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6"> Learning Actions </h4>
          <div className="space-y-4">
            
            <button className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-all rounded-2xl group border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 fill-green-600 text-white" />
                </div>
                <span className="font-bold text-slate-800">Mark as Learned</span>
              </div>
              <ChevronRight className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5" />
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-all rounded-2xl group border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Bookmark className="w-5 h-5 fill-primary text-primary" />
                </div>
                <span className="font-bold text-slate-800">Save to Deck</span>
              </div>
              <ChevronRight className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5" />
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-all rounded-2xl group border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <span className="font-bold text-slate-800">Review Later</span>
              </div>
              <ChevronRight className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5" />
            </button>

          </div>
        </div>

        <div className="pt-6 border-t border-slate-200">
          <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4"> AI Insight </h4>
          <div className="p-4 bg-secondary/5 rounded-2xl border border-secondary/10">
            <p className="text-xs text-secondary font-medium leading-relaxed">
              "Ubiquitous" is a high-frequency academic term. Use it in Writing Task 2 when discussing technology, urbanization, or media trends.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-100 hover:bg-slate-50 transition-colors shadow-sm text-slate-500 hover:text-slate-800">
            <ChevronLeft className="mb-2 w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Previous</span>
          </button>
          
          <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity active:scale-[0.98]">
            <ChevronRight className="mb-2 w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Next Card</span>
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center flex flex-col items-center justify-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Session Streak</p>
          <p className="text-3xl font-black text-primary">12</p>
        </div>
        <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center flex flex-col items-center justify-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Time Elapsed</p>
          <p className="text-3xl font-black text-slate-800">08:42</p>
        </div>
      </div>
    </>
  );
}
