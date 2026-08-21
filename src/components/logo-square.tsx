import { LeafIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LogoSquare({ size }: { size?: "sm" | undefined }) {
  return (
    <div
      className={cn(
        "flex size-10 items-center justify-center rounded-xl border border-emerald-600/20 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-400",
        {
          "size-8 rounded-lg": size === "sm",
        },
      )}
    >
      <LeafIcon
        className={cn({
          "size-5": !size,
          "size-4": size === "sm",
        })}
      />
    </div>
  );
}
