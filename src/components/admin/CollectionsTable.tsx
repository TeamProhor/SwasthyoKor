"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Trash2 } from "@/components/icons";
import { Button } from "@/components/ui/button";
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
import { deleteCollectionAction } from "@/lib/actions/admin";

interface CollectionItem {
  id: string;
  title: string;
  handle: string;
  description?: string | null;
  createdAt: Date;
}

export function CollectionsTable({
  collections,
}: {
  collections: CollectionItem[];
}) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই কালেকশনটি মুছে ফেলতে চান?")) return;
    setDeletingId(id);
    startTransition(async () => {
      await deleteCollectionAction(id);
      setDeletingId(null);
    });
  };

  return (
    <div className="w-full rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-4">কালেকশন</TableHead>
            <TableHead className="px-6 py-4">হ্যান্ডেল (Slug)</TableHead>
            <TableHead className="px-6 py-4">বিবরণ</TableHead>
            <TableHead className="px-6 py-4">তৈরির তারিখ</TableHead>
            <TableHead className="px-6 py-4 text-right">অ্যাকশন</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collections.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-48 text-center">
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle>কোনো কালেকশন পাওয়া যায়নি</EmptyTitle>
                    <EmptyDescription>
                      নতুন ক্যাটাগরি তৈরি করতে 'নতুন কালেকশন' বাটনে চাপ দিন।
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </TableCell>
            </TableRow>
          ) : (
            collections.map((col) => (
              <TableRow key={col.id}>
                <TableCell className="px-6 py-4 font-bold text-foreground">
                  <Link
                    href={`/search/${col.handle}`}
                    className="hover:underline hover:text-primary transition-colors"
                  >
                    {col.title}
                  </Link>
                </TableCell>
                <TableCell className="px-6 py-4 font-mono text-xs text-muted-foreground">
                  /{col.handle}
                </TableCell>
                <TableCell className="px-6 py-4 text-xs text-muted-foreground max-w-xs truncate">
                  {col.description || "—"}
                </TableCell>
                <TableCell className="px-6 py-4 text-xs text-muted-foreground">
                  {new Date(col.createdAt).toLocaleDateString("bn-BD")}
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isPending && deletingId === col.id}
                    onClick={() => handleDelete(col.id)}
                    className="text-destructive hover:bg-destructive/10 cursor-pointer rounded-xl"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
