import React from 'react';
import { Bold, Italic, List, Send } from 'lucide-react';

export function EssayEditor() {
  return (
    <section className="flex-1 flex flex-col bg-white relative">
      <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col pt-12 px-12">
        <div className="flex justify-between items-end mb-10 border-b border-slate-100 pb-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-black font-headline tracking-tighter text-slate-900">Academic Essay</h2>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Focus Mode Active • Auto-saving</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-5xl font-black text-primary font-headline tabular-nums">184</span>
            <span className="text-[10px] font-black text-slate-300 block uppercase tracking-[0.3em] mt-1">Words</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-4 hide-scrollbar">
          <div 
            className="text-lg leading-[2] text-slate-600 font-body outline-none min-h-[500px]" 
            contentEditable 
            suppressContentEditableWarning
            spellCheck="false"
          >
            <p className="mb-8">
              The ongoing debate surrounding global urbanization presents two distinct perspectives on environmental impact. While many observers contend that the sprawl of metropolitan areas devastates local ecosystems, 
              <span className="bg-primary/10 border-b-2 border-primary cursor-help mx-1 px-1">another school of thought maintains</span> 
              that concentrated populations are actually more resource-efficient than their rural counterparts.
            </p>
            <p className="mb-8">
              From an environmental standpoint, critics of urbanization point to the "urban heat island" effect and the massive carbon footprint of industrial hubs. Large-scale construction often leads to 
              <span className="bg-tertiary/10 border-b-2 border-tertiary cursor-help mx-1 px-1">destruction of natural habitats</span>, 
              replacing biodiversity with concrete jungles. This results in significant loss of flora and fauna...
            </p>
            <p className="mb-8 font-medium border-l-4 border-slate-100 pl-6 italic text-slate-400">
              Continue typing your conclusion here...
            </p>
          </div>
        </div>

        <div className="h-28 flex items-center justify-between border-t border-slate-100">
          <div className="flex gap-2">
            {[Bold, Italic, List].map((Icon, i) => (
              <button key={i} className="p-3 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-primary active:scale-95">
                <Icon className="w-5 h-5" />
              </button>
            ))}
          </div>
          <button className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:-translate-y-1 transition-all shadow-xl shadow-primary/20 active:scale-95 flex items-center gap-3">
            Grading <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
