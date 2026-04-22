import React from 'react';
import { Lightbulb, BookOpen, BarChart3 } from 'lucide-react';
import { CueCard } from './CueCard';
import { SpeakingRecorder } from './SpeakingRecorder';
import { SpeechAnalysis } from './SpeechAnalysis';

export function IeltsSpeakingSimulation() {
  return (
    <main className="pt-8 pb-32 px-6 lg:px-12 min-h-screen animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-12">
        {/* Left Column: The Exam Interaction */}
        <div className="xl:col-span-8 space-y-12">
          {/* Header Status */}
          <header className="flex justify-between items-end">
            <div className="space-y-4">
              <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest inline-block border border-primary/20">
                IELTS Speaking • Part 2
              </span>
              <h1 className="text-5xl font-black font-headline text-slate-900 leading-tight tracking-tight">
                Long Turn: <span className="text-primary">Personal Experience</span>
              </h1>
            </div>
            <div className="text-right pb-2">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-1">Time Remaining</p>
              <p className="text-4xl font-headline font-black text-primary tabular-nums">01:42</p>
            </div>
          </header>

          <CueCard />
          <SpeakingRecorder />
        </div>

        {/* Right Column: AI Co-Pilot */}
        <div className="xl:col-span-4 space-y-8">
          {/* Speaking Tips */}
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200/50">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <Lightbulb className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-headline font-bold text-2xl text-slate-800">Expert Tips</h3>
            </div>
            <div className="space-y-6">
              <div className="p-5 bg-white rounded-2xl shadow-sm ring-1 ring-slate-100">
                <h5 className="font-bold text-sm text-secondary mb-2 uppercase tracking-wider">Fluency Tip</h5>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Use "signposting" words like 'Firstly', 'Moving on to...', and 'As a result' to structure your 2-minute talk.
                </p>
              </div>
              <div className="p-5 bg-white rounded-2xl shadow-sm ring-1 ring-slate-100">
                <h5 className="font-bold text-sm text-secondary mb-2 uppercase tracking-wider">Time Management</h5>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Don't stop talking until the examiner says "Thank you". Expand on your reasons if you have time left.
                </p>
              </div>
            </div>
          </div>

          {/* Vocabulary Suggestions */}
          <div className="bg-gradient-to-br from-secondary to-primary-container text-white rounded-2xl p-8 shadow-xl shadow-secondary/20">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-headline font-bold text-2xl">Power Vocab</h3>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {['Stunning', 'Life-changing', 'Picturesque', 'Memorable', 'Serene', 'Unforgettable'].map((word) => (
                <span 
                  key={word} 
                  className="px-4 py-2 bg-white/10 rounded-xl text-sm font-bold border border-white/20 cursor-pointer hover:bg-white/20 transition-all active:scale-95"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-tertiary text-white rounded-2xl p-8 flex items-center justify-between shadow-xl shadow-tertiary/20 group cursor-pointer active:scale-[0.98] transition-all">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Post-Exam</p>
              <h4 className="font-headline font-bold text-xl">View Full Analysis</h4>
            </div>
            <BarChart3 className="w-10 h-10 opacity-40 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>

      <SpeechAnalysis />
    </main>
  );
}
