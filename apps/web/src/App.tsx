import React from "react";
import QueryProvider from "@/providers/QueryProvider";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import "./globals.css";

export default function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryProvider>
  );
}
