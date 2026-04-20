import { NextRequest, NextResponse } from "next/server";

const MERCHANTS_URL = `${process.env.NEXT_PUBLIC_API_URL}/merchants`;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const fetchUrl = `${MERCHANTS_URL}?${searchParams.toString()}`;

    const res = await fetch(fetchUrl, {
      headers: { Authorization: authHeader },
      next: { revalidate: 0 },
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[api/admin/merchants] error:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
