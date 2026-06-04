"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="flex h-7 w-[4.5rem] shrink-0 items-center justify-center"
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex items-center gap-1.5">
      <Sun className="size-3 text-muted-foreground" aria-hidden />
      <Switch
        id="theme-toggle"
        size="sm"
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      />
      <Moon className="size-3 text-muted-foreground" aria-hidden />
      <Label htmlFor="theme-toggle" className="sr-only">
        Dark mode
      </Label>
    </div>
  );
}
