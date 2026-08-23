"use server";

import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCart } from "@/lib/db/queries";
import { cartItems, carts, orders } from "@/lib/db/schema";

export async function checkout(): Promise<void> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;
  const cart = cartId ? await getCart(cartId) : null;

  if (!cartId || !cart || cart.lines.length === 0) {
    redirect("/search");
  }

  const now = new Date();
  const orderId = crypto.randomUUID();

  await db.insert(orders).values({
    id: orderId,
    totalAmount: Number(cart.cost.totalAmount.amount),
    totalCurrency: cart.cost.totalAmount.currencyCode,
    status: "confirmed",
    items: cart.lines.map((line) => ({
      productHandle: line.merchandise.product.handle,
      productTitle: line.merchandise.product.title,
      variantTitle: line.merchandise.title,
      quantity: line.quantity,
      priceAmount: Number(line.cost.totalAmount.amount) / line.quantity,
      priceCurrency: line.cost.totalAmount.currencyCode,
    })),
    createdAt: now,
  });

  // Clear the cart now that the order is placed.
  await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
  await db.delete(carts).where(eq(carts.id, cartId));
  cookieStore.delete("cartId");

  redirect(`/order/${orderId}`);
}

export async function checkoutDirectProduct(formData: FormData): Promise<void> {
  const handle = formData.get("handle") as string;
  const quantity = Number(formData.get("quantity") || 1);
  const _name = formData.get("name") as string;
  const _phone = formData.get("phone") as string;
  const _address = formData.get("address") as string;

  if (!handle) {
    redirect("/search");
  }

  const { getProduct } = await import("@/lib/db/queries");
  const product = await getProduct(handle);

  if (!product) {
    redirect("/search");
  }

  const variant = product.variants[0];
  const priceAmount = variant
    ? Number(variant.price.amount)
    : Number(product.priceRange.minVariantPrice.amount);
  const priceCurrency = variant
    ? variant.price.currencyCode
    : product.priceRange.minVariantPrice.currencyCode;

  const now = new Date();
  const orderId = crypto.randomUUID();

  await db.insert(orders).values({
    id: orderId,
    totalAmount: priceAmount * quantity,
    totalCurrency: priceCurrency,
    status: "confirmed",
    items: [
      {
        productHandle: product.handle,
        productTitle: product.title,
        variantTitle: variant?.title || "Default Title",
        quantity,
        priceAmount,
        priceCurrency,
      },
    ],
    createdAt: now,
  });

  redirect(`/order/${orderId}`);
}
