import { render, screen, fireEvent } from '@test/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

describe('Select', () => {
  it('renders correctly and handles value changes', () => {
    const onValueChange = vi.fn();
    render(
      <Select onValueChange={onValueChange} defaultValue="apple">
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByText('Apple')).toBeInTheDocument();

    const bananaOption = screen.getByText('Banana');
    fireEvent.click(bananaOption);

    expect(onValueChange).toHaveBeenCalledWith('banana');
    expect(screen.getByText('Banana')).toBeInTheDocument();
  });

  it('renders placeholder when no value is selected', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByText('Select a fruit')).toBeInTheDocument();
  });
});
