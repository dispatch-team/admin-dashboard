import { NextRequest, NextResponse } from "next/server";

const ANALYTICS_URL = `${process.env.NEXT_PUBLIC_API_URL}/analytics/shipments`;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ error: "missing_authorization" }, { status: 401 });
  }

  const { id } = await params;

  if (!id || !/^\d+$/.test(id) || Number(id) <= 0) {
    return NextResponse.json(
      { error: "invalid_shipment_id", code: "BAD_REQUEST" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${ANALYTICS_URL}/${id}/timeline`, {
      headers: { Authorization: authHeader },
      next: { revalidate: 0 },
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Failed to proxy shipment timeline request:", err);
    return NextResponse.json(
      { error: "network_error", code: "INTERNAL_SERVER_ERROR" },
      { status: 500 }
    );
  }
}
