import Link from "next/link";
import { Suspense } from "react";
import CartModal from "@/components/cart/modal";
import LogoSquare from "@/components/logo-square";
import { getMenu } from "@/lib/db/queries";
import type { Menu } from "@/lib/types";
import MobileMenu from "./mobile-menu";
import Search, { SearchSkeleton } from "./search";

export async function Navbar() {
  const menu = await getMenu("header");
  const siteName = process.env.SITE_NAME || "স্বস্থ্যকর";

  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between border-b bg-background/80 p-4 backdrop-blur-md lg:px-6">
      <div className="block flex-none md:hidden">
        <Suspense fallback={null}>
          <MobileMenu menu={menu} />
        </Suspense>
      </div>
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-1/3">
          <Link
            href="/"
            prefetch={true}
            className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
          >
            <LogoSquare />
            <div className="ml-2 flex-none text-base font-bold uppercase tracking-tight md:hidden lg:block text-emerald-800 dark:text-emerald-300">
              {siteName}
            </div>
          </Link>
          {menu.length ? (
            <ul className="hidden gap-6 text-sm font-medium md:flex md:items-center">
              {menu.map((item: Menu) => (
                <li key={item.title}>
                  <Link
                    href={item.path}
                    prefetch={true}
                    className="text-neutral-600 underline-offset-4 transition hover:text-emerald-600 hover:underline dark:text-neutral-300 dark:hover:text-emerald-400"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="hidden justify-center md:flex md:w-1/3">
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
        </div>
        <div className="flex justify-end md:w-1/3">
          <CartModal />
        </div>
      </div>
    </nav>
  );
}
