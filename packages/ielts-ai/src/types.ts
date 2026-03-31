import { z } from "zod";

export const IELTSSpeakingSchema = z.object({
  overall_band: z.number().min(0).max(9),
  criteria: z.object({
    fluency: z.number().min(0).max(9),
    lexical: z.number().min(0).max(9),
    grammar: z.number().min(0).max(9),
    pronunciation: z.number().min(0).max(9),
  }),
  feedback: z.string(),
  mistakes: z.array(z.object({
    text: z.string(),
    issue: z.string(),
    suggestion: z.string(),
  })),
  improved_version: z.string(),
});

export const IELTSWritingSchema = z.object({
  overall_band: z.number().min(0).max(9),
  criteria: z.object({
    task_response: z.number().min(0).max(9),
    coherence_cohesion: z.number().min(0).max(9),
    lexical: z.number().min(0).max(9),
    grammar: z.number().min(0).max(9),
  }),
  feedback: z.string(),
  mistakes: z.array(z.object({
    text: z.string(),
    issue: z.string(),
    suggestion: z.string(),
  })),
  improved_version: z.string(),
});

export type IELTSSpeakingResult = z.infer<typeof IELTSSpeakingSchema>;
export type IELTSWritingResult = z.infer<typeof IELTSWritingSchema>;
