import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  getAvailableCouriers, 
  buildCourierLogoProxyUrl, 
  findCourierById 
} from '@/lib/couriers';

describe('couriers lib extra coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe('getAvailableCouriers', () => {
    it('throws error on non-ok response', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        json: async () => ({ message: 'Custom error' })
      });
      await expect(getAvailableCouriers('token')).rejects.toThrow('Custom error');
    });

    it('handles data envelope in payload', async () => {
       (global.fetch as any).mockResolvedValue({
         ok: true,
         json: async () => ({ data: [{ id: 1, company_name: 'Courier A' }] })
       });
       const couriers = await getAvailableCouriers('token');
       expect(couriers).toHaveLength(1);
       expect(couriers[0].id).toBe(1);
    });

    it('handles couriers envelope in payload', async () => {
       (global.fetch as any).mockResolvedValue({
         ok: true,
         json: async () => ({ couriers: [{ id: 2 }] })
       });
       const couriers = await getAvailableCouriers('token');
       expect(couriers[0].id).toBe(2);
    });

    it('handles results envelope in payload', async () => {
       (global.fetch as any).mockResolvedValue({
         ok: true,
         json: async () => ({ results: [{ id: 3 }] })
       });
       const couriers = await getAvailableCouriers('token');
       expect(couriers[0].id).toBe(3);
    });
  });

  describe('normalizeCourierId', () => {
    it('handles courier_company nested object', async () => {
       (global.fetch as any).mockResolvedValue({
         ok: true,
         json: async () => ([{ courier_company: { id: 123, company_name: 'Nested Co' } }])
       });
       const couriers = await getAvailableCouriers('token');
       expect(couriers[0].id).toBe(123);
       expect(couriers[0].company_name).toBe('Nested Co');
    });

    it('handles courier_id field', async () => {
       (global.fetch as any).mockResolvedValue({
         ok: true,
         json: async () => ([{ courier_id: 456 }])
       });
       const couriers = await getAvailableCouriers('token');
       expect(couriers[0].id).toBe(456);
    });
  });

  describe('buildCourierLogoProxyUrl', () => {
    it('returns null on empty inputs', () => {
       expect(buildCourierLogoProxyUrl(null, 'token')).toBeNull();
       expect(buildCourierLogoProxyUrl('', 'token')).toBeNull();
    });
  });

  describe('findCourierById', () => {
    it('finds in partners if available', () => {
       const available = [{ id: 1 } as any];
       const partners = [{ id: 2 } as any];
       expect(findCourierById(2, available, partners)).toEqual({ id: 2 });
       expect(findCourierById(1, available, partners)).toEqual({ id: 1 });
       expect(findCourierById(3, available, partners)).toBeUndefined();
    });
  });
});
