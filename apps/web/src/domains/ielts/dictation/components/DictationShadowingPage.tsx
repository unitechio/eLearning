import React from 'react';
import { ChevronUp, X } from 'lucide-react';
import { dictationSentences } from '../data';
import { DictationFilter, DictationHeader, FloatingMagicButton, PronunciationButton, SoundButton } from './DictationShared';

export function DictationShadowingPage() {
  const [filter, setFilter] = React.useState('Tất cả');
  const [active, setActive] = React.useState(1);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <DictationHeader mode="shadowing" />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-black">Luyện shadowing toàn bài</h1>
          <DictationFilter onChange={setFilter} value={filter} />
        </div>

        <div className="space-y-3">
          {dictationSentences.slice(0, 12).map((sentence) => {
            const isActive = sentence.id === active;
            return (
              <article className="rounded-xl bg-white p-5 shadow-sm" key={sentence.id}>
                <div className="grid gap-4 sm:grid-cols-[32px,1fr,44px]">
                  <span className={isActive ? 'flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-base font-black text-blue-600' : 'text-base font-semibold text-slate-500'}>{sentence.id}</span>
                  <div>
                    <button className="text-left text-base font-black leading-6 text-slate-950 hover:text-blue-600" onClick={() => setActive(sentence.id)} type="button">
                      {sentence.english}
                    </button>
                    {!isActive ? <p className="mt-2 text-base leading-6 text-slate-500">{sentence.vietnamese}</p> : null}
                  </div>
                  <div className="flex justify-end">
                    {isActive ? <button className="text-slate-400" onClick={() => setActive(0)} type="button"><X className="h-5 w-5" /></button> : <PronunciationButton />}
                  </div>
                </div>

                {isActive ? (
                  <div className="mt-28 rounded-xl border border-slate-200 bg-white">
                    <button className="flex w-full items-center justify-center gap-3 px-5 py-4 text-base font-black text-blue-600" type="button">
                      <span className="text-blue-600">🎙</span> Nhấn để thu âm
                      <span className="ml-auto border-l border-slate-200 pl-5 text-slate-900"><ChevronUp className="h-5 w-5" /></span>
                    </button>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </main>
      <FloatingMagicButton />
    </div>
  );
}

export function ShadowSentenceQuickAction() {
  return <SoundButton />;
}
