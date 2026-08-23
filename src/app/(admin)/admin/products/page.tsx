import { CreateProductDialog, ProductsTable } from "@/components/admin";
import { db } from "@/lib/db";
import {
  collections,
  productImages,
  products,
  productVariants,
} from "@/lib/db/schema";

export const metadata = {
  title: "পণ্য পরিচালনা | অ্যাডমিন",
  description: "স্বাস্থ্যকর পণ্যের তালিকা, স্টক ও মূল্য পরিচালনা।",
};

export default async function AdminProductsPage() {
  const [allProducts, allImages, allVariants, allCollections] =
    await Promise.all([
      db.select().from(products),
      db.select().from(productImages),
      db.select().from(productVariants),
      db.select().from(collections),
    ]);

  const formattedProducts = allProducts.map((prod) => {
    const img = allImages.find((i) => i.productId === prod.id);
    const variant = allVariants.find((v) => v.productId === prod.id);
    return {
      id: prod.id,
      title: prod.title,
      handle: prod.handle,
      price: variant ? String(variant.priceAmount) : "0",
      imageUrl: img?.url,
      available: prod.availableForSale,
    };
  });

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            পণ্য পরিচালনা 📦
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            মোট {formattedProducts.length}টি পণ্য স্টোরে রয়েছে।
          </p>
        </div>
        <CreateProductDialog
          collections={allCollections.map((c) => ({
            id: c.id,
            title: c.title,
          }))}
        />
      </div>

      <ProductsTable products={formattedProducts} />
    </div>
  );
}
