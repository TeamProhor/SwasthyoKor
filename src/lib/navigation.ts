import {
  Home,
  Package,
  Receipt,
  User,
  Settings,
  MapPin,
  Heart,
  Tag,
  Boxes,
  Store,
  ShoppingBag,
  Layers,
} from "lucide-react";
import type { Dictionary, NavItem, SidebarAnnouncement } from "@/types";

export const DEFAULT_NAV_ITEMS: readonly NavItem[] = [
  { name: "ড্যাশবোর্ড", path: "/dashboard", exact: true, icon: Home },
  { name: "অর্ডারসমূহ", path: "/dashboard/orders", exact: false, icon: Package },
  {
    name: "সংরক্ষিত ঠিকানা",
    path: "/dashboard/addresses",
    exact: false,
    icon: MapPin,
  },
  {
    name: "পছন্দের তালিকা",
    path: "/dashboard/wishlist",
    exact: false,
    icon: Heart,
  },
  {
    name: "পেমেন্ট হিস্ট্রি",
    path: "/dashboard/payments",
    exact: false,
    icon: Receipt,
  },
  { name: "প্রোফাইল", path: "/dashboard/profile", exact: false, icon: User },
  { name: "সেটিংস", path: "/dashboard/settings", exact: false, icon: Settings },
];

export const ADMIN_NAV_ITEMS: readonly NavItem[] = [
  { name: "ওভারভিউ", path: "/admin", exact: true, icon: Home },
  { name: "পণ্যসমূহ", path: "/admin/products", exact: false, icon: Package },
  { name: "ইনভেন্টরি ও স্টক", path: "/admin/inventory", exact: false, icon: Boxes },
  { name: "অর্ডারসমূহ", path: "/admin/orders", exact: false, icon: Receipt },
  { name: "কালেকশন", path: "/admin/collections", exact: false, icon: Layers },
  { name: "কুপন ও প্রোমো", path: "/admin/coupons", exact: false, icon: Tag },
  { name: "গ্রাহকবৃন্দ", path: "/admin/customers", exact: false, icon: User },
  { name: "স্টোর সেটিংস", path: "/admin/settings", exact: false, icon: Store },
  { name: "শপ দেখুন", path: "/", exact: true, icon: ShoppingBag },
];

export function getNavItems(
  dict?: Dictionary,
  isAdmin: boolean = false,
): readonly NavItem[] {
  if (isAdmin) {
    return ADMIN_NAV_ITEMS;
  }

  return DEFAULT_NAV_ITEMS;
}

export const sidebarAnnouncement: SidebarAnnouncement = {
  imageSrc:
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=732",
  imageAlt: "১০০% প্রাকৃতিক পণ্য",
  title: "খাঁটি ও স্বাস্থ্যকর পণ্যের সমাহার",
  subtitle: "আপনার দৈনন্দিন পুষ্টির চাহিদা মেটাতে সেরা মানের অর্গানিক পণ্য কিনুন।",
  href: "/search",
};
