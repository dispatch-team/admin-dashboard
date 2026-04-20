import { NextRequest, NextResponse } from "next/server";

const PROFILE_URL = `${process.env.NEXT_PUBLIC_API_URL}/admins/profile`;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(PROFILE_URL, {
      headers: { Authorization: authHeader },
      next: { revalidate: 0 },
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[api/admin/profile] error:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
