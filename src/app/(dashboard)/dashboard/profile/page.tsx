import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/dashboard";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata = {
  title: "প্রোফাইল | স্বাস্থ্যকর",
  description: "আপনার ব্যক্তিগত অ্যাকাউন্ট প্রোফাইল ও যোগাযোগের তথ্য।",
};

export default async function UserProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?callbackUrl=/dashboard/profile");
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            আমার প্রোফাইল
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            আপনার অ্যাকাউন্টের বিবরণ ও যোগাযোগের তথ্য পরিচালনা করুন।
          </p>
        </div>
      </div>

      <ProfileForm
        initialUser={{
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatarUrl: user.avatarUrl,
          isAdmin: user.isAdmin,
        }}
      />
    </div>
  );
}
