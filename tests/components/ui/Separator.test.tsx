import { render, screen } from '@test/utils';
import { Separator } from '@/components/ui/separator';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('Separator', () => {
  it('renders correctly', () => {
    render(<Separator />);
    const sep = screen.getByTestId('separator');
    expect(sep).toBeInTheDocument();
    expect(sep).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('handles vertical orientation', () => {
    render(<Separator orientation="vertical" />);
    const sep = screen.getByTestId('separator');
    expect(sep).toHaveAttribute('data-orientation', 'vertical');
  });
});
