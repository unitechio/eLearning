import React, { useEffect, useMemo, useState } from 'react';
import { Flame, Headphones, Loader2, Send } from 'lucide-react';
import { PremiumBadge, PremiumLockCard, usePremiumAccess } from '@/features/billing/premium';
import { useListeningLesson, useListeningLessons, useSubmitListeningLesson } from '@/features/ielts/api/hooks';

export function IeltsListeningPractice() {
  const { unlocked } = usePremiumAccess('premium');
  const lessonsQuery = useListeningLessons();
  const [selectedLessonId, setSelectedLessonId] = useState<string>();
  const lessonQuery = useListeningLesson(selectedLessonId);
  const submitLesson = useSubmitListeningLesson();
  const [answers, setAnswers] = useState(Array.from({ length: 6 }, () => ''));

  useEffect(() => {
    if (!selectedLessonId && lessonsQuery.data?.[0]?.id) {
      setSelectedLessonId(lessonsQuery.data[0].id);
    }
  }, [lessonsQuery.data, selectedLessonId]);

  const lesson = lessonQuery.data;
  const answered = useMemo(() => answers.filter((item) => item.trim()).length, [answers]);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 p-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">IELTS Listening</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">Listening answers with audio, transcript, and explanation</h1>
            <p className="mt-2 text-sm text-slate-500">Layout này bám theo kiểu detail practice: có audio, câu hỏi, transcript, result block, và luyện tập thêm.</p>
          </div>
          <div className="flex items-center gap-4">
            <PremiumBadge unlocked={unlocked} />
            <select className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700" onChange={(e) => setSelectedLessonId(e.target.value)} value={selectedLessonId ?? ''}>
              <option value="">Select lesson</option>
              {(lessonsQuery.data ?? []).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {!unlocked ? <PremiumLockCard title="Listening premium review is locked" description="Upgrade to unlock guided explanations, richer transcript review, and personalized listening feedback." featureKey="premium" /> : null}

      {lessonQuery.isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-3xl border border-slate-200 bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : lesson ? (
        <>
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="grid gap-8 lg:grid-cols-[0.9fr,1.1fr]">
              <div>
                <img
                  alt={lesson.title}
                  className="h-72 w-full rounded-3xl object-cover"
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop"
                />
              </div>
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <Headphones className="h-5 w-5 text-primary" />
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Audio and questions</span>
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900">{lesson.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-500">{lesson.description}</p>
                </div>
                {lesson.audio_url ? <audio className="w-full" controls src={lesson.audio_url} /> : <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">Lesson này chưa có audio URL trong seed data.</div>}
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  <p className="font-bold text-slate-900">Progress</p>
                  <p className="mt-2">Answered {answered}/{answers.length} blanks.</p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(answered / answers.length) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <Flame className="h-5 w-5 text-orange-500" />
              <h2 className="text-2xl font-black text-slate-900">Answer sheet</h2>
            </div>
            <div className="mt-6 rounded-3xl bg-slate-50 p-6">
              <div className="space-y-5">
                {answers.map((answer, index) => (
                  <label key={index} className="flex flex-wrap items-center gap-3 text-base text-slate-700">
                    <span className="font-black text-primary">{index + 1}.</span>
                    <span className="min-w-28 font-semibold">Answer here</span>
                    <input
                      className="h-12 min-w-48 rounded-xl border border-slate-200 bg-white px-4 font-bold outline-none"
                      onChange={(e) => setAnswers((prev) => prev.map((item, itemIndex) => (itemIndex === index ? e.target.value : item)))}
                      value={answer}
                    />
                  </label>
                ))}
              </div>
              <button
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-red-500 px-6 py-3 text-sm font-black uppercase tracking-wider text-white disabled:opacity-50"
                disabled={submitLesson.isPending || !selectedLessonId}
                onClick={() => selectedLessonId && submitLesson.mutate({ lessonId: selectedLessonId, answers })}
                type="button"
              >
                {submitLesson.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Submit
              </button>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900">Transcript</h2>
            <div className="mt-6 rounded-3xl bg-slate-50 p-6 text-sm leading-8 text-slate-700">
              {submitLesson.data?.transcript ? (
                <p>{submitLesson.data.transcript}</p>
              ) : (
                <p>Submit bài để xem transcript thật mà backend trả về từ lesson hiện tại.</p>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900">Answer key (đáp án và giải thích)</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-emerald-50 p-5">
                <p className="text-sm font-black uppercase tracking-wider text-emerald-700">Latest score</p>
                <p className="mt-2 text-3xl font-black text-emerald-900">{submitLesson.data?.score ?? 0}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">
                Result block này đang dùng data thật sau khi submit. Bước sau có thể nối thêm answer explanations per-question khi backend có schema chi tiết hơn.
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">No listening lesson available yet.</div>
      )}
    </div>
  );
}
