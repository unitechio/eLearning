import React, { useMemo, useState } from 'react';
import { Loader2, Send, Sparkles } from 'lucide-react';
import { PremiumBadge, PremiumLockCard, usePremiumAccess } from '@/features/billing/premium';
import { useEvaluateWriting, useSubmitWriting, useWritingHistory, useWritingSubmission } from '@/features/ielts/api/hooks';

export function IeltsWritingCoach() {
  const { unlocked } = usePremiumAccess('premium');
  const [prompt, setPrompt] = useState('Some people believe that the rapid expansion of cities has a negative impact on the environment. Others argue that urban living is more sustainable than rural living. Discuss both views and give your opinion.');
  const [essay, setEssay] = useState('');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string>();
  const evaluateWriting = useEvaluateWriting();
  const submitWriting = useSubmitWriting();
  const historyQuery = useWritingHistory();
  const submissionQuery = useWritingSubmission(selectedSubmissionId);
  const words = useMemo(() => essay.trim().split(/\s+/).filter(Boolean).length, [essay]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 p-8 animate-in fade-in duration-700">
      <aside className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">IELTS Writing Task 2</p>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900">Writing coach</h1>
          </div>
          <PremiumBadge unlocked={unlocked} />
        </div>
        <textarea
          className="mt-6 min-h-56 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-7 text-slate-700"
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
        />
        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-bold text-slate-900">Target</p>
          <p className="mt-2">Aim for 250+ words. The backend already scores and stores submissions via `/writing/submit`.</p>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-black text-slate-900">History</h2>
          <div className="mt-4 space-y-3">
            {(historyQuery.data?.items ?? []).map((item) => (
              <button
                key={item.id}
                className={`block w-full rounded-2xl border px-4 py-3 text-left text-sm ${selectedSubmissionId === item.id ? 'border-primary bg-primary/5' : 'border-slate-200'}`}
                onClick={() => setSelectedSubmissionId(item.id)}
                type="button"
              >
                <p className="font-bold text-slate-900">Score {typeof item.ai_score === 'number' ? item.ai_score.toFixed(1) : item.ai_score}</p>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">{item.prompt_text}</p>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <section className="min-w-0 flex-1 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        {!unlocked ? (
          <div className="mb-6">
            <PremiumLockCard title="Advanced writing coach is locked" description="Premium unlocks advanced AI feedback, coherence analysis, and deeper writing evaluation." featureKey="premium" />
          </div>
        ) : null}
        <div className="flex items-end justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900">Academic essay</h2>
            <p className="mt-2 text-sm text-slate-500">Evaluate first, then submit to save the result into real history.</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black text-primary">{words}</p>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Words</p>
          </div>
        </div>

        <textarea
          className="mt-8 min-h-[420px] w-full rounded-3xl border border-slate-200 px-6 py-5 text-base leading-8 text-slate-700"
          onChange={(e) => setEssay(e.target.value)}
          placeholder="Write your IELTS Task 2 essay here..."
          value={essay}
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-black uppercase tracking-wider text-white disabled:opacity-50"
            disabled={!unlocked || !essay.trim() || evaluateWriting.isPending}
            onClick={() => evaluateWriting.mutate({ prompt, text: essay })}
            type="button"
          >
            {evaluateWriting.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Evaluate
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black uppercase tracking-wider text-white disabled:opacity-50"
            disabled={!essay.trim() || submitWriting.isPending}
            onClick={() => submitWriting.mutate({ promptText: prompt, responseText: essay })}
            type="button"
          >
            {submitWriting.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Submit
          </button>
        </div>
      </section>

      <aside className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h3 className="text-xl font-black text-slate-900">AI Coach</h3>
        {evaluateWriting.data ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-primary/5 p-4">
              <p className="text-xs font-black uppercase tracking-wider text-primary">Score</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{evaluateWriting.data.score.toFixed(1)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-bold text-slate-900">Feedback</p>
              <p className="mt-2 whitespace-pre-wrap">{evaluateWriting.data.feedback}</p>
            </div>
            {evaluateWriting.data.improved_answer ? (
              <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900">
                <p className="font-bold">Improved answer</p>
                <p className="mt-2 whitespace-pre-wrap">{evaluateWriting.data.improved_answer}</p>
              </div>
            ) : null}
          </div>
        ) : selectedSubmissionId && submissionQuery.data ? (
          <div className="mt-6 space-y-4 text-sm text-slate-700">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-bold text-slate-900">Saved submission</p>
              <p className="mt-2">Score: {String(submissionQuery.data.score ?? 'n/a')}</p>
              <p className="mt-2">Word count: {String(submissionQuery.data.word_count ?? 'n/a')}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-bold text-slate-900">Feedback</p>
              <p className="mt-2 whitespace-pre-wrap">{String(submissionQuery.data.feedback ?? '')}</p>
            </div>
          </div>
        ) : (
          <p className="mt-6 text-sm text-slate-500">Run evaluation or open a saved submission to inspect real backend data.</p>
        )}
      </aside>
    </div>
  );
}
