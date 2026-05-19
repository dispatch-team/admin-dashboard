import { getShipmentTimeline } from '@/lib/analytics';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('analytics lib', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  const mockTimeline = {
    shipment_id: 42,
    total_events: 2,
    first_event_at: '2026-01-15T08:00:00Z',
    last_event_at: '2026-01-15T10:00:00Z',
    events: [
      {
        id: 301,
        timestamp: '2026-01-15T08:00:00Z',
        action: 'create',
        user_id: 'usr_88',
        source: 'web',
        description: 'Shipment created by merchant',
        properties: {},
      },
      {
        id: 302,
        timestamp: '2026-01-15T10:00:00Z',
        action: 'deliver',
        user_id: 'usr_12',
        source: 'mobile',
        description: 'Delivered successfully',
        properties: {},
      },
    ],
  };

  it('calls the correct proxy route with Bearer token', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockTimeline,
    });

    await getShipmentTimeline('test-token', 42);

    expect(fetch).toHaveBeenCalledWith('/api/analytics/shipments/42/timeline', {
      headers: { Authorization: 'Bearer test-token' },
    });
  });

  it('returns the parsed timeline on success', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockTimeline,
    });

    const result = await getShipmentTimeline('test-token', '42');
    expect(result).toEqual(mockTimeline);
    expect(result.events).toHaveLength(2);
    expect(result.events[0].action).toBe('create');
  });

  it('throws and attaches status 404 when no events are found', async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ error: 'no events found for shipment', code: 'NOT_FOUND' }),
    });

    let caughtError: any;
    try {
      await getShipmentTimeline('test-token', 99);
    } catch (err) {
      caughtError = err;
    }

    expect(caughtError).toBeDefined();
    expect(caughtError.status).toBe(404);
    expect(caughtError.message).toContain('no events found for shipment');
  });

  it('throws on 500 with the parsed error message', async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: 'internal server error', code: 'INTERNAL_SERVER_ERROR' }),
    });

    let caughtError: any;
    try {
      await getShipmentTimeline('test-token', 1);
    } catch (err) {
      caughtError = err;
    }

    expect(caughtError).toBeDefined();
    expect(caughtError.status).toBe(500);
    expect(caughtError.message).toContain('internal server error');
  });

  it('falls back to default message when JSON parse fails', async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => { throw new Error('parse error'); },
    });

    await expect(getShipmentTimeline('test-token', 1)).rejects.toThrow(
      'Failed to fetch shipment timeline'
    );
  });
});
