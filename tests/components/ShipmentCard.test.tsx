import { render, screen, fireEvent } from '@test/utils';
import { ShipmentCard } from '@/components/ShipmentCard';
import { describe, it, expect, vi } from 'vitest';

describe('ShipmentCard', () => {
  const defaultProps = {
    id: '1',
    trackingNumber: 'TRK-123456',
    status: 'pending' as const,
    pickupAddress: 'Bole, Addis Ababa',
    deliveryAddress: 'Sarbet, Addis Ababa',
    recipientName: 'John Doe',
    recipientPhone: '+251911223344',
  };

  it('renders default variant correctly', () => {
    render(<ShipmentCard {...defaultProps} />);
    
    expect(screen.getByText('TRK-123456')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Bole, Addis Ababa')).toBeInTheDocument();
    expect(screen.getByText('Sarbet, Addis Ababa')).toBeInTheDocument();
    // StatusBadge renders the label. For 'pending' it should find it via i18n
    expect(screen.getByText(/pending/i)).toBeInTheDocument();
  });

  it('renders mobile variant correctly', () => {
    render(<ShipmentCard {...defaultProps} variant="mobile" />);
    
    expect(screen.getByText('TRK-123456')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('displays estimated time and COD amount if provided', () => {
    render(
      <ShipmentCard 
        {...defaultProps} 
        estimatedTime="25 mins" 
        codAmount={1500} 
      />
    );
    
    expect(screen.getByText('25 mins')).toBeInTheDocument();
    expect(screen.getByText(/1,500/)).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<ShipmentCard {...defaultProps} onClick={onClick} />);
    
    fireEvent.click(screen.getByText('John Doe').closest('div[class*="cursor-pointer"]')!);
    expect(onClick).toHaveBeenCalled();
  });
});
