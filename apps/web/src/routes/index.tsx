import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MarketingLayout from '@/layouts/MarketingLayout';
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';

// Pages
import MarketingPage from '@/pages/marketing/Marketing';
import LoginPage from '@/pages/auth/Login';
import DashboardPage from '@/pages/dashboard/Dashboard';
import SpeakingPage from '@/pages/dashboard/Speaking';
import VocabularyPage from '@/pages/dashboard/Vocabulary';
import WritingPage from '@/pages/dashboard/Writing';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Marketing Routes */}
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<MarketingPage />} />
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Navigate to="/login" replace />} />
      </Route>

      {/* Dashboard Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/speaking" element={<SpeakingPage />} />
        <Route path="/vocabulary" element={<VocabularyPage />} />
        <Route path="/writing" element={<WritingPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
