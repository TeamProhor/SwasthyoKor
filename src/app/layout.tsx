import type { ReactNode } from "react";
import Footer from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "@/components/ui/toast";
import { WelcomeToast } from "@/components/welcome-toast";
import "./globals.css";
import { Hind_Siliguri } from "next/font/google";
import { baseUrl, cn } from "@/lib/utils";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const siteName = process.env.SITE_NAME || "স্বস্থ্যকর";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${siteName} | খাঁটি ও অর্গানিক পণ্যের স্টোর`,
    template: `%s | ${siteName}`,
  },
  description: "১০০% খাঁটি ও অর্গানিক পণ্যের আধুনিক অনলাইন মার্কেটপ্লেস।",
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
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
          <WelcomeToast />
        </QueryProvider>
      </body>
    </html>
  );
}
