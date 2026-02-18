import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// GET /api/analytics — seller's own analytics
export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: "Duhet të jeni i kyçur." }, { status: 401 });
    }

    // Get all user's listings with analytics
    const listings = await prisma.listing.findMany({
      where: { userId: authUser.userId },
      select: {
        id: true,
        title: true,
        brand: true,
        model: true,
        price: true,
        views: true,
        clicks: true,
        status: true,
        featured: true,
        premium: true,
        createdAt: true,
        images: { orderBy: { order: "asc" }, take: 1 },
        _count: { select: { favorites: true, reviews: true } },
        analytics: {
          orderBy: { date: "desc" },
          take: 30, // last 30 days
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Overall stats
    const totalViews = listings.reduce((a, l) => a + l.views, 0);
    const totalClicks = listings.reduce((a, l) => a + l.clicks, 0);
    const totalFavorites = listings.reduce((a, l) => a + l._count.favorites, 0);
    const totalReviews = listings.reduce((a, l) => a + l._count.reviews, 0);
    const activeListings = listings.filter((l) => l.status === "active").length;
    const soldListings = listings.filter((l) => l.status === "sold").length;

    // Aggregate daily analytics across all listings (last 30 days)
    const dailyMap = new Map<string, { views: number; clicks: number }>();
    for (const listing of listings) {
      for (const a of listing.analytics) {
        const existing = dailyMap.get(a.date) || { views: 0, clicks: 0 };
        existing.views += a.views;
        existing.clicks += a.clicks;
        dailyMap.set(a.date, existing);
      }
    }
    const dailyAnalytics = Array.from(dailyMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Seller rating
    const sellerReviews = await prisma.review.findMany({
      where: { sellerId: authUser.userId },
    });
    const avgRating = sellerReviews.length
      ? sellerReviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / sellerReviews.length
      : 0;

    return NextResponse.json({
      stats: {
        totalListings: listings.length,
        activeListings,
        soldListings,
        totalViews,
        totalClicks,
        totalFavorites,
        totalReviews,
        avgRating: Math.round(avgRating * 10) / 10,
      },
      listings,
      dailyAnalytics,
    });
  } catch (error) {
    console.error("Analytics GET error:", error);
    return NextResponse.json({ error: "Gabim serveri." }, { status: 500 });
  }
}

// POST /api/analytics — track a click event
export async function POST(request: NextRequest) {
  try {
    const { listingId } = await request.json();
    if (!listingId) {
      return NextResponse.json({ error: "listingId mungon." }, { status: 400 });
    }

    const today = new Date().toISOString().split("T")[0];

    // Increment click on listing
    await prisma.listing.update({
      where: { id: listingId },
      data: { clicks: { increment: 1 } },
    });

    // Upsert daily analytics
    await prisma.listingAnalytics.upsert({
      where: { listingId_date: { listingId, date: today } },
      update: { clicks: { increment: 1 } },
      create: { listingId, date: today, clicks: 1 },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Analytics POST error:", error);
    return NextResponse.json({ error: "Gabim serveri." }, { status: 500 });
  }
}
