import {
  BentoShowcase,
  CollectionTabsSection,
  FeatureBar,
  HeroSection,
  QuoteSection,
  ResellerBanner,
} from "@/components/landing";

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
      <FeatureBar />
      <BentoShowcase />
      <CollectionTabsSection />
      <QuoteSection />
      <ResellerBanner />
    </div>
  );
}
