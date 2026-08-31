"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Star,
  Plus,
  Minus,
  MessageCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
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
  const [quantity, setQuantity] = useState(1);

  const variant =
    product.variants.find((variant) =>
      variant.selectedOptions.every(
        (option) =>
          searchParams.get(option.name.toLowerCase()) === option.value,
      ),
    ) ?? product.variants[0];

  const currentPriceNum = Number(
    variant?.price.amount ?? product.priceRange.minVariantPrice.amount,
  );
  // Calculate regular strikethrough price with ~15-20% discount illusion
  const originalPriceNum = Math.round(currentPriceNum * 1.18);
  const savingsNum = originalPriceNum - currentPriceNum;

  const productSku = `SW-${product.handle.slice(0, 6).toUpperCase()}`;

  const handleAddToCart = () => {
    if (!variant) return;
    for (let i = 0; i < quantity; i++) {
      addCartItem.mutate({ variant, product });
    }
  };

  const whatsappNumber = "8801812345678";
  const whatsappOrderMsg = encodeURIComponent(
    `আসসালামু আলাইকুম, আমি স্বাস্থ্যকর থেকে "${product.title}" (${variant?.title || "ডিফল্ট"}) ${quantity}টি অর্ডার করতে চাই। মূল্য: ৳${currentPriceNum * quantity}।`,
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappOrderMsg}`;

  const scrollToReviews = () => {
    document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* Title & SKU Header */}
      <div className="flex flex-col border-b border-border/40 pb-3 sm:pb-4">
        <div className="flex items-center justify-between gap-2 mb-1.5 text-xs text-muted-foreground">
          <span className="font-mono font-semibold">প্রোডাক্ট কোড: {productSku}</span>
          <span className="font-medium text-emerald-600 dark:text-emerald-400">
            {product.availableForSale && variant?.availableForSale ? "ইন স্টক" : "স্টক শেষ"}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-foreground leading-snug">
          {product.title}
        </h1>

        {/* Rating & Reviews Bar */}
        <div className="mt-2.5 flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="size-3.5 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-1 text-xs font-bold text-foreground">4.9 / 5</span>
          </div>
          <button
            type="button"
            onClick={scrollToReviews}
            className="text-xs text-emerald-600 dark:text-emerald-400 underline underline-offset-4 hover:text-emerald-700 cursor-pointer font-medium"
          >
            ২৪টি রিভিউ দেখুন
          </button>
        </div>

        {/* Price & Savings Display */}
        <div className="mt-4 flex flex-wrap items-baseline gap-3">
          <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            ৳{currentPriceNum}
          </span>
          <span className="text-sm sm:text-base text-muted-foreground line-through decoration-rose-500/70 font-semibold">
            ৳{originalPriceNum}
          </span>
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            ৳{savingsNum} সাশ্রয়
          </span>
        </div>
      </div>

      {/* Product Meta Specs */}
      <div className="grid grid-cols-2 gap-2 rounded-xl border border-border/60 bg-muted/20 p-3 text-xs">
        <div>
          <span className="text-muted-foreground">ব্র্যান্ড: </span>
          <span className="font-bold text-foreground">স্বাস্থ্যকর</span>
        </div>
        <div>
          <span className="text-muted-foreground">পণ্য ধরন: </span>
          <span className="font-bold text-foreground">১০০% প্রাকৃতিক খাদ্য</span>
        </div>
        <div>
          <span className="text-muted-foreground">পরিমাণ (Unit): </span>
          <span className="font-bold text-foreground">{variant?.title || "স্ট্যান্ডার্ড প্যাক"}</span>
        </div>
        <div>
          <span className="text-muted-foreground">ডেলিভারি: </span>
          <span className="font-bold text-foreground">সারা দেশে ক্যাশ অন ডেলিভারি</span>
        </div>
      </div>

      {/* Variant Selector (if multiple variants exist) */}
      <VariantSelector options={product.options} variants={product.variants} />

      {/* Quantity Increment/Decrement Selector */}
      <div className="flex items-center gap-3 pt-1">
        <span className="text-xs font-bold text-foreground">পরিমাণ:</span>
        <div className="flex items-center rounded-xl border border-border bg-card p-1 shadow-2xs">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="flex size-7 items-center justify-center rounded-lg hover:bg-muted active:scale-95 disabled:opacity-40 cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Minus className="size-3.5 text-foreground" />
          </button>
          <span className="w-9 text-center text-xs font-bold text-foreground font-mono">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="flex size-7 items-center justify-center rounded-lg hover:bg-muted active:scale-95 cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus className="size-3.5 text-foreground" />
          </button>
        </div>
        <span className="text-xs text-muted-foreground">
          মোট: ৳{currentPriceNum * quantity}
        </span>
      </div>

      {/* Description Text */}
      {product.descriptionHtml ? (
        <Prose
          className="text-xs sm:text-sm leading-relaxed text-muted-foreground"
          html={product.descriptionHtml}
        />
      ) : null}

      {/* CTA Action Buttons */}
      <div className="flex flex-col gap-2.5 pt-2">
        {/* Direct Checkout (Buy Now) */}
        <Button
          render={
            <Link href={`/checkout/${product.handle}?quantity=${quantity}`}>
              সরাসরি অর্ডার করুন
            </Link>
          }
          size="lg"
          className="w-full rounded-xl bg-emerald-600 text-sm sm:text-base font-bold text-white shadow-md hover:bg-emerald-500 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:cursor-not-allowed"
          disabled={!product.availableForSale || !variant?.availableForSale}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Add To Cart */}
          <Button
            variant="outline"
            size="lg"
            className="w-full rounded-xl border-border text-xs sm:text-sm font-bold disabled:cursor-not-allowed"
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
              <ShoppingBag className="size-4 text-emerald-600" />
            )}
            {product.availableForSale && variant?.availableForSale
              ? addCartItem.isPending
                ? "যোগ হচ্ছে..."
                : `কার্টে যোগ করুন (${quantity})`
              : "স্টক শেষ"}
          </Button>

          {/* WhatsApp 1-Click Order */}
          <Button
            render={
              <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer" />
            }
            variant="outline"
            size="lg"
            className="w-full rounded-xl border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs sm:text-sm font-bold"
          >
            <MessageCircle className="size-4 text-emerald-600" />
            <span>হোয়াটসঅ্যাপে অর্ডার</span>
          </Button>
        </div>
      </div>

      {/* Trust & Guarantee Badges */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/50 text-center">
        <div className="flex flex-col items-center gap-1 rounded-xl p-2 bg-muted/20">
          <Truck className="size-4 text-emerald-600" />
          <span className="text-[10px] font-bold text-foreground">দ্রুত ডেলিভারি</span>
          <span className="text-[9px] text-muted-foreground">২৪-৭২ ঘণ্টায়</span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-xl p-2 bg-muted/20">
          <ShieldCheck className="size-4 text-emerald-600" />
          <span className="text-[10px] font-bold text-foreground">১০০% খাঁটি</span>
          <span className="text-[9px] text-muted-foreground">ল্যাব টেস্টেড</span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-xl p-2 bg-muted/20">
          <RotateCcw className="size-4 text-emerald-600" />
          <span className="text-[10px] font-bold text-foreground">ক্যাশ অন ডেলিভারি</span>
          <span className="text-[9px] text-muted-foreground">পণ্য দেখে পেমেন্ট</span>
        </div>
      </div>
    </div>
  );
}
