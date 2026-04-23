import { 
  getAvailableCouriers, 
  buildCourierLogoProxyUrl, 
  findCourierById 
} from '@/lib/couriers';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('couriers lib', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  describe('getAvailableCouriers', () => {
    it('returns courier list on success', async () => {
      const mockData = { data: [{ id: 1, company_name: 'Fast' }] };
      (fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const result = await getAvailableCouriers('token');
      expect(result).toHaveLength(1);
      expect(result[0].company_name).toBe('Fast');
      expect(fetch).toHaveBeenCalledWith('/api/couriers/available', expect.any(Object));
    });

    it('throws error on failure', async () => {
      (fetch as any).mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Forbidden' }),
      });

      await expect(getAvailableCouriers('token')).rejects.toThrow('Forbidden');
    });
  });

  describe('buildCourierLogoProxyUrl', () => {
    it('builds URL with token', () => {
      const url = buildCourierLogoProxyUrl('logo.png', 'token123');
      expect(url).toBe('/api/couriers/logo/logo.png?token=token123');
    });

    it('returns null for empty logoId', () => {
      expect(buildCourierLogoProxyUrl('', 'token')).toBeNull();
      expect(buildCourierLogoProxyUrl(null, 'token')).toBeNull();
    });
  });

  describe('findCourierById', () => {
    const courier = { id: 1, company_name: 'C1' } as any;
    it('finds in partners', () => {
      expect(findCourierById(1, [], [courier])).toEqual(courier);
    });
    it('finds in available', () => {
      expect(findCourierById(1, [courier], [])).toEqual(courier);
    });
    it('returns undefined if not found', () => {
      expect(findCourierById(99, [], [])).toBeUndefined();
    });
  });
});
