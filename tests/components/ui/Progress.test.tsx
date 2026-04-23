import { render, screen } from '@test/utils';
import { Progress } from '@/components/ui/progress';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('Progress', () => {
  it('renders correctly with value', () => {
    const { container } = render(<Progress value={50} />);
    
    const indicator = container.querySelector('[style*="translateX(-50%)"]');
    expect(indicator).toBeInTheDocument();
  });

  it('handles undefined value', () => {
    const { container } = render(<Progress />);
    const indicator = container.querySelector('[style*="translateX(-100%)"]');
    expect(indicator).toBeInTheDocument();
  });
});
