import React from "react";
import { FlashcardHero, LearningActions } from "@/features/vocabulary";

export function VocabularyPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      <section className="max-w-5xl mx-auto py-12">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider mb-2">
              Active Session: Academic Vocabulary
            </span>
            <h2 className="text-4xl font-headline font-semibold text-on-surface tracking-tight">Expand your Lexis</h2>
          </div>
          <div className="flex items-center gap-4 text-on-surface-variant text-sm font-medium">
            <span>Card <span className="text-on-surface font-bold">14</span> of 50</span>
            <div className="flex gap-1">
              <div className="w-6 h-1 rounded-full bg-primary"></div>
              <div className="w-6 h-1 rounded-full bg-primary/20"></div>
              <div className="w-6 h-1 rounded-full bg-primary/20"></div>
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-12 gap-8 items-start">
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <FlashcardHero />
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6 lg:sticky top-24">
            <LearningActions />
          </div>
        </div>
      </section>

      {/* Aesthetic Backdrop Elements */}
      <div className="fixed -bottom-48 -left-48 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
      <div className="fixed -top-48 -right-48 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] -z-10"></div>
    </div>
  );
}
