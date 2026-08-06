import React from 'react';
import { type Recommendation } from './hooks/useAIScheduling';
import { FieldLabel, HelperText } from '@/shared/components/ui/typography';
import { Sparkles, Trophy } from 'lucide-react';

interface AIRecommendationPanelProps {
  readonly recommendations: readonly Recommendation[];
  readonly onSelectSlot: (start: string, end: string) => void;
}

export function AIRecommendationPanel({
  recommendations,
  onSelectSlot,
}: AIRecommendationPanelProps) {
  if (recommendations.length === 0) return null;

  return (
    <div className="p-4 bg-primary/[0.03] border border-primary/20 rounded-xl space-y-3 font-sans">
      <header className="flex items-center gap-1.5 text-primary">
        <Sparkles className="h-4.5 w-4.5 shrink-0" />
        <FieldLabel className="text-primary font-semibold">AI Scheduling Assistant</FieldLabel>
      </header>

      <ul className="space-y-2">
        {recommendations.map((rec, i) => (
          <li
            key={i}
            className="p-2.5 rounded-lg bg-card border border-primary/10 hover:border-primary/30 transition-all cursor-pointer space-y-1.5"
            onClick={() => onSelectSlot(rec.start, rec.end)}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                {rec.start} - {rec.end}
              </span>
              <span className="text-[10px] font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                <span>{rec.score}% match</span>
              </span>
            </div>
            <HelperText className="text-[10px] leading-relaxed">
              {rec.reason}
            </HelperText>
          </li>
        ))}
      </ul>
    </div>
  );
}
