"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Edit, Trash2 } from "@/components/icons";
import { ResponsiveDialog } from "@/components/shared";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteCollectionAction,
  updateCollectionAction,
} from "@/lib/actions/admin";

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
  const [editingCol, setEditingCol] = useState<CollectionItem | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই কালেকশনটি মুছে ফেলতে চান?")) return;
    setDeletingId(id);
    startTransition(async () => {
      await deleteCollectionAction(id);
      setDeletingId(null);
    });
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCol) return;
    setEditError(null);
    const formData = new FormData(e.currentTarget);
    formData.append("id", editingCol.id);

    startTransition(async () => {
      const res = await updateCollectionAction(formData);
      if (res.success) {
        setEditingCol(null);
      } else {
        setEditError(res.error || "কালেকশন আপডেট করতে সমস্যা হয়েছে।");
      }
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
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingCol(col)}
                      className="text-foreground hover:bg-muted cursor-pointer rounded-xl h-8 w-8 p-0"
                      title="সম্পাদনা করুন"
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isPending && deletingId === col.id}
                      onClick={() => handleDelete(col.id)}
                      className="text-destructive hover:bg-destructive/10 cursor-pointer rounded-xl h-8 w-8 p-0"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Edit Collection Dialog */}
      {editingCol && (
        <ResponsiveDialog
          open={Boolean(editingCol)}
          onOpenChange={(open) => !open && setEditingCol(null)}
          title="কালেকশন / ক্যাটাগরি সম্পাদনা"
          description="কালেকশনের নাম, হ্যান্ডেল ও বিবরণ আপডেট করুন।"
        >
          {editError && (
            <Alert variant="destructive">
              <AlertDescription>{editError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
            <FieldGroup className="gap-3.5">
              <Field>
                <FieldLabel htmlFor="edit-col-title">কালেকশনের নাম *</FieldLabel>
                <Input
                  id="edit-col-title"
                  name="title"
                  defaultValue={editingCol.title}
                  required
                  className="rounded-xl"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="edit-col-handle">
                  হ্যান্ডেল (URL Slug) *
                </FieldLabel>
                <Input
                  id="edit-col-handle"
                  name="handle"
                  defaultValue={editingCol.handle}
                  required
                  className="rounded-xl font-mono text-xs"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="edit-col-desc">বিবরণ</FieldLabel>
                <Textarea
                  id="edit-col-desc"
                  name="description"
                  rows={3}
                  defaultValue={editingCol.description || ""}
                  className="rounded-xl text-xs"
                />
              </Field>
            </FieldGroup>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingCol(null)}
                className="rounded-xl"
              >
                বাতিল
              </Button>
              <Button type="submit" disabled={isPending} className="rounded-xl">
                {isPending ? (
                  <>
                    <Spinner className="size-4 mr-1" />
                    <span>আপডেট হচ্ছে...</span>
                  </>
                ) : (
                  "আপডেট সম্পন্ন করুন"
                )}
              </Button>
            </div>
          </form>
        </ResponsiveDialog>
      )}
    </div>
  );
}
