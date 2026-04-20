import { NextRequest, NextResponse } from "next/server";

const COURIERS_URL = `${process.env.NEXT_PUBLIC_API_URL}/couriers`;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const fetchUrl = `${COURIERS_URL}?${searchParams.toString()}`;

    const res = await fetch(fetchUrl, {
      headers: { Authorization: authHeader },
      next: { revalidate: 0 },
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[api/admin/couriers] error:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const res = await fetch(COURIERS_URL, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[api/admin/couriers] POST error:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
