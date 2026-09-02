import { ShieldCheck, Truck, RestartCircle, Award } from "@/components/icons";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "১০০% খাঁটি ও অর্গানিক",
    description: "কোনো প্রিজারভেটিভ বা ভেজাল নেই, ল্যাব টেস্টেড বিশুদ্ধতা",
  },
  {
    icon: Truck,
    title: "দ্রুততম হোম ডেলিভারি",
    description: "ঢাকা ও সারা বাংলাদেশে ২৪ থেকে ৭২ ঘণ্টায় পৌঁছানো হয়",
  },
  {
    icon: RestartCircle,
    title: "সহজ রিটার্ন পলিসি",
    description: "পছন্দ না হলে ৭ দিনের মধ্যে পরিবর্তন বা রিফান্ড গ্যারান্টি",
  },
  {
    icon: Award,
    title: "বিশ্বস্ততার প্রতীক",
    description: "হাজারো সচেতন পরিবারের প্রথম পছন্দের স্বাস্থ্যকর খাদ্য ব্র্যান্ড",
  },
];

export function TrustFeaturesBar() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {FEATURES.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="flex items-start gap-3.5 rounded-2xl border border-border/70 bg-card p-4 sm:p-5 shadow-xs transition-all hover:border-emerald-500/40"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Icon className="size-6" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
