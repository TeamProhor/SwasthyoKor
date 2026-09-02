"use client";

import type { ProductOption, ProductVariant } from "@/lib/types";
import { cn } from "@/lib/utils";

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

export function VariantSelector({
  options,
  variants,
  selectedOptions,
  onOptionSelect,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
  selectedOptions: Record<string, string>;
  onOptionSelect: (optionName: string, value: string) => void;
}) {
  const hasNoOptionsOrJustOneOption =
    !options.length ||
    (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: Combination[] = variants.map((variant) => {
    const selectedOptionsMap: Record<string, string> = {};
    for (const option of variant.selectedOptions) {
      selectedOptionsMap[option.name.toLowerCase()] = option.value;
    }

    return {
      id: variant.id,
      availableForSale: variant.availableForSale,
      ...selectedOptionsMap,
    };
  });

  return options.map((option) => (
    <dl className="mb-4" key={option.id}>
      <dt className="mb-2 text-xs font-bold text-foreground">
        {option.name}:
      </dt>
      <dd className="flex flex-wrap gap-2.5">
        {option.values.map((value) => {
          const optionNameLowerCase = option.name.toLowerCase();

          // Calculate tentative options to check availability
          const currentCombination = {
            ...selectedOptions,
            [optionNameLowerCase]: value,
          };

          const isAvailableForSale = combinations.some((combination) =>
            Object.entries(currentCombination).every(
              ([key, val]) =>
                combination[key] === val && combination.availableForSale,
            ),
          );

          const isActive = selectedOptions[optionNameLowerCase] === value;

          return (
            <button
              type="button"
              key={value}
              aria-disabled={!isAvailableForSale}
              disabled={!isAvailableForSale}
              onClick={() => onOptionSelect(optionNameLowerCase, value)}
              title={`${option.name} ${value}${
                !isAvailableForSale ? " (স্টক শেষ)" : ""
              }`}
              className={cn(
                "flex min-w-[48px] items-center justify-center rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                {
                  "border-emerald-600 bg-emerald-600 text-white shadow-xs":
                    isActive,
                  "border-border bg-card hover:border-emerald-500/50 hover:bg-muted text-foreground":
                    !isActive && isAvailableForSale,
                  "relative z-10 cursor-not-allowed opacity-40 bg-muted text-muted-foreground border-dashed":
                    !isAvailableForSale,
                },
              )}
            >
              {value}
            </button>
          );
        })}
      </dd>
    </dl>
  ));
}

