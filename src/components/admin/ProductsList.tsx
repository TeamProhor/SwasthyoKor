"use client";

import { useMemo, useState, useTransition } from "react";
import { SearchNormal, Trash2 } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteProductAction } from "@/lib/actions/admin";
import { EditProductDialog, type EditProductItem } from "./EditProductDialog";
import { QuickList, type QuickListItem } from "./QuickList";

export function ProductsList({
  products,
  collections = [],
}: {
  products: EditProductItem[];
  collections?: { id: string; title: string }[];
}) {
  const [query, setQuery] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<string>("all");
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই পণ্যটি মুছে ফেলতে চান?")) return;
    setDeletingId(id);
    startTransition(async () => {
      await deleteProductAction(id);
      setDeletingId(null);
    });
  };

  const collectionMap = useMemo(
    () => new Map(collections.map((c) => [c.id, c.title])),
    [collections],
  );

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.handle.toLowerCase().includes(query.toLowerCase()) ||
        item.price.includes(query);

      const matchCategory =
        selectedCollection === "all" || item.collectionId === selectedCollection;

      return matchSearch && matchCategory;
    });
  }, [products, query, selectedCollection]);

  const items: QuickListItem[] = filteredProducts.map((item) => {
    const colTitle = item.collectionId
      ? collectionMap.get(item.collectionId)
      : undefined;

    return {
      id: item.id,
      title: item.title,
      subtitle: `/${item.handle}`,
      logoUrl: item.imageUrl,
      badgeText: item.available ? "ইন স্টক" : "স্টক শেষ",
      badgeVariant: item.available ? "success" : "destructive",
      tags: [
        {
          text: `৳${item.price}`,
          variant: "default",
        },
        ...(colTitle
          ? [
              {
                text: colTitle,
                variant: "secondary" as const,
              },
            ]
          : []),
      ],
      actions: (
        <div className="flex items-center gap-1">
          <EditProductDialog product={item} collections={collections} />
          <Button
            variant="ghost"
            size="sm"
            disabled={isPending && deletingId === item.id}
            onClick={() => handleDelete(item.id)}
            className="text-destructive hover:bg-destructive/10 cursor-pointer rounded-xl h-8 w-8 p-0"
            title="মুছে ফেলুন"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    };
  });

  return (
    <div className="flex flex-col gap-4">
      {/* ─── Search & Filter Bar ─── */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:flex-1">
          <SearchNormal className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="পণ্য খুঁজুন (নাম, হ্যান্ডেল অথবা মূল্য)..."
            className="pl-10 rounded-xl bg-card"
          />
        </div>

        {collections.length > 0 && (
          <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            className="w-full sm:w-48 rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
          >
            <option value="all">সকল ক্যাটাগরি</option>
            {collections.map((col) => (
              <option key={col.id} value={col.id}>
                {col.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* ─── Products QuickList ─── */}
      <QuickList
        items={items}
        emptyMessage={
          query || selectedCollection !== "all"
            ? "অনুসন্ধানের সাথে মেলে এমন কোনো পণ্য পাওয়া যায়নি।"
            : "কোনো পণ্য পাওয়া যায়নি। আপনার স্টোরে পণ্য যোগ করতে 'নতুন পণ্য যোগ করুন' বাটনে ক্লিক করুন।"
        }
      />
    </div>
  );
}
