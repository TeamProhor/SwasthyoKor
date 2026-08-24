import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle, Receipt } from "@/components/icons";
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
  title: "পেমেন্ট হিস্ট্রি| স্বাস্থ্যকর",
  description: "আপনার সমস্ত লেনদেন এবং পেমেন্ট রসিদ।",
};

export default async function UserPaymentsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?callbackUrl=/dashboard/payments");
  }

  const allOrders = await db.select().from(orders);
  const userOrders = allOrders.filter(
    (o) => !o.email || o.email === user.email,
  );

  const totalSpent = userOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            পেমেন্ট হিস্ট্রি
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            আপনার অতীত সমস্ত লেনদেন ও ইনভয়েস রসিদ।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="rounded-2xl border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              সর্বমোট কেনাকাটা
            </CardTitle>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Receipt className="size-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ৳{totalSpent.toLocaleString("bn-BD")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              মোট {userOrders.length}টি অর্ডারে পরিশোধিত
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ডিফল্ট পেমেন্ট মেথড
            </CardTitle>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="size-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ক্যাশ অন ডেলিভারি
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              পণ্য হাতে পেয়ে মূল্য পরিশোধের সুবিধা
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-border bg-card shadow-xs overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-bold">লেনদেন বিবরণী</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6 py-4">ট্রানজেকশন আইডি</TableHead>
                <TableHead className="px-6 py-4">তারিখ</TableHead>
                <TableHead className="px-6 py-4">পেমেন্ট মেথড</TableHead>
                <TableHead className="px-6 py-4">পরিমাণ</TableHead>
                <TableHead className="px-6 py-4">স্ট্যাটাস</TableHead>
                <TableHead className="px-6 py-4 text-right">ইনভয়েস</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <Empty>
                      <EmptyHeader>
                        <EmptyTitle>কোনো লেনদেন রেকর্ড নেই</EmptyTitle>
                        <EmptyDescription>
                          অর্ডার সম্পন্ন করার পর আপনার পেমেন্ট হিস্ট্রিএখানে জমা হবে।
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              ) : (
                userOrders.map((ord) => (
                  <TableRow key={ord.id}>
                    <TableCell className="px-6 py-4 font-mono font-bold text-foreground">
                      TXN-{ord.id.slice(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-xs text-muted-foreground">
                      {new Date(ord.createdAt).toLocaleDateString("bn-BD")}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm font-medium text-foreground">
                      ক্যাশ অন ডেলিভারি (COD)
                    </TableCell>
                    <TableCell className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400">
                      <Price
                        amount={ord.totalAmount.toFixed(2)}
                        currencyCode={ord.totalCurrency}
                      />
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge variant="default">
                        {ord.status === "delivered" ? "পরিশোধিত" : "প্রক্রিয়াধীন"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        render={
                          <Link href={`/order/${ord.id}`}>
                            <span>ইনভয়েস দেখুন</span>
                          </Link>
                        }
                        className="rounded-xl text-xs font-semibold"
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
