import { render, screen, fireEvent } from '@test/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

describe('Collapsible', () => {
  it('renders and toggles content', () => {
    const onOpenChange = vi.fn();
    render(
      <Collapsible onOpenChange={onOpenChange}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );

    expect(screen.queryByText('Content')).not.toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Toggle'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.getByText('Content')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Toggle'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });
});
