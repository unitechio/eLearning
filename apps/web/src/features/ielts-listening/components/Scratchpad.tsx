import React from 'react';
import { FileEdit, Copy, Trash2 } from 'lucide-react';

export function Scratchpad() {
  return (
    <div className="bg-surface-container-high rounded-xl p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h4 className="font-headline font-bold flex items-center gap-2">
          <FileEdit className="w-5 h-5 text-secondary" /> Scratchpad
        </h4>
        <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Autosaved</span>
      </div>
      <textarea
        className="w-full h-48 bg-surface-container-lowest border-none rounded-lg p-4 text-sm focus:ring-2 focus:ring-secondary resize-none placeholder:text-zinc-400"
        placeholder="Type your notes here as you listen..."
      />
      <div className="flex justify-end gap-2">
        <button className="p-2 bg-white rounded-md text-zinc-400 hover:text-secondary transition-colors">
          <Copy className="w-4 h-4" />
        </button>
        <button className="p-2 bg-white rounded-md text-zinc-400 hover:text-error transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
