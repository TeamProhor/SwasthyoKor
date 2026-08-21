"use client";

import { ShoppingBagIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Price from "@/components/price";
import { Prose } from "@/components/prose";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@/lib/types";
import { VariantSelector } from "./variant-selector";

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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-foreground">
          {product.title}
        </h1>
        <div className="mr-auto w-auto rounded-full bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white">
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

      <Button
        size="lg"
        className="w-full rounded-full bg-emerald-600 text-base font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed"
        disabled={
          !product.availableForSale ||
          !variant?.availableForSale ||
          addCartItem.isPending
        }
        onClick={handleAddToCart}
      >
        <ShoppingBagIcon data-icon="inline-start" />
        {product.availableForSale && variant?.availableForSale
          ? addCartItem.isPending
            ? "কার্টে যুক্ত হচ্ছে..."
            : "কার্টে যুক্ত করুন (Add to Cart)"
          : "স্টক শেষ (Out of Stock)"}
      </Button>
    </div>
  );
}
