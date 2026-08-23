import { Suspense } from "react";
import { LoginForm } from "@/components/auth";
import { Spinner } from "@/components/ui/spinner";

export const metadata = {
  title: "লগইন | স্বাস্থ্যকর",
  description: "আপনার স্বাস্থ্যকর অ্যাকাউন্টে লগইন বা সাইন আপ করুন।",
};

export default function LoginPage() {
  return (
    <main className="w-full flex min-h-[calc(100vh-160px)] flex-col items-center justify-center p-6 sm:p-10 relative z-10">
      <div className="w-full max-w-md mx-auto">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <Spinner className="size-6 text-emerald-600" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
