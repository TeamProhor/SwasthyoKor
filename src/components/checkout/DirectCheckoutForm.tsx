"use client";

import { useState } from "react";
import { BagShopping } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkoutDirectProduct } from "@/lib/actions/checkout";

interface DirectCheckoutFormProps {
  handle: string;
  quantity: number;
  finalTotal: number;
  initialName?: string;
  initialPhone?: string;
}

export function DirectCheckoutForm({
  handle,
  quantity,
  finalTotal,
  initialName = "",
  initialPhone = "",
}: DirectCheckoutFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");

  return (
    <form action={checkoutDirectProduct} className="space-y-4">
      <input type="hidden" name="handle" value={handle} />
      <input type="hidden" name="quantity" value={quantity.toString()} />
      <input type="hidden" name="paymentMethod" value={paymentMethod} />

      <div className="space-y-1.5">
        <Label htmlFor="name">আপনার পুরো নাম</Label>
        <Input
          id="name"
          name="name"
          required
          defaultValue={initialName}
          placeholder="যেমন: মোঃ সাকিব হাসান"
          className="rounded-xl h-10"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">মোবাইল নম্বর</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          required
          defaultValue={initialPhone}
          placeholder="যেমন: 017XXXXXXXX"
          className="rounded-xl h-10"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address">সম্পূর্ণ ডেলিভারি ঠিকানা</Label>
        <Input
          id="address"
          name="address"
          required
          placeholder="বাড়ি/ফ্ল্যাট নং, রাস্তা, এলাকা, থানা ও জেলা"
          className="rounded-xl h-10"
        />
      </div>

      {/* Payment Method Selector */}
      <div className="space-y-2 pt-2">
        <Label className="text-sm font-semibold">পেমেন্ট পদ্ধতি নির্বাচন করুন</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setPaymentMethod("cod")}
            className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
              paymentMethod === "cod"
                ? "border-emerald-600 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-600/30"
                : "border-border/80 bg-card hover:border-border text-foreground"
            }`}
          >
            <input
              type="radio"
              name="paymentChoice"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
              className="mt-1 size-4 accent-emerald-600 cursor-pointer"
            />
            <div>
              <div className="text-sm font-bold flex items-center gap-1.5">
                <span>ক্যাশ অন ডেলিভারি</span>
                <span className="text-[10px] bg-emerald-600/15 text-emerald-700 dark:text-emerald-300 font-semibold px-1.5 py-0.5 rounded">
                  COD
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধ করুন
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("online")}
            className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
              paymentMethod === "online"
                ? "border-emerald-600 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-600/30"
                : "border-border/80 bg-card hover:border-border text-foreground"
            }`}
          >
            <input
              type="radio"
              name="paymentChoice"
              checked={paymentMethod === "online"}
              onChange={() => setPaymentMethod("online")}
              className="mt-1 size-4 accent-emerald-600 cursor-pointer"
            />
            <div>
              <div className="text-sm font-bold flex items-center gap-1.5">
                <span>অনলাইন পেমেন্ট</span>
                <span className="text-[10px] bg-blue-600/15 text-blue-700 dark:text-blue-300 font-semibold px-1.5 py-0.5 rounded">
                  বিকাশ / নগদ / কার্ড
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                সুরক্ষিত অনলাইন গেটওয়ে দিয়ে সরাসরি পেমেন্ট
              </p>
            </div>
          </button>
        </div>
      </div>

      <div className="pt-2">
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2.5">
          <div className="size-2 rounded-full bg-emerald-600 animate-pulse shrink-0" />
          <span>
            {paymentMethod === "online"
              ? "বিকাশ, নগদ, রকেট, উপায় বা ব্যাংক কার্ডের মাধ্যমে পেমেন্ট সম্পন্ন হবে।"
              : "পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধ (Cash on Delivery) সুবিধা রয়েছে।"}
          </span>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-xl bg-emerald-600 font-bold text-white hover:bg-emerald-700 h-12 text-base shadow-xs mt-2 cursor-pointer"
      >
        <BagShopping className="size-4" />
        <span>
          {paymentMethod === "online"
            ? `অনলাইনে পেমেন্ট করুন — ৳${finalTotal.toLocaleString("bn-BD")}`
            : `অর্ডার নিশ্চিত করুন — ৳${finalTotal.toLocaleString("bn-BD")} (ক্যাশ অন ডেলিভারি)`}
        </span>
      </Button>

      <p className="text-[11px] text-center text-muted-foreground pt-1">
        {paymentMethod === "online"
          ? "পেমেন্ট সম্পন্ন করার জন্য আপনাকে UddoktaPay সুরক্ষিত গেটওয়েতে রিডাইরেক্ট করা হবে।"
          : "অর্ডার প্লেস করার পর আমাদের প্রতিনিধি আপনাকে কল করে নিশ্চিত করবেন।"}
      </p>
    </form>
  );
}
