"use client";

import { cn } from "@/lib/utils";

export function LanguageToggler({
  lang: _lang = "bn",
  className,
}: {
  lang?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs font-semibold text-muted-foreground",
        className,
      )}
    >
      <span className="text-foreground font-bold">বাংলা</span>
      <span>/</span>
      <span>EN</span>
    </div>
  );
}
