"use client";

import { useWritingStore } from "@/hooks/use-writing";
import { GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function NotionEditor() {
  const { textContent, setTextContent } = useWritingStore();

  return (
    <div className="max-w-4xl w-full px-12 py-16">
      {/* Prompt Section */}
      <header className="mb-12">
        <Badge variant="outline" className="px-3 py-1 bg-slate-50 text-primary border-none text-xs font-bold rounded-full mb-4 uppercase tracking-widest shadow-sm">
          ACADEMIC WRITING • TASK 2
        </Badge>
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 mb-6">
          The influence of social media on young people's communication skills.
        </h1>
        <p className="text-lg leading-relaxed text-slate-500 font-medium">
          Some people believe that social media has a negative impact on the communication skills of young people. To what extent do you agree or disagree?
        </p>
      </header>

      {/* Notion-style Minimalist Editor */}
      <div className="relative min-h-[600px] group border-l-2 border-transparent hover:border-slate-100 transition-colors pl-4">
        
        <div className="absolute -left-6 top-1 opacity-0 group-hover:opacity-30 transition-opacity">
          <GripVertical className="text-slate-400 cursor-grab w-5 h-5" />
        </div>

        <div className="space-y-6 text-xl leading-[1.8] text-slate-800 font-normal outline-none focus:outline-none">
          {/* Simulated content for the demo matching the HTML behavior */}
          <p className="focus:outline-none focus-visible:outline-none">
            In the contemporary digital era, the pervasive nature of social networking platforms has ignited a fierce debate regarding their effects on the interpersonal abilities of the younger generation.
            {" "}
            <span className="bg-red-50 border-b-2 border-red-300 cursor-pointer relative group/error">
              While some argue that these platforms hinder face-to-face interaction
              <span className="absolute bottom-full left-0 mb-2 hidden group-hover/error:block w-64 p-3 bg-slate-800 text-slate-100 text-sm rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                <span className="font-bold block mb-1 text-white">Clarity Suggestion:</span>
                Consider specifying which "platforms" for better lexical resource scores.
              </span>
            </span>
            , I contend that they actually serve as a catalyst for broadening communication horizons if used judiciously.
          </p>

          <p className="focus:outline-none focus-visible:outline-none">
            One primary reason for this perspective is the global connectivity afforded by platforms like Twitter and Instagram. Young individuals are no longer restricted by geographical boundaries; they can engage in cross-cultural dialogues that
            {" "}
            <span className="bg-primary/10 border-b-2 border-primary/40 cursor-pointer relative group/vocab">
              enhance their sociolinguistic competence
              <span className="absolute bottom-full left-0 mb-2 hidden group-hover/vocab:block w-64 p-3 bg-slate-800 text-slate-100 text-sm rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                <span className="font-bold text-primary-fixed block mb-1 text-primary-200">Advanced Vocabulary Detected</span>
                Excellent use of "sociolinguistic competence". This increases your Lexical Resource score.
              </span>
            </span>
            . For instance, a student in Tokyo can discuss environmental issues with peers in London, necessitating the use of precise and nuanced language.
          </p>

          <p className="focus:outline-none focus-visible:outline-none text-slate-400 relative">
            Furthermore, social media provides a low-pressure environment for individuals who might suffer from social anxiety. Through text-based communication
            <span className="animate-pulse absolute ml-[1px] bg-slate-400 h-[1em] w-[2px] top-1/2 -translate-y-1/2"></span>
          </p>
        </div>
      </div>
    </div>
  );
}
