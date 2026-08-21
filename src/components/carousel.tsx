import Image from "next/image";
import Link from "next/link";
import { getCollectionProducts } from "@/lib/db/queries";

export async function Carousel() {
  const products = await getCollectionProducts({
    collection: "hidden-homepage-carousel",
  });

  if (!products?.length) return null;

  const carouselProducts = [...products, ...products];

  return (
    <div className="w-full overflow-x-auto pb-6 pt-1 [scrollbar-width:none]">
      <ul className="flex animate-carousel gap-4">
        {carouselProducts.map((product, i) => (
          <li
            key={`${product.handle}-${i}`}
            className="group relative h-[260px] w-2/3 max-w-[340px] flex-none overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-50/50 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-lg sm:w-1/2 md:w-1/3 lg:w-1/4 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-emerald-500/50"
          >
            <Link
              href={`/product/${product.handle}`}
              className="relative flex size-full items-center justify-center p-4"
              prefetch={true}
            >
              {product.featuredImage?.url ? (
                <Image
                  src={product.featuredImage.url}
                  alt={product.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              ) : null}

              <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between rounded-xl border border-neutral-200/80 bg-white/80 p-2 backdrop-blur-md transition-colors group-hover:border-emerald-500/40 dark:border-neutral-800/80 dark:bg-neutral-950/80">
                <h3 className="line-clamp-1 text-xs font-medium text-neutral-900 dark:text-neutral-100">
                  {product.title}
                </h3>
                <span className="shrink-0 rounded-md bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white shadow-xs">
                  ${product.priceRange.maxVariantPrice.amount}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
