import React, { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';

/**
 * Optimized Lazy Loading Pattern for Named Exports.
 * As suggested by the user to ensure production-grade performance.
 */
const MarketingLayout = lazy(() =>
  import('@/layouts/MarketingLayout').then((m) => ({ default: m.MarketingLayout }))
);
const AuthLayout = lazy(() =>
  import('@/layouts/AuthLayout').then((m) => ({ default: m.AuthLayout }))
);
const DashboardLayout = lazy(() =>
  import('@/layouts/DashboardLayout').then((m) => ({ default: m.DashboardLayout }))
);

const MarketingPage = lazy(() =>
  import('@/pages/marketing/Marketing').then((m) => ({ default: m.MarketingPage }))
);
const LoginPage = lazy(() =>
  import('@/pages/auth/Login').then((m) => ({ default: m.LoginPage }))
);
const DashboardPage = lazy(() =>
  import('@/pages/dashboard/Dashboard').then((m) => ({ default: m.DashboardPage }))
);
const SpeakingPage = lazy(() =>
  import('@/pages/dashboard/Speaking').then((m) => ({ default: m.SpeakingPage }))
);
const VocabularyPage = lazy(() =>
  import('@/pages/dashboard/Vocabulary').then((m) => ({ default: m.VocabularyPage }))
);
const WritingPage = lazy(() =>
  import('@/pages/dashboard/Writing').then((m) => ({ default: m.WritingPage }))
);

const IeltsListeningPage = lazy(() =>
  import('@/pages/dashboard/IeltsListening').then((m) => ({ default: m.IeltsListeningPage }))
);
const IeltsReadingPage = lazy(() =>
  import('@/pages/dashboard/IeltsReading').then((m) => ({ default: m.IeltsReadingPage }))
);
const IeltsSpeakingSimPage = lazy(() =>
  import('@/pages/dashboard/IeltsSpeakingSim').then((m) => ({ default: m.IeltsSpeakingSimPage }))
);
const IeltsWritingCoachPage = lazy(() =>
  import('@/pages/dashboard/IeltsWritingCoach').then((m) => ({ default: m.IeltsWritingCoachPage }))
);

/**
 * routes configuration array used by useRoutes hook.
 */
export const routes: RouteObject[] = [
  {
    element: <MarketingLayout />,
    children: [
      { path: '/', element: <MarketingPage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <Navigate to="/login" replace /> },
    ],
  },
  {
    element: <DashboardLayout />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/speaking', element: <SpeakingPage /> },
      { path: '/vocabulary', element: <VocabularyPage /> },
      { path: '/writing', element: <WritingPage /> },
      
      { path: '/listening-practice', element: <IeltsListeningPage /> },
      { path: '/reading-practice', element: <IeltsReadingPage /> },
      { path: '/speaking-simulation', element: <IeltsSpeakingSimPage /> },
      { path: '/writing-coach', element: <IeltsWritingCoachPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];
