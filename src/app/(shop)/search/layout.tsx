import { Suspense } from "react";
import { CollectionsList, FilterList } from "@/components/collection";
import { sorting } from "@/lib/constants";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container-layout page-section-spacing flex flex-col gap-4 sm:gap-6 md:gap-8 text-black md:flex-row dark:text-white">
      <div className="order-first w-full flex-none md:max-w-[200px]">
        <Suspense fallback={null}>
          <CollectionsList />
        </Suspense>
      </div>
      <div className="order-last min-h-[50vh] w-full md:order-none">
        {children}
      </div>
      <div className="order-none md:order-last md:w-[200px] md:flex-none">
        <FilterList list={sorting} title="সাজান (Sort by)" />
      </div>
    </div>
  );
}
