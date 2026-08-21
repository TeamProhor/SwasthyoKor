import Image from "next/image";
import Link from "next/link";
import { getCollectionProducts } from "@/lib/db/queries";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

function ThreeItemGridItem({
  item,
  size,
  priority,
}: {
  item: Product;
  size: "full" | "half";
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative group overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-50/50 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-emerald-500/50",
        size === "full"
          ? "min-h-[360px] md:min-h-[480px] md:col-span-4 md:row-span-2"
          : "min-h-[220px] md:min-h-[230px] md:col-span-2 md:row-span-1",
      )}
    >
      <Link
        className="relative flex size-full items-center justify-center p-6"
        href={`/product/${item.handle}`}
        prefetch={true}
      >
        {item.featuredImage?.url ? (
          <Image
            src={item.featuredImage.url}
            alt={item.title}
            fill
            priority={priority}
            sizes={
              size === "full"
                ? "(min-width: 768px) 66vw, 100vw"
                : "(min-width: 768px) 33vw, 100vw"
            }
            className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : null}

        <div
          className={cn(
            "absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between rounded-xl border border-neutral-200/80 bg-white/80 p-2 backdrop-blur-md transition-colors group-hover:border-emerald-500/40 dark:border-neutral-800/80 dark:bg-neutral-950/80",
            size === "full" && "md:bottom-6 md:left-6 md:right-6 md:p-3",
          )}
        >
          <h3
            className={cn(
              "line-clamp-1 font-medium text-neutral-900 dark:text-neutral-100",
              size === "full"
                ? "text-sm md:text-base font-semibold"
                : "text-xs md:text-sm",
            )}
          >
            {item.title}
          </h3>
          <span className="shrink-0 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white shadow-xs">
            ${item.priceRange.maxVariantPrice.amount}{" "}
            {item.priceRange.maxVariantPrice.currencyCode}
          </span>
        </div>
      </Link>
    </div>
  );
}

export async function ThreeItemGrid() {
  const homepageItems = await getCollectionProducts({
    collection: "hidden-homepage-featured-items",
  });

  if (!homepageItems[0] || !homepageItems[1] || !homepageItems[2]) return null;

  const [firstProduct, secondProduct, thirdProduct] = homepageItems;

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2">
      <ThreeItemGridItem size="full" item={firstProduct} priority={true} />
      <ThreeItemGridItem size="half" item={secondProduct} priority={true} />
      <ThreeItemGridItem size="half" item={thirdProduct} />
    </section>
  );
}
