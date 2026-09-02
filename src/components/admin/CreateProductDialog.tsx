"use client";

import { useState, useTransition } from "react";
import { Add } from "@/components/icons";
import { ResponsiveDialog } from "@/components/shared";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { createProductAction } from "@/lib/actions/admin";
import { compressImageClient } from "@/lib/image";

export function CreateProductDialog({
  collections,
}: {
  collections: { id: string; title: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    // Compress client-side to WebP if image file is selected
    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0 && imageFile.type.startsWith("image/")) {
      const compressedWebpFile = await compressImageClient(imageFile);
      formData.set("image", compressedWebpFile);
    }

    startTransition(async () => {
      const res = await createProductAction(formData);
      if (res.success) {
        setOpen(false);
      } else {
        setError(res.error || "পণ্য যোগ করতে সমস্যা হয়েছে।");
      }
    });
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      title="নতুন পণ্য যোগ করুন"
      description="স্বাস্থ্যকর স্টোরে নতুন অর্গানিক পণ্য ও মূল্য নির্ধারণ করুন।"
      trigger={
        <Button className="rounded-xl shadow-xs">
          <Add data-icon="inline-start" />
          <span>নতুন পণ্য যোগ করুন</span>
        </Button>
      }
    >
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel htmlFor="prod-title">পণ্যের নাম *</FieldLabel>
            <Input
              id="prod-title"
              name="title"
              placeholder="যেমন: খাঁটি সুন্দরবন মধু"
              required
              className="rounded-xl"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="prod-handle">হ্যান্ডেল (URL Slug) *</FieldLabel>
            <Input
              id="prod-handle"
              name="handle"
              placeholder="যেমন: sundarban-honey"
              required
              className="rounded-xl"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="prod-price">মূল্য (টাকা) *</FieldLabel>
              <Input
                id="prod-price"
                name="price"
                type="number"
                step="any"
                placeholder="যেমন: ৭৫০"
                required
                className="rounded-xl"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="prod-compare-price">পূর্বের মূল্য (ঐচ্ছিক)</FieldLabel>
              <Input
                id="prod-compare-price"
                name="compareAtPrice"
                type="number"
                step="any"
                placeholder="যেমন: ৮৫০ (ছাড় দেখাতে)"
                className="rounded-xl"
              />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="prod-collection">কালেকশন / ক্যাটাগরি</FieldLabel>
            <select
              id="prod-collection"
              name="collectionId"
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
            >
              <option value="">কালেকশন নির্বাচন করুন (ঐচ্ছিক)</option>
              {collections.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>
          </Field>

          <Field>
            <FieldLabel htmlFor="prod-image">
              পণ্যের ছবি
            </FieldLabel>
            <Input
              id="prod-image"
              name="image"
              type="file"
              accept="image/*"
              className="rounded-xl file:mr-3 file:rounded-lg file:border-0 file:bg-muted file:px-2.5 file:py-1 file:text-xs file:font-semibold"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="prod-desc">বিবরণ</FieldLabel>
            <Textarea
              id="prod-desc"
              name="description"
              rows={3}
              placeholder="পণ্য সম্পর্কিত বিস্তারিত বিবরণ..."
              className="rounded-xl"
            />
          </Field>
        </FieldGroup>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="rounded-xl"
          >
            বাতিল
          </Button>
          <Button type="submit" disabled={isPending} className="rounded-xl">
            {isPending ? (
              <>
                <Spinner data-icon="inline-start" className="size-4" />
                <span>সংরক্ষণ হচ্ছে...</span>
              </>
            ) : (
              "সংরক্ষণ করুন"
            )}
          </Button>
        </div>
      </form>
    </ResponsiveDialog>
  );
}
