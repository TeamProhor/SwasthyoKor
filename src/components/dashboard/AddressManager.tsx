"use client";

import { useState } from "react";
import { Plus, MapPin, Phone, User, Trash2, CheckCircle2, Home, Building2 } from "lucide-react";
import { ResponsiveDialog } from "@/components/shared/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserAddress } from "@/lib/db/schema";

export function AddressManager({ initialAddresses }: { initialAddresses: UserAddress[] }) {
  const [addresses, setAddresses] = useState<UserAddress[]>(initialAddresses);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    label: "বাসা / Home",
    fullName: "",
    phone: "",
    district: "ঢাকা",
    thana: "",
    streetAddress: "",
    isDefault: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "ঠিকানা সংরক্ষণ করা যায়নি");
      }

      if (formData.isDefault) {
        setAddresses((prev) => [
          data.address,
          ...prev.map((a) => ({ ...a, isDefault: false })),
        ]);
      } else {
        setAddresses((prev) => [data.address, ...prev]);
      }

      setIsOpen(false);
      setFormData({
        label: "বাসা / Home",
        fullName: "",
        phone: "",
        district: "ঢাকা",
        thana: "",
        streetAddress: "",
        isDefault: false,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই ঠিকানাটি মুছে ফেলতে চান?")) return;

    try {
      const res = await fetch(`/api/user/addresses?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            আপনার সংরক্ষিত ঠিকানা
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            চেকআউটে দ্রুত ডেলিভারির জন্য ঠিকানা সেভ করে রাখুন।
          </p>
        </div>

        <ResponsiveDialog
          open={isOpen}
          onOpenChange={setIsOpen}
          title="নতুন ডেলিভারি ঠিকানা"
          description="আপনার সঠিক ডেলিভারি তথ্য প্রদান করুন।"
          trigger={
            <Button size="sm" className="rounded-xl bg-emerald-600 font-bold text-white shadow-xs hover:bg-emerald-500">
              <Plus className="size-4" />
              <span>ঠিকানা যোগ করুন</span>
            </Button>
          }
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-2.5 text-xs font-semibold text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="label" className="text-xs font-semibold">লেবেল</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="যেমন: বাসা, অফিস"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="fullName" className="text-xs font-semibold">প্রাপকের নাম</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="পূর্ণ নাম"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="phone" className="text-xs font-semibold">মোবাইল নম্বর</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="01XXXXXXXXX"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="district" className="text-xs font-semibold">জেলা</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="যেমন: ঢাকা, চট্টগ্রাম"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="thana" className="text-xs font-semibold">থানা / উপজেলা</Label>
              <Input
                id="thana"
                value={formData.thana}
                onChange={(e) => setFormData({ ...formData, thana: e.target.value })}
                placeholder="যেমন: মিরপুর, ধানমন্ডি, গুলশান"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="streetAddress" className="text-xs font-semibold">বিস্তারিত ঠিকানা (বাড়ি, রোড, ফ্ল্যাট)</Label>
              <Input
                id="streetAddress"
                value={formData.streetAddress}
                onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                placeholder="বাড়ি নং, রোড নং, এলাকা..."
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="size-4 rounded accent-emerald-600 cursor-pointer"
              />
              <Label htmlFor="isDefault" className="text-xs font-medium cursor-pointer">
                ডিফল্ট ডেলিভারি ঠিকানা হিসেবে সেট করুন
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-xl bg-emerald-600 font-bold text-white hover:bg-emerald-500"
            >
              {isLoading ? "সংরক্ষণ হচ্ছে..." : "ঠিকানা সংরক্ষণ করুন"}
            </Button>
          </form>
        </ResponsiveDialog>
      </div>

      {/* Address Cards Grid */}
      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 p-8 sm:p-12 text-center bg-card">
          <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 mb-3">
            <MapPin className="size-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">কোনো ঠিকানা সংরক্ষিত নেই</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            সহজে চেকআউট করার জন্য আপনার বাসা বা অফিসের ঠিকানা যোগ করুন।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card
              key={address.id}
              className="relative overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-all hover:border-emerald-500/40"
            >
              <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        {address.label.includes("অফিস") ? (
                          <Building2 className="size-4" />
                        ) : (
                          <Home className="size-4" />
                        )}
                      </div>
                      <span className="text-xs font-bold text-foreground">
                        {address.label}
                      </span>
                    </div>

                    {address.isDefault && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                        <CheckCircle2 className="size-3" />
                        ডিফল্ট
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs text-muted-foreground mt-3">
                    <div className="flex items-center gap-2 text-foreground font-semibold">
                      <User className="size-3.5 text-emerald-600" />
                      <span>{address.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="size-3.5 text-emerald-600" />
                      <span>{address.phone}</span>
                    </div>
                    <div className="flex items-start gap-2 pt-0.5">
                      <MapPin className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">
                        {address.streetAddress}, {address.thana}, {address.district}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 mt-2 border-t border-border/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(address.id)}
                    className="size-8 p-0 text-muted-foreground hover:text-red-500 rounded-lg"
                    title="ডিলিট করুন"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
