import { render, screen } from '@test/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('Skeleton', () => {
  it('renders correctly', () => {
    const { container } = render(<Skeleton className="w-[100px] h-[20px]" />);
    const skeleton = container.querySelector('div');
    expect(skeleton).toHaveClass('animate-pulse');
    expect(skeleton).toHaveClass('w-[100px]');
  });
});
