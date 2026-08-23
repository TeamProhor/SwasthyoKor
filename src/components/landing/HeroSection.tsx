import Link from "next/link";
import { BagShopping, Leaf } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 py-12 sm:py-16 md:py-24">
      {/* Glowing Ambient Blobs */}
      <div className="pointer-events-none absolute inset-0 flex justify-center opacity-30 dark:opacity-20">
        <div className="size-[420px] sm:size-[500px] rounded-full bg-emerald-300 mix-blend-multiply blur-3xl dark:bg-emerald-900" />
        <div className="-ml-32 mt-12 size-[380px] sm:size-[450px] rounded-full bg-amber-200 mix-blend-multiply blur-3xl dark:bg-amber-900" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-700 backdrop-blur-xs dark:border-emerald-400/30 dark:bg-emerald-950/60 dark:text-emerald-300">
          <Leaf className="size-3.5" />
          <span>১০০% প্রাকৃতিক ও কেমিক্যালমুক্ত</span>
        </div>

        <h1 className="mb-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.2]">
          খাঁটি পণ্যের <br />
          <span className="text-emerald-700 dark:text-amber-400">বিশ্বস্ত গন্তব্য</span>
        </h1>

        <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
          আমাদের নিজস্ব বাগান ও বিশ্বস্ত সোর্স থেকে বাছাইকৃত। রাসায়নিক ও ফরমালিন মুক্ত বিশুদ্ধতার নিশ্চয়তা।
        </p>

        <div className="flex justify-center">
          <Button
            render={<Link href="#collection-section" />}
            size="lg"
            className="rounded-full bg-emerald-700 px-8 font-bold text-white shadow-lg hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700"
          >
            <BagShopping data-icon="inline-start" />
            পণ্য দেখুন
          </Button>
        </div>
      </div>
    </section>
  );
}
