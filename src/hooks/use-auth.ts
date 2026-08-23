"use client";

import { useSession } from "@/lib/auth-client";

export function useUser() {
  const { data } = useSession();
  return {
    data: data?.user ?? null,
  };
}

export function useLogout() {
  return {
    mutate: () => {
      window.location.href = "/login";
    },
    isPending: false,
  };
}
