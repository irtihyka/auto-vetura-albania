import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// POST /api/reviews — create a review
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: "Duhet të jeni i kyçur." }, { status: 401 });
    }

    const { listingId, rating, comment } = await request.json();
    if (!listingId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Vlerësimi duhet të jetë 1-5." }, { status: 400 });
    }

    // Get listing to find seller
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) {
      return NextResponse.json({ error: "Njoftimi nuk u gjet." }, { status: 404 });
    }

    // Can't review your own listing
    if (listing.userId === authUser.userId) {
      return NextResponse.json({ error: "Nuk mund të vlerësoni njoftimin tuaj." }, { status: 400 });
    }

    // Check if already reviewed
    const existing = await prisma.review.findUnique({
      where: { userId_listingId: { userId: authUser.userId, listingId } },
    });
    if (existing) {
      return NextResponse.json({ error: "E keni vlerësuar tashmë këtë njoftim." }, { status: 409 });
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment: comment || null,
        userId: authUser.userId,
        sellerId: listing.userId,
        listingId,
      },
      include: {
        user: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Review POST error:", error);
    return NextResponse.json({ error: "Gabim serveri." }, { status: 500 });
  }
}

// GET /api/reviews?listingId=xxx or ?sellerId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get("listingId");
    const sellerId = searchParams.get("sellerId");

    const where: Record<string, string> = {};
    if (listingId) where.listingId = listingId;
    if (sellerId) where.sellerId = sellerId;

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: { select: { id: true, name: true } },
        listing: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Compute average
    const avg = reviews.length
      ? reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length
      : 0;

    return NextResponse.json({ reviews, average: Math.round(avg * 10) / 10, total: reviews.length });
  } catch (error) {
    console.error("Reviews GET error:", error);
    return NextResponse.json({ error: "Gabim serveri." }, { status: 500 });
  }
}
