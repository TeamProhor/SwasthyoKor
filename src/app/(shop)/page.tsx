import { Suspense } from "react";
import { ThreeItemGrid } from "@/components/grid";
import {
  CategorySlider,
  CollectionTabsSection,
  HeroSection,
  ResellerBanner,
} from "@/components/landing";

import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "SwasthyoKor — The Symbol of Faith and Trust | স্বাস্থ্যকর",
  description:
    "স্বাস্থ্যকর (SwasthyoKor) — The Symbol of Faith and Trust. খাঁটি সুন্দরবন মধু, ঘানি ভাঙা সরিষার তেল, গাওয়া ঘি ও সেরা অর্গানিক সুপারফুড।",
  openGraph: {
    title: "SwasthyoKor — The Symbol of Faith and Trust",
    description:
      "স্বাস্থ্যকর (SwasthyoKor) — The Symbol of Faith and Trust. খাঁটি সুন্দরবন মধু, ঘানি ভাঙা সরিষার তেল, গাওয়া ঘি ও সেরা অর্গানিক সুপারফুড।",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 640,
        height: 640,
        alt: "SwasthyoKor — The Symbol of Faith and Trust",
      },
    ],
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <CategorySlider />
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:py-6">
        <Suspense
          fallback={
            <div className="grid gap-3 sm:gap-4 md:grid-cols-6 md:grid-rows-2">
              <Skeleton className="h-[280px] sm:h-[380px] md:h-[480px] rounded-2xl md:col-span-4 md:row-span-2" />
              <Skeleton className="h-[180px] sm:h-[220px] rounded-2xl md:col-span-2 md:row-span-1" />
              <Skeleton className="h-[180px] sm:h-[220px] rounded-2xl md:col-span-2 md:row-span-1" />
            </div>
          }
        >
          <ThreeItemGrid />
        </Suspense>
      </div>
      <CollectionTabsSection />
      <ResellerBanner />
    </div>
  );
}
