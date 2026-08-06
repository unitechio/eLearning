import React from "react";
import { AppProviders } from "@/app/providers";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/routes";
import { Toaster } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import "@/assets/styles/globals.css";

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <TooltipProvider delayDuration={200}>
          <AppRoutes />
        </TooltipProvider>
        <Toaster position="top-right" />
      </BrowserRouter>
    </AppProviders>
  );
}
