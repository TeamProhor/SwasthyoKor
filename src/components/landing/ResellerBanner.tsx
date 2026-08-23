import Link from "next/link";
import { Chat } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function ResellerBanner() {
  const whatsappNumber = "8801812345678";
  const whatsappMessage = encodeURIComponent(
    "আমি স্বাস্থ্যকর-এর রিসেলার হতে আগ্রহী।",
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section
      id="reseller"
      className="mx-auto w-full max-w-5xl px-4 py-12 sm:py-16 md:py-20"
    >
      <div className="relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-3xl border border-amber-500/20 bg-neutral-900 px-6 py-8 text-neutral-100 shadow-2xl sm:px-10 sm:py-12 md:flex-row md:px-12 dark:bg-neutral-950">
        <div className="pointer-events-none absolute -bottom-10 -right-10 size-64 rounded-full bg-emerald-600/25 blur-3xl" />
        <div className="relative z-10 max-w-lg">
          <h3 className="mb-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
            উদ্যোক্তা হতে চান?
          </h3>
          <p className="text-sm leading-relaxed text-neutral-300 sm:text-base">
            স্বাস্থ্যকর-এর রিসেলার প্রোগ্রামে যুক্ত হয়ে সম্পূর্ণ হালাল উপায়ে নিজের এলাকায় ব্যবসা শুরু
            করুন। পাইকারি মূল্য এবং সার্বিক সাপোর্ট পেতে মেসেজ দিন।
          </p>
        </div>
        <div className="relative z-10 shrink-0">
          <Button
            render={
              <Link
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
            size="lg"
            className="rounded-full bg-white font-bold text-neutral-900 shadow-lg hover:bg-neutral-100 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            <Chat data-icon="inline-start" className="text-emerald-600" />
            যোগাযোগ করুন
          </Button>
        </div>
      </div>
    </section>
  );
}
