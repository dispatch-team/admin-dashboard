import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const { id: merchantID } = await params;
    const body = await request.text();
    const fetchUrl = `${process.env.NEXT_PUBLIC_API_URL}/merchants/${merchantID}/status`;

    const res = await fetch(fetchUrl, {
      method: "PATCH",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body,
    });

    if (res.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[api/admin/merchants/status] error:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
