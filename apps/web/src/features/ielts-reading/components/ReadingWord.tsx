import React, { useState } from 'react';
import { Volume2, BookmarkPlus, Loader2 } from 'lucide-react';
import { useReadingLookup, useSaveReadingWord } from '@/features/practice/api/hooks';

interface ReadingWordProps {
  word: string;
  context: string;
  highlightClassName?: string;
}

export function ReadingWord({ word, context, highlightClassName }: ReadingWordProps) {
  const [open, setOpen] = useState(false);
  const lookup = useReadingLookup();
  const saveWord = useSaveReadingWord();

  const handleOpen = async () => {
    setOpen((value) => !value);
    if (!lookup.data && !lookup.isPending) {
      await lookup.mutateAsync({ word, context });
    }
  };

  const handlePlay = () => {
    if (!lookup.data?.audio) return;
    const audio = new Audio(lookup.data.audio);
    void audio.play();
  };

  const handleSave = async () => {
    await saveWord.mutateAsync(word);
  };

  return (
    <span className="relative inline">
      <button
        className={highlightClassName || 'rounded-sm border-b-2 border-primary bg-primary/10 px-1 font-semibold text-slate-900'}
        onClick={handleOpen}
        type="button"
      >
        {word}
      </button>
      {open ? (
        <div className="absolute left-0 top-full z-20 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-2xl">
          {lookup.isPending ? (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Looking up meaning...
            </div>
          ) : lookup.data ? (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-black text-slate-900">{lookup.data.word}</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {lookup.data.word_type} {lookup.data.ipa ? `• ${lookup.data.ipa}` : ''}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-xl bg-slate-100 p-2 text-slate-600 hover:bg-slate-200" onClick={handlePlay} type="button">
                    <Volume2 className="h-4 w-4" />
                  </button>
                  <button className="rounded-xl bg-primary/10 p-2 text-primary hover:bg-primary/20" onClick={handleSave} type="button">
                    <BookmarkPlus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Meaning</p>
                <p className="text-sm text-slate-700">{lookup.data.meaning}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Collocation</p>
                <p className="text-sm text-slate-700">{lookup.data.collocation || 'No collocation available yet.'}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Example</p>
                <p className="text-sm italic text-slate-700">{lookup.data.example || 'No example available yet.'}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No dictionary result found.</p>
          )}
        </div>
      ) : null}
    </span>
  );
}
