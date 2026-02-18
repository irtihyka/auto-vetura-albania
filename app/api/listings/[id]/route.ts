import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// GET /api/listings/[id] - Get a single listing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: "asc" } },
        user: { select: { id: true, name: true, phone: true, email: true, createdAt: true } },
        reviews: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { favorites: true, reviews: true } },
      },
    });

    if (!listing) {
      return NextResponse.json({ error: "Njoftimi nuk u gjet." }, { status: 404 });
    }

    // Increment views + daily analytics
    const today = new Date().toISOString().split("T")[0];
    await Promise.all([
      prisma.listing.update({
        where: { id },
        data: { views: { increment: 1 } },
      }),
      prisma.listingAnalytics.upsert({
        where: { listingId_date: { listingId: id, date: today } },
        update: { views: { increment: 1 } },
        create: { listingId: id, date: today, views: 1 },
      }),
    ]);

    // Check if current user has favorited / reported / reviewed this listing
    const authUser = await getAuthUser();
    let isFavorited = false;
    let isReported = false;
    let userReview = null;

    if (authUser) {
      const [fav, rep, rev] = await Promise.all([
        prisma.favorite.findUnique({
          where: { userId_listingId: { userId: authUser.userId, listingId: id } },
        }),
        prisma.report.findUnique({
          where: { userId_listingId: { userId: authUser.userId, listingId: id } },
        }),
        prisma.review.findUnique({
          where: { userId_listingId: { userId: authUser.userId, listingId: id } },
        }),
      ]);
      isFavorited = !!fav;
      isReported = !!rep;
      userReview = rev;
    }

    // Compute seller's average rating
    const sellerReviews = await prisma.review.findMany({
      where: { sellerId: listing.user.id },
    });
    const sellerAvgRating = sellerReviews.length
      ? Math.round((sellerReviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / sellerReviews.length) * 10) / 10
      : 0;

    return NextResponse.json({
      listing,
      isFavorited,
      isReported,
      userReview,
      sellerRating: { average: sellerAvgRating, total: sellerReviews.length },
    });
  } catch (error) {
    console.error("Listing GET error:", error);
    return NextResponse.json({ error: "Gabim serveri." }, { status: 500 });
  }
}

// PUT /api/listings/[id] - Update a listing
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: "Duhet të jeni i kyçur." }, { status: 401 });
    }

    const { id } = await params;

    // Check ownership
    const existing = await prisma.listing.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Njoftimi nuk u gjet." }, { status: 404 });
    }
    if (existing.userId !== authUser.userId && authUser.role !== "admin") {
      return NextResponse.json({ error: "Nuk keni leje." }, { status: 403 });
    }

    const data = await request.json();
    const { title, description, brand, model, year, fuel, transmission, km, price, color, bodyType, location, phone, status, images } = data;

    // Update listing
    const listing = await prisma.listing.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(brand && { brand }),
        ...(model && { model }),
        ...(year && { year: parseInt(year) }),
        ...(fuel && { fuel }),
        ...(transmission && { transmission }),
        ...(km !== undefined && { km: parseInt(km) }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(color !== undefined && { color }),
        ...(bodyType !== undefined && { bodyType }),
        ...(location !== undefined && { location }),
        ...(phone !== undefined && { phone }),
        ...(status && { status }),
      },
      include: {
        images: true,
        user: { select: { id: true, name: true } },
      },
    });

    // Update images if provided
    if (images) {
      await prisma.listingImage.deleteMany({ where: { listingId: id } });
      if (images.length > 0) {
        await prisma.listingImage.createMany({
          data: images.map((url: string, index: number) => ({
            url,
            order: index,
            listingId: id,
          })),
        });
      }
    }

    return NextResponse.json({ listing });
  } catch (error) {
    console.error("Listing PUT error:", error);
    return NextResponse.json({ error: "Gabim serveri." }, { status: 500 });
  }
}

// DELETE /api/listings/[id] - Delete a listing
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: "Duhet të jeni i kyçur." }, { status: 401 });
    }

    const { id } = await params;

    // Check ownership
    const existing = await prisma.listing.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Njoftimi nuk u gjet." }, { status: 404 });
    }
    if (existing.userId !== authUser.userId && authUser.role !== "admin") {
      return NextResponse.json({ error: "Nuk keni leje." }, { status: 403 });
    }

    await prisma.listing.delete({ where: { id } });

    return NextResponse.json({ message: "Njoftimi u fshi me sukses." });
  } catch (error) {
    console.error("Listing DELETE error:", error);
    return NextResponse.json({ error: "Gabim serveri." }, { status: 500 });
  }
}
