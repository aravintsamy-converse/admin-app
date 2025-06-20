import React from 'react'
import { cn } from '@/lib/utils'

export const CalendarNavLeft = ({
  className,
  ...props
}: React.ComponentProps<'svg'>) => (
  <svg
    data-testid="left-arrow"
    xmlns="http://www.w3.org/2000/svg"
    width="8"
    height="16"
    viewBox="0 0 8 16"
    fill="none"
    className={cn(
      'h-6 w-6 flex items-center !pt-[5px] justify-center',
      className
    )}
    {...props}
  >
    <path
      d="M6.0625 8.9425L2.97208 5.5L6.0625 2.0575L5.11108 1L1.0625 5.5L5.11108 10L6.0625 8.9425Z"
      fill="#889ABC"
      stroke="#889ABC"
    />
  </svg>
)

export const CalendarNavRight = ({
  className,
  ...props
}: React.ComponentProps<'svg'>) => (
  <svg
    data-testid="right-arrow"
    xmlns="http://www.w3.org/2000/svg"
    width="8"
    height="16"
    viewBox="0 0 8 16"
    fill="none"
    className={cn(
      'h-6 w-6 flex items-center !pt-[5px] justify-center',
      className
    )}
    {...props}
  >
    <path
      d="M1.15625 2.0575L4.24667 5.5L1.15625 8.9425L2.10767 10L6.15625 5.5L2.10767 1L1.15625 2.0575Z"
      fill="#889ABC"
      stroke="#889ABC"
    />
  </svg>
)
