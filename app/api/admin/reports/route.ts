import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

// GET /api/admin/reports - List all reports
export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";
    const reason = searchParams.get("reason") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (reason) where.reason = reason;

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          listing: {
            select: {
              id: true,
              title: true,
              brand: true,
              model: true,
              price: true,
              status: true,
              premium: true,
              images: { take: 1, select: { url: true } },
              user: { select: { id: true, name: true, email: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.report.count({ where }),
    ]);

    return NextResponse.json({
      reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin reports GET error:", error);
    return NextResponse.json({ error: "Gabim serveri." }, { status: 500 });
  }
}
