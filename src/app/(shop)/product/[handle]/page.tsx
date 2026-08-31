import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Price from "@/components/price";
import { Gallery, ProductDescription } from "@/components/product";
import { Skeleton } from "@/components/ui/skeleton";
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
    title: `${product.seo.title || product.title} | স্বাস্থ্যকর`,
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

import { ProductReviews } from "@/components/product/ProductReviews";

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
    image: product.featuredImage?.url,
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
      <div className="container-layout page-section-spacing">
        <div className="flex flex-col border-0 sm:border sm:border-border/60 bg-transparent sm:bg-card sm:rounded-3xl sm:p-6 md:p-8 sm:shadow-sm lg:flex-row lg:gap-12">
          <div className="size-full basis-full lg:basis-4/6">
            <Suspense
              fallback={
                <Skeleton className="aspect-square size-full max-h-[400px] sm:max-h-[550px] rounded-2xl md:rounded-3xl" />
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

          <div className="basis-full pt-4 lg:pt-0 lg:basis-2/6">
            <Suspense fallback={null}>
              <ProductDescription product={product} />
            </Suspense>
          </div>
        </div>

        {/* Customer Reviews & Ratings Section */}
        <ProductReviews
          productTitle={product.title}
          productHandle={product.handle}
        />

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
    <div className="py-8 sm:py-12">
      <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold tracking-tight text-foreground">
        সম্পর্কিত অন্যান্য পণ্য
      </h2>
      <ul className="flex w-full gap-3 sm:gap-4 overflow-x-auto pb-4 pt-1 [scrollbar-width:none]">
        {relatedProducts.map((product) => (
          <li
            key={product.handle}
            className="group relative h-[240px] sm:h-[260px] w-[180px] sm:w-[220px] flex-none overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:border-emerald-500/50 hover:shadow-md"
          >
            <Link
              className="relative flex size-full items-center justify-center p-3 sm:p-4"
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

              <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 z-10 flex items-center justify-between rounded-xl border border-border/60 bg-background/85 p-2 backdrop-blur-md transition-colors group-hover:border-emerald-500/40">
                <h3 className="line-clamp-1 text-xs font-medium text-foreground">
                  {product.title}
                </h3>
                <Price
                  className="shrink-0 rounded-md bg-emerald-600 px-1.5 py-0.5 sm:px-2 text-[11px] sm:text-xs font-semibold text-white shadow-xs"
                  amount={product.priceRange.maxVariantPrice.amount}
                  currencyCode={product.priceRange.maxVariantPrice.currencyCode}
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
