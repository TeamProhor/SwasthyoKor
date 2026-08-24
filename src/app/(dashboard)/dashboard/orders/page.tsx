import Link from "next/link";
import { redirect } from "next/navigation";
import { Box } from "@/components/icons";
import Price from "@/components/price";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";

export const metadata = {
  title: "আমার অর্ডারসমূহ| স্বাস্থ্যকর",
  description: "আপনার অতীত ও সাম্প্রতিক অর্ডারসমূহের তালিকা ও ট্র্যাকিং।",
};

export default async function UserOrdersPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?callbackUrl=/dashboard/orders");
  }

  // Fetch all orders
  const allOrders = await db.select().from(orders);
  // Match orders by user email if available, otherwise display all orders for this session/user
  const userOrders = allOrders.filter(
    (o) => !o.email || o.email === user.email,
  );

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "confirmed":
      case "delivered":
        return "default";
      case "shipped":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            আমার অর্ডারসমূহ
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            মোট {userOrders.length}টি অর্ডার পাওয়া গিয়েছে।
          </p>
        </div>
        <Button
          render={
            <Link href="/search">
              <Box data-icon="inline-start" />
              <span>নতুন অর্ডার করুন</span>
            </Link>
          }
          className="rounded-xl shadow-xs"
        />
      </div>

      <Card className="rounded-2xl border-border bg-card shadow-xs overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-bold">
            অর্ডারের ইতিহাস ও ট্র্যাকিং
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6 py-4">অর্ডার আইডি</TableHead>
                <TableHead className="px-6 py-4">তারিখ</TableHead>
                <TableHead className="px-6 py-4">আইটেম বিবরণ</TableHead>
                <TableHead className="px-6 py-4">মোট টাকা</TableHead>
                <TableHead className="px-6 py-4">স্ট্যাটাস</TableHead>
                <TableHead className="px-6 py-4 text-right">রসিদ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <Empty>
                      <EmptyHeader>
                        <EmptyTitle>এখনো কোনো অর্ডার নেই</EmptyTitle>
                        <EmptyDescription>
                          আপনার পছন্দের স্বাস্থ্যকর পণ্য অর্ডার করতে শপ ব্রাউজ করুন।
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              ) : (
                userOrders.map((ord) => {
                  const itemCount = ord.items.reduce(
                    (sum, item) => sum + item.quantity,
                    0,
                  );
                  return (
                    <TableRow key={ord.id}>
                      <TableCell className="px-6 py-4 font-mono font-bold text-foreground">
                        #{ord.id.slice(0, 8)}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-xs text-muted-foreground">
                        {new Date(ord.createdAt).toLocaleDateString("bn-BD")}
                      </TableCell>
                      <TableCell className="px-6 py-4 font-medium text-foreground">
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm">
                            {ord.items[0]?.productTitle || "পণ্য"}
                            {ord.items.length > 1
                              ? ` সহ আরও ${ord.items.length - 1}টি`
                              : ""}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            মোট {itemCount}টি আইটেম
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400">
                        <Price
                          amount={ord.totalAmount.toFixed(2)}
                          currencyCode={ord.totalCurrency}
                        />
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge variant={getBadgeVariant(ord.status)}>
                          {ord.status === "confirmed"
                            ? "কনফার্মড"
                            : ord.status === "shipped"
                              ? "ডেলিভারিতে"
                              : ord.status === "delivered"
                                ? "ডেলিভার্ড"
                                : ord.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          render={
                            <Link href={`/order/${ord.id}`}>
                              <span>বিস্তারিত দেখুন</span>
                            </Link>
                          }
                          className="rounded-xl text-xs font-semibold"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
