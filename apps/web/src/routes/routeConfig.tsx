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
  AdminPlatformSettingsPage,
  AdminSupportTicketsPage,
  AdminUsersPage,
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
import { ToeicHubPage } from '@/domains/course';
import { AchievementsPage, PlannerPage } from '@/domains/engagement';
import { DashboardPage } from '@/domains/learning';
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

const MarketingLayout = lazy(() => import('./layouts/MarketingLayout').then((m) => ({ default: m.MarketingLayout })));
const AuthLayout = lazy(() => import('./layouts/AuthLayout').then((m) => ({ default: m.AuthLayout })));
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout').then((m) => ({ default: m.DashboardLayout })));

export const routes: RouteObject[] = [
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
  {
    element: <MarketingLayout />,
    children: [
      { path: '/', element: <MarketingPage /> },
      { path: '/preview/user', element: <UserPage /> },
      { path: '/preview/user/users', element: <CustomerManagementPage /> },
      { path: '/preview/user/roles', element: <RoleManagementPage /> },
      { path: '/preview/user/role-permission', element: <RolePermissionPage /> },
      { path: '/preview/user/permissions', element: <PermissionPage /> },
      { path: '/preview/user/menu', element: <MenuManagementPage /> },
    ],
  },
  {
    element: <RequireGuest />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
        ],
      },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/billing', element: <BillingPage /> },
          { path: '/planner', element: <PlannerPage /> },
          { path: '/achievements', element: <AchievementsPage /> },
          { path: '/speaking', element: <SpeakingPage /> },
          { path: '/vocabulary', element: <VocabularyPage /> },
          { path: '/writing', element: <WritingPage /> },
          { path: '/toeic', element: <ToeicHubPage /> },
          { path: '/listening-practice', element: <IeltsListeningPage /> },
          { path: '/reading-practice', element: <IeltsReadingPage /> },
          { path: '/speaking-simulation', element: <IeltsSpeakingSimPage /> },
          { path: '/writing-coach', element: <IeltsWritingCoachPage /> },
          {
            element: <RequireAdmin />,
            children: [
              { path: '/admin/users', element: <AdminUsersPage /> },
              { path: '/admin/access', element: <AdminAccessPage /> },
              { path: '/admin/platform-settings', element: <AdminPlatformSettingsPage /> },
              { path: '/admin/feature-flags', element: <AdminFeatureFlagsPage /> },
              { path: '/admin/audit-logs', element: <AdminAuditLogsPage /> },
              { path: '/admin/email-logs', element: <AdminEmailLogsPage /> },
              { path: '/admin/billing', element: <AdminBillingPage /> },
              { path: '/admin/ielts-content', element: <AdminIELTSContentPage /> },
              { path: '/admin/ielts', element: <AdminIELTSContentPage /> },
              { path: '/admin/support-tickets', element: <AdminSupportTicketsPage /> },
              { path: '/admin/support', element: <AdminSupportTicketsPage /> },
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
    ],
  },
  {
    path: '*',
    element: <Navigate replace to="/" />,
  },
];
