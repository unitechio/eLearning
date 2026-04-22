import React from 'react';
import { EyeOff, BookOpen } from 'lucide-react';
import { AudioPlayer } from './AudioPlayer';
import { QuestionList } from './QuestionList';
import { Scratchpad } from './Scratchpad';
import { ProgressSidebar } from './ProgressSidebar';

export function IeltsListeningPractice() {
  return (
    <main className="pt-8 pb-32 px-8 max-w-[1600px] mx-auto flex gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Main Exam Canvas */}
      <div className="flex-1 space-y-8">
        {/* Hero Audio Section */}
        <section className="bg-surface-container-low rounded-xl p-10 relative overflow-hidden ring-1 ring-slate-200/50">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface mb-2">Section 3: Campus Orientation</h1>
                <p className="text-on-surface-variant font-medium">Listening for specific details and attitudes</p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-surface-container-highest rounded-full text-sm font-bold flex items-center gap-2 transition-all hover:bg-white active:scale-95">
                  <EyeOff className="w-4 h-4" /> Focus Mode
                </button>
                <button className="px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-bold flex items-center gap-2 transition-all hover:bg-secondary/20 active:scale-95">
                  <BookOpen className="w-4 h-4" /> Transcript Sync
                </button>
              </div>
            </div>
            <AudioPlayer />
          </div>
          {/* Subtle background decoration */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl shadow-primary-container" />
        </section>

        {/* Questions Area */}
        <QuestionList />
      </div>

      {/* Sidebar Cluster */}
      <div className="w-80 space-y-6">
        <Scratchpad />
        <ProgressSidebar />
      </div>
    </main>
  );
}
