"use client";

import { useState } from "react";
import { BagShopping, CheckCircle, CloseCircle, Tag } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
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
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    finalAmount: number;
    message: string;
  } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const payableAmount = appliedCoupon ? appliedCoupon.finalAmount : finalTotal;

  const handleApplyCoupon = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsApplying(true);
    setCouponError("");

    try {
      const res = await fetch("/api/coupons/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode.trim(),
          orderAmount: finalTotal,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error || "কুপন কোডটি সঠিক নয়।");
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon({
          code: data.code,
          discountAmount: data.discountAmount,
          finalAmount: data.finalAmount,
          message: data.message,
        });
        setCouponError("");
      }
    } catch {
      setCouponError("কুপন যাচাই করতে সমস্যা হয়েছে।");
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = (e: React.MouseEvent) => {
    e.preventDefault();
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  return (
    <form action={checkoutDirectProduct} className="space-y-4">
      <input type="hidden" name="handle" value={handle} />
      <input type="hidden" name="quantity" value={quantity.toString()} />
      <input type="hidden" name="paymentMethod" value="online" />
      <input
        type="hidden"
        name="couponCode"
        value={appliedCoupon ? appliedCoupon.code : ""}
      />

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

      {/* Coupon Application Box */}
      <div className="pt-1">
        <div className="rounded-xl border border-border bg-card p-3.5 space-y-2.5">
          <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Tag className="size-3.5 text-emerald-600" />
            <span>কুপন বা ডিসকাউন্ট ভাউচার কোড</span>
          </Label>

          {appliedCoupon ? (
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-xs text-emerald-900 dark:text-emerald-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="size-4 text-emerald-600 shrink-0" />
                <span>
                  কুপন{" "}
                  <strong className="font-mono uppercase">
                    {appliedCoupon.code}
                  </strong>{" "}
                  যুক্ত হয়েছে (-৳
                  {appliedCoupon.discountAmount.toLocaleString("bn-BD")})
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="text-muted-foreground hover:text-red-600 transition-colors p-1"
                title="কুপন মুছুন"
              >
                <CloseCircle className="size-4" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="প্রোমোকোড লিখুন (যেমন: SWAS10)"
                className="rounded-lg h-9 text-xs font-mono uppercase"
              />
              <Button
                type="button"
                onClick={handleApplyCoupon}
                disabled={isApplying || !couponCode.trim()}
                variant="outline"
                size="sm"
                className="rounded-lg h-9 px-4 text-xs font-semibold shrink-0 cursor-pointer border-emerald-600 text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
              >
                {isApplying ? <Spinner className="size-3" /> : "প্রয়োগ করুন"}
              </Button>
            </div>
          )}

          {couponError ? (
            <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">
              {couponError}
            </p>
          ) : null}

          {appliedCoupon ? (
            <div className="pt-1 text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>মূল মূল্য:</span>
                <span>৳{finalTotal.toLocaleString("bn-BD")}</span>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>কুপন ছাড়:</span>
                <span>
                  -৳{appliedCoupon.discountAmount.toLocaleString("bn-BD")}
                </span>
              </div>
              <div className="flex justify-between font-bold text-foreground border-t border-border/50 pt-1 text-sm">
                <span>পরিশোধযোগ্য মূল্য:</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  ৳{payableAmount.toLocaleString("bn-BD")}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Online Payment Method Banner */}
      <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
            পেমেন্ট পদ্ধতি
          </span>
          <span className="text-[11px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
            ১০০% নিরাপদ অনলাইন পেমেন্ট
          </span>
        </div>
        <p className="text-xs font-semibold text-foreground">
          বিকাশ, নগদ, রকেট অথবা কার্ডের মাধ্যমে সম্পূর্ণ মূল্য অগ্রিম পরিশোধযোগ্য।
        </p>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-xl bg-emerald-600 font-bold text-white hover:bg-emerald-700 h-12 text-base shadow-xs mt-2 cursor-pointer"
      >
        <BagShopping className="size-4" />
        <span>
          পেমেন্ট করুন — ৳{payableAmount.toLocaleString("bn-BD")} (অনলাইন গেটওয়ে)
        </span>
      </Button>

      <p className="text-[11px] text-center text-muted-foreground pt-1">
        অর্ডার নিশ্চিত করতে আপনাকে UddoktaPay সুরক্ষিত গেটওয়েতে নিয়ে যাওয়া হবে।
      </p>
    </form>
  );
}
