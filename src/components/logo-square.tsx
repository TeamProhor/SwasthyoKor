import Image from "next/image";
import { cn } from "@/lib/utils";

export default function LogoSquare({ size }: { size?: "sm" | undefined }) {
  return (
    <div
      className={cn(
        "relative flex size-10 overflow-hidden items-center justify-center rounded-xl border border-emerald-600/20 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-950/40",
        {
          "size-8 rounded-lg": size === "sm",
        },
      )}
    >
      <Image
        src="/icon.png"
        alt="স্বাস্থ্যকর"
        fill
        sizes="40px"
        className="object-contain p-0.5"
        priority
      />
    </div>
  );
}
