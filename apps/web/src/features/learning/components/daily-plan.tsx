import React from "react";
import { Check, PlayCircle } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Advanced Collocations for 'Environment'",
    description: "Review 15 high-level phrases and synonyms.",
    type: "VOCABULARY",
    duration: "10 MINS",
    status: "completed"
  },
  {
    id: 2,
    title: "Critical Analysis: Argumentative Essays",
    description: "AI-guided breakdown of a Band 9 response.",
    type: "WRITING",
    duration: "25 MINS",
    status: "current"
  },
  {
    id: 3,
    title: "Mock Speaking: Part 2 Simulation",
    description: "Practice cue cards with real-time feedback.",
    type: "SPEAKING",
    duration: "15 MINS",
    status: "upcoming"
  }
];

export const DailyPlan = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100/50 dark:border-slate-800/50 h-full">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">Daily Roadmap</h3>
          <p className="text-sm text-on-surface-variant opacity-60">Personalized focus for today</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-2xl">
          <span className="text-xs font-black text-primary uppercase">40% Complete</span>
        </div>
      </div>

      <div className="space-y-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex gap-6 group">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                step.status === "completed" 
                  ? "bg-primary text-white ring-4 ring-primary/10" 
                  : step.status === "current"
                  ? "bg-white dark:bg-slate-800 border-2 border-primary text-primary animate-pulse shadow-lg shadow-primary/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200/50 dark:border-slate-700"
              }`}>
                {step.status === "completed" ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-bold">{step.id}</span>
                )}
              </div>
              {index !== steps.length - 1 && (
                <div className={`w-0.5 h-full mt-2 rounded-full ${
                  step.status === "completed" ? "bg-primary/20" : "bg-slate-100 dark:bg-slate-800"
                }`} />
              )}
            </div>
            
            <div className={`${index !== steps.length - 1 ? "pb-8" : ""} flex-1`}>
              <h4 className={`font-bold leading-tight ${
                step.status === "upcoming" ? "text-slate-400" : "text-slate-900 dark:text-slate-50"
              }`}>{step.title}</h4>
              <p className="text-sm text-on-surface-variant opacity-60 mt-1">{step.description}</p>
              
              <div className="mt-4 flex items-center gap-3">
                <span className="text-[10px] px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg font-black text-on-surface-variant tracking-wider">{step.type}</span>
                <span className="text-[10px] px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg font-black text-on-surface-variant tracking-wider">{step.duration}</span>
                
                {step.status === "current" && (
                  <button className="flex items-center gap-2 ml-auto py-2 px-5 bg-primary text-white rounded-xl text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
                    Start Session <PlayCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
