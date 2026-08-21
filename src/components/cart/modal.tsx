"use client";

import { ShoppingBagIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import LoadingDots from "@/components/loading-dots";
import Price from "@/components/price";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { checkout } from "@/lib/actions/checkout";
import { DEFAULT_OPTION } from "@/lib/constants";
import { createUrl } from "@/lib/utils";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-item-quantity-button";
import OpenCart from "./open-cart";

export default function CartModal() {
  const { cart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      if (!isOpen) {
        setIsOpen(true);
      }
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity]);

  return (
    <>
      <button type="button" aria-label="কার্ট খুলুন" onClick={openCart}>
        <OpenCart quantity={cart?.totalQuantity} />
      </button>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="flex h-full w-full max-w-md flex-col justify-between bg-white/95 p-6 text-black backdrop-blur-xl dark:bg-neutral-950/95 dark:text-white"
        >
          <div className="flex items-center justify-between border-b pb-4 dark:border-neutral-800">
            <SheetTitle className="text-lg font-bold text-foreground">
              আমার শপিং ব্যাগ (Cart)
            </SheetTitle>
            <button
              type="button"
              aria-label="কার্ট বন্ধ করুন"
              onClick={closeCart}
              className="flex size-9 items-center justify-center rounded-md border border-neutral-200 text-black hover:bg-neutral-100 dark:border-neutral-800 dark:text-white dark:hover:bg-neutral-900"
            >
              <XIcon className="size-5" />
            </button>
          </div>
          <SheetDescription className="sr-only">
            আপনার কার্টের আইটেমগুলো দেখুন এবং চেকআউটে যান।
          </SheetDescription>

          {!cart || cart.lines.length === 0 ? (
            <div className="flex size-full flex-col items-center justify-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900">
                <ShoppingBagIcon className="size-8 text-neutral-400" />
              </div>
              <p className="text-xl font-semibold">আপনার কার্ট খালি</p>
              <p className="text-sm text-neutral-500">
                খাঁটি ও প্রাকৃতিক পণ্য সংগ্রহ করতে শপিং শুরু করুন।
              </p>
            </div>
          ) : (
            <div className="flex flex-1 flex-col justify-between overflow-hidden">
              <ul className="flex-1 overflow-y-auto divide-y divide-neutral-200 py-2 dark:divide-neutral-800">
                {cart.lines
                  .sort((a, b) =>
                    a.merchandise.product.title.localeCompare(
                      b.merchandise.product.title,
                    ),
                  )
                  .map((item, i) => {
                    const merchandiseSearchParams: Record<string, string> = {};

                    item.merchandise.selectedOptions.forEach(
                      ({ name, value }) => {
                        if (value !== DEFAULT_OPTION) {
                          merchandiseSearchParams[name.toLowerCase()] = value;
                        }
                      },
                    );

                    const merchandiseUrl = createUrl(
                      `/product/${item.merchandise.product.handle}`,
                      new URLSearchParams(merchandiseSearchParams),
                    );

                    return (
                      <li key={`${item.merchandise.id}-${i}`} className="py-4">
                        <div className="relative flex items-center justify-between gap-4">
                          <div className="absolute -left-1 -top-1 z-40">
                            <DeleteItemButton item={item} />
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative size-16 overflow-hidden rounded-md border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900">
                              {item.merchandise.product.featuredImage ? (
                                <Image
                                  className="size-full object-cover"
                                  width={64}
                                  height={64}
                                  alt={
                                    item.merchandise.product.featuredImage
                                      .altText || item.merchandise.product.title
                                  }
                                  src={
                                    item.merchandise.product.featuredImage.url
                                  }
                                />
                              ) : null}
                            </div>
                            <Link
                              href={merchandiseUrl}
                              onClick={closeCart}
                              className="flex flex-col text-sm font-medium hover:underline"
                            >
                              <span className="line-clamp-1">
                                {item.merchandise.product.title}
                              </span>
                              {item.merchandise.title !== DEFAULT_OPTION ? (
                                <span className="text-xs text-neutral-500">
                                  {item.merchandise.title}
                                </span>
                              ) : null}
                            </Link>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Price
                              className="text-sm font-semibold"
                              amount={item.cost.totalAmount.amount}
                              currencyCode={item.cost.totalAmount.currencyCode}
                            />
                            <div className="flex h-8 items-center rounded-full border border-neutral-200 dark:border-neutral-800">
                              <EditItemQuantityButton
                                item={item}
                                type="minus"
                              />
                              <span className="w-5 text-center text-xs font-semibold">
                                {item.quantity}
                              </span>
                              <EditItemQuantityButton item={item} type="plus" />
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
              </ul>

              <div className="border-t pt-4 text-sm dark:border-neutral-800">
                <div className="mb-2 flex items-center justify-between text-neutral-500">
                  <p>ভ্যাট / ট্যাক্স</p>
                  <Price
                    className="font-medium text-black dark:text-white"
                    amount={cart.cost.totalTaxAmount.amount}
                    currencyCode={cart.cost.totalTaxAmount.currencyCode}
                  />
                </div>
                <div className="mb-3 flex items-center justify-between text-neutral-500">
                  <p>শিপিং চার্জ</p>
                  <p className="font-medium text-black dark:text-white">
                    ফ্রি (Free)
                  </p>
                </div>
                <div className="mb-4 flex items-center justify-between border-t pt-2 text-base font-bold text-black dark:text-white dark:border-neutral-800">
                  <p>সর্বমোট (Total)</p>
                  <Price
                    className="text-lg text-emerald-600 font-bold"
                    amount={cart.cost.totalAmount.amount}
                    currencyCode={cart.cost.totalAmount.currencyCode}
                  />
                </div>
                <form action={checkout}>
                  <CheckoutButton />
                </form>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="flex w-full items-center justify-center rounded-full bg-emerald-600 p-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      type="submit"
      disabled={pending}
    >
      {pending ? (
        <LoadingDots className="bg-white" />
      ) : (
        "অর্ডার কনফার্ম করুন (Checkout)"
      )}
    </button>
  );
}
