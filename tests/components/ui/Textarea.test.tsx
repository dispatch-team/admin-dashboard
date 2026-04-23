import { render, screen, fireEvent } from '@test/utils';
import { Textarea } from '@/components/ui/textarea';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

describe('Textarea', () => {
  it('renders correctly', () => {
    render(<Textarea placeholder="Type message" />);
    expect(screen.getByPlaceholderText('Type message')).toBeInTheDocument();
  });

  it('handles change events', () => {
    const onChange = vi.fn();
    render(<Textarea onChange={onChange} />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Hello world' } });
    expect(onChange).toHaveBeenCalled();
    expect((textarea as HTMLTextAreaElement).value).toBe('Hello world');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Textarea disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
