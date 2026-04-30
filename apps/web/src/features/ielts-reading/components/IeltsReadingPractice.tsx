import React, { useState } from 'react';
import { BookmarkPlus, ChevronLeft, ChevronRight, Clock3, Search, Volume2, X } from 'lucide-react';
import { PremiumBadge, PremiumLockCard, usePremiumAccess } from '@/features/billing/premium';
import { ReadingWord } from './ReadingWord';
import { useSaveReadingWord } from '@/features/practice/api/hooks';
import { lookupDictionaryWord } from '@/features/practice/api/service';

const questionLabels = Array.from({ length: 13 }, (_, index) => index + 1);

export function IeltsReadingPractice() {
  const { unlocked } = usePremiumAccess('premium');
  const [showExitModal, setShowExitModal] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [word, setWord] = useState('');
  const [lookup, setLookup] = useState<Awaited<ReturnType<typeof lookupDictionaryWord>> | null>(null);
  const saveWord = useSaveReadingWord();

  const completedCount = Object.values(answers).filter(Boolean).length;

  const handleLookup = async () => {
    if (!word.trim()) return;
    setLookup(await lookupDictionaryWord(word.trim()));
  };

  const handlePlay = () => {
    if (!lookup?.audio) return;
    const audio = new Audio(lookup.audio);
    void audio.play();
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col overflow-hidden bg-[#fafafa]">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600" onClick={() => setShowExitModal(true)} type="button">
            <X className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Làm bài</p>
            <h1 className="text-xl font-black text-slate-900">IELTS Online Test - CAM 20 - Reading Test 2</h1>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <PremiumBadge unlocked={unlocked} />
          <div className="flex items-center gap-2 text-red-500">
            <Clock3 className="h-5 w-5" />
            <span className="text-3xl font-black">59:41</span>
          </div>
        </div>
      </header>

      {!unlocked ? (
        <div className="border-b border-slate-200 bg-white px-6 py-4">
          <PremiumLockCard title="IELTS reading review is locked" description="Premium unlocks assistant feedback, saved word syncing, and guided reading analytics." featureKey="premium" />
        </div>
      ) : null}

      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            className="min-w-72 flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            onChange={(e) => setWord(e.target.value)}
            placeholder="Tra từ ngay trong AI Dictionary..."
            value={word}
          />
          <button className="rounded-2xl bg-slate-900 px-4 py-3 text-xs font-black uppercase tracking-wider text-white" onClick={() => void handleLookup()} type="button">
            <Search className="h-4 w-4" />
          </button>
          {lookup ? (
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
              <span className="font-black text-slate-900">{lookup.word}</span>
              <span>{lookup.word_type}</span>
              <span>{lookup.ipa}</span>
              <button className="rounded-xl bg-white p-2" onClick={handlePlay} type="button">
                <Volume2 className="h-4 w-4" />
              </button>
              <button className="rounded-xl bg-primary/10 p-2 text-primary" onClick={() => saveWord.mutate(lookup.word)} type="button">
                <BookmarkPlus className="h-4 w-4" />
              </button>
              <span className="max-w-xl text-slate-500">{lookup.meaning}</span>
            </div>
          ) : null}
        </div>
      </div>

      <main className="grid min-h-0 flex-1 grid-cols-[1fr,1fr]">
        <section className="min-h-0 overflow-y-auto border-r border-slate-200 bg-white px-7 py-8">
          <article className="mx-auto max-w-4xl space-y-8 text-[18px] leading-[1.7] text-slate-800">
            <div>
              <h2 className="text-5xl font-black tracking-tight text-slate-900">Manatees</h2>
            </div>
            <p>
              Manatees, also known as sea cows, are aquatic mammals that belong to a group of animals called Sirenia. This group also contains dugongs. Dugongs and manatees look quite alike but they are similar in size, colour and shape, and both have flexible flippers for forelimbs. However, the manatee has a broad, rounded tail, whereas the dugong&apos;s is fluked, like that of a whale.
            </p>
            <p>
              Unlike most mammals, manatees have only six bones in their neck. This short neck allows a manatee to move its head up and down, but not side to side. To see something on its left or its right, a manatee must turn its entire body, steering with its flippers. Like elephants, manatees have thick, wrinkled skin. They also have some hairs covering their bodies which help them sense vibrations in the water around them.
            </p>
            <p>
              Seagrasses and other marine plants make up most of a manatee&apos;s diet. Manatees spend about eight hours each day grazing and uprooting plants. African manatees are omnivorous; studies have shown that molluscs and fish make up a small part of their diets. West Indian and Amazonian manatees are both herbivores.
            </p>
            <p>
              Manatees&apos; teeth are all molars: flat, rounded teeth for grinding food. Instead of having incisors to grasp their food, manatees have lips which function like a pair of hands to help tear food away from the seafloor. A <ReadingWord context="Dugongs and manatees look quite alike but have a differently shaped tail." word="rounded" /> tail, thick skin and strong <ReadingWord context="A manatee must turn its entire body, steering with its flippers." word="flippers" /> are all key physical adaptations.
            </p>
          </article>
        </section>

        <section className="min-h-0 overflow-y-auto bg-[#fbfbfd] px-8 py-8">
          <div className="rounded-[24px] bg-red-600 px-6 py-4 text-white">
            <p className="text-2xl font-black">Question 1 - 6 Complete the notes below.</p>
            <p className="mt-2 text-lg font-semibold">Choose ONE WORD AND/OR A NUMBER from the passage for each answer.</p>
          </div>

          <div className="mt-6 rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-4xl font-black text-slate-900">Manatees</h3>

            <div className="mt-8 space-y-8 text-[18px] leading-8 text-slate-800">
              <div>
                <p className="mb-3 text-2xl font-black">Appearance</p>
                <label className="flex flex-wrap items-center gap-3">
                  <span>look similar to dugongs, but with a differently shaped</span>
                  <span className="font-black text-primary">1.</span>
                  <input className="h-12 w-32 rounded-xl bg-slate-100 px-4 text-center font-bold outline-none" onChange={(e) => setAnswers((prev) => ({ ...prev, 1: e.target.value }))} value={answers[1] ?? ''} />
                </label>
              </div>

              <div>
                <p className="mb-3 text-2xl font-black">Movement</p>
                <div className="space-y-3">
                  <p>• have fewer neck bones than most mammals</p>
                  <label className="flex flex-wrap items-center gap-3">
                    <span>• need to use their</span>
                    <span className="font-black text-primary">2.</span>
                    <input className="h-12 w-32 rounded-xl bg-slate-100 px-4 text-center font-bold outline-none" onChange={(e) => setAnswers((prev) => ({ ...prev, 2: e.target.value }))} value={answers[2] ?? ''} />
                    <span>to help to turn their bodies around in order to look sideways</span>
                  </label>
                  <label className="flex flex-wrap items-center gap-3">
                    <span>• sense vibrations in the water by means of</span>
                    <span className="font-black text-primary">3.</span>
                    <input className="h-12 w-32 rounded-xl bg-slate-100 px-4 text-center font-bold outline-none" onChange={(e) => setAnswers((prev) => ({ ...prev, 3: e.target.value }))} value={answers[3] ?? ''} />
                    <span>on their skin</span>
                  </label>
                </div>
              </div>

              <div>
                <p className="mb-3 text-2xl font-black">Feeding</p>
                <div className="space-y-3">
                  <label className="flex flex-wrap items-center gap-3">
                    <span>• eat mainly aquatic vegetation, such as</span>
                    <span className="font-black text-primary">4.</span>
                    <input className="h-12 w-32 rounded-xl bg-slate-100 px-4 text-center font-bold outline-none" onChange={(e) => setAnswers((prev) => ({ ...prev, 4: e.target.value }))} value={answers[4] ?? ''} />
                  </label>
                  <label className="flex flex-wrap items-center gap-3">
                    <span>• grasp and pull up plants with their</span>
                    <span className="font-black text-primary">5.</span>
                    <input className="h-12 w-32 rounded-xl bg-slate-100 px-4 text-center font-bold outline-none" onChange={(e) => setAnswers((prev) => ({ ...prev, 5: e.target.value }))} value={answers[5] ?? ''} />
                  </label>
                </div>
              </div>

              <div>
                <p className="mb-3 text-2xl font-black">Breathing</p>
                <label className="flex flex-wrap items-center gap-3">
                  <span>• may regulate the</span>
                  <span className="font-black text-primary">6.</span>
                  <input className="h-12 w-32 rounded-xl bg-slate-100 px-4 text-center font-bold outline-none" onChange={(e) => setAnswers((prev) => ({ ...prev, 6: e.target.value }))} value={answers[6] ?? ''} />
                  <span>of their bodies by using muscles of diaphragm to store air internally</span>
                </label>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          {questionLabels.map((label) => (
            <button
              key={label}
              className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-sm font-black ${activeQuestion === label ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 bg-white text-slate-600'}`}
              onClick={() => setActiveQuestion(label)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3">
            <p className="text-sm font-black text-red-600">Passage 1</p>
            <p className="text-xs text-red-500">{completedCount}/13 answered</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black uppercase tracking-wider text-white" onClick={() => setActiveQuestion((prev) => Math.min(prev + 1, 13))} type="button">
            7 - 13 <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </footer>

      {showExitModal ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[28px] bg-white p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-4xl font-black text-slate-900">Thoát và lưu lại bài</h2>
                <p className="mt-5 text-xl leading-8 text-slate-700">Bài của bạn sẽ được lưu lại ở mục in-progress. Bạn có muốn thoát không.</p>
              </div>
              <button className="text-slate-400" onClick={() => setShowExitModal(false)} type="button">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button className="rounded-2xl bg-slate-100 px-6 py-3 text-lg font-bold text-slate-700" onClick={() => setShowExitModal(false)} type="button">
                Ở lại
              </button>
              <button className="rounded-2xl bg-red-500 px-6 py-3 text-lg font-bold text-white" onClick={() => setShowExitModal(false)} type="button">
                Thoát
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
