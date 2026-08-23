import { OrdersTable } from "@/components/admin";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";

export const metadata = {
  title: "অর্ডার পরিচালনা | অ্যাডমিন",
  description: "গ্রাহকদের সমস্ত অর্ডার ট্র্যাকিং ও স্ট্যাটাস আপডেট।",
};

export default async function AdminOrdersPage() {
  const allOrders = await db.select().from(orders);

  const formattedOrders = allOrders.map((order) => ({
    id: order.id,
    totalAmount: order.totalAmount,
    totalCurrency: order.totalCurrency,
    status: order.status,
    createdAt: order.createdAt,
    itemsCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    email: order.email,
  }));

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            অর্ডার পরিচালনা 🧾
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            মোট {formattedOrders.length}টি অর্ডার পাওয়া গিয়েছে।
          </p>
        </div>
      </div>

      <OrdersTable orders={formattedOrders} />
    </div>
  );
}
