"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AlertTriangle, CheckCircle2, XCircle, Search, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface InventoryItem {
  id: string;
  variantId: string;
  productTitle: string;
  variantTitle: string;
  handle: string;
  price: string;
  imageUrl?: string;
  available: boolean;
}

export function InventoryManager({ initialItems }: { initialItems: InventoryItem[] }) {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "in_stock" | "out_of_stock">("all");

  const handleToggleStock = async (variantId: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, availableForSale: !currentStatus }),
      });

      if (res.ok) {
        setItems((prev) =>
          prev.map((item) =>
            item.variantId === variantId
              ? { ...item, available: !currentStatus }
              : item,
          ),
        );
      }
    } catch (err) {
      console.error("Toggle stock failed:", err);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.productTitle.toLowerCase().includes(search.toLowerCase()) ||
      item.variantTitle.toLowerCase().includes(search.toLowerCase());

    if (filterStatus === "in_stock") return matchesSearch && item.available;
    if (filterStatus === "out_of_stock") return matchesSearch && !item.available;
    return matchesSearch;
  });

  const inStockCount = items.filter((i) => i.available).length;
  const outOfStockCount = items.filter((i) => !i.available).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Metrics Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl border-border bg-card p-4 shadow-xs">
          <div className="text-xs font-semibold text-muted-foreground">মোট আইটেম / ভ্যারিয়েন্ট</div>
          <div className="text-2xl font-extrabold text-foreground mt-1">{items.length}</div>
        </Card>
        <Card className="rounded-2xl border-border bg-card p-4 shadow-xs">
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="size-4" />
            <span>ইন স্টক (বিক্রিযোগ্য)</span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{inStockCount}</div>
        </Card>
        <Card className="rounded-2xl border-border bg-card p-4 shadow-xs">
          <div className="text-xs font-semibold text-rose-500 flex items-center gap-1.5">
            <AlertTriangle className="size-4" />
            <span>স্টক আউট (শেষ)</span>
          </div>
          <div className="text-2xl font-extrabold text-rose-500 mt-1">{outOfStockCount}</div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Input
            placeholder="পণ্য বা ভ্যারিয়েন্ট খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("all")}
            className="rounded-full text-xs font-semibold"
          >
            সবগুলো ({items.length})
          </Button>
          <Button
            variant={filterStatus === "in_stock" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("in_stock")}
            className="rounded-full text-xs font-semibold"
          >
            ইন স্টক ({inStockCount})
          </Button>
          <Button
            variant={filterStatus === "out_of_stock" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("out_of_stock")}
            className="rounded-full text-xs font-semibold"
          >
            স্টক আউট ({outOfStockCount})
          </Button>
        </div>
      </div>

      {/* Inventory Table */}
      <Card className="rounded-2xl border-border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-bold text-xs">পণ্য</TableHead>
              <TableHead className="font-bold text-xs">ভ্যারিয়েন্ট / সাইজ</TableHead>
              <TableHead className="font-bold text-xs">মূল্য</TableHead>
              <TableHead className="font-bold text-xs">স্টক স্ট্যাটাস</TableHead>
              <TableHead className="text-right font-bold text-xs">টগল অ্যাকশন</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.variantId} className="border-border">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative size-10 flex-none overflow-hidden rounded-lg border border-border bg-muted">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.productTitle}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <Link
                      href={`/product/${item.handle}`}
                      target="_blank"
                      className="text-xs font-bold text-foreground hover:text-emerald-600 line-clamp-1 flex items-center gap-1"
                    >
                      <span>{item.productTitle}</span>
                      <ArrowUpRight className="size-3 text-muted-foreground" />
                    </Link>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground font-medium">
                  {item.variantTitle || "ডিফল্ট ভ্যারিয়েন্ট"}
                </TableCell>
                <TableCell className="text-xs font-extrabold text-foreground">
                  ৳{item.price}
                </TableCell>
                <TableCell>
                  {item.available ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                      <CheckCircle2 className="size-3" />
                      ইন স্টক
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-600 dark:bg-rose-950/60 dark:text-rose-300">
                      <XCircle className="size-3" />
                      স্টক শেষ
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant={item.available ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleToggleStock(item.variantId, item.available)}
                    className={`rounded-xl text-xs font-bold ${
                      item.available
                        ? "text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/50"
                        : "bg-emerald-600 text-white hover:bg-emerald-500"
                    }`}
                  >
                    {item.available ? "স্টক আউট করুন" : "স্টকে যুক্ত করুন"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
