import { render, screen, fireEvent } from '@test/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

describe('Checkbox', () => {
  it('renders and toggles state', () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox onCheckedChange={onCheckedChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    
    fireEvent.click(checkbox);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
    
    fireEvent.click(checkbox);
    expect(onCheckedChange).toHaveBeenCalledWith(false);
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  it('renders as checked when checked prop is true', () => {
    render(<Checkbox checked={true} />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Checkbox disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });
});
