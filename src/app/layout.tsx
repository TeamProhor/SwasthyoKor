import type { ReactNode } from "react";

import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "@/components/ui/toast";
import { WelcomeToast } from "@/components/welcome-toast";
import "./globals.css";
import localFont from "next/font/local";
import { baseUrl, cn } from "@/lib/utils";

const hindSiliguri = localFont({
  src: [
    {
      path: "../fonts/HindSiliguri-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/HindSiliguri-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/HindSiliguri-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

const siteName = process.env.SITE_NAME || "স্বাস্থ্যকর";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `SwasthyoKor — The Symbol of Faith and Trust | ${siteName}`,
    template: `%s | SwasthyoKor — The Symbol of Faith and Trust`,
  },
  description:
    "স্বাস্থ্যকর (SwasthyoKor) — The Symbol of Faith and Trust. ১০০% খাঁটি, প্রাকৃতিক ও নিরাপদ পণ্যের বিশ্বস্ত গন্তব্য।",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
  openGraph: {
    title: "SwasthyoKor — The Symbol of Faith and Trust",
    description:
      "স্বাস্থ্যকর (SwasthyoKor) — The Symbol of Faith and Trust. ১০০% খাঁটি, প্রাকৃতিক ও নিরাপদ পণ্যের বিশ্বস্ত গন্তব্য।",
    siteName: "SwasthyoKor",
    images: [
      {
        url: "/icon.png",
        width: 640,
        height: 640,
        alt: "SwasthyoKor — The Symbol of Faith and Trust",
      },
    ],
    type: "website",
  },
  robots: {
    follow: true,
    index: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="bn" className={cn("font-sans", hindSiliguri.variable)}>
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-emerald-300 dark:selection:bg-emerald-800">
        <QueryProvider>
          {children}
          <Toaster />
          <WelcomeToast />
        </QueryProvider>
      </body>
    </html>
  );
}
