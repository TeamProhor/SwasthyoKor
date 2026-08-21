import { Suspense } from "react";
import { Carousel } from "@/components/carousel";
import { ThreeItemGrid } from "@/components/grid/three-items";

export const metadata = {
  description:
    "স্বস্থ্যকর — খাঁটি সুন্দরবন মধু, ঘানি ভাঙা সরিষার তেল, গাওয়া ঘি ও সেরা অর্গানিক সুপারফুড।",
  openGraph: {
    type: "website",
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6 py-6">
      <Suspense
        fallback={
          <div className="mx-auto grid max-w-(--breakpoint-2xl) animate-pulse gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2">
            <div className="h-[400px] rounded-lg bg-neutral-200 md:col-span-4 md:row-span-2 dark:bg-neutral-800" />
            <div className="h-[200px] rounded-lg bg-neutral-200 md:col-span-2 md:row-span-1 dark:bg-neutral-800" />
            <div className="h-[200px] rounded-lg bg-neutral-200 md:col-span-2 md:row-span-1 dark:bg-neutral-800" />
          </div>
        }
      >
        <ThreeItemGrid />
      </Suspense>

      <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
          🌿 সকল অর্গানিক পণ্য ও সুপারফুড
        </h2>
      </div>

      <Suspense
        fallback={
          <div className="flex w-full animate-pulse gap-4 overflow-hidden px-4">
            <div className="h-[200px] w-1/3 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-[200px] w-1/3 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-[200px] w-1/3 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
          </div>
        }
      >
        <Carousel />
      </Suspense>
    </div>
  );
}
