import type { LmsEnrollmentItem } from '@/domains/lms/api/service';

export type DashboardFormState = {
  hero_title: string;
  hero_description: string;
  current_streak: number;
  longest_streak: number;
  estimated_band: number;
  target_band: number;
  overall_progress: number;
  attendance_rate: number;
  practice_rate: number;
  assignment_rate: number;
  active_courses: number;
  upcoming_courses: number;
  completed_courses: number;
  study_days: number;
  practice_sets: number;
  assignments_done: number;
  toolkitText: string;
  skillPlanText: string;
  scoreBreakdownText: string;
  fourSkillsText: string;
  aiFeaturesText: string;
  highlightCardsText: string;
  current_focus: string;
  current_focus_note: string;
};

export type EnrollmentDraft = LmsEnrollmentItem & { metricsText: string };
