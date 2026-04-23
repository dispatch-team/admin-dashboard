import { render, screen, fireEvent } from '@test/utils';
import { Switch } from '@/components/ui/switch';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

describe('Switch', () => {
  it('renders and toggles state', () => {
    const onCheckedChange = vi.fn();
    render(<Switch onCheckedChange={onCheckedChange} />);
    
    const sw = screen.getByRole('switch');
    expect(sw).toHaveAttribute('aria-checked', 'false');
    
    fireEvent.click(sw);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(sw).toHaveAttribute('aria-checked', 'true');
    
    fireEvent.click(sw);
    expect(onCheckedChange).toHaveBeenCalledWith(false);
    expect(sw).toHaveAttribute('aria-checked', 'false');
  });

  it('renders as checked when checked prop is true', () => {
    render(<Switch checked={true} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Switch disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });
});
