import React, { useMemo, useState } from 'react';
import { AudioLines, Loader2, Mic, Upload } from 'lucide-react';
import { PremiumBadge, PremiumLockCard, usePremiumAccess } from '@/features/billing/premium';
import {
  useAnalyzePronunciation,
  useAnalyzeSpeakingAudio,
  useSpeakingSession,
  useStartSpeakingSession,
  useStopSpeakingSession,
} from '@/features/ielts/api/hooks';

export function IeltsSpeakingSimulation() {
  const { unlocked } = usePremiumAccess('speaking_realtime');
  const [sessionId, setSessionId] = useState<string>();
  const [text, setText] = useState('Describe a memorable trip you took and explain why it was important to you.');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const startSession = useStartSpeakingSession();
  const stopSession = useStopSpeakingSession();
  const sessionQuery = useSpeakingSession(sessionId);
  const pronunciation = useAnalyzePronunciation();
  const audioAnalysis = useAnalyzeSpeakingAudio();
  const activeSession = sessionQuery.data;
  const timeLabel = useMemo(() => (activeSession?.status === 'started' ? 'LIVE' : 'READY'), [activeSession?.status]);

  return (
    <main className="min-h-screen px-6 pb-32 pt-8 lg:px-12 animate-in fade-in duration-700">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 xl:grid-cols-12">
        <div className="space-y-12 xl:col-span-8">
          <header className="flex justify-between items-end">
            <div className="space-y-4">
              <span className="inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-primary">
                IELTS Speaking • Realtime Session
              </span>
              <div className="mt-3">
                <PremiumBadge unlocked={unlocked} />
              </div>
              <h1 className="text-5xl font-black leading-tight tracking-tight text-slate-900">
                Speaking coach: <span className="text-primary">session, pronunciation, audio analysis</span>
              </h1>
            </div>
            <div className="pb-2 text-right">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Session status</p>
              <p className="font-headline text-4xl font-black tabular-nums text-primary">{timeLabel}</p>
            </div>
          </header>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-wrap gap-3">
              <button
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black uppercase tracking-wider text-white disabled:opacity-50"
                disabled={!unlocked || startSession.isPending}
                onClick={async () => {
                  const session = await startSession.mutateAsync();
                  setSessionId(session.id);
                }}
                type="button"
              >
                <Mic className="h-4 w-4" />
                {startSession.isPending ? 'Starting...' : 'Start session'}
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-sm font-black uppercase tracking-wider text-white disabled:opacity-50"
                disabled={!unlocked || !sessionId || stopSession.isPending}
                onClick={async () => {
                  const session = await stopSession.mutateAsync();
                  setSessionId(session.id);
                }}
                type="button"
              >
                <AudioLines className="h-4 w-4" />
                {stopSession.isPending ? 'Stopping...' : 'Stop session'}
              </button>
            </div>
            {!unlocked ? <div className="mt-6"><PremiumLockCard title="Realtime speaking coach is locked" description="Upgrade to premium to unlock realtime speaking feedback, pronunciation scoring, and full analysis." featureKey="speaking_realtime" /></div> : null}

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6">
                <h2 className="text-xl font-black text-slate-900">Cue card</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Describe a memorable trip you took. You should say where you went, who you traveled with, what happened there, and explain why it remains memorable.
                </p>
                {activeSession ? (
                  <div className="mt-6 rounded-2xl bg-white p-4 text-sm text-slate-600 shadow-sm">
                    <p><span className="font-bold text-slate-900">Session ID:</span> {activeSession.id}</p>
                    <p className="mt-2"><span className="font-bold text-slate-900">Started:</span> {new Date(activeSession.started_at).toLocaleString()}</p>
                    <p className="mt-2"><span className="font-bold text-slate-900">Status:</span> {activeSession.status}</p>
                  </div>
                ) : null}
              </div>

              <div className="rounded-3xl border border-slate-100 bg-white p-6">
                <h2 className="text-xl font-black text-slate-900">Pronunciation check</h2>
                <textarea
                  className="mt-4 min-h-40 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700"
                  onChange={(e) => setText(e.target.value)}
                  value={text}
                />
                <button
                  className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-black uppercase tracking-wider text-white disabled:opacity-50"
                  disabled={!unlocked || pronunciation.isPending || !text.trim()}
                  onClick={() => pronunciation.mutate(text)}
                  type="button"
                >
                  {pronunciation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mic className="h-4 w-4" />}
                  Analyze pronunciation
                </button>
                {pronunciation.data ? (
                  <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                    <p className="font-bold text-slate-900">Accuracy: {pronunciation.data.accuracy.toFixed(1)}</p>
                    <p className="mt-2">{pronunciation.data.feedback}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-black text-slate-900">Upload audio for speaking analysis</h2>
            <p className="mt-2 text-sm text-slate-500">Route thật đang dùng `POST /speaking/analyze` với audio multipart.</p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <input accept="audio/*" onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)} type="file" />
              <button
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black uppercase tracking-wider text-white disabled:opacity-50"
                disabled={!unlocked || !audioFile || audioAnalysis.isPending}
                onClick={() => audioFile && audioAnalysis.mutate(audioFile)}
                type="button"
              >
                {audioAnalysis.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Analyze uploaded audio
              </button>
            </div>
            {audioAnalysis.data ? (
              <div className="mt-6 rounded-3xl bg-slate-50 p-6">
                <p className="text-sm font-bold text-slate-900">Score: {audioAnalysis.data.score.toFixed(1)}</p>
                <p className="mt-3 text-sm text-slate-600"><span className="font-bold text-slate-900">Transcript:</span> {audioAnalysis.data.transcript}</p>
                <p className="mt-3 text-sm text-slate-600"><span className="font-bold text-slate-900">Feedback:</span> {audioAnalysis.data.feedback}</p>
                {audioAnalysis.data.improved_answer ? <p className="mt-3 text-sm text-slate-600"><span className="font-bold text-slate-900">Improved answer:</span> {audioAnalysis.data.improved_answer}</p> : null}
              </div>
            ) : null}
          </section>
        </div>

        <div className="space-y-8 xl:col-span-4">
          <div className="rounded-2xl border border-slate-200/50 bg-slate-50 p-8">
            <h3 className="font-headline text-2xl font-bold text-slate-800">Expert Tips</h3>
            <div className="mt-8 space-y-6">
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <h5 className="mb-2 text-sm font-bold uppercase tracking-wider text-secondary">Fluency Tip</h5>
                <p className="text-sm leading-relaxed text-slate-600">Use signposting words like "Firstly", "Moving on to", and "As a result" to structure your 2-minute talk.</p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <h5 className="mb-2 text-sm font-bold uppercase tracking-wider text-secondary">Time Management</h5>
                <p className="text-sm leading-relaxed text-slate-600">Keep speaking until the examiner stops you. Expand reasons and examples if you still have time.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-secondary to-primary-container p-8 text-white shadow-xl shadow-secondary/20">
            <h3 className="font-headline text-2xl font-bold">Power Vocab</h3>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {['Stunning', 'Life-changing', 'Picturesque', 'Memorable', 'Serene', 'Unforgettable'].map((word) => (
                <span key={word} className="cursor-pointer rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold transition-all active:scale-95 hover:bg-white/20">
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
