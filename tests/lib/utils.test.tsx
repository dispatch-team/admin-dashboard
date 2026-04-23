import { cn } from '@/lib/utils';
import { describe, it, expect } from 'vitest';

describe('cn utility', () => {
  it('merges class names correctly', () => {
    expect(cn('base', 'extra')).toBe('base extra');
  });

  it('handles conditional classes', () => {
    expect(cn('base', true && 'is-true', false && 'is-false')).toBe('base is-true');
  });

  it('merges tailwind classes correctly (conflict resolution)', () => {
    // p-4 and p-2 conflict, p-2 should win if it comes later or via twMerge logic
    expect(cn('p-4', 'p-2')).toBe('p-2');
  });

  it('handles arrays and objects', () => {
    expect(cn(['a', 'b'], { 'c': true, 'd': false })).toBe('a b c');
  });
});
