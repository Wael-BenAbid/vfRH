import React from 'react';
import { cn } from '@/lib/utils';

interface WaveyBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  waveOpacity?: number;
  className?: string;
}

export function WaveyBackground({
  children,
  waveOpacity = 0.5,
  className,
  ...props
}: WaveyBackgroundProps) {
  return (
    <div className={cn("relative overflow-hidden bg-background", className)} {...props}>
      <svg
        className="absolute inset-0 w-full z-0"
        xmlns="http://www.w3.org/2000/svg"
        id="visual"
        viewBox="0 0 900 600"
        style={{ opacity: waveOpacity }}
        preserveAspectRatio="none"
      >
        <path
          d="M0 109L21.5 114.5C43 120 86 131 128.8 129.7C171.7 128.3 214.3 114.7 257.2 113C300 111.3 343 121.7 385.8 130.5C428.7 139.3 471.3 146.7 514.2 143.3C557 140 600 126 642.8 122.3C685.7 118.7 728.3 125.3 771.2 131.2C814 137 857 142 878.5 144.5L900 147L900 0L878.5 0C857 0 814 0 771.2 0C728.3 0 685.7 0 642.8 0C600 0 557 0 514.2 0C471.3 0 428.7 0 385.8 0C343 0 300 0 257.2 0C214.3 0 171.7 0 128.8 0C86 0 43 0 21.5 0L0 0Z"
          fill="hsl(var(--primary) / 0.3)"
        ></path>
        <path
          d="M0 97L21.5 99.5C43 102 86 107 128.8 108.5C171.7 110 214.3 108 257.2 101.7C300 95.3 343 84.7 385.8 83.5C428.7 82.3 471.3 90.7 514.2 96.2C557 101.7 600 104.3 642.8 99.5C685.7 94.7 728.3 82.3 771.2 82.5C814 82.7 857 95.3 878.5 101.7L900 108L900 0L878.5 0C857 0 814 0 771.2 0C728.3 0 685.7 0 642.8 0C600 0 557 0 514.2 0C471.3 0 428.7 0 385.8 0C343 0 300 0 257.2 0C214.3 0 171.7 0 128.8 0C86 0 43 0 21.5 0L0 0Z"
          fill="hsl(var(--primary) / 0.2)"
        ></path>
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  );
}