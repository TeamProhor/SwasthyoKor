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
import { createCollectionAction } from "@/lib/actions/admin";

export function CreateCollectionDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await createCollectionAction(formData);
      if (res.success) {
        setOpen(false);
      } else {
        setError(res.error || "কালেকশন তৈরি করতে সমস্যা হয়েছে।");
      }
    });
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      title="নতুন কালেকশন যোগ করুন"
      description="নতুন পণ্য ক্যাটাগরি বা কালেকশন তৈরি করুন।"
      trigger={
        <Button className="rounded-xl shadow-xs">
          <Add data-icon="inline-start" />
          <span>নতুন কালেকশন</span>
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
            <FieldLabel htmlFor="col-title">কালেকশনের নাম *</FieldLabel>
            <Input
              id="col-title"
              name="title"
              placeholder="যেমন: খাঁটি মধু ও ঘি"
              required
              className="rounded-xl"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="col-handle">হ্যান্ডেল (URL Slug) *</FieldLabel>
            <Input
              id="col-handle"
              name="handle"
              placeholder="যেমন: honey-and-ghee"
              required
              className="rounded-xl"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="col-desc">বিবরণ</FieldLabel>
            <Textarea
              id="col-desc"
              name="description"
              rows={3}
              placeholder="কালেকশন সম্পর্কিত সংক্ষিপ্ত বিবরণ..."
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
