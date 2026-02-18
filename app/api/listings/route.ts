import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

/**
 * Deterministic daily shuffle — uses the date as seed so premium listings
 * rotate position every day, but stay stable within a single day.
 */
function dailyShuffle<T>(arr: T[]): T[] {
  if (arr.length <= 1) return arr;
  const today = new Date();
  let seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  // Simple seeded PRNG (mulberry32)
  function rand() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// GET /api/listings - List all listings with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get("brand");
    const fuel = searchParams.get("fuel");
    const yearFrom = searchParams.get("yearFrom");
    const yearTo = searchParams.get("yearTo");
    const priceFrom = searchParams.get("priceFrom");
    const priceTo = searchParams.get("priceTo");
    const transmission = searchParams.get("transmission");
    const sort = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const userId = searchParams.get("userId");
    const vehicleType = searchParams.get("vehicleType");
    const bodyType = searchParams.get("bodyType");
    const city = searchParams.get("city");
    const color = searchParams.get("color");
    const kmFrom = searchParams.get("kmFrom");
    const kmTo = searchParams.get("kmTo");

    // Build where clause - show all statuses when filtering by userId (user's own listings)
    const where: Record<string, unknown> = userId ? {} : { status: "active" };

    if (brand) where.brand = brand;
    const model = searchParams.get("model");
    if (model) where.model = model;
    if (fuel) where.fuel = fuel;
    if (transmission) where.transmission = transmission;
    if (vehicleType) where.vehicleType = vehicleType;
    if (bodyType) where.bodyType = bodyType;
    if (city) where.location = city;
    if (color) where.color = color;
    if (userId) where.userId = userId;
    if (featured === "true") where.featured = true;

    if (yearFrom || yearTo) {
      where.year = {};
      if (yearFrom) (where.year as Record<string, number>).gte = parseInt(yearFrom);
      if (yearTo) (where.year as Record<string, number>).lte = parseInt(yearTo);
    }

    if (priceFrom || priceTo) {
      where.price = {};
      if (priceFrom) (where.price as Record<string, number>).gte = parseFloat(priceFrom);
      if (priceTo) (where.price as Record<string, number>).lte = parseFloat(priceTo);
    }

    if (kmFrom || kmTo) {
      where.km = {};
      if (kmFrom) (where.km as Record<string, number>).gte = parseInt(kmFrom);
      if (kmTo) (where.km as Record<string, number>).lte = parseInt(kmTo);
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { brand: { contains: search } },
        { model: { contains: search } },
        { description: { contains: search } },
      ];
    }

    // Build orderBy
    let orderBy: Record<string, string> = { createdAt: "desc" };
    switch (sort) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "price-asc":
        orderBy = { price: "asc" };
        break;
      case "price-desc":
        orderBy = { price: "desc" };
        break;
      case "year-desc":
        orderBy = { year: "desc" };
        break;
      case "year-asc":
        orderBy = { year: "asc" };
        break;
      case "km-asc":
        orderBy = { km: "asc" };
        break;
    }

    const includeOpts = {
      images: { orderBy: { order: "asc" as const }, take: 1 },
      user: { select: { id: true, name: true, phone: true } },
    };

    // When browsing public listings (not user's own), premium listings
    // always come first with a daily-rotating order among themselves.
    const isPublicBrowse = !userId;

    if (isPublicBrowse) {
      // Build premium + regular where clauses
      const now = new Date();
      const premiumWhere = { ...where, premium: true, premiumUntil: { gte: now } };

      // Regular = NOT currently premium. Use AND to combine with existing filters.
      const notPremiumCondition = { OR: [{ premium: false }, { premiumUntil: null }, { premiumUntil: { lt: now } }] };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const regularWhere: any = { ...where };
      regularWhere.AND = [notPremiumCondition];

      const [premiumListings, premiumCount, regularCount] = await Promise.all([
        prisma.listing.findMany({
          where: premiumWhere,
          include: includeOpts,
        }),
        prisma.listing.count({ where: premiumWhere }),
        prisma.listing.count({ where: regularWhere }),
      ]);

      const total = premiumCount + regularCount;
      const shuffledPremium = dailyShuffle(premiumListings);

      // Calculate how many premium and regular listings go on this page
      const premiumOnPage = shuffledPremium.slice(
        Math.max(0, (page - 1) * limit),
        Math.min(shuffledPremium.length, page * limit)
      );

      const regularSlotsOnPage = limit - premiumOnPage.length;
      const regularSkip = Math.max(0, (page - 1) * limit - premiumCount);

      let regularListings: typeof premiumListings = [];
      if (regularSlotsOnPage > 0) {
        regularListings = await prisma.listing.findMany({
          where: regularWhere,
          orderBy,
          skip: regularSkip,
          take: regularSlotsOnPage,
          include: includeOpts,
        });
      }

      const combined = [...premiumOnPage, ...regularListings];

      return NextResponse.json({
        listings: combined,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    }

    // Fallback: user's own listings or other non-public queries (no premium boosting)
    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: includeOpts,
      }),
      prisma.listing.count({ where }),
    ]);

    return NextResponse.json({
      listings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Listings GET error:", error);
    return NextResponse.json({ error: "Gabim serveri." }, { status: 500 });
  }
}

// POST /api/listings - Create a new listing
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: "Duhet të jeni i kyçur." }, { status: 401 });
    }

    const data = await request.json();
    const { title, description, brand, model, year, fuel, transmission, km, price, color, bodyType, location, phone, images, vehicleType } = data;

    // Validate required fields
    if (!title || !brand || !model || !year || !fuel || !transmission || km === undefined || !price) {
      return NextResponse.json(
        { error: "Plotësoni të gjitha fushat e detyrueshme." },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.create({
      data: {
        title,
        description: description || null,
        brand,
        model,
        year: parseInt(year),
        fuel,
        transmission,
        km: parseInt(km),
        price: parseFloat(price),
        color: color || null,
        bodyType: bodyType || null,
        vehicleType: vehicleType || "Makinë",
        location: location || null,
        phone: phone || null,
        userId: authUser.userId,
        images: images?.length
          ? {
              create: images.map((url: string, index: number) => ({
                url,
                order: index,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
        user: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ listing }, { status: 201 });
  } catch (error) {
    console.error("Listings POST error:", error);
    return NextResponse.json({ error: "Gabim serveri." }, { status: 500 });
  }
}
