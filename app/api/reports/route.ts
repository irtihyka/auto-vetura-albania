import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// POST /api/reports — report a listing
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: "Duhet të jeni i kyçur." }, { status: 401 });
    }

    const { listingId, reason, details } = await request.json();
    if (!listingId || !reason) {
      return NextResponse.json({ error: "Arsyeja e raportimit mungon." }, { status: 400 });
    }

    const validReasons = ["spam", "fraud", "duplicate", "inappropriate", "other"];
    if (!validReasons.includes(reason)) {
      return NextResponse.json({ error: "Arsye e pavlefshme." }, { status: 400 });
    }

    // Check if already reported
    const existing = await prisma.report.findUnique({
      where: { userId_listingId: { userId: authUser.userId, listingId } },
    });
    if (existing) {
      return NextResponse.json({ error: "E keni raportuar tashmë këtë njoftim." }, { status: 409 });
    }

    const report = await prisma.report.create({
      data: {
        reason,
        details: details || null,
        userId: authUser.userId,
        listingId,
      },
    });

    return NextResponse.json({ report, message: "Raporti u dërgua me sukses." }, { status: 201 });
  } catch (error) {
    console.error("Report POST error:", error);
    return NextResponse.json({ error: "Gabim serveri." }, { status: 500 });
  }
}

// GET /api/reports — admin-only, list reports
export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser || authUser.role !== "admin") {
      return NextResponse.json({ error: "Nuk keni leje." }, { status: 403 });
    }

    const reports = await prisma.report.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        listing: {
          select: { id: true, title: true, brand: true, model: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error("Reports GET error:", error);
    return NextResponse.json({ error: "Gabim serveri." }, { status: 500 });
  }
}
