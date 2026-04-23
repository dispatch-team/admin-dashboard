import { render, screen } from '@test/utils';
import { StatusBadge, type ShipmentStatus } from '@/components/StatusBadge';
import { describe, it, expect } from 'vitest';

describe('StatusBadge', () => {
  it('renders pending status correctly', () => {
    render(<StatusBadge status="pending" />);
    expect(screen.getByText(/pending/i)).toBeInTheDocument();
  });

  it('renders delivered status correctly', () => {
    render(<StatusBadge status="delivered" />);
    expect(screen.getByText(/delivered/i)).toBeInTheDocument();
  });

  it('renders failed status correctly', () => {
    render(<StatusBadge status="failed" />);
    expect(screen.getByText(/failed/i)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<StatusBadge status="pending" className="custom-class" />);
    expect(screen.getByTestId('status-badge')).toHaveClass('custom-class');
  });

  const statuses: ShipmentStatus[] = [
    'pending',
    'assigned',
    'picked_up',
    'in_transit',
    'out_for_delivery',
    'delivered',
    'failed',
    'returned',
    'cancelled'
  ];

  it.each(statuses)('renders %s status without crashing', (status) => {
    render(<StatusBadge status={status} />);
    expect(screen.getByTestId('status-badge')).toBeInTheDocument();
  });
});
