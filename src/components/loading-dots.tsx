import { cn } from "@/lib/utils";

export default function LoadingDots({ className }: { className?: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span
        className={cn(
          "size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]",
          className,
        )}
      />
      <span
        className={cn(
          "size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]",
          className,
        )}
      />
      <span
        className={cn(
          "size-1.5 animate-bounce rounded-full bg-current",
          className,
        )}
      />
    </span>
  );
}
