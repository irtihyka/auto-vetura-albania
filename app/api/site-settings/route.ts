import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/site-settings — public endpoint for site contact info
export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({ where: { id: "main" } });
    if (!settings) {
      settings = await prisma.siteSettings.create({ data: { id: "main" } });
    }
    return NextResponse.json({
      contactPhone: settings.contactPhone,
      whatsapp: settings.whatsapp,
      contactEmail: settings.contactEmail,
    });
  } catch (error) {
    console.error("Site settings GET error:", error);
    return NextResponse.json({ error: "Gabim serveri." }, { status: 500 });
  }
}
