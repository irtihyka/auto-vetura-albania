import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

// GET /api/admin/stats - Advanced dashboard statistics
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalListings,
      activeListings,
      soldListings,
      totalMessages,
      unreadMessages,
      featuredListings,
      premiumListings,
      totalReviews,
      totalReports,
      pendingReports,
      totalFavorites,
      recentUsers,
      recentListings,
      newUsersThisWeek,
      newListingsThisWeek,
      reportsThisWeek,
      allListingsForAnalytics,
      dailyAnalytics,
      pendingReportsList,
      brandStats,
      fuelStats,
      priceRangeListings,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.listing.count(),
      prisma.listing.count({ where: { status: "active" } }),
      prisma.listing.count({ where: { status: "sold" } }),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.listing.count({ where: { featured: true } }),
      prisma.listing.count({ where: { premium: true } }),
      prisma.review.count(),
      prisma.report.count(),
      prisma.report.count({ where: { status: "pending" } }),
      prisma.favorite.count(),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, email: true, role: true, createdAt: true, _count: { select: { listings: true } } },
      }),
      prisma.listing.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true, title: true, price: true, status: true, views: true, premium: true, featured: true,
          createdAt: true, user: { select: { name: true } },
          _count: { select: { reports: true } },
        },
      }),
      prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.listing.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.report.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      // For views/clicks analytics
      prisma.listing.findMany({
        select: { views: true, clicks: true, brand: true, price: true },
      }),
      // Daily analytics last 30 days
      prisma.listingAnalytics.findMany({
        where: { date: { gte: thirtyDaysAgo.toISOString().split("T")[0] } },
        select: { date: true, views: true, clicks: true },
      }),
      // Pending reports for alerts
      prisma.report.findMany({
        where: { status: "pending" },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true, reason: true, details: true, createdAt: true, status: true,
          user: { select: { name: true } },
          listing: { select: { id: true, title: true } },
        },
      }),
      // Popular brands
      prisma.listing.groupBy({
        by: ["brand"],
        _count: { brand: true },
        orderBy: { _count: { brand: "desc" } },
        take: 10,
      }),
      // Fuel type distribution
      prisma.listing.groupBy({
        by: ["fuel"],
        _count: { fuel: true },
        orderBy: { _count: { fuel: "desc" } },
      }),
      // Price range analysis
      prisma.listing.findMany({
        where: { status: "active" },
        select: { price: true },
      }),
    ]);

    // Aggregate daily analytics
    const dailyMap = new Map<string, { views: number; clicks: number }>();
    for (const a of dailyAnalytics) {
      const existing = dailyMap.get(a.date) || { views: 0, clicks: 0 };
      existing.views += a.views;
      existing.clicks += a.clicks;
      dailyMap.set(a.date, existing);
    }
    const dailyChartData = Array.from(dailyMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Total views & clicks across all listings
    const totalViews = allListingsForAnalytics.reduce((a: number, l: { views: number }) => a + l.views, 0);
    const totalClicks = allListingsForAnalytics.reduce((a: number, l: { clicks: number }) => a + l.clicks, 0);

    // Price range distribution
    const priceRanges = [
      { label: "€0 - €5,000", min: 0, max: 5000, count: 0 },
      { label: "€5,000 - €10,000", min: 5000, max: 10000, count: 0 },
      { label: "€10,000 - €20,000", min: 10000, max: 20000, count: 0 },
      { label: "€20,000 - €50,000", min: 20000, max: 50000, count: 0 },
      { label: "€50,000+", min: 50000, max: Infinity, count: 0 },
    ];
    for (const l of priceRangeListings) {
      for (const range of priceRanges) {
        if (l.price >= range.min && l.price < range.max) {
          range.count++;
          break;
        }
      }
    }

    // Popular brands formatted
    const popularBrands = brandStats.map((b) => ({
      brand: b.brand,
      count: b._count.brand,
    }));

    // Fuel distribution formatted
    const fuelDistribution = fuelStats.map((f) => ({
      fuel: f.fuel,
      count: f._count.fuel,
    }));

    // Conversion rate (clicks / views)
    const conversionRate = totalViews > 0 ? Math.round((totalClicks / totalViews) * 1000) / 10 : 0;

    return NextResponse.json({
      stats: {
        totalUsers,
        totalListings,
        activeListings,
        soldListings,
        totalMessages,
        unreadMessages,
        featuredListings,
        premiumListings,
        totalReviews,
        totalReports,
        pendingReports,
        totalFavorites,
        totalViews,
        totalClicks,
        conversionRate,
        newUsersThisWeek,
        newListingsThisWeek,
        reportsThisWeek,
      },
      recentUsers,
      recentListings,
      dailyChartData,
      popularBrands,
      fuelDistribution,
      priceRanges: priceRanges.map(({ label, count }) => ({ label, count })),
      pendingReportsList,
      alerts: {
        pendingReports,
        unreadMessages,
        newUsersThisWeek,
        newListingsThisWeek,
        reportsThisWeek,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Gabim serveri." }, { status: 500 });
  }
}
