"use server";

import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSession, deleteSession, getCurrentSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { accounts, magicLinkTokens, users } from "@/lib/db/schema";
import { sendMagicLinkEmail } from "@/lib/email";

async function getRequestMeta() {
  const headersList = await headers();
  const rawIp =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    undefined;
  const ip = rawIp ? rawIp.replace(/^::ffff:/, "") : undefined;
  return {
    ip,
    userAgent: headersList.get("user-agent") ?? undefined,
  };
}

export async function requestMagicLinkAction(formData: FormData) {
  const currentSession = await getCurrentSession();
  if (currentSession) redirect("/dashboard");

  const email = (formData.get("email") as string)?.toLowerCase().trim();
  if (!email || !email.includes("@")) {
    return { success: false, error: "একটি বৈধ ইমেইল ঠিকানা দিন।" };
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  // Delete previous tokens for this email
  await db.delete(magicLinkTokens).where(eq(magicLinkTokens.email, email));
  await db.insert(magicLinkTokens).values({ email, token, expiresAt });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const result = await sendMagicLinkEmail({
    to: email,
    token,
    appUrl,
  });

  if (!result.success) {
    await db.delete(magicLinkTokens).where(eq(magicLinkTokens.token, token));
    return { success: false, error: result.error || "ইমেইল পাঠাতে সমস্যা হয়েছে।" };
  }

  return {
    success: true,
    message: "ম্যাজিক লিংক পাঠানো হয়েছে! আপনার ইমেইল ইনবক্স চেক করুন।",
  };
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}
