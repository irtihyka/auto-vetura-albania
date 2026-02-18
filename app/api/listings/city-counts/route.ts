import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const counts = await prisma.listing.groupBy({
      by: ["location"],
      _count: { id: true },
      where: {
        approved: true,
        location: { not: null },
      },
      orderBy: { _count: { id: "desc" } },
    });

    const cityCounts: Record<string, number> = {};
    for (const row of counts) {
      if (row.location) {
        cityCounts[row.location] = row._count.id;
      }
    }

    return NextResponse.json({ cityCounts });
  } catch {
    return NextResponse.json({ cityCounts: {} }, { status: 500 });
  }
}
