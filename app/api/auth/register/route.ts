import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, generateToken, COOKIE_OPTIONS } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password } = await request.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Emri, emaili dhe fjalëkalimi janë të detyrueshme." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Ky email është i regjistruar tashmë." },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        password: hashedPassword,
      },
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        message: "Regjistrimi u krye me sukses!",
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 201 }
    );

    response.cookies.set(COOKIE_OPTIONS.name, token, {
      path: COOKIE_OPTIONS.path,
      httpOnly: COOKIE_OPTIONS.httpOnly,
      sameSite: COOKIE_OPTIONS.sameSite,
      maxAge: COOKIE_OPTIONS.maxAge,
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Ndodhi një gabim. Provoni përsëri." },
      { status: 500 }
    );
  }
}
