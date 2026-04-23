import { render, screen } from '@test/utils';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('Card', () => {
  it('renders all card sub-components correctly', () => {
    render(
      <Card className="custom-card">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
    expect(screen.getByText('Card Content')).toBeInTheDocument();
    expect(screen.getByText('Card Footer')).toBeInTheDocument();
    
    // Check custom class on Root
    const card = screen.getByText('Card Title').closest('.custom-card');
    expect(card).toBeInTheDocument();
  });
});
