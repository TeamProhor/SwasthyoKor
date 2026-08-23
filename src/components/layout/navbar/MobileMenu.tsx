"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Menu as MenuIcon, X } from "@/components/icons";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Menu } from "@/lib/types";
import Search, { SearchSkeleton } from "./Search";

export default function MobileMenu({ menu }: { menu: Menu[] }) {
  const _pathname = usePathname();
  const _searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={openMobileMenu}
        aria-label="মেনু খুলুন"
        className="flex size-9 sm:size-10 md:size-11 items-center justify-center rounded-lg border border-neutral-200 text-black transition-colors md:hidden dark:border-neutral-700 dark:text-white"
      >
        <MenuIcon className="size-4 sm:size-5" />
      </button>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="flex h-full w-full flex-col bg-white p-6 text-black dark:bg-black dark:text-white"
        >
          <div className="flex items-center justify-between border-b pb-4 dark:border-neutral-800">
            <SheetTitle className="text-lg font-bold">মেনু (Menu)</SheetTitle>
            <button
              type="button"
              onClick={closeMobileMenu}
              aria-label="মেনু বন্ধ করুন"
              className="flex size-9 items-center justify-center rounded-md border border-neutral-200 text-black hover:bg-neutral-100 dark:border-neutral-800 dark:text-white dark:hover:bg-neutral-900"
            >
              <X className="size-5" />
            </button>
          </div>
          <SheetDescription className="sr-only">
            ন্যাভিগেশন মেনু এবং ক্যাটাগরি
          </SheetDescription>

          <div className="mt-4 mb-4">
            <Suspense fallback={<SearchSkeleton />}>
              <Search />
            </Suspense>
          </div>

          {menu.length ? (
            <ul className="flex w-full flex-col gap-4 py-2">
              {menu.map((item: Menu) => (
                <li
                  className="border-b border-neutral-200 pb-2 text-xl text-black transition-colors hover:text-emerald-600 dark:border-neutral-700 dark:text-white dark:hover:text-emerald-400"
                  key={item.title}
                >
                  <Link href={item.path} onClick={closeMobileMenu}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
}
