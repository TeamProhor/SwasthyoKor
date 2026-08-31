"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/lib/types";

export function WishlistManager({ products }: { products: Product[] }) {
  const [wishlist, setWishlist] = useState<Product[]>(products);

  const handleRemove = (handle: string) => {
    setWishlist((prev) => prev.filter((p) => p.handle !== handle));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            আপনার পছন্দের পণ্যসমূহ
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            মোট {wishlist.length}টি পণ্য সংরক্ষিত রয়েছে।
          </p>
        </div>
        <Button
          render={<Link href="/search" />}
          variant="outline"
          size="sm"
          className="rounded-xl border-border"
        >
          <ShoppingBag className="size-4" />
          <span>আরও পণ্য দেখুন</span>
        </Button>
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 p-8 sm:p-12 text-center bg-card">
          <div className="flex size-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 mb-3">
            <Heart className="size-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">আপনার পছন্দের তালিকা খালি</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            ব্রাউজ করার সময় পছন্দের পণ্যগুলো সেভ করে রাখুন।
          </p>
          <Button
            render={<Link href="/search" />}
            size="sm"
            className="mt-4 rounded-xl bg-emerald-600 font-bold text-white shadow-xs hover:bg-emerald-500"
          >
            <span>পণ্য ব্রাউজ করুন</span>
            <ArrowRight className="size-3.5 ml-1" />
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map((product) => (
            <Card
              key={product.handle}
              className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-all hover:border-emerald-500/40"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {product.featuredImage?.url ? (
                  <Image
                    src={product.featuredImage.url}
                    alt={product.title}
                    fill
                    sizes="(min-width: 1024px) 300px, 100vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : null}
              </div>
              <CardContent className="p-4 flex flex-col justify-between gap-3">
                <div>
                  <h3 className="line-clamp-1 text-sm font-bold text-foreground">
                    {product.title}
                  </h3>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                      ৳{product.priceRange.maxVariantPrice.amount}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                      ইন স্টক
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                  <Button
                    render={<Link href={`/product/${product.handle}`} />}
                    size="sm"
                    className="flex-1 rounded-xl bg-emerald-600 font-bold text-white hover:bg-emerald-500 text-xs"
                  >
                    <ShoppingBag className="size-3.5" />
                    <span>পণ্য দেখুন</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(product.handle)}
                    className="size-8 p-0 text-muted-foreground hover:text-red-500 rounded-lg"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
