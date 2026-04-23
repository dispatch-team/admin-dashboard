import { render, screen, fireEvent } from '@test/utils';
import { Calendar } from '@/components/ui/calendar';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { format } from 'date-fns';

describe('Calendar', () => {
  it('renders correctly', () => {
    const today = new Date();
    render(<Calendar mode="single" selected={today} />);
    
    // Check if the current month is visible (caption label)
    const monthLabel = format(today, 'MMMM yyyy');
    expect(screen.getByText(monthLabel)).toBeInTheDocument();
  });

  it('handles date selection', () => {
    const onSelect = vi.fn();
    const today = new Date();
    // We need to be careful with "today" because it might be the only one or not.
    // Let's use a fixed date for more deterministic testing if possible, 
    // but react-day-picker usually renders the current month by default.
    
    render(<Calendar mode="single" onSelect={onSelect} />);
    
    // Find a day button. They usually have the day number as text.
    // Let's find "15" (if it exists in current month)
    const day15 = screen.getByText('15');
    fireEvent.click(day15);
    
    expect(onSelect).toHaveBeenCalled();
  });
});
