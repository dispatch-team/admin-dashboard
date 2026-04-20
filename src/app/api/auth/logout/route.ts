import { NextRequest, NextResponse } from "next/server";
import { LOGOUT_URL, KEYCLOAK_CLIENT_ID, KEYCLOAK_CLIENT_SECRET } from "@/lib/keycloak.server";

const BACKEND_LOGOUT_URL = `${process.env.NEXT_PUBLIC_API_URL}/merchants/logout`;

export async function POST(request: NextRequest) {
  const { refresh_token } = await request.json();

  if (!refresh_token) {
    return NextResponse.json({ success: true });
  }

  // Best-effort logout from both Keycloak and our backend.
  try {
    const keycloakParams = new URLSearchParams({
      client_id: KEYCLOAK_CLIENT_ID,
      client_secret: KEYCLOAK_CLIENT_SECRET,
      refresh_token: refresh_token,
    });

    await Promise.allSettled([
      // 1. Keycloak logout
      fetch(LOGOUT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: keycloakParams.toString(),
      }),
      // 2. Merchant backend logout
      fetch(BACKEND_LOGOUT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token }),
      }),
    ]);
  } catch (err) {
    console.error("Logout error:", err);
    // Silently ignore — logout is best-effort
  }

  return NextResponse.json({ success: true });
}
