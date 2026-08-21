import Price from "@/components/price";
import { cn } from "@/lib/utils";

export function Label({
  title,
  amount,
  currencyCode,
  position = "bottom",
}: {
  title: string;
  amount: string;
  currencyCode: string;
  position?: "bottom" | "center";
}) {
  return (
    <div
      className={cn(
        "absolute bottom-0 left-0 flex w-full p-4 @container/label",
        {
          "lg:p-8": position === "center",
        },
      )}
    >
      <div className="flex items-center rounded-full border border-neutral-200 bg-white/70 p-1 text-xs font-semibold text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white">
        <h3 className="mr-4 line-clamp-2 grow pl-2 leading-none tracking-tight">
          {title}
        </h3>
        <Price
          className="flex-none rounded-full bg-emerald-600 p-2 text-white"
          amount={amount}
          currencyCode={currencyCode}
          currencyCodeClassName="hidden @[275px]/label:inline"
        />
      </div>
    </div>
  );
}
