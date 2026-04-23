import { render, screen } from '@test/utils';
import NotFound from '@/app/not-found';
import { describe, it, expect } from 'vitest';

describe('NotFound', () => {
  it('renders 404 message', () => {
    render(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText(/Page not found/i)).toBeInTheDocument();
  });

  it('renders back to home link', () => {
    render(<NotFound />);
    const link = screen.getByRole('link', { name: /Back to home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});
