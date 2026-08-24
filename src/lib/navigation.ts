import {
  BagShopping,
  Box,
  Category,
  Home,
  Receipt,
  Setting,
  User,
} from "@/components/icons";
import type { Dictionary, NavItem, SidebarAnnouncement } from "@/types";

export const DEFAULT_NAV_ITEMS: readonly NavItem[] = [
  { name: "ড্যাশবোর্ড", path: "/dashboard", exact: true, icon: Home },
  { name: "অর্ডারসমূহ", path: "/dashboard/orders", exact: false, icon: Box },
  {
    name: "পেমেন্ট হিস্ট্রি",
    path: "/dashboard/payments",
    exact: false,
    icon: Receipt,
  },
  { name: "প্রোফাইল", path: "/dashboard/profile", exact: false, icon: User },
  { name: "সেটিংস", path: "/dashboard/settings", exact: false, icon: Setting },
];

export const ADMIN_NAV_ITEMS: readonly NavItem[] = [
  { name: "ওভারভিউ", path: "/admin", exact: true, icon: Home },
  { name: "পণ্যসমূহ", path: "/admin/products", exact: false, icon: Box },
  { name: "অর্ডারসমূহ", path: "/admin/orders", exact: false, icon: Receipt },
  { name: "কালেকশন", path: "/admin/collections", exact: false, icon: Category },
  { name: "গ্রাহকবৃন্দ", path: "/admin/customers", exact: false, icon: User },
  { name: "শপ দেখুন", path: "/", exact: true, icon: BagShopping },
];

export function getNavItems(
  dict?: Dictionary,
  isAdmin: boolean = false,
): readonly NavItem[] {
  if (isAdmin) {
    return ADMIN_NAV_ITEMS;
  }

  if (dict?.sidebar) {
    const d = dict.sidebar;
    return [
      {
        name: d.dashboard || "ড্যাশবোর্ড",
        path: "/dashboard",
        exact: true,
        icon: Home,
      },
      { name: "অর্ডারসমূহ", path: "/dashboard/orders", exact: false, icon: Box },
      {
        name: "পেমেন্ট হিস্ট্রি",
        path: "/dashboard/payments",
        exact: false,
        icon: Receipt,
      },
      { name: "প্রোফাইল", path: "/dashboard/profile", exact: false, icon: User },
      {
        name: "সেটিংস",
        path: "/dashboard/settings",
        exact: false,
        icon: Setting,
      },
    ];
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
