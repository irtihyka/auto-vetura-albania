import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

// PUT /api/admin/listings/[id] - Update listing (feature, status, etc.)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const data = await request.json();
    const { featured, status, premium, premiumUntil } = data;

    const updateData: Record<string, unknown> = {};
    if (featured !== undefined) updateData.featured = featured;
    if (status !== undefined) updateData.status = status;
    if (premium !== undefined) updateData.premium = premium;
    if (premiumUntil !== undefined) updateData.premiumUntil = premiumUntil ? new Date(premiumUntil) : null;

    const listing = await prisma.listing.update({
      where: { id },
      data: updateData,
      select: { id: true, title: true, featured: true, status: true, premium: true, premiumUntil: true },
    });

    return NextResponse.json({ listing });
  } catch (error) {
    console.error("Admin listing PUT error:", error);
    return NextResponse.json({ error: "Gabim serveri." }, { status: 500 });
  }
}

// DELETE /api/admin/listings/[id] - Delete a listing
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    await prisma.listing.delete({ where: { id } });
    return NextResponse.json({ message: "Njoftimi u fshi me sukses." });
  } catch (error) {
    console.error("Admin listing DELETE error:", error);
    return NextResponse.json({ error: "Gabim serveri." }, { status: 500 });
  }
}
