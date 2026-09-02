"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  blogs,
  collections,
  orders,
  heroBanners,
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
    const compareAtPriceInput = formData.get("compareAtPrice") as string;
    const compareAtPrice = compareAtPriceInput ? Number(compareAtPriceInput) : null;
    const categoryId = formData.get("collectionId") as string;
    const imageFile = formData.get("image") as File | null;
    const imageUrlInput = formData.get("imageUrl") as string;

    const id = `prod_${crypto.randomUUID().slice(0, 8)}`;
    const now = new Date();

    let finalImageUrl = imageUrlInput || "";

    // Upload file if provided (compressed to WebP from browser)
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const extension = imageFile.name.endsWith(".webp") || imageFile.type === "image/webp" ? "webp" : imageFile.name.split(".").pop() || "webp";
      const s3Key = `products/${id}-${Date.now()}.${extension}`;
      finalImageUrl = await uploadObject({
        key: s3Key,
        body: buffer,
        contentType: imageFile.type || "image/webp",
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
      compareAtPrice,
      priceCurrency: "BDT",
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

export async function updateProductAction(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    if (!id) {
      return { success: false, error: "পণ্যের আইডি পাওয়া যায়নি।" };
    }

    const title = formData.get("title") as string;
    const handle = (formData.get("handle") as string)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-");
    const description = (formData.get("description") as string) || "";
    const priceAmount = Number(formData.get("price") || 0);
    const compareAtPriceInput = formData.get("compareAtPrice") as string;
    const compareAtPrice = compareAtPriceInput ? Number(compareAtPriceInput) : null;
    const categoryId = formData.get("collectionId") as string;
    const availableForSale = formData.get("availableForSale") === "true";
    const imageFile = formData.get("image") as File | null;
    const imageUrlInput = formData.get("imageUrl") as string;

    const now = new Date();

    // 1. Update product table
    await db
      .update(products)
      .set({
        title,
        handle,
        description,
        availableForSale,
        updatedAt: now,
      })
      .where(eq(products.id, id));

    // 2. Update variant price & status
    const existingVariants = await db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, id));

    if (existingVariants.length > 0) {
      await db
        .update(productVariants)
        .set({
          priceAmount,
          compareAtPrice,
          priceCurrency: "BDT",
          availableForSale,
        })
        .where(eq(productVariants.productId, id));
    } else {
      await db.insert(productVariants).values({
        id: `var_${crypto.randomUUID().slice(0, 8)}`,
        productId: id,
        title: "Default",
        priceAmount,
        compareAtPrice,
        priceCurrency: "BDT",
        availableForSale,
        position: 0,
        selectedOptions: [],
      });
    }

    // 3. Update image if new file or URL is provided
    let finalImageUrl = imageUrlInput || "";
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const extension = imageFile.name.endsWith(".webp") || imageFile.type === "image/webp" ? "webp" : imageFile.name.split(".").pop() || "webp";
      const s3Key = `products/${id}-${Date.now()}.${extension}`;
      finalImageUrl = await uploadObject({
        key: s3Key,
        body: buffer,
        contentType: imageFile.type || "image/webp",
      });
    }

    if (finalImageUrl) {
      const existingImages = await db
        .select()
        .from(productImages)
        .where(eq(productImages.productId, id));

      if (existingImages.length > 0) {
        await db
          .update(productImages)
          .set({
            url: finalImageUrl,
            altText: title,
          })
          .where(eq(productImages.productId, id));
      } else {
        await db.insert(productImages).values({
          id: `img_${crypto.randomUUID().slice(0, 8)}`,
          productId: id,
          url: finalImageUrl,
          altText: title,
          width: 800,
          height: 800,
          position: 0,
        });
      }
    }

    // 4. Update collection association
    await db
      .delete(productCollections)
      .where(eq(productCollections.productId, id));

    if (categoryId) {
      await db.insert(productCollections).values({
        productId: id,
        collectionId: categoryId,
      });
    }

    revalidatePath("/admin/products");
    revalidatePath("/search");
    revalidatePath(`/product/${handle}`);
    revalidatePath("/");

    return { success: true, message: "পণ্য সফলভাবে আপডেট করা হয়েছে।" };
  } catch (err: unknown) {
    console.error("Update product error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "পণ্য আপডেট করতে সমস্যা হয়েছে।",
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

export async function updateCollectionAction(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    if (!id) return { success: false, error: "কালেকশন আইডি পাওয়া যায়নি।" };

    const title = formData.get("title") as string;
    const handle = (formData.get("handle") as string)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-");
    const description = (formData.get("description") as string) || "";

    const now = new Date();

    await db
      .update(collections)
      .set({
        title,
        handle,
        description,
        updatedAt: now,
      })
      .where(eq(collections.id, id));

    revalidatePath("/admin/collections");
    revalidatePath("/search");
    revalidatePath("/category");
    revalidatePath("/");

    return { success: true, message: "কালেকশন সফলভাবে আপডেট করা হয়েছে।" };
  } catch (err: unknown) {
    console.error("Update collection error:", err);
    return { success: false, error: "কালেকশন আপডেট করতে সমস্যা হয়েছে।" };
  }
}

export async function deleteCollectionAction(collectionId: string) {
  try {
    await db.delete(collections).where(eq(collections.id, collectionId));
    revalidatePath("/admin/collections");
    revalidatePath("/search");
    revalidatePath("/category");
    revalidatePath("/");
    return { success: true, message: "কালেকশন মুছে ফেলা হয়েছে।" };
  } catch (err: unknown) {
    console.error("Delete collection error:", err);
    return { success: false, error: "কালেকশন মুছতে সমস্যা হয়েছে।" };
  }
}

// ─── Blogs ────────────────────────────────────────────────────────────────

export async function createBlogAction(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const slug = (formData.get("slug") as string)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]+/g, "-");
    const description = (formData.get("description") as string) || "";
    const content = (formData.get("content") as string) || "";
    const category = (formData.get("category") as string) || "মধু ও পুষ্টি";
    const readTime = (formData.get("readTime") as string) || "৫ মিনিট";
    const author = (formData.get("author") as string) || "স্বাস্থ্যকর নিউট্রিশন টিম";
    const coverImage =
      (formData.get("coverImage") as string) ||
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=85";

    const id = `blog_${crypto.randomUUID().slice(0, 8)}`;
    const now = new Date();

    await db.insert(blogs).values({
      id,
      slug,
      title,
      description,
      content,
      category,
      readTime,
      author,
      coverImage,
      tags: ["অর্গানিক ফুড", "স্বাস্থ্য টিপস"],
      relatedProductHandles: [],
      published: true,
      createdAt: now,
      updatedAt: now,
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);

    return { success: true, message: "ব্লগ আর্টিকেল সফলভাবে তৈরি হয়েছে।" };
  } catch (err: unknown) {
    console.error("Create blog error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "ব্লগ তৈরি করতে সমস্যা হয়েছে।",
    };
  }
}

export async function updateBlogAction(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    if (!id) return { success: false, error: "ব্লগ আইডি পাওয়া যায়নি।" };

    const title = formData.get("title") as string;
    const slug = (formData.get("slug") as string)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]+/g, "-");
    const description = (formData.get("description") as string) || "";
    const content = (formData.get("content") as string) || "";
    const category = (formData.get("category") as string) || "মধু ও পুষ্টি";
    const readTime = (formData.get("readTime") as string) || "৫ মিনিট";
    const author = (formData.get("author") as string) || "স্বাস্থ্যকর নিউট্রিশন টিম";
    const coverImage = (formData.get("coverImage") as string) || "";

    const now = new Date();

    await db
      .update(blogs)
      .set({
        title,
        slug,
        description,
        content,
        category,
        readTime,
        author,
        ...(coverImage ? { coverImage } : {}),
        updatedAt: now,
      })
      .where(eq(blogs.id, id));

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);

    return { success: true, message: "ব্লগ আর্টিকেল সফলভাবে আপডেট হয়েছে।" };
  } catch (err: unknown) {
    console.error("Update blog error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "ব্লগ আপডেট করতে সমস্যা হয়েছে।",
    };
  }
}

export async function deleteBlogAction(blogId: string) {
  try {
    await db.delete(blogs).where(eq(blogs.id, blogId));
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { success: true, message: "ব্লগ আর্টিকেল মুছে ফেলা হয়েছে।" };
  } catch (err: unknown) {
    console.error("Delete blog error:", err);
    return { success: false, error: "ব্লগ মুছতে সমস্যা হয়েছে।" };
  }
}

// ─── Hero Banners ─────────────────────────────────────────────────────────

export async function createHeroBannerAction(formData: FormData) {
  try {
    const title = (formData.get("title") as string) || "";
    const highlight = (formData.get("highlight") as string) || "";
    const subtitle = (formData.get("subtitle") as string) || "";
    const link = (formData.get("link") as string) || "/search";
    const accentColor = (formData.get("accentColor") as string) || "text-amber-400";
    const position = Number(formData.get("position") || 0);
    const imageFile = formData.get("image") as File | null;
    const imageUrlInput = (formData.get("imageUrl") as string) || "";

    let finalImageUrl = imageUrlInput;

    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const extension = imageFile.name.endsWith(".webp") || imageFile.type === "image/webp" ? "webp" : imageFile.name.split(".").pop() || "webp";
      const s3Key = `banners/banner-${Date.now()}.${extension}`;
      finalImageUrl = await uploadObject({
        key: s3Key,
        body: buffer,
        contentType: imageFile.type || "image/webp",
      });
    }

    if (!finalImageUrl) {
      return { success: false, error: "অনুগ্রহ করে ব্যানারের ছবি দিন।" };
    }

    await db.insert(heroBanners).values({
      id: `banner_${crypto.randomUUID().slice(0, 8)}`,
      title,
      highlight,
      subtitle,
      link,
      accentColor,
      image: finalImageUrl,
      position,
      active: true,
      createdAt: new Date(),
    });

    revalidatePath("/admin/banners");
    revalidatePath("/");

    return { success: true, message: "হিরো ব্যানার সফলভাবে তৈরি করা হয়েছে।" };
  } catch (err: unknown) {
    console.error("Create banner error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "ব্যানার তৈরি করতে সমস্যা হয়েছে।",
    };
  }
}

export async function updateHeroBannerAction(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    if (!id) return { success: false, error: "ব্যানার আইডি পাওয়া যায়নি।" };

    const title = (formData.get("title") as string) || "";
    const highlight = (formData.get("highlight") as string) || "";
    const subtitle = (formData.get("subtitle") as string) || "";
    const link = (formData.get("link") as string) || "/search";
    const accentColor = (formData.get("accentColor") as string) || "text-amber-400";
    const position = Number(formData.get("position") || 0);
    const active = formData.get("active") === "true";
    const imageFile = formData.get("image") as File | null;
    const imageUrlInput = (formData.get("imageUrl") as string) || "";

    let finalImageUrl = imageUrlInput;

    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const extension = imageFile.name.endsWith(".webp") || imageFile.type === "image/webp" ? "webp" : imageFile.name.split(".").pop() || "webp";
      const s3Key = `banners/banner-${Date.now()}.${extension}`;
      finalImageUrl = await uploadObject({
        key: s3Key,
        body: buffer,
        contentType: imageFile.type || "image/webp",
      });
    }

    await db
      .update(heroBanners)
      .set({
        title,
        highlight,
        subtitle,
        link,
        accentColor,
        position,
        active,
        ...(finalImageUrl ? { image: finalImageUrl } : {}),
      })
      .where(eq(heroBanners.id, id));

    revalidatePath("/admin/banners");
    revalidatePath("/");

    return { success: true, message: "হিরো ব্যানার আপডেট করা হয়েছে।" };
  } catch (err: unknown) {
    console.error("Update banner error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "ব্যানার আপডেট করতে সমস্যা হয়েছে।",
    };
  }
}

export async function deleteHeroBannerAction(id: string) {
  try {
    await db.delete(heroBanners).where(eq(heroBanners.id, id));
    revalidatePath("/admin/banners");
    revalidatePath("/");
    return { success: true, message: "হিরো ব্যানার মুছে ফেলা হয়েছে।" };
  } catch (err: unknown) {
    console.error("Delete banner error:", err);
    return { success: false, error: "ব্যানার মুছতে সমস্যা হয়েছে।" };
  }
}
