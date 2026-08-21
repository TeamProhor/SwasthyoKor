"use client";

import { XIcon } from "lucide-react";
import LoadingDots from "@/components/loading-dots";
import { useCart } from "@/hooks/use-cart";
import type { CartItem } from "@/lib/types";

export function DeleteItemButton({ item }: { item: CartItem }) {
  const { updateCartItem } = useCart();

  return (
    <button
      type="button"
      onClick={() => {
        updateCartItem.mutate({
          merchandiseId: item.merchandise.id,
          type: "delete",
        });
      }}
      disabled={updateCartItem.isPending}
      aria-label="পণ্যটি মুছে ফেলুন"
      className="flex size-6 items-center justify-center rounded-full bg-neutral-500 text-white transition-all hover:bg-neutral-800"
    >
      {updateCartItem.isPending ? (
        <LoadingDots className="bg-white" />
      ) : (
        <XIcon className="size-3.5" />
      )}
    </button>
  );
}
