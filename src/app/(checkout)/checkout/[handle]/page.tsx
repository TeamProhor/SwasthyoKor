import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BagShopping } from "@/components/icons";
import LogoSquare from "@/components/logo-square";
import Price from "@/components/price";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { checkoutDirectProduct } from "@/lib/actions/checkout";
import { getProduct } from "@/lib/db/queries";

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await props.params;
  const product = await getProduct(handle);

  if (!product) return notFound();

  return {
    title: `চেকআউট - ${product.title} | স্বাস্থ্যকর`,
    description: `${product.title} সরাসরি অর্ডার করুন।`,
  };
}

export default async function CheckoutProductPage(props: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ quantity?: string }>;
}) {
  const { handle } = await props.params;
  const searchParams = await props.searchParams;
  const product = await getProduct(handle);

  if (!product) return notFound();

  const quantity = Math.max(
    1,
    parseInt(searchParams?.quantity || "1", 10) || 1,
  );
  const variant = product.variants[0];
  const unitPrice = variant
    ? Number(variant.price.amount)
    : Number(product.priceRange.minVariantPrice.amount);
  const currencyCode = variant
    ? variant.price.currencyCode
    : product.priceRange.minVariantPrice.currencyCode;

  const finalTotal = unitPrice * quantity;

  return (
    <div className="min-h-screen bg-neutral-50/60 dark:bg-neutral-950 py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full">
        {/* Minimal Header */}
        <div className="flex items-center justify-between pb-6 border-b border-border/80 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-extrabold text-xl tracking-tight"
          >
            <LogoSquare size="sm" />
            <span>স্বাস্থ্যকর</span>
          </Link>
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/20">
            🔒 সুরক্ষিত চেকআউট (SSL/COD)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Delivery Form */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-border/80 bg-card rounded-2xl shadow-xs">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-foreground">
                  ডেলিভারির ঠিকানা ও তথ্য
                </CardTitle>
                <CardDescription>
                  আপনার সঠিক ঠিকানা দিন, ক্যাশ অন ডেলিভারিতে পৌঁছে দেওয়া হবে।
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form action={checkoutDirectProduct} className="space-y-4">
                  <input type="hidden" name="handle" value={product.handle} />
                  <input
                    type="hidden"
                    name="quantity"
                    value={quantity.toString()}
                  />

                  <div className="space-y-1.5">
                    <Label htmlFor="name">আপনার পুরো নাম</Label>
                    <Input
                      id="name"
                      name="name"
                      required
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

                  <div className="pt-2">
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2.5">
                      <div className="size-2 rounded-full bg-emerald-600 animate-pulse shrink-0" />
                      <span>
                        পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধ (Cash on Delivery) সুবিধা
                        রয়েছে।
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
                      অর্ডার নিশ্চিত করুন — ৳{finalTotal.toLocaleString("bn-BD")}{" "}
                      (ক্যাশ অন ডেলিভারি)
                    </span>
                  </Button>

                  <p className="text-[11px] text-center text-muted-foreground pt-1">
                    অর্ডার প্লেস করার পর আমাদের প্রতিনিধি আপনাকে কল করে নিশ্চিত করবেন।
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-border/80 bg-card rounded-2xl shadow-xs sticky top-8">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-bold text-foreground">
                  অর্ডার সারাংশ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Product row */}
                <div className="flex items-center gap-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-border/80 bg-neutral-100 dark:bg-neutral-900">
                    {product.featuredImage?.url ? (
                      <Image
                        src={product.featuredImage.url}
                        alt={product.title}
                        fill
                        sizes="64px"
                        className="size-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-semibold text-foreground line-clamp-1">
                      {product.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      পরিমাণ: {quantity.toLocaleString("bn-BD")}টি প্যাক
                    </span>
                    <Price
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5"
                      amount={unitPrice.toString()}
                      currencyCode={currencyCode}
                    />
                  </div>
                </div>

                <Separator />

                {/* Price calculations */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>পণ্যের মূল্য</span>
                    <Price
                      className="font-medium text-foreground"
                      amount={finalTotal.toString()}
                      currencyCode={currencyCode}
                    />
                  </div>

                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>ভ্যাট ও ট্যাক্স</span>
                    <Price
                      className="font-medium text-foreground"
                      amount="0"
                      currencyCode={currencyCode}
                    />
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>ডেলিভারি চার্জ</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      ফ্রি
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-bold text-foreground">
                    সর্বমোট
                  </span>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    ৳{finalTotal.toLocaleString("bn-BD")}
                  </span>
                </div>

                {/* Video 2 Reassurance Guarantees */}
                <div className="rounded-xl border border-border/60 bg-muted/25 p-3 space-y-2 pt-3 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>১০০% প্রাকৃতিক ও ল্যাব টেস্টেড খাঁটি পণ্য</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>পণ্য হাতে পেয়ে চেক করে নেওয়ার সুবিধা</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>পছন্দ না হলে ৭ দিনের মান নিশ্চয়তা ও রিটার্ন</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Clean Bottom link back */}
      <div className="text-center py-6 text-xs text-muted-foreground">
        <Link href={`/product/${product.handle}`} className="hover:underline">
          ← প্রোডাক্ট পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}
