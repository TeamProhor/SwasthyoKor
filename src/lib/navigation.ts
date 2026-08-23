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
  { name: "শপ ব্রাউজ", path: "/search", exact: false, icon: BagShopping },
  {
    name: "পেমেন্ট হিস্ট্রি",
    path: "/dashboard/payments",
    exact: false,
    icon: Receipt,
  },
  { name: "প্রোফাইল", path: "/dashboard/profile", exact: false, icon: User },
  { name: "ক্যাটাগরি", path: "/search", exact: false, icon: Category },
  { name: "সেটিংস", path: "/dashboard/settings", exact: false, icon: Setting },
];

export function getNavItems(
  dict?: Dictionary,
  _isAdmin: boolean = false,
): readonly NavItem[] {
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
      { name: "শপ ব্রাউজ", path: "/search", exact: false, icon: BagShopping },
      {
        name: "পেমেন্ট হিস্ট্রি",
        path: "/dashboard/payments",
        exact: false,
        icon: Receipt,
      },
      { name: "প্রোফাইল", path: "/dashboard/profile", exact: false, icon: User },
      { name: "ক্যাটাগরি", path: "/search", exact: false, icon: Category },
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
