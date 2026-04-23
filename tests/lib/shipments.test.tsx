import { createShipment, getShipments, getShipmentDetails, updateShipment, deleteShipment } from '@/lib/shipments';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('shipments lib', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('createShipment calls fetch with correct params', async () => {
    const mockResponse = { id: '1', status: 'pending' };
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const payload = {
      courier_company_id: 1,
      merchant_user_id: 'm1',
      start_address: 'A',
      end_address: 'B',
      description: 'D',
    };

    const result = await createShipment('token', payload);

    expect(fetch).toHaveBeenCalledWith('/api/shipments', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    expect(result).toEqual(mockResponse);
  });

  it('getShipments handles query parameters', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ shipments: [], total: 0 }),
    });

    await getShipments('token', { page: 1, page_size: 10 });

    expect(fetch).toHaveBeenCalledWith('/api/shipments?page=1&page_size=10', {
      headers: { Authorization: 'Bearer token' },
    });
  });

  it('getShipmentDetails handles success', async () => {
    const mockShipment = { id: '1', code: 'SHIP123' };
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockShipment,
    });

    const result = await getShipmentDetails('token', 'SHIP123');

    expect(fetch).toHaveBeenCalledWith('/api/shipments/SHIP123', {
      headers: { Authorization: 'Bearer token' },
    });
    expect(result).toEqual(mockShipment);
  });

  it('throws error when response is not ok', async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ message: 'Not Found' }),
    });

    await expect(getShipmentDetails('token', 'MISSING')).rejects.toThrow('Not Found');
  });

  it('updateShipment handles success', async () => {
    const mockResponse = { id: '1', status: 'updated' };
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await updateShipment('token', 'SHIP123', { status: 'updated' });
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith('/api/shipments/SHIP123', expect.objectContaining({
      method: 'PATCH',
    }));
  });

  it('updateShipment handles failure', async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Update Failed' }),
    });

    await expect(updateShipment('token', 'S', {})).rejects.toThrow('Update Failed');
  });

  it('deleteShipment handles success', async () => {
    (fetch as any).mockResolvedValue({ ok: true });
    await expect(deleteShipment('token', 'SHIP123')).resolves.not.toThrow();
  });

  it('deleteShipment handles failure', async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Delete Error' }),
    });

    await expect(deleteShipment('token', 'S')).rejects.toThrow('Delete Error');
  });

  it('handles JSON parse error in catch block', async () => {
     (fetch as any).mockResolvedValue({
      ok: false,
      json: async () => { throw new Error('JSON Error'); },
    });

    await expect(createShipment('token', {} as any)).rejects.toThrow('Failed to create shipment');
  });
});
