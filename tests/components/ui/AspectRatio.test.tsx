import { render, screen } from '@test/utils';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('AspectRatio', () => {
  it('renders correctly with ratio', () => {
    render(
      <AspectRatio ratio={16 / 9}>
        <div data-testid="child">Content</div>
      </AspectRatio>
    );
    
    const ar = screen.getByTestId('aspect-ratio');
    expect(ar).toHaveAttribute('data-ratio', (16 / 9).toString());
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
