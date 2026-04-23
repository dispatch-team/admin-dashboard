import { render, screen, fireEvent } from '@test/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('Tooltip', () => {
  it('renders and toggles content on hover', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip info</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    expect(screen.queryByText('Tooltip info')).not.toBeInTheDocument();
    
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(screen.getByText('Tooltip info')).toBeInTheDocument();
    
    fireEvent.mouseLeave(screen.getByText('Hover me'));
    expect(screen.queryByText('Tooltip info')).not.toBeInTheDocument();
  });
});
