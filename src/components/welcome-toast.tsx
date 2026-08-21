"use client";

import { useEffect } from "react";
import { toast } from "@/components/ui/toast";

export function WelcomeToast() {
  useEffect(() => {
    if (typeof window === "undefined" || window.innerHeight < 650) return;
    if (!localStorage.getItem("welcome-toast-shown")) {
      toast.add({
        title: "🌿 স্বস্থ্যকরের সাথে সুস্থ থাকুন!",
        type: "success",
        timeout: 6000,
        onClose: () => {
          localStorage.setItem("welcome-toast-shown", "true");
        },
        description:
          "১০০% খাঁটি ও অর্গানিক পণ্যের সম্ভার নিয়ে Next.js 16 ও PostgreSQL দ্বারা চালিত আধুনিক স্টোরফ্রন্ট।",
      });
    }
  }, []);

  return null;
}
