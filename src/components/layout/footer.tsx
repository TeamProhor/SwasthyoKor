import Link from "next/link";
import { Suspense } from "react";
import { CopyrightDate } from "@/components/copyright-date";
import FooterMenu from "@/components/layout/footer-menu";
import LogoSquare from "@/components/logo-square";
import { getMenu } from "@/lib/db/queries";

export default async function Footer() {
  const skeleton =
    "w-full h-6 animate-pulse rounded-sm bg-neutral-200 dark:bg-neutral-700";
  const menu = await getMenu("footer");
  const siteName = process.env.SITE_NAME || "স্বস্থ্যকর";
  const copyrightName = process.env.COMPANY_NAME || siteName;

  return (
    <footer className="border-t border-neutral-200 bg-background text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-12 text-sm md:flex-row md:gap-12 md:px-4 min-[1320px]:px-0">
        <div>
          <Link
            className="flex items-center gap-2 text-black md:pt-1 dark:text-white"
            href="/"
          >
            <LogoSquare size="sm" />
            <span className="font-bold tracking-tight text-emerald-800 dark:text-emerald-400 uppercase">
              {siteName}
            </span>
          </Link>
          <p className="mt-2 max-w-xs text-xs text-muted-foreground">
            ১০০% খাঁটি, প্রাকৃতিক ও অর্গানিক স্বাস্থ্যকর খাদ্যের নির্ভরযোগ্য ঠিকানা।
          </p>
        </div>
        <Suspense
          fallback={
            <div className="flex h-[188px] w-[200px] flex-col gap-2">
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
            </div>
          }
        >
          <FooterMenu menu={menu} />
        </Suspense>
      </div>
      <div className="border-t border-neutral-200 py-6 text-sm dark:border-neutral-800">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 md:flex-row min-[1320px]:px-0">
          <p>
            &copy; <CopyrightDate /> {copyrightName}. সর্বস্বত্ব সংরক্ষিত।
          </p>
          <p className="text-xs text-neutral-500">
            Powered by Next.js 16 & PostgreSQL
          </p>
        </div>
      </div>
    </footer>
  );
}
