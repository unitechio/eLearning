import React from 'react';
import { Outlet } from 'react-router-dom';
import { SideNav, TopNav } from "@/shared/components";

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-surface flex">
      <SideNav />
      <main className="ml-64 flex-1 flex flex-col min-h-screen">
        <TopNav />
        <div className="w-full flex-1 flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
