import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { products, productVariants } from "@/lib/db/schema";

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { variantId, availableForSale } = body;

    if (!variantId) {
      return NextResponse.json({ error: "Variant ID আবশ্যক" }, { status: 400 });
    }

    const [updatedVariant] = await db
      .update(productVariants)
      .set({ availableForSale: Boolean(availableForSale) })
      .where(eq(productVariants.id, variantId))
      .returning();

    return NextResponse.json({ variant: updatedVariant });
  } catch (err) {
    console.error("Inventory update error:", err);
    return NextResponse.json({ error: "সার্ভার এরর" }, { status: 500 });
  }
}
