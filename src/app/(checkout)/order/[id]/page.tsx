import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BagShopping, CheckCircle, Leaf } from "@/components/icons";
import Price from "@/components/price";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getOrder } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "অর্ডার সফল হয়েছে | স্বাস্থ্যকর",
  description: "আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে।",
};

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) return notFound();

  const orderNumber = order.id.slice(0, 8).toUpperCase();

  return (
    <div className="min-h-screen bg-neutral-50/60 dark:bg-neutral-950 py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
      <div className="max-w-xl mx-auto w-full">
        {/* Minimal Header */}
        <div className="flex items-center justify-between pb-6 border-b border-border/80 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-xl tracking-tight"
          >
            <Leaf className="size-6" />
            <span>স্বাস্থ্যকর</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-full border border-border/60">
            <CheckCircle className="size-4 text-emerald-600 dark:text-emerald-400" />
            <span>অর্ডার নিশ্চিত</span>
          </div>
        </div>

        <Card className="border-border/80 bg-card rounded-2xl shadow-xs overflow-hidden">
          <CardHeader className="text-center pb-2 pt-6">
            <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="size-9" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে!
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground pt-1">
              অর্ডার ট্র্যাকিং নম্বর:{" "}
              <span className="font-mono font-bold text-foreground bg-muted px-2 py-0.5 rounded-md">
                #{orderNumber}
              </span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3.5 text-xs text-emerald-800 dark:text-emerald-300">
              <p className="font-semibold text-sm mb-0.5">পরবর্তী ধাপ:</p>
              <p>
                আমাদের প্রতিনিধি দ্রুত আপনার নম্বরে কল দিয়ে অর্ডারটি কনফার্ম করবেন এবং খুব
                শীঘ্রই আপনার ঠিকানায় পণ্য পৌঁছে দেওয়া হবে।
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                অর্ডারকৃত পণ্যের তালিকা
              </h3>
              <ul className="divide-y divide-border/60 rounded-xl border border-border/60 bg-muted/20 px-4">
                {order.items.map((item, i) => (
                  <li
                    key={`${item.productHandle}-${item.variantTitle}-${i}`}
                    className="flex items-center justify-between py-3.5 text-sm"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <Link
                        href={`/product/${item.productHandle}`}
                        className="font-semibold text-foreground hover:text-emerald-600 transition-colors line-clamp-1"
                      >
                        {item.productTitle}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.variantTitle !== "Default Title"
                          ? `${item.variantTitle} · `
                          : ""}
                        পরিমাণ: {item.quantity}টি
                      </p>
                    </div>
                    <Price
                      className="font-bold text-foreground text-sm shrink-0"
                      amount={(item.priceAmount * item.quantity).toFixed(2)}
                      currencyCode={item.priceCurrency}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>ডেলিভারি চার্জ</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  ফ্রি
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>পেমেন্ট পদ্ধতি</span>
                <span className="font-medium text-foreground">
                  ক্যাশ অন ডেলিভারি
                </span>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between pt-1">
              <span className="text-base font-bold text-foreground">
                সর্বমোট প্রদেয় মূল্য
              </span>
              <Price
                className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400"
                amount={order.totalAmount.toFixed(2)}
                currencyCode={order.totalCurrency}
              />
            </div>
          </CardContent>

          <CardFooter className="pt-2 pb-6 px-6">
            <Button
              render={
                <Link href="/">
                  <BagShopping className="size-4" />
                  <span>আরও কেনাকাটা করুন</span>
                </Link>
              }
              size="lg"
              className="w-full rounded-xl bg-emerald-600 font-semibold text-white hover:bg-emerald-700 h-11 text-base shadow-xs"
            />
          </CardFooter>
        </Card>
      </div>

      <div className="text-center py-6 text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} স্বাস্থ্যকর — খাঁটি ও প্রাকৃতিক পণ্যের নির্ভরযোগ্য
          প্রতিষ্ঠান
        </p>
      </div>
    </div>
  );
}
