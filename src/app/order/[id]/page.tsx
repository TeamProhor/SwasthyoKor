import { CheckCircle2Icon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Price from "@/components/price";
import { getOrder } from "@/lib/db/queries";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) return notFound();

  const orderNumber = order.id.slice(0, 8).toUpperCase();

  return (
    <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-4 py-12">
      <div className="mx-auto max-w-lg rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-black">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
          <CheckCircle2Icon className="size-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          অর্ডার সফলভাবে নিশ্চিত হয়েছে! 🎉
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। অর্ডার নম্বর:{" "}
          <span className="font-mono font-bold text-foreground">
            #{orderNumber}
          </span>
        </p>

        <div className="mt-6 border-t pt-4 dark:border-neutral-800">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            অর্ডারের বিবরণ
          </h2>
          <ul className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-800">
            {order.items.map((item, i) => (
              <li
                key={`${item.productHandle}-${item.variantTitle}-${i}`}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <Link
                    href={`/product/${item.productHandle}`}
                    className="font-medium text-sm hover:underline"
                  >
                    {item.productTitle}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {item.variantTitle !== "Default Title"
                      ? `${item.variantTitle} · `
                      : ""}
                    পরিমাণ: {item.quantity}টি
                  </p>
                </div>
                <Price
                  className="text-sm font-semibold"
                  amount={(item.priceAmount * item.quantity).toFixed(2)}
                  currencyCode={item.priceCurrency}
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex items-center justify-between border-t pt-4 dark:border-neutral-800">
          <p className="font-semibold text-base">মোট পরিশোধিত</p>
          <Price
            className="text-xl font-bold text-emerald-600"
            amount={order.totalAmount.toFixed(2)}
            currencyCode={order.totalCurrency}
          />
        </div>

        <Link
          href="/search"
          className="mt-8 block w-full rounded-full bg-emerald-600 p-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          আরও কেনাকাটা করুন (Continue Shopping)
        </Link>
      </div>
    </div>
  );
}
