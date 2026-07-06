import type {
  IELTSContentDetail,
  IELTSContentItem,
  IELTSPassage,
  IELTSQuestion,
  IELTSQuestionGroup,
  IELTSRelatedPost,
  IELTSVocabularyItem,
} from '@/domains/ielts/content/api';
import type {
  ContentFormState,
  GroupDraft,
  PassageDraft,
  QuestionDraft,
  RelatedPostDraft,
  VocabularyDraft,
} from './types';

export function prettyJSON(value: unknown, fallback: string): string {
  try {
    return JSON.stringify(value ?? JSON.parse(fallback), null, 2);
  } catch {
    return fallback;
  }
}

export function parseJSONField<T>(value: string, fallback: T): T {
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  return JSON.parse(trimmed) as T;
}

export function buildContentFormState(
  item?: Partial<IELTSContentDetail> | Partial<IELTSContentItem> | null,
): ContentFormState {
  return {
    slug: item?.slug ?? '',
    title: item?.title ?? '',
    subtitle: item?.subtitle ?? '',
    description: item?.description ?? '',
    module: item?.module ?? 'practice',
    skill: item?.skill ?? 'reading',
    content_type: item?.content_type ?? 'practice_test',
    part: item?.part ?? '',
    test_kind: item?.test_kind ?? '',
    status: item?.status ?? 'draft',
    review_status: (item as IELTSContentDetail | undefined)?.review_status ?? 'draft',
    review_note: (item as IELTSContentDetail | undefined)?.review_note ?? '',
    level: item?.level ?? '',
    thumbnail_url: item?.thumbnail_url ?? '',
    preview_image_url: item?.preview_image_url ?? '',
    audio_url: item?.audio_url ?? '',
    pdf_url: item?.pdf_url ?? '',
    source_url: item?.source_url ?? '',
    question_count: item?.question_count ?? 0,
    duration_seconds: item?.duration_seconds ?? 0,
    tagsText: prettyJSON(item?.tags, '[]'),
    metadataText: prettyJSON(item?.metadata, '{}'),
    published_at: item?.published_at ? item.published_at.slice(0, 16) : '',
  };
}

export const toPassageDraft = (item: IELTSPassage): PassageDraft => ({
  id: item.id,
  passage_no: item.passage_no,
  title: item.title ?? '',
  body: item.body,
  sort_order: item.sort_order ?? 0,
});

export const toGroupDraft = (item: IELTSQuestionGroup): GroupDraft => ({
  id: item.id,
  passage_id: item.passage_id ?? '',
  group_no: item.group_no,
  question_from: item.question_from,
  question_to: item.question_to,
  question_type: item.question_type,
  instruction: item.instruction ?? '',
  payloadText: prettyJSON(item.payload, '{}'),
  sort_order: item.sort_order ?? 0,
});

export const toQuestionDraft = (item: IELTSQuestion): QuestionDraft => ({
  id: item.id,
  group_id: item.group_id,
  question_no: item.question_no,
  prompt: item.prompt ?? '',
  answer: item.answer ?? '',
  optionsText: prettyJSON(item.options, '[]'),
  explanationText: prettyJSON(item.explanation, '{}'),
  payloadText: prettyJSON(item.payload, '{}'),
  sort_order: item.sort_order ?? 0,
});

export const toVocabularyDraft = (item: IELTSVocabularyItem): VocabularyDraft => ({
  id: item.id,
  term: item.term,
  ipa: item.ipa ?? '',
  part_of_speech: item.part_of_speech ?? '',
  meaning: item.meaning ?? '',
  example: item.example ?? '',
  audio_url: item.audio_url ?? '',
  image_url: item.image_url ?? '',
  sort_order: item.sort_order ?? 0,
});

export const toRelatedPostDraft = (item: IELTSRelatedPost): RelatedPostDraft => ({
  id: item.id,
  post_id: item.post_id,
  title: item.title ?? '',
  sort_order: item.sort_order ?? 0,
});
