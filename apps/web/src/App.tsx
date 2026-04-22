import React from "react";
import { AppProviders } from "@/app/providers";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/routers";
import "@/app/styles/globals.css";

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProviders>
  );
}
