import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/contact - Submit a contact message
export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Emri, emaili dhe mesazhi janë të detyrueshme." },
        { status: 400 }
      );
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
      },
    });

    return NextResponse.json(
      { message: "Mesazhi u dërgua me sukses!", id: contactMessage.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact POST error:", error);
    return NextResponse.json(
      { error: "Gabim serveri. Provoni përsëri." },
      { status: 500 }
    );
  }
}

// GET /api/contact - Get all contact messages (admin only)
export async function GET() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Contact GET error:", error);
    return NextResponse.json({ error: "Gabim serveri." }, { status: 500 });
  }
}
