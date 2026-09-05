"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowLeft2, ArrowRight, ArrowRight2 } from "@/components/icons";
import { ProductCard } from "@/components/product";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";

interface CategoryProductSliderProps {
  title: string;
  subtitle?: string | null;
  handle: string;
  products: Product[];
}

export function CategoryProductSlider({
  title,
  subtitle,
  handle,
  products,
}: CategoryProductSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const offset = direction === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="flex flex-col gap-3 sm:gap-4">
      {/* Category Header */}
      <div className="flex items-center justify-between border-b border-border/50 pb-3 sm:pb-4 gap-3">
        <div className="min-w-0 flex-1">
          <Link
            href={`/category/${handle}`}
            className="group block max-w-full"
          >
            <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight text-foreground truncate group-hover:text-primary transition-colors">
              {title}
            </h2>
          </Link>
          {subtitle && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
              {subtitle}
            </p>
          )}
        </div>

        {/* Navigation Arrows only (all screens) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            aria-label="Previous products"
            className="size-8 sm:size-9 rounded-full bg-background/90 hover:bg-accent cursor-pointer border-border shadow-2xs"
          >
            <ArrowLeft2 className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            aria-label="Next products"
            className="size-8 sm:size-9 rounded-full bg-background/90 hover:bg-accent cursor-pointer border-border shadow-2xs"
          >
            <ArrowRight2 className="size-4" />
          </Button>
        </div>
      </div>

      {/* Horizontal Scrollable Slider Row */}
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
      >
        {products.map((product) => (
          <div
            key={product.handle}
            className="w-[160px] sm:w-[210px] md:w-[240px] lg:w-[260px] shrink-0"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
