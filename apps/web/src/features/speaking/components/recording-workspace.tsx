import { useSpeakingStore } from "@/features/speaking/stores/use-speaking-store";
import { Mic, Info } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/components/ui/badge";
import { useIELTSScoring } from "../api";

export function RecordingWorkspace() {
  const { isRecording, setRecording, recordingTime, setScoringResult } = useSpeakingStore();
  const scoringMutation = useIELTSScoring();

  const handleToggleRecording = async () => {
    if (isRecording) {
      setRecording(false);
      // In a real app, you would send the audio to a STT service first.
      // For this demo, we simulate a transcript submission to the scoring API.
      try {
        const result = await scoringMutation.mutateAsync("I find the new smart refrigerator quite complicated to use because the interface is very advanced.");
        setScoringResult(result);
      } catch (err) {
        console.error("Scoring failed", err);
      }
    } else {
      setScoringResult(null);
      setRecording(true);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Badge variant="secondary" className="bg-secondary-container/10 text-secondary text-[10px] font-bold tracking-widest uppercase rounded-full border-none px-3 py-1">
          IELTS Speaking Part 2
        </Badge>
        <h2 className="text-3xl font-headline font-semibold text-slate-800 tracking-tight leading-tight">
          Describe a technology you find difficult to use.
        </h2>
        <p className="text-slate-500 font-medium leading-relaxed max-w-xl">
          You should say: what it is, when you first used it, what it is used for, and explain why you find it difficult to use.
        </p>
      </div>

      {/* Recording Visualizer Module */}
      <div className="bg-slate-50 border border-slate-100 p-10 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
        {/* Decorative Glass Background Elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>

        {/* Waveform Visualization */}
        <div className="flex items-end justify-center gap-1.5 h-32 mb-12 opacity-80">
          {[4, 12, 20, 28, 16, 24, 8, 14, 22, 32, 12, 6].map((height, i) => (
            <div
              key={i}
              className={cn(
                "w-1.5 rounded-full transition-all duration-300",
                isRecording ? "animate-pulse" : "",
                [3, 9].includes(i) ? "bg-gradient-to-t from-primary to-secondary" : "bg-primary/40"
              )}
              style={{ height: `${isRecording ? height * (Math.random() * 0.5 + 0.8) : height * 0.5}px` }}
            ></div>
          ))}
        </div>

        {/* Central Record Button */}
        <div className="relative">
          {isRecording && (
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-125 animate-pulse"></div>
          )}
          <button 
            onClick={handleToggleRecording}
            className="relative w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-105 active:scale-95 group z-10"
          >
            <Mic className="text-white w-10 h-10" />
          </button>
        </div>

        <p className={cn(
          "mt-8 font-bold tracking-widest text-sm transition-all",
          isRecording ? "text-primary animate-pulse" : "text-slate-400"
        )}>
          {isRecording ? `Recording... ${formatTime(recordingTime)}` : "Tap to Start"}
        </p>
      </div>

      {/* Footer Help */}
      <div className="flex items-center gap-4 text-slate-500 text-sm bg-blue-50/50 p-4 rounded-xl border border-blue-100">
        <Info className="w-5 h-5 text-blue-500" />
        <p>Aim for a 2-minute response to maximize your Lexical Resource score.</p>
      </div>
    </div>
  );
}
