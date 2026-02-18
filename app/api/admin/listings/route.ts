import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

// GET /api/admin/listings - List all listings (including paused/sold)
export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const featured = searchParams.get("featured");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (featured === "true") where.featured = true;
    if (featured === "false") where.featured = false;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { brand: { contains: search } },
        { model: { contains: search } },
      ];
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          brand: true,
          model: true,
          year: true,
          price: true,
          status: true,
          featured: true,
          premium: true,
          premiumUntil: true,
          views: true,
          createdAt: true,
          user: { select: { id: true, name: true, email: true } },
          images: { orderBy: { order: "asc" }, take: 1, select: { url: true } },
          _count: { select: { favorites: true, reports: true } },
        },
      }),
      prisma.listing.count({ where }),
    ]);

    return NextResponse.json({
      listings,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Admin listings GET error:", error);
    return NextResponse.json({ error: "Gabim serveri." }, { status: 500 });
  }
}
