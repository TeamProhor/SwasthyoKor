"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BagShopping } from "@/components/icons";
import Price from "@/components/price";
import { Prose } from "@/components/prose";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@/lib/types";
import { VariantSelector } from "./VariantSelector";

export function ProductDescription({ product }: { product: Product }) {
  const searchParams = useSearchParams();
  const { addCartItem } = useCart();

  const variant =
    product.variants.find((variant) =>
      variant.selectedOptions.every(
        (option) =>
          searchParams.get(option.name.toLowerCase()) === option.value,
      ),
    ) ?? product.variants[0];

  const handleAddToCart = () => {
    if (!variant) return;
    addCartItem.mutate({ variant, product });
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col border-b pb-4 sm:pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          {product.title}
        </h1>
        <div className="mr-auto w-auto rounded-full bg-emerald-600 px-3 py-1 text-xs sm:text-sm font-semibold text-white">
          <Price
            amount={
              variant?.price.amount ?? product.priceRange.minVariantPrice.amount
            }
            currencyCode={
              variant?.price.currencyCode ??
              product.priceRange.minVariantPrice.currencyCode
            }
          />
        </div>
      </div>

      <VariantSelector options={product.options} variants={product.variants} />

      {product.descriptionHtml ? (
        <Prose
          className="text-sm leading-relaxed text-muted-foreground"
          html={product.descriptionHtml}
        />
      ) : null}

      <div className="flex flex-col gap-2.5">
        <Button
          render={
            <Link href={`/checkout/${product.handle}`}>সরাসরি অর্ডার করুন</Link>
          }
          size="lg"
          className="w-full rounded-xl bg-emerald-600 text-base font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed shadow-xs"
          disabled={!product.availableForSale || !variant?.availableForSale}
        />

        <Button
          variant="outline"
          size="lg"
          className="w-full rounded-xl border-border text-base font-semibold disabled:cursor-not-allowed"
          disabled={
            !product.availableForSale ||
            !variant?.availableForSale ||
            addCartItem.isPending
          }
          onClick={handleAddToCart}
        >
          {addCartItem.isPending ? (
            <Spinner className="size-4 text-current" />
          ) : (
            <BagShopping data-icon="inline-start" />
          )}
          {product.availableForSale && variant?.availableForSale
            ? addCartItem.isPending
              ? "কার্টে যুক্ত হচ্ছে..."
              : "কার্টে যোগ করুন"
            : "স্টক শেষ"}
        </Button>
      </div>
    </div>
  );
}
