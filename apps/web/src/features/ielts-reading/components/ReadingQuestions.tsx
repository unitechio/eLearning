import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function ReadingQuestions() {
  return (
    <section className="w-1/2 h-full flex flex-col bg-surface-container-low overflow-y-auto hide-scrollbar">
      <div className="p-8 space-y-10 max-w-2xl mx-auto">
        {/* Section Header */}
        <div>
          <h3 className="font-headline text-2xl font-extrabold text-primary mb-2">Questions 14 – 20</h3>
          <p className="text-on-surface-variant text-sm font-medium">Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.</p>
        </div>

        {/* Summary Completion */}
        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_10px_40px_rgba(0,0,0,0.02)] space-y-6 border border-outline-variant/10">
          <div className="space-y-4">
            <p className="leading-loose text-on-surface">
              Historically, researchers such as (14) 
              <input 
                className="mx-2 px-3 py-1 bg-surface-container border-none rounded-md focus:ring-2 focus:ring-primary w-32 transition-all outline-none" 
                placeholder="type here" 
                type="text"
              /> 
              have focused on the way (15) 
              <input 
                className="mx-2 px-3 py-1 bg-surface-container border-none rounded-md focus:ring-2 focus:ring-primary w-32 transition-all outline-none" 
                placeholder="type here" 
                type="text"
              /> 
              organize their travel. 
            </p>
            <p className="leading-loose text-on-surface">
              In modern technology, this is applied to (16) 
              <input 
                className="mx-2 px-3 py-1 bg-surface-container border-none rounded-md focus:ring-2 focus:ring-primary w-32 transition-all outline-none" 
                placeholder="type here" 
                type="text"
              /> 
              to create systems that do not need a central authority.
            </p>
          </div>
        </div>

        {/* True / False / Not Given */}
        <div className="space-y-6">
          <h4 className="font-headline font-bold text-on-surface">Do the following statements agree with the information in the text?</h4>
          <div className="grid gap-4">
            <div className="bg-surface-container-lowest p-6 rounded-xl flex items-start justify-between group hover:bg-surface-container-high transition-colors border border-outline-variant/10">
              <div className="pr-8">
                <span className="text-xs font-bold text-primary mb-1 block">17</span>
                <p className="text-sm font-semibold text-on-surface">Centralized command is more efficient than decentralized intelligence in high-risk scenarios.</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {['TRUE', 'FALSE', 'NG'].map((opt) => (
                  <button key={opt} className="px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-surface-container text-on-surface-variant hover:bg-primary hover:text-white transition-all">
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl flex items-start justify-between group hover:bg-surface-container-high transition-colors border border-outline-variant/10">
              <div className="pr-8">
                <span className="text-xs font-bold text-primary mb-1 block">18</span>
                <p className="text-sm font-semibold text-on-surface">Pheromone trails are the primary method of communication in digital cloud networks.</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-surface-container text-on-surface-variant hover:bg-primary hover:text-white transition-all">TRUE</button>
                <button className="px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider border-2 border-primary text-primary bg-white shadow-sm">FALSE</button>
                <button className="px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-surface-container text-on-surface-variant hover:bg-primary hover:text-white transition-all">NG</button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-10 border-t border-outline-variant/20">
          <button className="flex items-center gap-2 text-on-surface-variant font-bold hover:text-primary transition-colors active:scale-95">
            <ArrowLeft className="w-4 h-4" /> Previous Section
          </button>
          <button className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/20 hover:-translate-y-1 transition-transform active:scale-95">
            Next Section <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="h-24" />
      </div>
    </section>
  );
}
