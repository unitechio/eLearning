import { apiClient } from '@/shared/api';
import type { ApiResponse } from '@/shared/types/api';

export interface LmsMetricItem {
  label: string;
  value?: string | number;
  subtitle?: string;
  icon?: string;
  percent?: number;
}

export interface LmsDashboardData {
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
  toolkit: LmsMetricItem[];
  skill_plan: LmsMetricItem[];
  score_breakdown: LmsMetricItem[];
  four_skills: LmsMetricItem[];
  ai_features: LmsMetricItem[];
  highlight_cards: LmsMetricItem[];
  current_focus: string;
  current_focus_note: string;
}

export interface LmsEnrollmentItem {
  id: string;
  user_id: string;
  course_id?: string;
  title: string;
  track: string;
  status: string;
  progress_percent: number;
  attendance_percent: number;
  practice_percent: number;
  assignment_percent: number;
  schedule_label: string;
  time_range: string;
  center_name: string;
  room_name: string;
  instructor_name: string;
  current_lesson: string;
  next_lesson: string;
  certificate_name: string;
  certificate_url: string;
  metrics: LmsMetricItem[];
  sort_order: number;
}

export interface LmsDashboardResponse {
  user_id: string;
  dashboard: LmsDashboardData;
  enrollments: LmsEnrollmentItem[];
}

export interface UpsertLmsDashboardPayload {
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
  toolkit: LmsMetricItem[];
  skill_plan: LmsMetricItem[];
  score_breakdown: LmsMetricItem[];
  four_skills: LmsMetricItem[];
  ai_features: LmsMetricItem[];
  highlight_cards: LmsMetricItem[];
  current_focus: string;
  current_focus_note: string;
}

export interface UpsertLmsEnrollmentPayload {
  course_id?: string;
  title: string;
  track: string;
  status: string;
  progress_percent: number;
  attendance_percent: number;
  practice_percent: number;
  assignment_percent: number;
  schedule_label: string;
  time_range: string;
  center_name: string;
  room_name: string;
  instructor_name: string;
  current_lesson: string;
  next_lesson: string;
  certificate_name: string;
  certificate_url: string;
  metrics: LmsMetricItem[];
  sort_order: number;
}

export async function getMyLmsDashboard() {
  const response = await apiClient.get<ApiResponse<LmsDashboardResponse>>('/lms/dashboard');
  return response.data.data;
}

export async function getAdminLmsDashboard(userId: string) {
  const response = await apiClient.get<ApiResponse<LmsDashboardResponse>>(`/admin/lms/users/${userId}`);
  return response.data.data;
}

export async function updateAdminLmsDashboard(userId: string, payload: UpsertLmsDashboardPayload) {
  const response = await apiClient.put<ApiResponse<LmsDashboardResponse>>(`/admin/lms/users/${userId}`, payload);
  return response.data.data;
}

export async function createAdminLmsEnrollment(userId: string, payload: UpsertLmsEnrollmentPayload) {
  const response = await apiClient.post<ApiResponse<LmsEnrollmentItem>>(`/admin/lms/users/${userId}/enrollments`, payload);
  return response.data.data;
}

export async function updateAdminLmsEnrollment(id: string, payload: UpsertLmsEnrollmentPayload) {
  const response = await apiClient.put<ApiResponse<LmsEnrollmentItem>>(`/admin/lms/enrollments/${id}`, payload);
  return response.data.data;
}

export async function deleteAdminLmsEnrollment(id: string) {
  await apiClient.delete(`/admin/lms/enrollments/${id}`);
}
