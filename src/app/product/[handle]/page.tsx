import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Gallery } from "@/components/product/gallery";
import { ProductDescription } from "@/components/product/product-description";
import { getProduct, getProductRecommendations } from "@/lib/db/queries";
import type { Image as ImageType } from "@/lib/types";

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await props.params;
  const product = await getProduct(handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};

  return {
    title: `${product.seo.title || product.title} | স্বস্থ্যকর`,
    description: product.seo.description || product.description,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt,
            },
          ],
        }
      : null,
  };
}

export default async function ProductPage(props: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await props.params;
  const product = await getProduct(handle);

  if (!product) return notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage?.url ?? "",
    offers: {
      "@type": "AggregateOffer",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4 py-8">
        <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:p-10 lg:flex-row lg:gap-12 dark:border-neutral-800 dark:bg-black">
          <div className="size-full basis-full lg:basis-4/6">
            <Suspense
              fallback={
                <div className="relative aspect-square size-full max-h-[550px] animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-900" />
              }
            >
              <Gallery
                images={product.images.slice(0, 5).map((image: ImageType) => ({
                  src: image.url,
                  altText: image.altText,
                }))}
              />
            </Suspense>
          </div>

          <div className="basis-full lg:basis-2/6">
            <Suspense fallback={null}>
              <ProductDescription product={product} />
            </Suspense>
          </div>
        </div>

        <Suspense fallback={null}>
          <RelatedProducts id={product.id} />
        </Suspense>
      </div>
    </>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts.length) return null;

  return (
    <div className="py-12">
      <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground">
        সম্পর্কিত অন্যান্য পণ্য (Related Products)
      </h2>
      <ul className="flex w-full gap-4 overflow-x-auto pb-4 pt-1 [scrollbar-width:none]">
        {relatedProducts.map((product) => (
          <li
            key={product.handle}
            className="group relative h-[260px] w-[220px] flex-none overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-50/50 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-emerald-500/50"
          >
            <Link
              className="relative flex size-full items-center justify-center p-4"
              href={`/product/${product.handle}`}
              prefetch={true}
            >
              {product.featuredImage?.url ? (
                <Image
                  src={product.featuredImage.url}
                  alt={product.title}
                  fill
                  sizes="(min-width: 1024px) 20vw, 220px"
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
