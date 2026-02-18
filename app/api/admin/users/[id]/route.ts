import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

// PUT /api/admin/users/[id] - Update user role
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, user: adminUser } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const { role } = await request.json();

    if (!["user", "admin"].includes(role)) {
      return NextResponse.json({ error: "Rol i pavlefshëm." }, { status: 400 });
    }

    // Prevent self-demotion
    if (adminUser!.userId === id && role !== "admin") {
      return NextResponse.json(
        { error: "Nuk mund të hiqni rolin tuaj si admin." },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Admin user PUT error:", error);
    return NextResponse.json({ error: "Gabim serveri." }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id] - Delete a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, user: adminUser } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;

    if (adminUser!.userId === id) {
      return NextResponse.json(
        { error: "Nuk mund të fshini llogarinë tuaj." },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: "Përdoruesi u fshi me sukses." });
  } catch (error) {
    console.error("Admin user DELETE error:", error);
    return NextResponse.json({ error: "Gabim serveri." }, { status: 500 });
  }
}
