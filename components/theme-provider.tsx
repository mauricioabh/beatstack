"use client";

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      // React 19 warns on <script> in client trees; FOUC prevention runs from layout <head>.
      scriptProps={{ type: "application/json" }}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
