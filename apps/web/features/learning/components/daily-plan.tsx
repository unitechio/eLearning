"use client";

import { useDailyPlan, useLearningStore } from "@/hooks/use-learning";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function DailyPlan() {
  const { data: planItems, isLoading, error } = useDailyPlan();
  const { setActivePlan, activePlanId } = useLearningStore();

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-surface-container-lowest rounded-lg"></div>;
  }

  if (error || !planItems) {
    return <div className="text-red-500">Failed to load plan.</div>;
  }

  const completedCount = planItems.filter((i) => i.status === "completed").length;
  const progressPercent = Math.round((completedCount / planItems.length) * 100);

  return (
    <div className="bg-surface-container-lowest rounded-lg p-8 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-bold">Daily Learning Plan</h3>
          <p className="text-sm text-on-surface-variant">Recommended steps for today</p>
        </div>
        <span className="text-xs font-bold text-primary bg-primary-fixed px-3 py-1 rounded-full">
          {progressPercent}% Complete
        </span>
      </div>

      <div className="space-y-6">
        {planItems.map((step, index) => {
          const isCompleted = step.status === "completed";
          const isCurrent = step.status === "current";
          
          return (
            <div key={step.id} className="flex gap-4 group">
              <div className="flex flex-col items-center">
                <div 
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm",
                    isCompleted ? "bg-primary text-white ring-4 ring-primary-fixed" : "",
                    isCurrent ? "border-2 border-primary bg-surface-container-lowest text-primary animate-pulse" : "",
                    !isCompleted && !isCurrent ? "border-2 border-surface-container bg-surface-container-lowest text-on-surface-variant" : ""
                  )}
                >
                  {isCompleted && <Check className="w-4 h-4" />}
                  {isCurrent && <div className="w-2 h-2 rounded-full bg-primary" />}
                  {!isCompleted && !isCurrent && <span className="text-xs font-bold">{index + 1}</span>}
                </div>
                {index < planItems.length - 1 && (
                  <div className={cn(
                    "w-[2px] h-full mt-2",
                    isCompleted ? "bg-primary/20" : "bg-surface-container"
                  )} />
                )}
              </div>
              
              <div className="pb-6">
                <h4 className={cn(
                  "font-semibold leading-tight",
                  !isCompleted && !isCurrent ? "text-on-surface-variant/70" : "text-on-surface"
                )}>
                  {step.title}
                </h4>
                <p className={cn(
                  "text-sm mt-1",
                  !isCompleted && !isCurrent ? "text-on-surface-variant/50" : "text-on-surface-variant"
                )}>
                  {step.description}
                </p>
                
                {isCompleted && (
                  <div className="mt-2 flex gap-2">
                    <span className="text-[10px] px-2 py-0.5 bg-surface-container rounded font-medium text-on-surface-variant">
                      {step.type}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-surface-container rounded font-medium text-on-surface-variant">
                      {step.duration}
                    </span>
                  </div>
                )}
                
                {isCurrent && (
                  <button 
                    onClick={() => setActivePlan(step.id)}
                    className="mt-3 px-4 py-2 bg-primary text-white rounded-full text-xs font-bold hover:opacity-90 transition-opacity"
                  >
                    Start Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
