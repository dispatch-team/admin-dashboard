import { render, screen } from '@test/utils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('Alert', () => {
  it('renders correctly', () => {
    render(
      <Alert>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>You can add components to your app using the cli.</AlertDescription>
      </Alert>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Heads up!')).toBeInTheDocument();
    expect(screen.getByText(/using the cli/)).toBeInTheDocument();
  });

  it('applies destructive variant', () => {
    render(
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong.</AlertDescription>
      </Alert>
    );

    expect(screen.getByRole('alert')).toHaveClass('text-destructive');
  });
});
