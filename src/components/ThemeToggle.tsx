"use client";

/**
 * components/ThemeToggle.tsx
 *
 * Dark/light mode toggle.
 */

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

// Always English so theme switching stays readable when language is Amharic
const THEME_LABELS = {
  theme: "Theme",
  lightMode: "Light mode",
  darkMode: "Dark mode",
  systemMode: "System",
} as const;

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div
        className={`flex items-center gap-1 ${className ?? ""}`}
        aria-hidden
      />
    );
  }

  const ModeIcon =
    theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  return (
    <div className={`flex items-center gap-1 ${className ?? ""}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
            title={THEME_LABELS.theme}
          >
            <ModeIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 rounded-xl">
          <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground py-2 px-3">
            {THEME_LABELS.theme}
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => setTheme("light")}
            className={theme === "light" ? "text-primary bg-primary/10 mx-1 rounded-lg" : "mx-1 rounded-lg"}
          >
            <Sun className="h-3.5 w-3.5 mr-2" />
            <span className="text-xs font-medium">{THEME_LABELS.lightMode}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme("dark")}
            className={theme === "dark" ? "text-primary bg-primary/10 mx-1 rounded-lg" : "mx-1 rounded-lg"}
          >
            <Moon className="h-3.5 w-3.5 mr-2" />
            <span className="text-xs font-medium">{THEME_LABELS.darkMode}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme("system")}
            className={theme === "system" ? "text-primary bg-primary/10 mx-1 rounded-lg" : "mx-1 rounded-lg"}
          >
            <Monitor className="h-3.5 w-3.5 mr-2" />
            <span className="text-xs font-medium">{THEME_LABELS.systemMode}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
