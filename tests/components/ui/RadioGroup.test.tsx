import { render, screen, fireEvent } from '@test/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

describe('RadioGroup', () => {
  it('renders and handles value changes', () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup defaultValue="option-one" onValueChange={onValueChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-one" id="option-one" />
          <label htmlFor="option-one">Option One</label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-two" id="option-two" />
          <label htmlFor="option-two">Option Two</label>
        </div>
      </RadioGroup>
    );

    const radio1 = screen.getByRole('radio', { name: 'Option One' });
    const radio2 = screen.getByRole('radio', { name: 'Option Two' });

    expect(radio1).toHaveAttribute('aria-checked', 'true');
    expect(radio2).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(radio2);
    expect(onValueChange).toHaveBeenCalledWith('option-two');
    expect(radio1).toHaveAttribute('aria-checked', 'false');
    expect(radio2).toHaveAttribute('aria-checked', 'true');
  });
});
