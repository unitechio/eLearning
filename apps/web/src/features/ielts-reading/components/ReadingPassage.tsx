import React from 'react';
import { Highlighter, FileText, ZoomIn } from 'lucide-react';
import { ReadingWord } from './ReadingWord';

export function ReadingPassage() {
  return (
    <section className="w-1/2 h-full flex flex-col bg-surface border-r border-outline-variant/10">
      {/* Tools Header */}
      <div className="px-8 py-4 bg-surface-container-low flex justify-between items-center border-b border-outline-variant/5">
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Passage 2</span>
          <h2 className="font-headline text-lg font-extrabold text-on-surface">The Architecture of Collective Intelligence</h2>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-primary hover:shadow-sm transition-all active:scale-95">
            <Highlighter className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-secondary hover:shadow-sm transition-all active:scale-95">
            <FileText className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-primary transition-all active:scale-95">
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-12 py-10 hide-scrollbar">
        <article className="max-w-2xl mx-auto space-y-8 text-on-surface/90 leading-relaxed font-body">
          <p className="text-xl font-headline font-semibold text-primary/80 italic">
            An investigation into how modern algorithmic systems mimic the behavior of biological swarms to optimize resource distribution.
          </p>
          <p>
            The concept of collective intelligence is not a novelty of the digital age. For millennia, <ReadingWord context="For millennia, myrmecologists have observed the intricate navigational strategies of ant colonies." word="myrmecologists" /> have observed the intricate navigational strategies of ant colonies, noting how individual agents with limited cognitive capacity contribute to complex, goal-oriented structures. These biological models are now serving as the architectural blueprint for next-generation logistical frameworks.
          </p>
          <p>
            Unlike traditional hierarchical systems, where a central node dictates every movement, decentralized intelligence relies on local interactions. Each 'agent'—whether a drone in a delivery fleet or a data packet in a cloud network—responds to its immediate environment based on a set of <ReadingWord context="Each agent responds to its immediate environment based on a set of stochastic parameters." word="stochastic" highlightClassName="rounded-sm border-b-2 border-secondary bg-secondary/10 px-1 font-semibold text-slate-900" /> parameters. 
          </p>
          <div className="relative group">
            <img 
              alt="Swarm Intelligence Visualization" 
              className="w-full rounded-xl object-cover h-64 my-6 grayscale hover:grayscale-0 transition-all duration-700 shadow-xl" 
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
            />
            <div className="absolute bottom-4 left-4 bg-surface-container-lowest/90 backdrop-blur px-3 py-1 rounded text-xs font-medium text-slate-800 shadow-sm">
              Figure 1.1: Decentralized Node Mapping
            </div>
          </div>
          <p>
            Critics argue that this reliance on emergence over command leads to unpredictability. However, the robustness of such systems in the face of node failure suggests otherwise. When a single ant is lost, the colony's pheromone trail remains intact. Similarly, in a distributed ledger, the loss of one participant does not compromise the integrity of the whole. This resilience is what makes collective intelligence the "holy grail" of urban planning and automated transportation.
          </p>
          <p>
            The transition from static infrastructure to dynamic, responsive environments requires a fundamental shift in our understanding of agency. We are no longer designing tools for humans to use; we are designing ecosystems for <ReadingWord context="We are designing ecosystems for autonomous agents to inhabit." word="autonomous" /> agents to inhabit. The implications for privacy and personal autonomy are, as yet, poorly understood.
          </p>
        </article>
      </div>
    </section>
  );
}
