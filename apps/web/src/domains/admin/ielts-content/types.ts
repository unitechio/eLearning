// ─── Draft types cho local state (chưa lưu) ──────────────────────────────────
export type AssetKind = 'thumbnail' | 'content-image' | 'audio' | 'pdf' | 'vocab-image';

export type ContentFormState = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  module: string;
  skill: string;
  content_type: string;
  part: string;
  test_kind: string;
  status: string;
  review_status: string;
  review_note: string;
  level: string;
  thumbnail_url: string;
  preview_image_url: string;
  audio_url: string;
  pdf_url: string;
  source_url: string;
  question_count: number;
  duration_seconds: number;
  tagsText: string;
  metadataText: string;
  published_at: string;
};

export type PassageDraft = {
  id?: number;
  passage_no: number;
  title: string;
  body: string;
  sort_order: number;
};

export type GroupDraft = {
  id?: number;
  passage_id: number | '';
  group_no: number;
  question_from: number;
  question_to: number;
  question_type: string;
  instruction: string;
  payloadText: string;
  sort_order: number;
};

export type QuestionDraft = {
  id?: number;
  group_id: number | '';
  question_no: number;
  prompt: string;
  answer: string;
  optionsText: string;
  explanationText: string;
  payloadText: string;
  sort_order: number;
};

export type VocabularyDraft = {
  id?: number;
  term: string;
  ipa: string;
  part_of_speech: string;
  meaning: string;
  example: string;
  audio_url: string;
  image_url: string;
  sort_order: number;
};

export type RelatedPostDraft = {
  id?: number;
  post_id: number;
  title: string;
  sort_order: number;
};
