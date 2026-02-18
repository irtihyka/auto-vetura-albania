import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword, generateToken, COOKIE_OPTIONS } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Emaili dhe fjalëkalimi janë të detyrueshme." },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Email ose fjalëkalim i gabuar." },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Email ose fjalëkalim i gabuar." },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      message: "Hyri me sukses!",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });

    response.cookies.set(COOKIE_OPTIONS.name, token, {
      path: COOKIE_OPTIONS.path,
      httpOnly: COOKIE_OPTIONS.httpOnly,
      sameSite: COOKIE_OPTIONS.sameSite,
      maxAge: COOKIE_OPTIONS.maxAge,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Ndodhi një gabim. Provoni përsëri." },
      { status: 500 }
    );
  }
}
