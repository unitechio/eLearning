import type { LmsDashboardData, LmsEnrollmentItem } from '@/domains/lms/api/service';
import type { DashboardFormState, EnrollmentDraft } from './types';

export function parseJson<T>(value: string, fallback: T): T {
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    return fallback;
  }
}

export function prettyJson(value: unknown): string {
  try {
    return JSON.stringify(value ?? [], null, 2);
  } catch {
    return '[]';
  }
}

export function toDashboardForm(item?: LmsDashboardData): DashboardFormState {
  return {
    hero_title: item?.hero_title ?? '',
    hero_description: item?.hero_description ?? '',
    current_streak: item?.current_streak ?? 0,
    longest_streak: item?.longest_streak ?? 0,
    estimated_band: item?.estimated_band ?? 0,
    target_band: item?.target_band ?? 0,
    overall_progress: item?.overall_progress ?? 0,
    attendance_rate: item?.attendance_rate ?? 0,
    practice_rate: item?.practice_rate ?? 0,
    assignment_rate: item?.assignment_rate ?? 0,
    active_courses: item?.active_courses ?? 0,
    upcoming_courses: item?.upcoming_courses ?? 0,
    completed_courses: item?.completed_courses ?? 0,
    study_days: item?.study_days ?? 0,
    practice_sets: item?.practice_sets ?? 0,
    assignments_done: item?.assignments_done ?? 0,
    toolkitText: prettyJson(item?.toolkit),
    skillPlanText: prettyJson(item?.skill_plan),
    scoreBreakdownText: prettyJson(item?.score_breakdown),
    fourSkillsText: prettyJson(item?.four_skills),
    aiFeaturesText: prettyJson(item?.ai_features),
    highlightCardsText: prettyJson(item?.highlight_cards),
    current_focus: item?.current_focus ?? '',
    current_focus_note: item?.current_focus_note ?? '',
  };
}

export function toEnrollmentDraft(item: LmsEnrollmentItem): EnrollmentDraft {
  return { ...item, metricsText: prettyJson(item.metrics) };
}
