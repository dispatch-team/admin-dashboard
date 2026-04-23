import { render, screen } from '@test/utils';
import { StatsCard } from '@/components/StatsCard';
import { Activity } from 'lucide-react';
import { describe, it, expect } from 'vitest';

describe('StatsCard', () => {
  it('renders title and value correctly', () => {
    render(<StatsCard title="Total Users" value="1,234" icon={Activity} />);
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('renders positive change correctly', () => {
    render(
      <StatsCard
        title="Total Users"
        value="1,234"
        icon={Activity}
        change="+12%"
        changeType="positive"
      />
    );
    const changeElement = screen.getByText('+12%');
    expect(changeElement).toBeInTheDocument();
    expect(changeElement).toHaveClass('text-success');
  });

  it('renders negative change correctly', () => {
    render(
      <StatsCard
        title="Total Users"
        value="1,234"
        icon={Activity}
        change="-5%"
        changeType="negative"
      />
    );
    const changeElement = screen.getByText('-5%');
    expect(changeElement).toBeInTheDocument();
    expect(changeElement).toHaveClass('text-destructive');
  });

  it('renders neutral change correctly', () => {
    render(
      <StatsCard
        title="Total Users"
        value="1,234"
        icon={Activity}
        change="Same as last month"
        changeType="neutral"
      />
    );
    const changeElement = screen.getByText('Same as last month');
    expect(changeElement).toBeInTheDocument();
    expect(changeElement).toHaveClass('text-muted-foreground');
  });

  it('renders the icon', () => {
    const { container } = render(<StatsCard title="Stats" value="100" icon={Activity} />);
    // Since we mock lucide-react, we can check for the presence of the icon element if we know how it's mocked
    // By default it's the actual component if not mocked specifically.
    // Let's check for the SVG or just the container class for the icon.
    expect(container.querySelector('.lucide-activity')).toBeInTheDocument();
  });
});
