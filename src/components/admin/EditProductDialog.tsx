"use client";

import { useState, useTransition } from "react";
import { Edit } from "@/components/icons";
import { ResponsiveDialog } from "@/components/shared";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { updateProductAction } from "@/lib/actions/admin";
import { compressImageClient } from "@/lib/image";

export interface EditProductItem {
  id: string;
  title: string;
  handle: string;
  price: string;
  compareAtPrice?: string;
  description?: string;
  collectionId?: string;
  imageUrl?: string;
  available: boolean;
}

export function EditProductDialog({
  product,
  collections,
}: {
  product: EditProductItem;
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
    formData.append("id", product.id);

    // Compress client-side to WebP if image file is selected
    const imageFile = formData.get("image") as File | null;
    if (
      imageFile &&
      imageFile.size > 0 &&
      imageFile.type.startsWith("image/")
    ) {
      const compressedWebpFile = await compressImageClient(imageFile);
      formData.set("image", compressedWebpFile);
    }

    startTransition(async () => {
      const res = await updateProductAction(formData);
      if (res.success) {
        setOpen(false);
      } else {
        setError(res.error || "পণ্য আপডেট করতে সমস্যা হয়েছে।");
      }
    });
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      title="পণ্য সম্পাদনা করুন"
      description="পণ্যের নাম, হ্যান্ডেল, মূল্য, পূর্বের মূল্য (ডিসকাউন্ট), স্টক এবং বিবরণ পরিবর্তন করুন।"
      trigger={
        <Button
          variant="ghost"
          size="sm"
          className="text-foreground hover:bg-muted cursor-pointer rounded-xl"
          title="সম্পাদনা করুন"
        >
          <Edit className="size-4" />
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
            <FieldLabel htmlFor={`prod-title-${product.id}`}>
              পণ্যের নাম *
            </FieldLabel>
            <Input
              id={`prod-title-${product.id}`}
              name="title"
              defaultValue={product.title}
              required
              className="rounded-xl"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor={`prod-handle-${product.id}`}>
              হ্যান্ডেল (URL Slug) *
            </FieldLabel>
            <Input
              id={`prod-handle-${product.id}`}
              name="handle"
              defaultValue={product.handle}
              required
              className="rounded-xl"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field>
              <FieldLabel htmlFor={`prod-price-${product.id}`}>
                বিক্রয় মূল্য (টাকা) *
              </FieldLabel>
              <Input
                id={`prod-price-${product.id}`}
                name="price"
                type="number"
                step="any"
                defaultValue={product.price}
                required
                className="rounded-xl"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor={`prod-compare-${product.id}`}>
                পূর্বের মূল্য (ঐচ্ছিক)
              </FieldLabel>
              <Input
                id={`prod-compare-${product.id}`}
                name="compareAtPrice"
                type="number"
                step="any"
                defaultValue={product.compareAtPrice || ""}
                placeholder="যেমন: ৮৫০"
                className="rounded-xl"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor={`prod-status-${product.id}`}>
                স্টক স্ট্যাটাস
              </FieldLabel>
              <select
                id={`prod-status-${product.id}`}
                name="availableForSale"
                defaultValue={product.available ? "true" : "false"}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
              >
                <option value="true">ইন স্টক (In Stock)</option>
                <option value="false">স্টক শেষ (Out of Stock)</option>
              </select>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor={`prod-collection-${product.id}`}>
              কালেকশন / ক্যাটাগরি
            </FieldLabel>
            <select
              id={`prod-collection-${product.id}`}
              name="collectionId"
              defaultValue={product.collectionId || ""}
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
            <FieldLabel htmlFor={`prod-image-${product.id}`}>
              নতুন ছবি পরিবর্তন (ঐচ্ছিক)
            </FieldLabel>
            <Input
              id={`prod-image-${product.id}`}
              name="image"
              type="file"
              accept="image/*"
              className="rounded-xl file:mr-3 file:rounded-lg file:border-0 file:bg-muted file:px-2.5 file:py-1 file:text-xs file:font-semibold"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor={`prod-desc-${product.id}`}>বিবরণ</FieldLabel>
            <Textarea
              id={`prod-desc-${product.id}`}
              name="description"
              rows={3}
              defaultValue={product.description || ""}
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
                <span>আপডেট হচ্ছে...</span>
              </>
            ) : (
              "আপডেট করুন"
            )}
          </Button>
        </div>
      </form>
    </ResponsiveDialog>
  );
}
