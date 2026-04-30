import React, { lazy } from 'react';
import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';
import { DashboardPage } from '@/pages/dashboard/Dashboard';
import { ProfilePage } from '@/pages/dashboard/Profile';
import { AdminUsersPage } from '@/pages/dashboard/AdminUsers';
import { AdminAccessPage } from '@/pages/dashboard/AdminAccess';
import { AdminPlatformSettingsPage } from '@/pages/dashboard/AdminPlatformSettings';
import { AdminFeatureFlagsPage } from '@/pages/dashboard/AdminFeatureFlags';
import { AdminAuditLogsPage } from '@/pages/dashboard/AdminAuditLogs';
import { AdminEmailLogsPage } from '@/pages/dashboard/AdminEmailLogs';
import { BillingPage } from '@/pages/dashboard/Billing';
import { AdminBillingPage } from '@/pages/dashboard/AdminBilling';
import { SpeakingPage } from '@/pages/dashboard/Speaking';
import { VocabularyPage } from '@/pages/dashboard/Vocabulary';
import { WritingPage } from '@/pages/dashboard/Writing';
import { ToeicHubPage } from '@/pages/dashboard/ToeicHub';
import { IeltsListeningPage } from '@/pages/dashboard/IeltsListening';
import { IeltsReadingPage } from '@/pages/dashboard/IeltsReading';
import { IeltsSpeakingSimPage } from '@/pages/dashboard/IeltsSpeakingSim';
import { IeltsWritingCoachPage } from '@/pages/dashboard/IeltsWritingCoach';
import { PlannerPage } from '@/pages/dashboard/Planner';
import { AchievementsPage } from '@/pages/dashboard/Achievements';
import {
  CustomerManagementPage,
  MenuManagementPage,
  PermissionPage,
  RoleManagementPage,
  RolePermissionPage,
  UserPage,
} from '@/pages/user';

const MarketingLayout = lazy(() => import('@/layouts/MarketingLayout').then((m) => ({ default: m.MarketingLayout })));
const AuthLayout = lazy(() => import('@/layouts/AuthLayout').then((m) => ({ default: m.AuthLayout })));
const DashboardLayout = lazy(() => import('@/layouts/DashboardLayout').then((m) => ({ default: m.DashboardLayout })));

const MarketingPage = lazy(() => import('@/pages/marketing/Marketing').then((m) => ({ default: m.MarketingPage })));
const LoginPage = lazy(() => import('@/pages/auth/Login').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/pages/auth/Register').then((m) => ({ default: m.RegisterPage })));

function ProtectedOutlet() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate replace to="/login" />;
}

function GuestOutlet() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Navigate replace to="/dashboard" /> : <Outlet />;
}

export const routes: RouteObject[] = [
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
    element: <GuestOutlet />,
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
    element: <ProtectedOutlet />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/admin/users', element: <AdminUsersPage /> },
          { path: '/admin/access', element: <AdminAccessPage /> },
          { path: '/admin/platform-settings', element: <AdminPlatformSettingsPage /> },
          { path: '/admin/feature-flags', element: <AdminFeatureFlagsPage /> },
          { path: '/admin/audit-logs', element: <AdminAuditLogsPage /> },
          { path: '/admin/email-logs', element: <AdminEmailLogsPage /> },
          { path: '/admin/billing', element: <AdminBillingPage /> },
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
  {
    path: '*',
    element: <Navigate replace to="/" />,
  },
];
