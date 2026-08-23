"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
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
    <dl className="mb-8" key={option.id}>
      <dt className="mb-4 text-sm uppercase tracking-wide font-medium">
        {option.name}
      </dt>
      <dd className="flex flex-wrap gap-3">
        {option.values.map((value) => {
          const optionNameLowerCase = option.name.toLowerCase();

          const optionSearchParams = new URLSearchParams(
            searchParams.toString(),
          );
          optionSearchParams.set(optionNameLowerCase, value);

          const isAvailableForSale = combinations.find((combination) =>
            Array.from(optionSearchParams.entries()).every(
              ([key, val]) =>
                combination[key] === val && combination.availableForSale,
            ),
          );

          const isActive = searchParams.get(optionNameLowerCase) === value;

          return (
            <button
              type="button"
              key={value}
              aria-disabled={!isAvailableForSale}
              disabled={!isAvailableForSale}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set(optionNameLowerCase, value);
                router.replace(`${pathname}?${params.toString()}`, {
                  scroll: false,
                });
              }}
              title={`${option.name} ${value}${
                !isAvailableForSale ? " (স্টক শেষ)" : ""
              }`}
              className={cn(
                "flex min-w-[48px] items-center justify-center rounded-full border px-4 py-2 text-sm transition-colors",
                {
                  "cursor-default ring-2 ring-emerald-600 bg-emerald-600 text-white":
                    isActive,
                  "ring-1 ring-transparent hover:ring-neutral-400 dark:hover:ring-neutral-600":
                    !isActive && isAvailableForSale,
                  "relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 dark:bg-neutral-900 dark:text-neutral-500 dark:ring-neutral-700":
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
