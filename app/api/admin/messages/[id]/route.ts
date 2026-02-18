import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

// PUT /api/admin/messages/[id] - Mark message as read/unread
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const { read } = await request.json();

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { read: !!read },
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Admin message PUT error:", error);
    return NextResponse.json({ error: "Gabim serveri." }, { status: 500 });
  }
}

// DELETE /api/admin/messages/[id] - Delete a message
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    await prisma.contactMessage.delete({ where: { id } });
    return NextResponse.json({ message: "Mesazhi u fshi." });
  } catch (error) {
    console.error("Admin message DELETE error:", error);
    return NextResponse.json({ error: "Gabim serveri." }, { status: 500 });
  }
}
