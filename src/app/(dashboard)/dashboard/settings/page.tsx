import { redirect } from "next/navigation";
import { ThemeToggler } from "@/components/theme-toggler";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata = {
  title: "সেটিংস | স্বাস্থ্যকর",
  description: "আপনার অ্যাকাউন্ট নিরাপত্তা ও পছন্দসমূহ পরিচালনা করুন।",
};

export default async function UserSettingsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?callbackUrl=/dashboard/settings");
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            অ্যাকাউন্ট সেটিংস
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            আপনার অ্যাকাউন্টের নিরাপত্তা এবং সিস্টেম প্রেফারেন্স কনফিগার করুন।
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Appearance Settings */}
        <Card className="rounded-2xl border-border bg-card shadow-xs">
          <CardHeader>
            <CardTitle className="text-lg font-bold">থিম ও ডিসপ্লে</CardTitle>
            <CardDescription>
              আপনার সুবিধাজনক ইন্টারফেস মোড (লাইট / ডার্ক বা সিস্টেম) বেছে নিন।
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">
                কালার মোড পরিবর্তন
              </span>
              <span className="text-xs text-muted-foreground">
                সিস্টেম থিম অথবা কাস্টম ডার্ক মোড সক্রিয় করুন
              </span>
            </div>
            <ThemeToggler />
          </CardContent>
        </Card>

        {/* Security & Account Status */}
        <Card className="rounded-2xl border-border bg-card shadow-xs">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              অ্যাকাউন্ট নিরাপত্তা ও রোল
            </CardTitle>
            <CardDescription>লগইন স্ট্যাটাস ও নিরাপত্তা কনফিগারেশন।</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            <div className="py-3 flex items-center justify-between text-sm">
              <div>
                <div className="font-semibold text-foreground">
                  ইমেইল ভেরিফিকেশন
                </div>
                <div className="text-xs text-muted-foreground">
                  {user.email}
                </div>
              </div>
              <Badge variant={user.emailVerified ? "default" : "secondary"}>
                {user.emailVerified ? "যাচাইকৃত" : "সক্রিয়"}
              </Badge>
            </div>

            <div className="py-3 flex items-center justify-between text-sm">
              <div>
                <div className="font-semibold text-foreground">অ্যাকাউন্ট টাইপ</div>
                <div className="text-xs text-muted-foreground">
                  {user.isAdmin
                    ? "আপনার অ্যাকাউন্টটি অ্যাডমিন এক্সেস প্রাপ্ত"
                    : "স্ট্যান্ডার্ড গ্রাহক অ্যাকাউন্ট"}
                </div>
              </div>
              <Badge variant={user.isAdmin ? "default" : "outline"}>
                {user.isAdmin ? "অ্যাডমিনিস্ট্রেটর" : "সাধারণ গ্রাহক"}
              </Badge>
            </div>

            <div className="py-3 flex items-center justify-between text-sm">
              <div>
                <div className="font-semibold text-foreground">
                  অ্যাকাউন্ট স্ট্যাটাস
                </div>
                <div className="text-xs text-muted-foreground">
                  সিস্টেম অ্যাক্টিভিটি অনুমোদন
                </div>
              </div>
              <Badge variant={user.isBanned ? "destructive" : "default"}>
                {user.isBanned ? "স্থগিত" : "সক্রিয়"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
