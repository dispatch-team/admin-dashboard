import { render, screen, fireEvent } from '@test/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

describe('AlertDialog', () => {
  it('renders correctly and handles actions', () => {
    const onAction = vi.fn();
    const onCancel = vi.fn();
    
    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete Account</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onAction}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    fireEvent.click(screen.getByText('Delete Account'));
    expect(screen.getByText('Are you absolutely sure?')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
    expect(screen.queryByText('Are you absolutely sure?')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Delete Account'));
    fireEvent.click(screen.getByText('Continue'));
    expect(onAction).toHaveBeenCalled();
    expect(screen.queryByText('Are you absolutely sure?')).not.toBeInTheDocument();
  });
});
