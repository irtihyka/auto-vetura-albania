import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

// PUT /api/admin/reports/[id] - Update report status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const data = await request.json();
    const { status } = data; // "reviewed" or "dismissed"

    if (!["reviewed", "dismissed"].includes(status)) {
      return NextResponse.json({ error: "Status i pavlefshëm." }, { status: 400 });
    }

    const report = await prisma.report.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ report });
  } catch (error) {
    console.error("Admin report PUT error:", error);
    return NextResponse.json({ error: "Gabim serveri." }, { status: 500 });
  }
}

// DELETE /api/admin/reports/[id] - Delete a report
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    await prisma.report.delete({ where: { id } });
    return NextResponse.json({ message: "Raporti u fshi." });
  } catch (error) {
    console.error("Admin report DELETE error:", error);
    return NextResponse.json({ error: "Gabim serveri." }, { status: 500 });
  }
}
