import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

/**
 * Checks if the current user is an admin.
 * Returns the user payload if admin, or a 403 response if not.
 */
export async function requireAdmin() {
  const user = await getAuthUser();
  if (!user) {
    return { error: NextResponse.json({ error: "Duhet të jeni i kyçur." }, { status: 401 }), user: null };
  }
  if (user.role !== "admin") {
    return { error: NextResponse.json({ error: "Nuk keni leje administratori." }, { status: 403 }), user: null };
  }
  return { error: null, user };
}
