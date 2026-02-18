import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

// GET /api/admin/settings - Get site settings
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    let settings = await prisma.siteSettings.findUnique({ where: { id: "main" } });
    if (!settings) {
      settings = await prisma.siteSettings.create({ data: { id: "main" } });
    }
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Admin settings GET error:", error);
    return NextResponse.json({ error: "Gabim serveri." }, { status: 500 });
  }
}

// PUT /api/admin/settings - Update site settings
export async function PUT(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const data = await request.json();
    const { siteName, siteDesc, instagram, facebook, tiktok, whatsapp, youtube, contactEmail, contactPhone, contactAddress } = data;

    const settings = await prisma.siteSettings.upsert({
      where: { id: "main" },
      update: {
        ...(siteName !== undefined && { siteName }),
        ...(siteDesc !== undefined && { siteDesc }),
        ...(instagram !== undefined && { instagram }),
        ...(facebook !== undefined && { facebook }),
        ...(tiktok !== undefined && { tiktok }),
        ...(whatsapp !== undefined && { whatsapp }),
        ...(youtube !== undefined && { youtube }),
        ...(contactEmail !== undefined && { contactEmail }),
        ...(contactPhone !== undefined && { contactPhone }),
        ...(contactAddress !== undefined && { contactAddress }),
      },
      create: { id: "main", ...data },
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Admin settings PUT error:", error);
    return NextResponse.json({ error: "Gabim serveri." }, { status: 500 });
  }
}
