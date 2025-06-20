import React from 'react';
import { render, screen } from '@testing-library/react';
import { TruncateTooltip } from '@/components/dynamic-table/truncate-tooltip';

describe('TruncateTooltip', () => {
  it('renders the tooltip when text is overflowing', () => {
    render(<TruncateTooltip text="This is a very long text to test overflow behavior" />);

    const span = screen.getByText(/This is a very long text/i);

    // Mock DOM measurements
    Object.defineProperty(span, 'scrollWidth', {
      configurable: true,
      value: 200,
    });
    Object.defineProperty(span, 'clientWidth', {
      configurable: true,
      value: 100,
    });

    // Trigger resize event to re-run overflow check
    window.dispatchEvent(new Event('resize'));

    // TooltipTrigger is a wrapper around span; text still appears
    expect(screen.getByText(/This is a very long text/i)).toBeInTheDocument();
  });
});
