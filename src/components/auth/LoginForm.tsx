"use client";

import { useState } from "react";
import { GoogleIcon } from "@/components/icons";
import LogoSquare from "@/components/logo-square";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type Mode = "email" | "password" | "register";

export function LoginForm() {
  const [mode, setMode] = useState<Mode>("email");
  const [isPending, setIsPending] = useState(false);
  const [isGooglePending, setIsGooglePending] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setMessage(null);
    setTimeout(() => {
      setIsPending(false);
      if (mode === "email") {
        setMessage({
          text: "আপনার ইমেইলে একটি ম্যাজিক লিংক পাঠানো হয়েছে। ইনবক্স চেক করুন!",
          type: "success",
        });
      } else if (mode === "password") {
        setMessage({
          text: "সফলভাবে লগইন হয়েছে!",
          type: "success",
        });
      } else {
        setMessage({
          text: "আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!",
          type: "success",
        });
      }
    }, 1200);
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <div className="mb-1">
          <LogoSquare />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          {mode === "register"
            ? "নতুন অ্যাকাউন্ট তৈরি করুন"
            : mode === "password"
              ? "পাসওয়ার্ড দিয়ে লগইন"
              : "আপনার অ্যাকাউন্টে লগইন করুন"}
        </h1>
        <p className="text-sm text-muted-foreground text-center">
          {mode === "register" ? (
            <>
              ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("email");
                  setMessage(null);
                }}
                className="text-foreground hover:underline cursor-pointer font-medium"
              >
                লগইন করুন
              </button>
            </>
          ) : (
            <>
              নতুন ব্যবহারকারী?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setMessage(null);
                }}
                className="text-foreground hover:underline cursor-pointer font-medium"
              >
                অ্যাকাউন্ট তৈরি করুন
              </button>
            </>
          )}
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

      {mode === "register" && (
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <Input
            id="reg-name"
            name="name"
            className="w-full rounded-xl px-4 py-6 text-sm bg-background border-border"
            placeholder="আপনার পুরো নাম"
            required
          />
          <Input
            id="reg-email"
            name="email"
            type="email"
            className="w-full rounded-xl px-4 py-6 text-sm bg-background border-border"
            placeholder="আপনার ইমেইল ঠিকানা"
            required
          />
          <PasswordInput
            id="reg-password"
            name="password"
            className="w-full rounded-xl px-4 py-6 text-sm bg-background border-border"
            placeholder="পাসওয়ার্ড (অন্তত ৮ অক্ষর)"
            required
          />
          <Button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl px-4 py-6 text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer active:scale-[0.98] transition-all"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner className="size-4 text-white" />
                তৈরি হচ্ছে...
              </span>
            ) : (
              "অ্যাকাউন্ট তৈরি করুন"
            )}
          </Button>
        </form>
      )}

      {mode === "email" && (
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <Input
            id="login-email"
            name="email"
            className="w-full rounded-xl px-4 py-6 text-sm bg-background border-border"
            placeholder="আপনার ইমেইল ঠিকানা"
            type="email"
            required
          />
          <Button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl px-4 py-6 text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer active:scale-[0.98] transition-all"
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
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setMode("password");
              setMessage(null);
            }}
            className="w-full text-muted-foreground hover:text-foreground py-6 text-sm cursor-pointer font-medium"
          >
            পাসওয়ার্ড দিয়ে লগইন
          </Button>
        </form>
      )}

      {mode === "password" && (
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <Input
            id="pw-email"
            name="email"
            type="email"
            className="w-full rounded-xl px-4 py-6 text-sm bg-background border-border"
            placeholder="ইমেইল ঠিকানা"
            required
          />
          <PasswordInput
            id="pw-password"
            name="password"
            className="w-full rounded-xl px-4 py-6 text-sm bg-background border-border"
            placeholder="পাসওয়ার্ড"
            required
          />
          <Button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl px-4 py-6 text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer active:scale-[0.98] transition-all"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner className="size-4 text-white" />
                যাচাই করা হচ্ছে...
              </span>
            ) : (
              "লগইন করুন"
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setMode("email");
              setMessage(null);
            }}
            className="w-full text-muted-foreground hover:text-foreground py-4 text-sm cursor-pointer"
          >
            ← ম্যাজিক লিংকে ফিরুন
          </Button>
        </form>
      )}

      <div className="w-full flex items-center gap-4 py-2 opacity-60">
        <div className="h-[1px] flex-1 bg-border" />
        <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">
          অথবা
        </span>
        <div className="h-[1px] flex-1 bg-border" />
      </div>

      <div className="w-full flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={isGooglePending}
          onClick={() => {
            setIsGooglePending(true);
            setTimeout(() => setIsGooglePending(false), 1500);
          }}
          className="w-full rounded-xl bg-card hover:bg-accent hover:text-foreground border border-border px-4 py-6 text-sm font-medium flex items-center justify-center cursor-pointer shadow-sm active:scale-[0.98] transition-all"
        >
          {isGooglePending ? (
            <Spinner className="size-4" />
          ) : (
            <GoogleIcon className="size-5 shrink-0" />
          )}
          <span>গুগল দিয়ে চালিয়ে যান</span>
        </Button>
      </div>

      <p className="w-11/12 text-pretty text-center text-muted-foreground text-[11px] leading-relaxed">
        এগিয়ে যাওয়ার মাধ্যমে আপনি আমাদের{" "}
        <button
          type="button"
          className="underline hover:text-foreground cursor-pointer"
        >
          শর্তাবলী
        </button>{" "}
        এবং{" "}
        <button
          type="button"
          className="underline hover:text-foreground cursor-pointer"
        >
          গোপনীয়তা নীতিতে
        </button>{" "}
        সম্মত হচ্ছেন।
      </p>
    </div>
  );
}
