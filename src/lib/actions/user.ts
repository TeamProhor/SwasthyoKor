"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { uploadObject } from "@/lib/storage";
import { compressFileToWebp } from "@/lib/image";

export async function updateProfileUserAction(formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "অনুগ্রহ করে প্রথমে লগইন করুন।" };
    }

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const avatarFile = formData.get("avatar") as File | null;

    let avatarUrl = user.avatarUrl;

    if (avatarFile && avatarFile.size > 0) {
      const { buffer, contentType, extension } = await compressFileToWebp(avatarFile, {
        maxWidth: 500,
        maxHeight: 500,
      });
      const s3Key = `avatars/${user.id}-${Date.now()}.${extension}`;
      avatarUrl = await uploadObject({
        key: s3Key,
        body: buffer,
        contentType,
      });
    }

    await db
      .update(users)
      .set({
        name: name || user.name,
        phone: phone || user.phone,
        avatarUrl,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard/settings");

    return { success: true, message: "প্রোফাইল সফলভাবে আপডেট হয়েছে।" };
  } catch (err: unknown) {
    console.error("Profile update error:", err);
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "প্রোফাইল আপডেট করতে সমস্যা হয়েছে।",
    };
  }
}
