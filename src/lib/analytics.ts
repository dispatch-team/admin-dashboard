export type TimelineAction =
  | "create"
  | "update"
  | "assign"
  | "dispatch"
  | "pickup"
  | "deliver"
  | "fail"
  | "cancel"
  | "rate"
  | "delete"
  | "export";

export type TimelineSource =
  | "web"
  | "mobile"
  | "desktop"
  | "system"
  | "internal"
  | "cli";

export interface TimelineEvent {
  id: number;
  timestamp: string;
  action: TimelineAction;
  user_id: string;
  source: TimelineSource;
  description: string;
  properties: Record<string, unknown>;
}

export interface ShipmentTimelineResponse {
  shipment_id: number;
  total_events: number;
  first_event_at: string;
  last_event_at: string;
  events: TimelineEvent[];
}

export async function getShipmentTimeline(
  token: string,
  shipmentId: string | number
): Promise<ShipmentTimelineResponse> {
  const res = await fetch(`/api/analytics/shipments/${shipmentId}/timeline`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data?.error || data?.message || "Failed to fetch shipment timeline");
    (err as any).status = res.status;
    throw err;
  }

  return data as ShipmentTimelineResponse;
}
