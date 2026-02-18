import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// POST /api/premium — purchase premium for a listing
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: "Duhet të jeni i kyçur." }, { status: 401 });
    }

    const { listingId, days = 7 } = await request.json();
    if (!listingId) {
      return NextResponse.json({ error: "listingId mungon." }, { status: 400 });
    }

    // Check ownership
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) {
      return NextResponse.json({ error: "Njoftimi nuk u gjet." }, { status: 404 });
    }
    if (listing.userId !== authUser.userId && authUser.role !== "admin") {
      return NextResponse.json({ error: "Nuk keni leje." }, { status: 403 });
    }

    // Calculate premium end date
    const now = new Date();
    const premiumUntil = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    await prisma.listing.update({
      where: { id: listingId },
      data: {
        premium: true,
        featured: true,
        premiumUntil,
      },
    });

    return NextResponse.json({
      message: `Njoftimi u bë premium për ${days} ditë.`,
      premiumUntil: premiumUntil.toISOString(),
    });
  } catch (error) {
    console.error("Premium POST error:", error);
    return NextResponse.json({ error: "Gabim serveri." }, { status: 500 });
  }
}
