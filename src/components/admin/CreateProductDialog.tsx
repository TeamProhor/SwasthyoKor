"use client";

import { useState, useTransition } from "react";
import { Add, Trash2 } from "@/components/icons";
import { ResponsiveDialog } from "@/components/shared";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { createProductAction } from "@/lib/actions/admin";
import { compressImageClient } from "@/lib/image";
import {
  SELLING_MODES,
  calculateTotalStock,
  formatPackTitle,
  getDefaultAmountForUnit,
  getProductUnitCategory,
  getProductUnitLabel,
  type ProductUnit,
  type SellingMode,
} from "@/lib/types";
import type { ProductVariantItem } from "./EditProductDialog";

export function CreateProductDialog({
  collections,
}: {
  collections: { id: string; title: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [sellingMode, setSellingMode] = useState<SellingMode>("packaged");


  const [rootUnit, setRootUnit] = useState<ProductUnit>("jar");

  const [variants, setVariants] = useState<ProductVariantItem[]>([
    {
      title: "১ জার",
      amount: 1,
      price: "",
      compareAtPrice: "",
      inventoryQuantity: 0,
      unit: "jar",
    },
  ]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setSellingMode("packaged");
      const defaultUnit: ProductUnit = "jar";
      setRootUnit(defaultUnit);
      const defaultAmt = getDefaultAmountForUnit(defaultUnit);
      setVariants([
        {
          title: formatPackTitle(defaultAmt, defaultUnit),
          amount: defaultAmt,
          price: "",
          compareAtPrice: "",
          inventoryQuantity: 0,
          unit: defaultUnit,
        },
      ]);
      setError(null);
    }
  };

  const handleRootUnitChange = (newUnit: ProductUnit) => {
    setRootUnit(newUnit);
    setVariants((prev) =>
      prev.map((v) => {
        const amt = v.amount && v.amount > 0 ? v.amount : getDefaultAmountForUnit(newUnit);
        return {
          ...v,
          unit: newUnit,
          amount: amt,
          title: formatPackTitle(amt, newUnit),
        };
      }),
    );
  };

  const handleAddVariant = (customAmount?: number) => {
    const amt =
      customAmount !== undefined
        ? customAmount
        : variants.length > 0
          ? (variants[variants.length - 1].amount || 1) + 1
          : getDefaultAmountForUnit(rootUnit);

    const lastVar = variants[variants.length - 1];
    setVariants((prev) => [
      ...prev,
      {
        title: formatPackTitle(amt, rootUnit),
        amount: amt,
        price: lastVar ? lastVar.price : "",
        compareAtPrice: lastVar?.compareAtPrice || "",
        inventoryQuantity: 0,
        unit: rootUnit,
      },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length <= 1) return;
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantAmountChange = (index: number, newAmountStr: string) => {
    const num = parseFloat(newAmountStr) || 0;
    setVariants((prev) =>
      prev.map((v, i) => {
        if (i !== index) return v;
        return {
          ...v,
          amount: num,
          title: num > 0 ? formatPackTitle(num, rootUnit) : v.title,
        };
      }),
    );
  };

  const handleVariantFieldChange = (
    index: number,
    field: keyof ProductVariantItem,
    value: any,
  ) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    );
  };

  // Real-time calculated total stock
  const stockSummary = calculateTotalStock(variants, rootUnit);
  const unitCategory = getProductUnitCategory(rootUnit);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    // Always pass selling mode
    formData.set("sellingMode", sellingMode);

    if (sellingMode !== "packaged") {
      // Bulk mode — pricePerUnit, compareAtPricePerUnit, bulkStockQuantity are in the form natively
      const imageFile = formData.get("image") as File | null;
      if (imageFile && imageFile.size > 0 && imageFile.type.startsWith("image/")) {
        const compressedWebpFile = await compressImageClient(imageFile);
        formData.set("image", compressedWebpFile);
      }
    } else {
      // Packaged mode
      const formattedVariants = variants.map((v) => ({
        ...v,
        unit: rootUnit,
        title:
          v.title.trim() ||
          (v.amount ? formatPackTitle(v.amount, rootUnit) : "স্ট্যান্ডার্ড"),
      }));

      formData.append("variants", JSON.stringify(formattedVariants));
      formData.set("unit", rootUnit);

      if (formattedVariants.length > 0) {
        formData.set("price", formattedVariants[0].price);
        if (formattedVariants[0].compareAtPrice) {
          formData.set("compareAtPrice", formattedVariants[0].compareAtPrice);
        }
        formData.set("inventoryQuantity", String(stockSummary.totalPacks));
      }

      const imageFile = formData.get("image") as File | null;
      if (imageFile && imageFile.size > 0 && imageFile.type.startsWith("image/")) {
        const compressedWebpFile = await compressImageClient(imageFile);
        formData.set("image", compressedWebpFile);
      }
    }

    startTransition(async () => {
      const res = await createProductAction(formData);
      if (res.success) {
        setOpen(false);
      } else {
        setError(res.error || "পণ্য যোগ করতে সমস্যা হয়েছে।");
      }
    });
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="নতুন পণ্য যোগ করুন"
      description="স্বাস্থ্যকর স্টোরে নতুন অর্গানিক পণ্য ও প্যাক সাইজের পরিমাণ এবং মূল্য নির্ধারণ করুন।"
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
        <FieldGroup className="gap-3 sm:gap-4">
          <Field>
            <FieldLabel
              htmlFor="prod-title"
              className="text-xs sm:text-sm font-semibold text-foreground/90"
            >
              পণ্যের নাম *
            </FieldLabel>
            <Input
              id="prod-title"
              name="title"
              placeholder="যেমন: সুন্দরবন খলিশা মধু"
              required
              className="h-10 text-xs sm:text-sm px-3 rounded-lg sm:rounded-xl"
            />
          </Field>

          <Field>
            <FieldLabel
              htmlFor="prod-handle"
              className="text-xs sm:text-sm font-semibold text-foreground/90"
            >
              হ্যান্ডেল (URL Slug) *
            </FieldLabel>
            <Input
              id="prod-handle"
              name="handle"
              placeholder="যেমন: sundarban-honey"
              required
              className="h-10 text-xs sm:text-sm px-3 rounded-lg sm:rounded-xl font-mono"
            />
          </Field>

          {/* ──── Selling Mode ──── */}
          <Field>
            <FieldLabel className="text-xs sm:text-sm font-semibold text-foreground/90">
              বিক্রয় পদ্ধতি *
            </FieldLabel>
            <div className="grid grid-cols-3 gap-2">
              {(["packaged", "gram", "piece"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSellingMode(mode)}
                  className={`h-10 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                    sellingMode === mode
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-background border-input text-foreground hover:bg-muted"
                  }`}
                >
                  {mode === "packaged" ? "📦 প্যাকেজড" : mode === "gram" ? "⚖️ গ্রাম ভিত্তিক" : "🥚 পিস ভিত্তিক"}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              {sellingMode === "packaged"
                ? "ফিক্সড প্যাক সাইজ — যেমন: ৫০০গ্রাম জার, ১কেজি প্যাকেট"
                : sellingMode === "gram"
                  ? "বাল্ক ওজন — স্টক মোট গ্রামে, গ্রাহক ১০০গ্রাম করে অর্ডার করবে"
                  : "বাল্ক পিস — স্টক মোট পিসে, গ্রাহক ১ পিস করে অর্ডার করবে"}
            </p>
          </Field>

          {/* ──── Root Unit & Category ──── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <Field>
              <FieldLabel
                htmlFor="prod-unit"
                className="text-xs sm:text-sm font-semibold text-foreground/90 flex items-center justify-between"
              >
                <span>পণ্যের ইউনিট / টাইপ *</span>
              </FieldLabel>
              <select
                id="prod-unit"
                name="rootUnitSelect"
                value={rootUnit}
                onChange={(e) =>
                  handleRootUnitChange(e.target.value as ProductUnit)
                }
                className="w-full h-10 rounded-lg sm:rounded-xl border border-input bg-background px-3 text-xs sm:text-sm font-medium text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
              >
                <optgroup label="গণনা ভিত্তিক (Count / Container)">
                  <option value="jar">জার (Jar)</option>
                  <option value="bottle">বোতল (Bottle)</option>
                  <option value="piece">পিস (Piece)</option>
                  <option value="packet">প্যাকেট (Packet)</option>
                  <option value="box">বক্স (Box)</option>
                </optgroup>
                <optgroup label="ওজন ভিত্তিক (Weight)">
                  <option value="gram">গ্রাম (Gram)</option>
                  <option value="kg">কেজি (Kg)</option>
                </optgroup>
                <optgroup label="ভলিউম / তরল (Volume)">
                  <option value="ml">মি.লি. (ml)</option>
                  <option value="litre">লিটার (Litre)</option>
                </optgroup>
              </select>
            </Field>

            <Field>
              <FieldLabel
                htmlFor="prod-collection"
                className="text-xs sm:text-sm font-semibold text-foreground/90"
              >
                কালেকশন / ক্যাটাগরি
              </FieldLabel>
              <select
                id="prod-collection"
                name="collectionId"
                className="w-full h-10 rounded-lg sm:rounded-xl border border-input bg-background px-3 text-xs sm:text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
              >
                <option value="">কালেকশন নির্বাচন করুন</option>
                {collections.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* ──── Variant / Pack Sizes Section ──── */}
          <div className="flex flex-col gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl border border-border/70 bg-muted/20 p-2.5 sm:p-4">
            <div className="flex items-center justify-between gap-2 pb-1 border-b border-border/40">
              <span className="text-xs sm:text-sm font-semibold text-foreground/90">
                ভ্যারিয়েন্ট / প্যাকসমূহ ({variants.length})
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddVariant()}
                className="h-8 rounded-lg sm:rounded-xl text-xs font-semibold cursor-pointer shrink-0"
              >
                <Add className="size-3.5 mr-1" />
                <span>+ নতুন প্যাক</span>
              </Button>
            </div>

            {/* Pack Rows */}
            <div className="flex flex-col gap-2.5">
              {variants.map((v, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-2 rounded-lg sm:rounded-xl border border-border bg-card p-2.5 sm:p-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] sm:text-xs font-bold text-muted-foreground">
                        প্যাক #{idx + 1}
                      </span>
                      {/* Live Generated Title Tag */}
                      <span className="inline-flex items-center text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                        {v.title || formatPackTitle(v.amount || 0, rootUnit) || "প্যাক"}
                      </span>
                    </div>
                    {variants.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveVariant(idx)}
                        className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10 cursor-pointer rounded-md"
                        title="এই প্যাকটি মুছুন"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-2.5">
                    {/* Amount / Size Input */}
                    <div>
                      <label className="text-[10px] sm:text-[11px] font-medium text-muted-foreground block mb-1">
                        {unitCategory === "count"
                          ? `সংখ্যা (${getProductUnitLabel(rootUnit)}) *`
                          : `পরিমাণ (${getProductUnitLabel(rootUnit)}) *`}
                      </label>
                      <div className="relative">
                        <Input
                          type="number"
                          step="any"
                          min="0"
                          value={v.amount ?? ""}
                          onChange={(e) =>
                            handleVariantAmountChange(idx, e.target.value)
                          }
                          placeholder={
                            unitCategory === "count"
                              ? "যেমন: 1, 2, 3"
                              : rootUnit === "gram"
                                ? "যেমন: 250, 500, 1000"
                                : "যেমন: 500, 1000"
                          }
                          required
                          className="h-9 text-xs font-mono rounded-lg pr-12"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-medium text-muted-foreground pointer-events-none">
                          {getProductUnitLabel(rootUnit)}
                        </span>
                      </div>
                    </div>

                    {/* Selling Price */}
                    <div>
                      <label className="text-[10px] sm:text-[11px] font-medium text-muted-foreground block mb-1">
                        বিক্রয় মূল্য (৳) *
                      </label>
                      <Input
                        type="number"
                        step="any"
                        value={v.price}
                        onChange={(e) =>
                          handleVariantFieldChange(idx, "price", e.target.value)
                        }
                        placeholder="যেমন: ৩৮০"
                        required
                        className="h-9 text-xs font-mono rounded-lg"
                      />
                    </div>

                    {/* Compare Price */}
                    <div>
                      <label className="text-[10px] sm:text-[11px] font-medium text-muted-foreground block mb-1">
                        পূর্বের মূল্য (৳)
                      </label>
                      <Input
                        type="number"
                        step="any"
                        value={v.compareAtPrice || ""}
                        onChange={(e) =>
                          handleVariantFieldChange(
                            idx,
                            "compareAtPrice",
                            e.target.value,
                          )
                        }
                        placeholder="যেমন: ৪২০"
                        className="h-9 text-xs font-mono rounded-lg"
                      />
                    </div>

                    {/* Pack Stock Count */}
                    <div>
                      <label className="text-[10px] sm:text-[11px] font-medium text-muted-foreground block mb-1">
                        স্টক (প্যাক সংখ্যা) *
                      </label>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            handleVariantFieldChange(
                              idx,
                              "inventoryQuantity",
                              Math.max(0, (v.inventoryQuantity || 0) - 1),
                            )
                          }
                          className="h-9 w-7 flex items-center justify-center rounded-lg border border-border bg-muted/60 hover:bg-muted text-foreground text-xs font-bold transition-colors cursor-pointer shrink-0 select-none"
                          title="১টি কমান"
                        >
                          -
                        </button>
                        <Input
                          type="number"
                          min="0"
                          value={v.inventoryQuantity}
                          onChange={(e) =>
                            handleVariantFieldChange(
                              idx,
                              "inventoryQuantity",
                              Math.max(0, parseInt(e.target.value, 10) || 0),
                            )
                          }
                          required
                          className="h-9 text-xs font-mono rounded-lg px-1 text-center"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleVariantFieldChange(
                              idx,
                              "inventoryQuantity",
                              (v.inventoryQuantity || 0) + 1,
                            )
                          }
                          className="h-9 w-7 flex items-center justify-center rounded-lg border border-border bg-muted/60 hover:bg-muted text-foreground text-xs font-bold transition-colors cursor-pointer shrink-0 select-none"
                          title="১টি বাড়ান"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ──── Bulk Mode Fields (gram / piece) ──── */}
          {sellingMode !== "packaged" && (
            <div className="flex flex-col gap-3 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/30 dark:bg-emerald-950/20 p-3 sm:p-4">
              <span className="text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                {sellingMode === "gram" ? "⚖️ গ্রাম ভিত্তিক বাল্ক স্টক" : "🥚 পিস ভিত্তিক বাল্ক স্টক"}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] sm:text-[11px] font-medium text-muted-foreground block mb-1">
                    {sellingMode === "gram" ? "প্রতি ১০০ গ্রামের মূল্য (৳) *" : "প্রতি ১ পিসের মূল্য (৳) *"}
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      step="any"
                      min="0"
                      name="pricePerUnit"
                      placeholder={sellingMode === "gram" ? "যেমন: ৮০" : "যেমন: ১৫"}
                      required
                      className="h-9 text-xs font-mono rounded-lg pr-14"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-medium text-muted-foreground pointer-events-none">
                      {sellingMode === "gram" ? "৳/১০০গ" : "৳/পিস"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] sm:text-[11px] font-medium text-muted-foreground block mb-1">
                    {sellingMode === "gram" ? "পূর্বের মূল্য (৳/১০০গ্রাম)" : "পূর্বের মূল্য (৳/পিস)"}
                  </label>
                  <Input
                    type="number"
                    step="any"
                    min="0"
                    name="compareAtPricePerUnit"
                    placeholder="ঐচ্ছিক"
                    className="h-9 text-xs font-mono rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] sm:text-[11px] font-medium text-muted-foreground block mb-1">
                  {sellingMode === "gram" ? "মোট স্টক (গ্রামে) *" : "মোট স্টক (পিসে) *"}
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    name="bulkStockQuantity"
                    placeholder={sellingMode === "gram" ? "যেমন: 10000 (= ১০ কেজি)" : "যেমন: 200"}
                    required
                    className="h-9 text-xs font-mono rounded-lg pr-16"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-medium text-muted-foreground pointer-events-none">
                    {sellingMode === "gram" ? "গ্রাম" : "পিস"}
                  </span>
                </div>
                <p className="text-[9px] text-muted-foreground mt-0.5">
                  {sellingMode === "gram"
                    ? "পূর্ণসংখ্যায় মোট গ্রাম লিখুন। যেমন ১০ কেজি = ১০০০০ গ্রাম"
                    : "মোট পিসের সংখ্যা লিখুন।"}
                </p>
              </div>
            </div>
          )}

          <Field>
            <FieldLabel
              htmlFor="prod-image"
              className="text-xs sm:text-sm font-semibold text-foreground/90"
            >
              পণ্যের ছবি
            </FieldLabel>
            <Input
              id="prod-image"
              name="image"
              type="file"
              accept="image/*"
              className="h-10 text-xs rounded-lg sm:rounded-xl file:mr-2.5 file:rounded-md file:border-0 file:bg-muted file:px-2 file:py-1 file:text-xs file:font-semibold"
            />
          </Field>

          <Field>
            <FieldLabel
              htmlFor="prod-desc"
              className="text-xs sm:text-sm font-semibold text-foreground/90"
            >
              বিবরণ
            </FieldLabel>
            <Textarea
              id="prod-desc"
              name="description"
              rows={3}
              placeholder="পণ্য সম্পর্কিত বিস্তারিত বিবরণ..."
              className="text-xs sm:text-sm rounded-lg sm:rounded-xl"
            />
          </Field>
        </FieldGroup>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="h-10 text-xs sm:text-sm rounded-lg sm:rounded-xl px-4"
          >
            বাতিল
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="h-10 text-xs sm:text-sm rounded-lg sm:rounded-xl px-5"
          >
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

