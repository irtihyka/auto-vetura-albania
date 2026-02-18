import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// GET /api/favorites - Get user's favorites
export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: "Duhet të jeni i kyçur." }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: authUser.userId },
      include: {
        listing: {
          include: {
            images: { orderBy: { order: "asc" }, take: 1 },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error("Favorites GET error:", error);
    return NextResponse.json({ error: "Gabim serveri." }, { status: 500 });
  }
}

// POST /api/favorites - Toggle favorite
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: "Duhet të jeni i kyçur." }, { status: 401 });
    }

    const { listingId } = await request.json();
    if (!listingId) {
      return NextResponse.json({ error: "ListingId mungon." }, { status: 400 });
    }

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId: authUser.userId,
          listingId,
        },
      },
    });

    if (existing) {
      // Remove favorite
      await prisma.favorite.delete({ where: { id: existing.id } });
      return NextResponse.json({ favorited: false, message: "U hoq nga të preferuarat." });
    } else {
      // Add favorite
      await prisma.favorite.create({
        data: {
          userId: authUser.userId,
          listingId,
        },
      });
      return NextResponse.json({ favorited: true, message: "U shtua te të preferuarat." });
    }
  } catch (error) {
    console.error("Favorites POST error:", error);
    return NextResponse.json({ error: "Gabim serveri." }, { status: 500 });
  }
}
