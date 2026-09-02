"use client";

import { useMemo, useState } from "react";
import { SearchNormal } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { type AdminOrderItem, ManageOrderDialog } from "./ManageOrderDialog";
import { QuickList, type QuickListItem } from "./QuickList";

export function OrdersList({ orders }: { orders: AdminOrderItem[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return { text: "কনফার্মড", variant: "default" as const };
      case "shipped":
        return { text: "ডেলিভারিতে", variant: "warning" as const };
      case "delivered":
        return { text: "ডেলিভার্ড", variant: "success" as const };
      case "cancelled":
        return { text: "বাতিল", variant: "destructive" as const };
      default:
        return { text: status, variant: "secondary" as const };
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const matchSearch =
        ord.id.toLowerCase().includes(query.toLowerCase()) ||
        (ord.email?.toLowerCase().includes(query.toLowerCase())) ||
        String(ord.totalAmount).includes(query);

      const matchStatus =
        statusFilter === "all" || ord.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [orders, query, statusFilter]);

  const items: QuickListItem[] = filteredOrders.map((order) => {
    const badge = getStatusBadge(order.status);
    const dateFormatted = new Date(order.createdAt).toLocaleDateString("bn-BD");

    return {
      id: order.id,
      title: `অর্ডার #${order.id.slice(0, 8)}`,
      subtitle: order.email || "অতিথি গ্রাহক",
      badgeText: badge.text,
      badgeVariant: badge.variant,
      tags: [
        {
          text: `৳${order.totalAmount.toLocaleString("bn-BD")}`,
          variant: "default",
        },
        {
          text: `${order.itemsCount}টি পণ্য`,
          variant: "secondary",
        },
        {
          text: dateFormatted,
          variant: "secondary",
        },
      ],
      actions: <ManageOrderDialog order={order} />,
    };
  });

  return (
    <div className="flex flex-col gap-4">
      {/* ─── Search & Status Filter ─── */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:flex-1">
          <SearchNormal className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="অর্ডার খুঁজুন (অর্ডার আইডি, ইমেইল বা পরিমাণ)..."
            className="pl-10 rounded-xl bg-card"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48 rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring cursor-pointer"
        >
          <option value="all">সকল স্ট্যাটাস</option>
          <option value="confirmed">কনফার্মড</option>
          <option value="shipped">ডেলিভারিতে</option>
          <option value="delivered">ডেলিভার্ড</option>
          <option value="cancelled">বাতিল</option>
        </select>
      </div>

      {/* ─── Orders QuickList ─── */}
      <QuickList
        items={items}
        emptyMessage={
          query || statusFilter !== "all"
            ? "অনুসন্ধানের সাথে মেলে এমন কোনো অর্ডার পাওয়া যায়নি।"
            : "এখনো কোনো অর্ডার আসেনি। গ্রাহকরা পণ্য অর্ডার করলে তা এখানে প্রদর্শিত হবে।"
        }
      />
    </div>
  );
}
