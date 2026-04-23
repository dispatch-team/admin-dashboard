import { render, screen, fireEvent } from '@test/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

describe('Accordion', () => {
  it('renders correctly and toggles content', () => {
    const onValueChange = vi.fn();
    render(
      <Accordion type="single" collapsible onValueChange={onValueChange}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it styled?</AccordionTrigger>
          <AccordionContent>Yes. It comes with default styles that matches the other components&apos; aesthetic.</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.queryByText(/WAI-ARIA/)).not.toBeInTheDocument();

    const trigger1 = screen.getByText('Is it accessible?');
    fireEvent.click(trigger1);

    expect(onValueChange).toHaveBeenCalledWith('item-1');
    expect(screen.getByText(/WAI-ARIA/)).toBeInTheDocument();

    const trigger2 = screen.getByText('Is it styled?');
    fireEvent.click(trigger2);

    expect(onValueChange).toHaveBeenCalledWith('item-2');
    expect(screen.getByText(/default styles/)).toBeInTheDocument();
    expect(screen.queryByText(/WAI-ARIA/)).not.toBeInTheDocument();
  });

  it('handles multiple expansion when type is multiple', () => {
    render(
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Trigger 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    fireEvent.click(screen.getByText('Trigger 1'));
    fireEvent.click(screen.getByText('Trigger 2'));

    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });
});
