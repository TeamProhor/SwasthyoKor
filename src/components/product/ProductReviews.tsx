"use client";

import Link from "next/link";
import { useState } from "react";
import { Star, MessagePlus, ArrowDoorIn } from "@/components/icons";
import { ResponsiveDialog } from "@/components/shared/ResponsiveDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/use-auth";

import { submitReviewAction } from "@/lib/actions/user";

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string | null;
  rating: number;
  date: string;
  comment: string;
}

export function ProductReviews({
  productTitle: _productTitle,
  productHandle,
  initialReviews = [],
}: {
  productTitle: string;
  productHandle?: string;
  initialReviews?: Review[];
}) {
  const { data: user } = useUser();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isOpen, setIsOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !user || !productHandle) return;

    setIsSubmitting(true);
    try {
      const res = await submitReviewAction({
        productHandle,
        rating: newRating,
        comment: comment.trim(),
      });

      if (res.success && res.review) {
        const newRev: Review = {
          id: res.review.id,
          userName: res.review.userName,
          userAvatar: res.review.userAvatar,
          rating: res.review.rating,
          date: "আজকে",
          comment: res.review.comment,
        };

        setReviews([newRev, ...reviews]);
        setComment("");
        setIsOpen(false);
      } else {
        alert(res.error || "রিভিউ যোগ করতে সমস্যা হয়েছে।");
      }
    } catch {
      alert("রিভিউ সাবমিট করতে সমস্যা হয়েছে।");
    } finally {
      setIsSubmitting(false);
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <section id="reviews-section" className="py-4 sm:py-6 border-t border-border/40">
      {/* Compact Header with Rating & Action */}
      <div className="flex items-center justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <h2 className="text-base sm:text-lg font-bold text-foreground">
            গ্রাহক রিভিউ
          </h2>
          {avgRating && (
            <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <span>{avgRating}</span>
              <span className="text-[11px] font-normal text-muted-foreground">
                ({reviews.length}টি রিভিউ)
              </span>
            </div>
          )}
        </div>

        {user ? (
          <ResponsiveDialog
            open={isOpen}
            onOpenChange={setIsOpen}
            title="আপনার রিভিউ লিখুন"
            description="পণ্যটি ব্যবহার করে আপনার অভিজ্ঞতা শেয়ার করুন।"
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-lg border-emerald-600/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-semibold px-2.5"
              >
                <MessagePlus className="size-3.5" />
                <span>রিভিউ লিখুন</span>
              </Button>
            }
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-muted/40 border border-border/60">
                <Avatar className="size-8 rounded-full">
                  {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name || "User"} />}
                  <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs">
                    {user.name ? user.name[0].toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-xs font-bold text-foreground">{user.name || "ইউজার"}</div>
                  <div className="text-[10px] text-muted-foreground">{user.email}</div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-xs font-semibold">রেটিং দিন</Label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`size-5 ${
                          star <= newRating
                            ? "fill-amber-400 text-amber-400"
                            : "text-neutral-300 dark:text-neutral-700"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="reviewComment" className="text-xs font-semibold">আপনার মন্তব্য</Label>
                <Textarea
                  id="reviewComment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="পণ্যের কোয়ালিটি ও স্বাদ কেমন লেগেছে লিখুন..."
                  rows={3}
                  className="text-xs"
                  required
                />
              </div>

              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-emerald-600 font-bold text-white hover:bg-emerald-500"
              >
                {isSubmitting ? "রিভিউ যোগ হচ্ছে..." : "রিভিউ পোস্ট করুন"}
              </Button>
            </form>
          </ResponsiveDialog>
        ) : (
          <Link
            href={`/login?callbackUrl=/product/${productHandle || ""}`}
            className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline underline-offset-4"
          >
            <ArrowDoorIn className="size-3.5" />
            <span>রিভিউ দিতে লগইন</span>
          </Link>
        )}
      </div>

      {/* Review Cards Grid or Empty State */}
      {reviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-6 text-center">
          <p className="text-xs text-muted-foreground">
            এই পণ্যে এখনো কোনো গ্রাহক রিভিউ যোগ হয়নি। পণ্যটি কিনে প্রথম রিভিউ দিন!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {reviews.map((rev) => {
            const initial = rev.userName ? rev.userName[0].toUpperCase() : "U";

            return (
              <div
                key={rev.id}
                className="rounded-xl border border-border/70 bg-card p-3 shadow-2xs transition-colors hover:border-emerald-500/30 flex flex-col justify-between"
              >
                <div>
                  {/* User Row with Avatar & Rating */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-7 rounded-full border border-border/60">
                        {rev.userAvatar && (
                          <AvatarImage
                            src={rev.userAvatar}
                            alt={rev.userName}
                            className="object-cover"
                          />
                        )}
                        <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">
                          {initial}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col leading-tight">
                        <span className="text-xs font-semibold text-foreground">
                          {rev.userName}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {rev.date}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`size-3 ${
                            s <= rev.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-neutral-300 dark:text-neutral-700"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Comment Text */}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
