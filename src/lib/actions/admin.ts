"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  collections,
  orders,
  productCollections,
  productImages,
  products,
  productVariants,
} from "@/lib/db/schema";
import { uploadObject } from "@/lib/storage";

// ─── Products ─────────────────────────────────────────────────────────────

export async function createProductAction(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const handle = (formData.get("handle") as string)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-");
    const description = (formData.get("description") as string) || "";
    const priceAmount = Number(formData.get("price") || 0);
    const categoryId = formData.get("collectionId") as string;
    const imageFile = formData.get("image") as File | null;
    const imageUrlInput = formData.get("imageUrl") as string;

    const id = `prod_${crypto.randomUUID().slice(0, 8)}`;
    const now = new Date();

    let finalImageUrl = imageUrlInput || "";

    // Upload to Neon S3 Object Storage if file is provided
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const ext = imageFile.name.split(".").pop() || "png";
      const s3Key = `products/${id}-${Date.now()}.${ext}`;
      finalImageUrl = await uploadObject({
        key: s3Key,
        body: buffer,
        contentType: imageFile.type,
      });
    }

    if (!finalImageUrl) {
      finalImageUrl =
        "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800";
    }

    await db.insert(products).values({
      id,
      handle,
      title,
      description,
      availableForSale: true,
      createdAt: now,
      updatedAt: now,
    });

    await db.insert(productImages).values({
      id: `img_${crypto.randomUUID().slice(0, 8)}`,
      productId: id,
      url: finalImageUrl,
      altText: title,
      width: 800,
      height: 800,
      position: 0,
    });

    await db.insert(productVariants).values({
      id: `var_${crypto.randomUUID().slice(0, 8)}`,
      productId: id,
      title: "Default",
      priceAmount,
      priceCurrency: "USD",
      availableForSale: true,
      position: 0,
      selectedOptions: [],
    });

    if (categoryId) {
      await db.insert(productCollections).values({
        productId: id,
        collectionId: categoryId,
      });
    }

    revalidatePath("/admin/products");
    revalidatePath("/search");
    revalidatePath("/");

    return { success: true, message: "পণ্য সফলভাবে তৈরি করা হয়েছে।" };
  } catch (err: unknown) {
    console.error("Create product error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "পণ্য তৈরি করতে সমস্যা হয়েছে।",
    };
  }
}

export async function deleteProductAction(productId: string) {
  try {
    await db.delete(products).where(eq(products.id, productId));
    revalidatePath("/admin/products");
    revalidatePath("/search");
    revalidatePath("/");
    return { success: true, message: "পণ্য মুছে ফেলা হয়েছে।" };
  } catch (err: unknown) {
    console.error("Delete product error:", err);
    return { success: false, error: "পণ্য মুছতে সমস্যা হয়েছে।" };
  }
}

// ─── Orders ───────────────────────────────────────────────────────────────

export async function updateOrderStatusAction(orderId: string, status: string) {
  try {
    await db.update(orders).set({ status }).where(eq(orders.id, orderId));
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return { success: true, message: "অর্ডার স্ট্যাটাস আপডেট হয়েছে।" };
  } catch (err: unknown) {
    console.error("Update order status error:", err);
    return { success: false, error: "স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে।" };
  }
}

// ─── Collections ──────────────────────────────────────────────────────────

export async function createCollectionAction(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const handle = (formData.get("handle") as string)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-");
    const description = (formData.get("description") as string) || "";

    const id = `col_${crypto.randomUUID().slice(0, 8)}`;
    const now = new Date();

    await db.insert(collections).values({
      id,
      handle,
      title,
      description,
      createdAt: now,
      updatedAt: now,
    });

    revalidatePath("/admin/collections");
    revalidatePath("/search");

    return { success: true, message: "কালেকশন তৈরি হয়েছে।" };
  } catch (err: unknown) {
    console.error("Create collection error:", err);
    return { success: false, error: "কালেকশন তৈরিতে ত্রুটি।" };
  }
}

export async function deleteCollectionAction(collectionId: string) {
  try {
    await db.delete(collections).where(eq(collections.id, collectionId));
    revalidatePath("/admin/collections");
    revalidatePath("/search");
    return { success: true, message: "কালেকশন মুছে ফেলা হয়েছে।" };
  } catch (err: unknown) {
    console.error("Delete collection error:", err);
    return { success: false, error: "কালেকশন মুছতে সমস্যা হয়েছে।" };
  }
}
