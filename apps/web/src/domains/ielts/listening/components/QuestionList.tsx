import React from 'react';
import { CheckCircle } from 'lucide-react';

export function QuestionList() {
  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="font-headline text-2xl font-bold">Questions 21-30</h2>
        <div className="flex items-center gap-2 px-4 py-2 bg-tertiary/10 text-tertiary rounded-full font-bold text-sm">
          <CheckCircle className="w-4 h-4 fill-current" />
          Practice Mode: Feedback On
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-8 space-y-8 border border-outline-variant/10">
        {/* Section 1: Completion */}
        <div>
          <h3 className="font-bold text-lg mb-4 text-[#1a1b22]">Complete the notes below. Write NO MORE THAN TWO WORDS for each answer.</h3>
          <div className="p-8 bg-surface-container-low rounded-lg space-y-6">
            <div className="flex items-center flex-wrap gap-x-2 gap-y-4 text-lg leading-relaxed">
              <span>The main topic of the presentation will be</span>
              <input
                className="w-48 bg-white border-none focus:ring-2 focus:ring-primary rounded-md px-3 py-1 text-primary font-bold shadow-sm"
                placeholder="21."
                type="text"
              />
              <span>and how it affects students' academic performance.</span>
            </div>
            <div className="flex items-center flex-wrap gap-x-2 gap-y-4 text-lg leading-relaxed">
              <span>Students must submit their </span>
              <input
                className="w-48 bg-white border-none focus:ring-2 focus:ring-primary rounded-md px-3 py-1 text-primary font-bold shadow-sm"
                placeholder="22."
                type="text"
              />
              <span>by the end of the second week.</span>
            </div>
          </div>
        </div>

        {/* Section 2: Multiple Choice */}
        <div className="space-y-6">
          <h3 className="font-bold text-lg text-[#1a1b22]">Questions 23-25: Choose the correct letter, A, B or C.</h3>
          <div className="space-y-4">
            <p className="font-semibold text-zinc-700">23. What does Dr. Smith suggest about the new library policy?</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="group relative flex items-center p-4 bg-surface-container-low rounded-lg cursor-pointer hover:bg-primary/10 transition-colors border border-transparent">
                <input className="hidden peer" name="q23" type="radio" />
                <span className="w-8 h-8 rounded-full flex items-center justify-center bg-white text-zinc-500 font-bold group-hover:bg-primary group-hover:text-white transition-all mr-3">A</span>
                <span className="text-sm font-medium">It is too restrictive for postgrads</span>
              </label>
              <label className="group relative flex items-center p-4 bg-surface-container-low rounded-lg cursor-pointer hover:bg-primary/10 transition-colors border border-transparent">
                <input className="hidden peer" name="q23" type="radio" />
                <span className="w-8 h-8 rounded-full flex items-center justify-center bg-white text-zinc-500 font-bold group-hover:bg-primary group-hover:text-white transition-all mr-3">B</span>
                <span className="text-sm font-medium">It needs more staff to manage</span>
              </label>
              <label className="group relative flex items-center p-4 bg-primary/10 border-primary rounded-lg cursor-pointer transition-colors">
                <input defaultChecked className="hidden peer" name="q23" type="radio" />
                <span className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-white font-bold mr-3">C</span>
                <span className="text-sm font-medium text-primary">It prioritizes digital access</span>
                <span className="absolute top-2 right-2 text-tertiary">
                  <CheckCircle className="w-5 h-5 fill-current" />
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
