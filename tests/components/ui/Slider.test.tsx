import { render, screen } from '@test/utils';
import { Slider } from '@/components/ui/slider';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('Slider', () => {
  it('renders correctly with default value', () => {
    render(<Slider defaultValue={[25]} max={100} step={1} />);
    
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuenow', '25');
  });

  it('applies custom value', () => {
    render(<Slider value={[50]} max={100} step={1} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuenow', '50');
  });
});
