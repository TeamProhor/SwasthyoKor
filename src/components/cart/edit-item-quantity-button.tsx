"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import LoadingDots from "@/components/loading-dots";
import { useCart } from "@/hooks/use-cart";
import type { CartItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function EditItemQuantityButton({
  item,
  type,
}: {
  item: CartItem;
  type: "plus" | "minus";
}) {
  const { updateCartItem } = useCart();

  return (
    <button
      type="button"
      aria-label={type === "plus" ? "পরিমাণ বাড়ান" : "পরিমাণ কমান"}
      onClick={() => {
        updateCartItem.mutate({
          merchandiseId: item.merchandise.id,
          type,
        });
      }}
      disabled={updateCartItem.isPending}
      className={cn(
        "ease flex size-full min-w-[36px] max-w-[36px] items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80",
        {
          "ml-auto": type === "minus",
        },
      )}
    >
      {updateCartItem.isPending ? (
        <LoadingDots className="bg-black dark:bg-white" />
      ) : type === "plus" ? (
        <PlusIcon className="size-3.5" />
      ) : (
        <MinusIcon className="size-3.5" />
      )}
    </button>
  );
}
