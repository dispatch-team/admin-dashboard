import { render, screen, fireEvent } from '@test/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

describe('Dialog', () => {
  it('renders correctly and opens content', () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog onOpenChange={onOpenChange}>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <p>Dialog Content</p>
        </DialogContent>
      </Dialog>
    );

    expect(screen.queryByText('Dialog Content')).not.toBeInTheDocument();

    const trigger = screen.getByText('Open Dialog');
    fireEvent.click(trigger);

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.getByText('Dialog Content')).toBeInTheDocument();
    expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    expect(screen.getByText('Dialog Description')).toBeInTheDocument();
  });

  it('closes when close button is clicked', () => {
    render(
      <Dialog defaultOpen={true}>
        <DialogContent>
          <p>Dialog Content</p>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByText('Dialog Content')).toBeInTheDocument();

    const closeButton = screen.getByTestId('dialog-close');
    fireEvent.click(closeButton);

    expect(screen.queryByText('Dialog Content')).not.toBeInTheDocument();
  });
});
