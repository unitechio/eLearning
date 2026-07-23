import React, { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { RequireAdmin, RequireAuth, RequireGuest } from './guards';
import { LoginPage, ProfilePage, RegisterPage } from '@/domains/auth';
import {
  AdminAccessPage,
  AdminAuditLogsPage,
  AdminBillingPage,
  AdminEmailLogsPage,
  AdminFeatureFlagsPage,
  AdminIELTSContentPage,
  AdminLmsPage,
  AdminPlatformSettingsPage,
  AdminSupportTicketsPage,
  AdminUsersPage,
  AdminDocumentPage,
  AdminWritingReviewPage,
  AdminInvoicesPage,
  AdminContentPage,
  AdminMockTestPage,
  AdminVouchersPage,
} from '@/domains/admin';
import {
  CustomerManagementPage,
  MenuManagementPage,
  PermissionPage,
  RoleManagementPage,
  RolePermissionPage,
  UserPage,
} from '@/domains/admin/user-access';
import { BillingPage } from '@/domains/billing';
import { ToeicHubPage, CoursesPage, CourseDetailPage, CartView } from '@/domains/course';
import { AchievementsPage, PlannerPage } from '@/domains/engagement';
import { DashboardPage } from '@/domains/learning';
import { LmsDashboardPage, AssignmentReviewPage, LmsLoginPage } from '@/domains/lms';
import { SpeakingPage } from '@/domains/speaking';
import { VocabularyPage } from '@/domains/vocabulary';
import { WritingPage } from '@/domains/writing';
import { MarketingPage } from '@/domains/marketing';
import { SelfStudyPracticePage } from '@/domains/self-study';
import { IeltsListeningPage, IeltsListeningPractice } from '@/domains/ielts/listening';
import { IeltsReadingPage, IeltsReadingPractice, ReadingAnswerKeyPage, ReadingPracticeList, ReadingVocabularyPage } from '@/domains/ielts/reading';
import { DictationPracticePage, DictationShadowingPage, DictationVocabularyPage } from '@/domains/ielts/dictation';
import { SpeakingSampleDetailPage, SpeakingSamplesPage, WritingSampleDetailPage, WritingSamplesPage } from '@/domains/ielts/samples';
import { IeltsSpeakingSimPage } from '@/domains/ielts/speaking-sim';
import { IeltsWritingCoachPage } from '@/domains/ielts/writing-coach';
import { StoryExerciseView } from '@/domains/practice/StoryExerciseView';
import { UniGrammarPage } from '@/domains/ecosystem/UniGrammarPage';
import { UniDictionaryPage } from '@/domains/ecosystem/UniDictionaryPage';
import { IeltsKnowledgePage } from '@/domains/ecosystem/IeltsKnowledgePage';

// ─── Lazy Layouts ──────────────────────────────────────────────────────────────
const MarketingLayout = lazy(() => import('./layouts/MarketingLayout').then((m) => ({ default: m.MarketingLayout })));
const AuthLayout      = lazy(() => import('./layouts/AuthLayout').then((m) => ({ default: m.AuthLayout })));
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout').then((m) => ({ default: m.DashboardLayout })));
const AdminLayout     = lazy(() => import('./layouts/AdminLayout').then((m) => ({ default: m.AdminLayout })));
const LmsLayout       = lazy(() => import('./layouts/LmsLayout').then((m) => ({ default: m.LmsLayout })));

export const routes: RouteObject[] = [
  // ─── Public fullscreen pages (no layout) ─────────────────────────────────
  { path: '/tu-hoc-practice', element: <SelfStudyPracticePage /> },
  { path: '/tu-hoc', element: <SelfStudyPracticePage /> },
  { path: '/luyen-thi-ielts/ielts-listening-practice', element: <IeltsListeningPractice /> },
  { path: '/luyen-thi-ielts/ielts-listening-practice/:slug', element: <IeltsListeningPractice /> },
  { path: '/luyen-thi-ielts/ielts-reading-practice', element: <ReadingPracticeList /> },
  { path: '/luyen-thi-ielts/ielts-reading-practice/:slug', element: <IeltsReadingPractice /> },
  { path: '/luyen-thi-ielts/ielts-reading-practice/:slug/answer-key', element: <ReadingAnswerKeyPage /> },
  { path: '/luyen-thi-ielts/ielts-reading-practice/:slug/vocabulary', element: <ReadingVocabularyPage /> },
  { path: '/chep-chinh-ta/:slug', element: <DictationPracticePage /> },
  { path: '/chep-chinh-ta/:slug/shadowing', element: <DictationShadowingPage /> },
  { path: '/chep-chinh-ta/:slug/vocabulary', element: <DictationVocabularyPage /> },
  { path: '/ielts-speaking-sample/part-1', element: <SpeakingSamplesPage /> },
  { path: '/ielts-speaking-sample/part-1/:slug', element: <SpeakingSampleDetailPage /> },
  { path: '/ielts-writing-sample/general-task-1', element: <WritingSamplesPage /> },
  { path: '/ielts-writing-sample/general-task-1/:slug', element: <WritingSampleDetailPage /> },

  // ─── Marketing (public) ───────────────────────────────────────────────────
  {
    element: <MarketingLayout />,
    children: [
      { path: '/', element: <MarketingPage /> },
      { path: '/courses', element: <CoursesPage /> },
      { path: '/courses/:id', element: <CourseDetailPage /> },
      { path: '/cart', element: <CartView /> },
    ],
  },

  // ─── Auth ─────────────────────────────────────────────────────────────────
  {
    element: <RequireGuest />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
          { path: '/lms/login', element: <LmsLoginPage /> },
        ],
      },
    ],
  },

  // ─── Admin (requires admin role, dedicated AdminLayout) ───────────────────
  {
    element: <RequireAdmin />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/admin/users', element: <AdminUsersPage /> },
          { path: '/admin/access', element: <AdminAccessPage /> },
          { path: '/admin/platform-settings', element: <AdminPlatformSettingsPage /> },
          { path: '/admin/feature-flags', element: <AdminFeatureFlagsPage /> },
          { path: '/admin/audit-logs', element: <AdminAuditLogsPage /> },
          { path: '/admin/email-logs', element: <AdminEmailLogsPage /> },
          { path: '/admin/billing', element: <AdminBillingPage /> },
          { path: '/admin/ielts', element: <AdminIELTSContentPage /> },
          { path: '/admin/lms', element: <AdminLmsPage /> },
          { path: '/admin/support', element: <AdminSupportTicketsPage /> },
          { path: '/admin/documents', element: <AdminDocumentPage /> },
          { path: '/admin/writing-review', element: <AdminWritingReviewPage /> },
          { path: '/admin/invoices', element: <AdminInvoicesPage /> },
          { path: '/admin/content', element: <AdminContentPage /> },
          { path: '/admin/mock-tests', element: <AdminMockTestPage /> },
          { path: '/admin/vouchers', element: <AdminVouchersPage /> },
          { path: '/admin/user-access', element: <UserPage /> },
          { path: '/admin/user-access/users', element: <CustomerManagementPage /> },
          { path: '/admin/user-access/roles', element: <RoleManagementPage /> },
          { path: '/admin/user-access/role-permission', element: <RolePermissionPage /> },
          { path: '/admin/user-access/permissions', element: <PermissionPage /> },
          { path: '/admin/user-access/menu', element: <MenuManagementPage /> },
        ],
      },
    ],
  },

  // ─── Authenticated User (requires login, DashboardLayout) ────────────────
  {
    element: <RequireAuth />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/grammar', element: <UniGrammarPage /> },
          { path: '/dictionary', element: <UniDictionaryPage /> },
          { path: '/ielts-knowledge', element: <IeltsKnowledgePage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/billing', element: <BillingPage /> },
          { path: '/speaking', element: <SpeakingPage /> },
          { path: '/story-practice', element: <StoryExerciseView /> },
          { path: '/vocabulary', element: <VocabularyPage /> },
          { path: '/writing', element: <WritingPage /> },
          { path: '/toeic', element: <ToeicHubPage /> },
          { path: '/listening-practice', element: <IeltsListeningPage /> },
          { path: '/reading-practice', element: <IeltsReadingPage /> },
          { path: '/speaking-simulation', element: <IeltsSpeakingSimPage /> },
          { path: '/writing-coach', element: <IeltsWritingCoachPage /> },
        ],
      },
    ],
  },

  // ─── LMS Student Service (Requires login, Standalone LmsLayout) ───────────
  {
    element: <RequireAuth />,
    children: [
      {
        element: <LmsLayout />,
        children: [
          { path: '/lms', element: <LmsDashboardPage /> },
          { path: '/lms/chat', element: <LmsDashboardPage /> },
          { path: '/lms/calendar', element: <LmsDashboardPage /> },
          { path: '/lms/documents', element: <LmsDashboardPage /> },
          { path: '/assignment-review/:id', element: <AssignmentReviewPage /> },
          { path: '/planner', element: <PlannerPage /> },
          { path: '/achievements', element: <AchievementsPage /> },
        ],
      },
    ],
  },

  // ─── Fallback ─────────────────────────────────────────────────────────────
  { path: '*', element: <Navigate replace to="/" /> },
];
