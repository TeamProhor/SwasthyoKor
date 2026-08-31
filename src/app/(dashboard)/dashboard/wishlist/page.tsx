import { redirect } from "next/navigation";
import { WishlistManager } from "@/components/dashboard/WishlistManager";
import { getCurrentUser } from "@/lib/auth/session";
import { getProducts } from "@/lib/db/queries";

export const metadata = {
  title: "পছন্দের তালিকা | স্বাস্থ্যকর",
  description: "আপনার সমস্ত সেভ করা ও পছন্দের পণ্য তালিকা।",
};

export default async function UserWishlistPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?callbackUrl=/dashboard/wishlist");
  }

  // Load featured/recommended organic products
  const products = await getProducts({});

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="border-b border-border pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          পছন্দের তালিকা (Wishlist)
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          আপনার পছন্দের পণ্যগুলো সহজে ট্র্যাক ও অর্ডার করুন।
        </p>
      </div>

      <WishlistManager products={products.slice(0, 4)} />
    </div>
  );
}
