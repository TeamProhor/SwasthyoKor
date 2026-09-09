"use client";

import { Minus, Plus } from "@/components/icons";
import { cn } from "@/lib/utils";

interface BulkQuantitySelectorProps {
  sellingMode: "gram" | "piece";
  pricePerUnit: number;         // per 100g or per 1 piece
  stockQuantity: number;        // total grams or pieces available
  minimumOrderQuantity: number; // 100 for gram, 1 for piece
  quantity: number;
  onQuantityChange: (qty: number) => void;
  disabled?: boolean;
}

export function BulkQuantitySelector({
  sellingMode,
  pricePerUnit,
  stockQuantity,
  minimumOrderQuantity,
  quantity,
  onQuantityChange,
  disabled = false,
}: BulkQuantitySelectorProps) {
  const isGram = sellingMode === "gram";
  const step = isGram ? 100 : 1;
  const min = minimumOrderQuantity;
  const max = Math.floor(stockQuantity / step) * step || min;

  const decrease = () => {
    const next = Math.max(min, quantity - step);
    onQuantityChange(next);
  };

  const increase = () => {
    const next = Math.min(max, quantity + step);
    onQuantityChange(next);
  };

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseInt(e.target.value, 10);
    const snapped = Math.round(raw / step) * step;
    onQuantityChange(Math.max(min, Math.min(max, snapped)));
  };

  // Price calculation: gram = (qty/100)*pricePerUnit, piece = qty*pricePerUnit
  const price = isGram
    ? (quantity / 100) * pricePerUnit
    : quantity * pricePerUnit;

  const unitLabel = isGram ? "গ্রাম" : "পিস";
  const priceLabel = isGram ? "প্রতি ১০০ গ্রাম" : "প্রতি পিস";

  const stockDisplay = isGram
    ? stockQuantity >= 1000
      ? `${(stockQuantity / 1000).toFixed(1)} কেজি স্টকে আছে`
      : `${stockQuantity} গ্রাম স্টকে আছে`
    : `${stockQuantity} পিস স্টকে আছে`;

  const isLowStock = stockQuantity > 0 && stockQuantity <= (isGram ? 500 : 5);

  return (
    <div className="flex flex-col gap-3">
      {/* Unit price + stock badge */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
        <span className="font-medium">মূল্য:</span>
        <span className="font-bold text-foreground">
          ৳{pricePerUnit.toLocaleString("bn-BD")} / {priceLabel}
        </span>
        <span
          className={cn(
            "ml-auto font-bold flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]",
            !stockQuantity
              ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-900"
              : isLowStock
                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-900 animate-pulse"
                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900",
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              !stockQuantity ? "bg-rose-500" : isLowStock ? "bg-amber-500" : "bg-emerald-500 animate-pulse",
            )}
          />
          {!stockQuantity ? "স্টক শেষ" : stockDisplay}
        </span>
      </div>

      {/* Stepper + live price */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-foreground">পরিমাণ নির্বাচন করুন:</span>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center rounded-xl border border-border bg-card p-1 shadow-2xs">
            <button
              type="button"
              onClick={decrease}
              disabled={disabled || !stockQuantity || quantity <= min}
              className="flex size-8 items-center justify-center rounded-lg hover:bg-muted active:scale-95 disabled:opacity-40 cursor-pointer"
              aria-label="পরিমাণ কমান"
            >
              <Minus className="size-3.5 text-foreground" />
            </button>
            <span className="w-24 text-center text-sm font-bold text-foreground font-mono">
              {quantity} {unitLabel}
            </span>
            <button
              type="button"
              onClick={increase}
              disabled={disabled || !stockQuantity || quantity >= max}
              className="flex size-8 items-center justify-center rounded-lg hover:bg-muted active:scale-95 disabled:opacity-40 cursor-pointer"
              aria-label="পরিমাণ বাড়ান"
            >
              <Plus className="size-3.5 text-foreground" />
            </button>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground">মোট মূল্য</span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono leading-tight">
              ৳{Math.round(price).toLocaleString("bn-BD")}
            </span>
          </div>
        </div>

        {/* Slider */}
        {max > min && (
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={quantity}
            onChange={handleSlider}
            disabled={disabled || !stockQuantity}
            className="w-full h-2 rounded-full accent-emerald-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="পরিমাণ স্লাইডার"
          />
        )}

        <p className="text-[10px] text-muted-foreground">
          {isGram
            ? `প্রতিবার ১০০ গ্রাম বাড়বে/কমবে • সর্বনিম্ন অর্ডার ${min} গ্রাম`
            : `প্রতিবার ১ পিস বাড়বে/কমবে • সর্বনিম্ন অর্ডার ${min} পিস`}
        </p>
      </div>
    </div>
  );
}
