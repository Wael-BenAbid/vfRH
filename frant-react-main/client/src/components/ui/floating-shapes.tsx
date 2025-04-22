import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type Shape = 'circle' | 'square' | 'triangle';
type ShapeColor = 'primary' | 'secondary' | 'accent' | 'muted';
type ShapePosition = {
  id: number;
  x: number;
  y: number;
  size: number;
  shape: Shape;
  color: ShapeColor;
  rotation: number;
  animationDuration: number;
  delay: number;
};

interface FloatingShapesProps {
  count?: number;
  minSize?: number;
  maxSize?: number;
  shapeColors?: ShapeColor[];
  className?: string;
}

export const FloatingShapes: React.FC<FloatingShapesProps> = ({
  count = 10,
  minSize = 20,
  maxSize = 60,
  shapeColors = ['primary', 'secondary'],
  className,
}) => {
  const [shapes, setShapes] = useState<ShapePosition[]>([]);

  useEffect(() => {
    const shapeTypes: Shape[] = ['circle', 'square', 'triangle'];
    
    const randomShapes = Array.from({ length: count }, (_, i) => {
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: minSize + Math.random() * (maxSize - minSize),
        shape: shapeTypes[Math.floor(Math.random() * shapeTypes.length)] as Shape,
        color: shapeColors[Math.floor(Math.random() * shapeColors.length)],
        rotation: Math.random() * 360,
        animationDuration: 15 + Math.random() * 30,
        delay: Math.random() * -30
      };
    });
    
    setShapes(randomShapes);
  }, [count, minSize, maxSize, shapeColors]);

  return (
    <div className={cn("fixed inset-0 pointer-events-none overflow-hidden", className)}>
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            opacity: 0.1,
          }}
          animate={{
            x: [
              0,
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
              0
            ],
            y: [
              0,
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
              0
            ],
            rotate: [
              shape.rotation,
              shape.rotation + (Math.random() > 0.5 ? 360 : -360)
            ],
          }}
          transition={{
            duration: shape.animationDuration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: shape.delay,
          }}
        >
          {shape.shape === 'circle' && (
            <div
              className={cn(`bg-${shape.color} rounded-full`)}
              style={{
                width: shape.size,
                height: shape.size,
              }}
            />
          )}
          
          {shape.shape === 'square' && (
            <div
              className={cn(`bg-${shape.color} rounded-md`)}
              style={{
                width: shape.size,
                height: shape.size,
              }}
            />
          )}
          
          {shape.shape === 'triangle' && (
            <div
              className={cn(`border-transparent`)}
              style={{
                width: 0,
                height: 0,
                borderLeft: `${shape.size / 2}px solid transparent`,
                borderRight: `${shape.size / 2}px solid transparent`,
                borderBottom: `${shape.size}px solid var(--${shape.color})`,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};