import Image from "next/image";
import { cn } from "@/lib/utils";

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: "bottom" | "center";
  };
} & React.ComponentProps<typeof Image>) {
  return (
    <div
      className={cn(
        "group relative flex aspect-square size-full items-center justify-center overflow-hidden rounded-2xl border bg-neutral-50/50 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-lg dark:bg-neutral-900/50 dark:hover:border-emerald-500/50",
        {
          "border-2 border-emerald-600": active,
          "border-neutral-200/80 dark:border-neutral-800/80": !active,
        },
      )}
    >
      {props.src ? (
        <Image
          className={cn(
            "relative size-full object-cover transition duration-500 ease-out group-hover:scale-105",
            {
              "transition duration-300 ease-in-out group-hover:scale-105":
                isInteractive,
            },
          )}
          {...props}
        />
      ) : null}
      {label ? (
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between rounded-xl border border-neutral-200/80 bg-white/80 p-2 backdrop-blur-md transition-colors group-hover:border-emerald-500/40 dark:border-neutral-800/80 dark:bg-neutral-950/80">
          <h3 className="line-clamp-1 text-xs font-medium text-neutral-900 dark:text-neutral-100">
            {label.title}
          </h3>
          <span className="shrink-0 rounded-md bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white shadow-xs">
            ${label.amount}
          </span>
        </div>
      ) : null}
    </div>
  );
}
