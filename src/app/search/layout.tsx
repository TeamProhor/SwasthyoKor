import { Suspense } from "react";
import { sorting } from "@/lib/constants";
import CollectionsList from "./collections-list";
import FilterList from "./filter-list";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-(--breakpoint-2xl) flex-col gap-8 px-4 pb-4 pt-6 text-black md:flex-row dark:text-white">
      <div className="order-first w-full flex-none md:max-w-[200px]">
        <Suspense fallback={null}>
          <CollectionsList />
        </Suspense>
      </div>
      <div className="order-last min-h-screen w-full md:order-none">
        {children}
      </div>
      <div className="order-none md:order-last md:w-[200px] md:flex-none">
        <FilterList list={sorting} title="সাজান (Sort by)" />
      </div>
    </div>
  );
}
