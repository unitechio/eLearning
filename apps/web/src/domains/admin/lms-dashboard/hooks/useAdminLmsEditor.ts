import { useEffect, useState } from 'react';
import { useAdminUsers } from '@/domains/admin/api/users';
import {
  useAdminLmsDashboard,
  useCreateAdminLmsEnrollment,
  useDeleteAdminLmsEnrollment,
  useUpdateAdminLmsDashboard,
  useUpdateAdminLmsEnrollment,
} from '@/domains/lms/api/hooks';
import { parseJson, toDashboardForm, toEnrollmentDraft } from '../utils';
import type { DashboardFormState, EnrollmentDraft } from '../types';

export function useAdminLmsEditor() {
  const [query, setQuery] = useState({ page: 1, page_size: 20, q: '' });
  const usersQuery = useAdminUsers(query);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  
  const dashboardQuery = useAdminLmsDashboard(selectedUserId);
  const updateDashboardMutation = useUpdateAdminLmsDashboard();
  const createEnrollmentMutation = useCreateAdminLmsEnrollment();
  const updateEnrollmentMutation = useUpdateAdminLmsEnrollment();
  const deleteEnrollmentMutation = useDeleteAdminLmsEnrollment();
  
  const [message, setMessage] = useState('');
  const [form, setForm] = useState<DashboardFormState>(toDashboardForm());
  const [enrollments, setEnrollments] = useState<EnrollmentDraft[]>([]);

  useEffect(() => {
    if (!selectedUserId && usersQuery.data?.items[0]?.id) {
      setSelectedUserId(usersQuery.data.items[0].id);
    }
  }, [selectedUserId, usersQuery.data?.items]);

  useEffect(() => {
    if (!dashboardQuery.data) return;
    setForm(toDashboardForm(dashboardQuery.data.dashboard));
    setEnrollments((dashboardQuery.data.enrollments ?? []).map(toEnrollmentDraft));
  }, [dashboardQuery.data]);

  const setNumber = (key: keyof DashboardFormState, value: string) => 
    setForm((current) => ({ ...current, [key]: Number(value || 0) }));
    
  const setText = (key: keyof DashboardFormState, value: string) => 
    setForm((current) => ({ ...current, [key]: value }));

  const saveDashboard = async () => {
    if (!selectedUserId) return;
    await updateDashboardMutation.mutateAsync({
      userId: selectedUserId,
      payload: {
        hero_title: form.hero_title,
        hero_description: form.hero_description,
        current_streak: form.current_streak,
        longest_streak: form.longest_streak,
        estimated_band: form.estimated_band,
        target_band: form.target_band,
        overall_progress: form.overall_progress,
        attendance_rate: form.attendance_rate,
        practice_rate: form.practice_rate,
        assignment_rate: form.assignment_rate,
        active_courses: form.active_courses,
        upcoming_courses: form.upcoming_courses,
        completed_courses: form.completed_courses,
        study_days: form.study_days,
        practice_sets: form.practice_sets,
        assignments_done: form.assignments_done,
        toolkit: parseJson(form.toolkitText, []),
        skill_plan: parseJson(form.skillPlanText, []),
        score_breakdown: parseJson(form.scoreBreakdownText, []),
        four_skills: parseJson(form.fourSkillsText, []),
        ai_features: parseJson(form.aiFeaturesText, []),
        highlight_cards: parseJson(form.highlightCardsText, []),
        current_focus: form.current_focus,
        current_focus_note: form.current_focus_note,
      },
    });
    setMessage('Saved LMS dashboard.');
  };

  const addEnrollment = () => {
    setEnrollments((current) => [
      ...current, 
      { 
        id: `draft-${current.length + 1}`, 
        user_id: selectedUserId, 
        title: '', track: '', status: 'in_progress', 
        progress_percent: 0, attendance_percent: 0, practice_percent: 0, assignment_percent: 0, 
        schedule_label: '', time_range: '', center_name: '', room_name: '', instructor_name: '', 
        current_lesson: '', next_lesson: '', certificate_name: '', certificate_url: '', 
        metrics: [], sort_order: current.length + 1, metricsText: '[]' 
      }
    ]);
  };

  const saveEnrollment = async (item: EnrollmentDraft) => {
    const payload = {
      course_id: item.course_id,
      title: item.title,
      track: item.track,
      status: item.status,
      progress_percent: item.progress_percent,
      attendance_percent: item.attendance_percent,
      practice_percent: item.practice_percent,
      assignment_percent: item.assignment_percent,
      schedule_label: item.schedule_label,
      time_range: item.time_range,
      center_name: item.center_name,
      room_name: item.room_name,
      instructor_name: item.instructor_name,
      current_lesson: item.current_lesson,
      next_lesson: item.next_lesson,
      certificate_name: item.certificate_name,
      certificate_url: item.certificate_url,
      metrics: parseJson<any>(item.metricsText, []),
      sort_order: item.sort_order,
    };
    
    if (item.id.startsWith('draft-')) {
      await createEnrollmentMutation.mutateAsync({ userId: selectedUserId, payload });
      setMessage('Created LMS course card.');
      return;
    }
    await updateEnrollmentMutation.mutateAsync({ id: item.id, payload });
    setMessage('Updated LMS course card.');
  };

  const deleteEnrollment = async (item: EnrollmentDraft, index: number) => {
    if (item.id.startsWith('draft-')) {
      setEnrollments((current) => current.filter((_, entryIndex) => entryIndex !== index));
      return;
    }
    await deleteEnrollmentMutation.mutateAsync(item.id);
    setMessage('Deleted LMS course card.');
  };

  return {
    query, setQuery,
    usersQuery,
    selectedUserId, setSelectedUserId,
    message,
    form, setNumber, setText,
    enrollments, setEnrollments,
    isSavingDashboard: updateDashboardMutation.isPending,
    saveDashboard,
    addEnrollment,
    saveEnrollment,
    deleteEnrollment,
  };
}
