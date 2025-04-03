"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { AppProvider } from "./AppContext";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <AppProvider>{children}</AppProvider>
    </ThemeProvider>
  );
}
