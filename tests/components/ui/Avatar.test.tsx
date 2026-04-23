import { render, screen } from '@test/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('Avatar', () => {
  it('renders image and fallback correctly', () => {
    render(
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByTestId('avatar-root')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-image')).toHaveAttribute('src', 'https://github.com/shadcn.png');
    expect(screen.getByText('CN')).toBeInTheDocument();
  });
});
