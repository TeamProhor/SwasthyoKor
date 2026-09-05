import { desc, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { userAddresses } from "@/lib/db/schema";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const addresses = await db
    .select()
    .from(userAddresses)
    .where(eq(userAddresses.userId, user.id))
    .orderBy(desc(userAddresses.isDefault), desc(userAddresses.createdAt));

  return NextResponse.json({ addresses });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      label,
      fullName,
      phone,
      district,
      thana,
      streetAddress,
      isDefault,
    } = body;

    if (!fullName || !phone || !district || !thana || !streetAddress) {
      return NextResponse.json(
        { error: "সবগুলো আবশ্যক ঘর পূরণ করুন।" },
        { status: 400 },
      );
    }

    // If setting default, unset others first
    if (isDefault) {
      await db
        .update(userAddresses)
        .set({ isDefault: false })
        .where(eq(userAddresses.userId, user.id));
    }

    const [created] = await db
      .insert(userAddresses)
      .values({
        userId: user.id,
        label: label || "বাসা / Home",
        fullName,
        phone,
        district,
        thana,
        streetAddress,
        isDefault: Boolean(isDefault),
      })
      .returning();

    return NextResponse.json({ address: created }, { status: 201 });
  } catch (err) {
    console.error("Address create error:", err);
    return NextResponse.json({ error: "সার্ভার এরর" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID আবশ্যক" }, { status: 400 });
    }

    await db.delete(userAddresses).where(eq(userAddresses.id, id));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Address delete error:", err);
    return NextResponse.json({ error: "সার্ভার এরর" }, { status: 500 });
  }
}
