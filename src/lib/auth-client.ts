"use client";

export function useSession() {
  return {
    data: null as {
      user?: { name?: string; email?: string; image?: string };
    } | null,
    isPending: false,
  };
}

export const authClient = {
  useSession,
};
