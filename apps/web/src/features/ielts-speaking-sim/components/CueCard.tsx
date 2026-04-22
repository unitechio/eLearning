import React from 'react';
import { BookOpen } from 'lucide-react';

export function CueCard() {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-8 lg:p-12 shadow-[0px_24px_48px_-12px_rgba(26,27,34,0.06)] relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
      <div className="relative z-10 max-w-2xl">
        <div className="flex items-center gap-2 mb-6 text-primary">
          <BookOpen className="w-6 h-6 fill-current" />
          <span className="font-bold text-lg tracking-tight">Describe a place you visited that had a significant impact on you.</span>
        </div>
        <ul className="space-y-4 text-on-surface-variant font-medium text-lg leading-relaxed">
          <li className="flex gap-4 items-start">
            <span className="text-primary mt-1 font-black">•</span> 
            Where the place was and when you went there.
          </li>
          <li className="flex gap-4 items-start">
            <span className="text-primary mt-1 font-black">•</span> 
            What you did when you were there.
          </li>
          <li className="flex gap-4 items-start">
            <span className="text-primary mt-1 font-black">•</span> 
            Why it had such a strong impact on you.
          </li>
        </ul>
      </div>
    </section>
  );
}
