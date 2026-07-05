import React from "react";
import { useVocabularyStore } from "../stores/use-vocabulary-store";
import { PenTool, MousePointerClick, Lightbulb } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";

export function FlashcardHero() {
  const { isFlipped, setFlipped } = useVocabularyStore();

  return (
    <div className="space-y-8">
      {/* The Card */}
      <div className="relative group h-[400px] lg:h-[500px] w-full perspective-1000">
        <div 
          onClick={() => setFlipped(!isFlipped)}
          className="relative w-full h-full text-center transition-all duration-700 cursor-pointer"
        >
          {/* Card Surface */}
          <div className="absolute inset-0 w-full h-full bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl flex flex-col items-center justify-center p-12 overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary opacity-80"></div>
            
            <PenTool className="text-secondary opacity-30 w-16 h-16 mb-6" />
            
            <h3 className="text-6xl font-headline font-bold text-slate-800 mb-4 tracking-tighter">
              ubiquitous
            </h3>
            
            <p className="text-slate-500 text-lg font-medium italic mb-8">
              /juːˈbɪk.wɪ.təs/
            </p>
            
            <div className="flex items-center gap-4 py-2 px-6 rounded-full bg-slate-50 text-slate-500 text-sm border border-slate-200">
              <MousePointerClick className="w-5 h-5 text-primary" />
              <span>Tap or space to reveal definition</span>
            </div>
            
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary rounded-full mix-blend-multiply opacity-10 blur-3xl animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Post-Reveal Context Demo - We can conditionally render this using `isFlipped` */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex items-center gap-3">
          <Lightbulb className="w-6 h-6 text-secondary" />
          <h4 className="font-bold text-lg text-slate-800">Example Sentence</h4>
        </div>
        
        <p className="text-xl text-slate-600 leading-relaxed font-medium">
          "The influence of artificial intelligence is becoming <span className="text-primary font-bold underline decoration-primary/30 underline-offset-4">ubiquitous</span> in modern healthcare systems, assisting doctors with faster diagnosis."
        </p>
        
        <div className="flex gap-3">
          <Badge variant="secondary" className="bg-secondary/10 text-secondary border-none shadow-none font-bold text-xs py-1 px-3">
            IELTS Band 8.5+
          </Badge>
          <Badge variant="outline" className="bg-slate-100 text-slate-500 border-none shadow-none font-bold text-xs py-1 px-3">
            Academic Context
          </Badge>
        </div>
      </div>
    </div>
  );
}

