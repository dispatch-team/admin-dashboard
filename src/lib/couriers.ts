export interface CourierProfile {
  id: number;
  company_name: string;
  company_address: string;
  status: string;
  company_logo_id?: string;
  phone_number: string;
  email: string;
  website_url?: string;
  rating_aggregate: number;
  rating_count: number;
  max_weight: number;
  base_price: number;
  weight_rate: number;
  distance_rate: number;
  time_rate: number;
}

function parseCourierListPayload(raw: unknown): CourierProfile[] {
  if (Array.isArray(raw)) {
    return raw.map(normalizeCourierId) as CourierProfile[];
  }
  if (raw && typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    for (const key of ["data", "couriers", "results"]) {
      const inner = o[key];
      if (Array.isArray(inner)) {
        return inner.map(normalizeCourierId) as CourierProfile[];
      }
    }
  }
  return [];
}

function normalizeCourierId(c: any): CourierProfile {
  let id = c.id;
  if (c.courier_id && (!id || id === 0)) {
    id = c.courier_id;
  }

  if (c.courier_company?.id) {
    const companyId = c.courier_company.id;
    return { ...c, ...c.courier_company, id: Number(companyId) };
  }

  const numericId = typeof id === "string" ? Number(id) : (id ?? 0);
  return { ...c, id: Number.isFinite(numericId) ? numericId : id };
}

export function buildCourierLogoProxyUrl(
  logoId: string | undefined | null,
  accessToken: string | null,
): string | null {
  if (logoId == null || String(logoId).trim() === "") return null;
  const raw = String(logoId).trim();
  const encodedPath = raw
    .split("/")
    .filter(Boolean)
    .map((s) => encodeURIComponent(s))
    .join("/");
  const qs = accessToken ? `?token=${encodeURIComponent(accessToken)}` : "";
  return `/api/couriers/logo/${encodedPath}${qs}`;
}

export async function getAvailableCouriers(
  token: string,
): Promise<CourierProfile[]> {
  const res = await fetch("/api/couriers/available", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const error = await res
      .json()
      .catch(() => ({ message: "Failed to fetch available couriers" }));
    throw new Error(
      error.message || error.error || "Failed to fetch available couriers",
    );
  }
  const raw = await res.json().catch(() => []);
  return parseCourierListPayload(raw);
}

export function findCourierById(
  id: number,
  available: CourierProfile[],
  partners: CourierProfile[],
): CourierProfile | undefined {
  const matches = (c: CourierProfile) => Number(c.id) === Number(id);
  return partners.find(matches) || available.find(matches);
}
