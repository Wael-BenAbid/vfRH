import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedGradientProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animationSpeed?: number; // in seconds
  gradientSize?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function AnimatedGradient({
  children,
  animationSpeed = 10,
  gradientSize = 'md',
  className,
  ...props
}: AnimatedGradientProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(0);

  useEffect(() => {
    const gradientTimeout = setTimeout(() => {
      setActive(1);
    }, 500);
    
    return () => clearTimeout(gradientTimeout);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      setCoords({ x: x * 100, y: y * 100 });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Map gradient size to scale value
  const sizeMap = {
    sm: 0.8,
    md: 1.0,
    lg: 1.5,
    xl: 2.0,
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden isolate bg-background",
        "before:absolute before:inset-0 before:-z-10 before:opacity-40 before:bg-[radial-gradient(circle_at_var(--x)%_var(--y)%,hsl(var(--primary)_/_0.8)_0%,transparent_50%)]",
        className
      )}
      style={{
        '--x': `${coords.x}`,
        '--y': `${coords.y}`,
        '--active': active,
        '--gradient-size': sizeMap[gradientSize],
        '--animation-speed': `${animationSpeed}s`,
      } as React.CSSProperties}
      {...props}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
          div::before {
            transform: translateZ(0) translateX(calc(var(--active) * (var(--x) - 50%) * 0.5)) translateY(calc(var(--active) * (var(--y) - 50%) * 0.5)) scale(var(--gradient-size));
            animation: pulse var(--animation-speed) ease-in-out infinite alternate;
          }
          
          @keyframes pulse {
            0% {
              opacity: 0.4;
              transform: translateZ(0) translateX(-10%) translateY(-10%) scale(var(--gradient-size));
            }
            100% {
              opacity: 0.7;
              transform: translateZ(0) translateX(10%) translateY(10%) scale(var(--gradient-size));
            }
          }
        `
      }} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}