import { redirect } from "next/navigation";
import { InventoryManager } from "@/components/admin/InventoryManager";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { productImages, products, productVariants } from "@/lib/db/schema";

export const metadata = {
  title: "ইনভেন্টরি ও স্টক | অ্যাডমিন",
  description: "পণ্য স্টক স্ট্যাটাস ও ইনভেন্টরি পর্যবেক্ষণ।",
};

export default async function AdminInventoryPage() {
  const user = await getCurrentUser();
  if (!user?.isAdmin) {
    redirect("/login");
  }

  const [allProducts, allImages, allVariants] = await Promise.all([
    db.select().from(products),
    db.select().from(productImages),
    db.select().from(productVariants),
  ]);

  const items = allVariants.map((variant) => {
    const prod = allProducts.find((p) => p.id === variant.productId);
    const img = allImages.find((i) => i.productId === variant.productId);
    return {
      id: prod?.id || "",
      variantId: variant.id,
      productTitle: prod?.title || "অজানা পণ্য",
      variantTitle: variant.title,
      handle: prod?.handle || "",
      price: String(variant.priceAmount),
      imageUrl: img?.url,
      available: variant.availableForSale,
    };
  });

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div className="border-b border-border pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          ইনভেন্টরি ও স্টক পরিচালনা
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          পণ্যগুলোর তাৎক্ষণিক প্রাপ্যতা ও স্টক স্ট্যাটাস নিয়ন্ত্রণ করুন।
        </p>
      </div>

      <InventoryManager initialItems={items} />
    </div>
  );
}
