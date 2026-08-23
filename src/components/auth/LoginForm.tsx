"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { GoogleIcon } from "@/components/icons";
import LogoSquare from "@/components/logo-square";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { requestMagicLinkAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(urlError ? { text: urlError, type: "error" } : null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await requestMagicLinkAction(formData);

    setIsPending(false);
    if (result.success) {
      setMessage({
        text: result.message || "ম্যাজিক লিংক পাঠানো হয়েছে!",
        type: "success",
      });
    } else {
      setMessage({
        text: result.error || "সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        type: "error",
      });
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/oauth/google";
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="mb-1">
          <LogoSquare />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          স্বাস্থ্যকর অ্যাকাউন্টে প্রবেশ
        </h1>
        <p className="text-sm text-muted-foreground">
          পাসওয়ার্ডহীন নিরাপদে লগইন বা সাইন আপ করুন
        </p>
      </div>

      {message && (
        <div
          className={cn(
            "w-full px-4 py-3 rounded-xl text-sm leading-relaxed text-center",
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-destructive/10 border border-destructive/20 text-destructive",
          )}
        >
          {message.text}
        </div>
      )}

      {/* Google OAuth Login Button */}
      <div className="w-full flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          className="w-full rounded-xl bg-card hover:bg-accent hover:text-foreground border border-border px-4 py-6 text-sm font-medium flex items-center justify-center gap-3 cursor-pointer shadow-xs active:scale-[0.98] transition-all"
        >
          <GoogleIcon className="size-5 shrink-0" />
          <span>গুগল দিয়ে চালিয়ে যান</span>
        </Button>
      </div>

      <div className="w-full flex items-center gap-4 py-1 opacity-60">
        <div className="h-[1px] flex-1 bg-border" />
        <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
          অথবা ইমেইল
        </span>
        <div className="h-[1px] flex-1 bg-border" />
      </div>

      {/* Magic Link Email Form */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <Input
          id="login-email"
          name="email"
          type="email"
          className="w-full rounded-xl px-4 py-6 text-sm bg-background border-border"
          placeholder="আপনার ইমেইল ঠিকানা লিখুন"
          required
        />
        <Button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl px-4 py-6 text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer active:scale-[0.98] transition-all shadow-xs"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner className="size-4 text-white" />
              পাঠানো হচ্ছে...
            </span>
          ) : (
            "ম্যাজিক লিংক পাঠান"
          )}
        </Button>
      </form>

      <p className="w-11/12 text-pretty text-center text-muted-foreground text-[11px] leading-relaxed">
        এগিয়ে যাওয়ার মাধ্যমে আপনি আমাদের{" "}
        <a
          href="/terms-conditions"
          className="underline hover:text-foreground"
        >
          শর্তাবলী
        </a>{" "}
        এবং{" "}
        <a
          href="/privacy-policy"
          className="underline hover:text-foreground"
        >
          গোপনীয়তা নীতিতে
        </a>{" "}
        সম্মত হচ্ছেন।
      </p>
    </div>
  );
}
