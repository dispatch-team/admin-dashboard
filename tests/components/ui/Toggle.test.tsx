import { render, screen, fireEvent } from '@test/utils';
import { Toggle } from '@/components/ui/toggle';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

describe('Toggle', () => {
  it('renders and toggles state', () => {
    const onPressedChange = vi.fn();
    render(<Toggle onPressedChange={onPressedChange}>Toggle Me</Toggle>);
    
    const toggle = screen.getByRole('button');
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    
    fireEvent.click(toggle);
    expect(onPressedChange).toHaveBeenCalledWith(true);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    
    fireEvent.click(toggle);
    expect(onPressedChange).toHaveBeenCalledWith(false);
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });
});
