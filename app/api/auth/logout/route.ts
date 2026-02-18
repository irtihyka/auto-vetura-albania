import { NextResponse } from "next/server";
import { COOKIE_OPTIONS } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ message: "U çkyçët me sukses!" });
  response.cookies.set(COOKIE_OPTIONS.name, "", {
    path: COOKIE_OPTIONS.path,
    httpOnly: COOKIE_OPTIONS.httpOnly,
    sameSite: COOKIE_OPTIONS.sameSite,
    maxAge: 0,
  });
  return response;
}
