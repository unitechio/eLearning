import React from 'react';
import { dictationVocabulary } from '../data';
import { DictationFilter, DictationHeader, FloatingMagicButton, PronunciationButton, SoundButton } from './DictationShared';

export function DictationVocabularyPage() {
  const [filter, setFilter] = React.useState('Tất cả');

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <DictationHeader mode="vocabulary" />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-black">Tất cả từ hay trong bài (13)</h1>
          <DictationFilter onChange={setFilter} value={filter} />
        </div>

        <div className="space-y-3">
          {dictationVocabulary.map((item) => (
            <article className="grid items-center gap-4 rounded-xl bg-white px-5 py-4 shadow-sm sm:grid-cols-[32px,1fr,44px,120px,1.2fr]" key={item.id}>
              <span className="text-base font-semibold text-slate-500">{item.id}</span>
              <p className="font-black text-slate-950">{item.term}</p>
              <PronunciationButton />
              <div className="flex items-center gap-3">
                <SoundButton />
                <span className="text-sm font-semibold text-slate-700">{item.ipa}</span>
              </div>
              <p className="text-base text-slate-700">{item.meaning}</p>
            </article>
          ))}
        </div>
      </main>
      <FloatingMagicButton />
    </div>
  );
}
