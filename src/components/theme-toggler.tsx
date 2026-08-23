"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Moon, Sun } from "@/components/icons";
import { cn } from "@/lib/utils";

interface ThemeTogglerProps extends React.ComponentPropsWithoutRef<"button"> {
  variant?: "circle" | "square";
}

export function ThemeToggler({
  className,
  variant = "circle",
  ...props
}: ThemeTogglerProps) {
  const [isDark, setIsDark] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = useCallback(() => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className={cn(
        "flex size-8 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-xs hover:bg-muted active:scale-95 transition-all cursor-pointer",
        className,
      )}
      {...props}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
