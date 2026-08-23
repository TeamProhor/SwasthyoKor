"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { SortFilterItem } from "@/lib/constants";
import { createUrl } from "@/lib/utils";

type PathFilterItem = { title: string; path: string };
type Item = SortFilterItem | PathFilterItem;

function isPathFilterItem(item: Item): item is PathFilterItem {
  return "path" in item;
}

export function FilterList({
  list,
  title,
}: {
  list: Item[];
  title?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <nav>
      {title ? (
        <h3 className="hidden text-xs font-semibold uppercase tracking-wider text-neutral-500 md:block dark:text-neutral-400">
          {title}
        </h3>
      ) : null}

      {/* Mobile Horizontal Pill Scroll */}
      <ul className="flex md:hidden gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
        {list.map((item: Item) => {
          let href = "";
          let active = false;

          if (isPathFilterItem(item)) {
            href = item.path;
            active = pathname === item.path;
          } else {
            const q = searchParams.get("q");
            const newParams = new URLSearchParams(searchParams.toString());
            if (item.slug) {
              newParams.set("sort", item.slug);
            } else {
              newParams.delete("sort");
            }
            if (q) newParams.set("q", q);
            href = createUrl(pathname, newParams);
            active = searchParams.get("sort") === item.slug;
          }

          return (
            <li key={"path" in item ? item.path : (item.slug ?? "default")}>
              <Link
                prefetch={true}
                href={href}
                className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                  active
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700"
                }`}
              >
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Desktop Vertical List */}
      <ul className="hidden md:block py-2">
        {list.map((item: Item, _i) => {
          let href = "";
          let active = false;

          if (isPathFilterItem(item)) {
            href = item.path;
            active = pathname === item.path;
          } else {
            const q = searchParams.get("q");
            const newParams = new URLSearchParams(searchParams.toString());
            if (item.slug) {
              newParams.set("sort", item.slug);
            } else {
              newParams.delete("sort");
            }
            if (q) newParams.set("q", q);
            href = createUrl(pathname, newParams);
            active = searchParams.get("sort") === item.slug;
          }

          return (
            <li
              key={"path" in item ? item.path : (item.slug ?? "default")}
              className="mt-2 flex text-sm text-neutral-600 dark:text-neutral-400"
            >
              <Link
                prefetch={true}
                href={href}
                className={`w-full hover:underline underline-offset-4 ${
                  active
                    ? "font-semibold text-emerald-600 dark:text-emerald-400"
                    : "hover:text-black dark:hover:text-white"
                }`}
              >
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default FilterList;
