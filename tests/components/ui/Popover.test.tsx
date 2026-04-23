import { render, screen, fireEvent } from '@test/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('Popover', () => {
  it('renders and toggles content', () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    );

    expect(screen.queryByText('Content')).not.toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
