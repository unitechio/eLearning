export const MODULE_OPTIONS = ['self-study', 'practice', 'mock-test'] as const;
export const SKILL_OPTIONS  = ['reading', 'listening', 'writing', 'speaking'] as const;
export const CONTENT_TYPE_OPTIONS = [
  'practice_test',
  'lesson',
  'mock_test',
  'explanation',
  'question_bank',
] as const;
export const STATUS_OPTIONS  = ['draft', 'published', 'archived'] as const;
export const REVIEW_OPTIONS  = ['draft', 'approved', 'published', 'rejected', 'archived'] as const;
export const QUESTION_TYPE_OPTIONS = [
  'sentence_completion',
  'table_completion',
  'true_false_not_given',
  'multiple_choice',
  'matching',
  'map_labeling',
  'note_completion',
  'summary_completion',
  'short_answer',
] as const;
