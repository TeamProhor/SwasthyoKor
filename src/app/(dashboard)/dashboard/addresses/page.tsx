import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { AddressManager } from "@/components/dashboard/AddressManager";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { userAddresses } from "@/lib/db/schema";

export const metadata = {
  title: "সংরক্ষিত ঠিকানা | স্বাস্থ্যকর",
  description: "আপনার সমস্ত ডেলিভারি ঠিকানা পরিচালনা করুন।",
};

export default async function UserAddressesPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?callbackUrl=/dashboard/addresses");
  }

  const addresses = await db
    .select()
    .from(userAddresses)
    .where(eq(userAddresses.userId, user.id))
    .orderBy(desc(userAddresses.isDefault), desc(userAddresses.createdAt));

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="border-b border-border pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          ডেলিভারি ঠিকানা
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          অনলাইন অর্ডারের সময় দ্রুততম ডেলিভারির জন্য ঠিকানা তালিকা।
        </p>
      </div>

      <AddressManager initialAddresses={addresses} />
    </div>
  );
}
