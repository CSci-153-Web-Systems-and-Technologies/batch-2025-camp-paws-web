/**
 * Skeleton Component - Loading placeholder
 * Single Responsibility: Display skeleton loading state
 */

import { HTMLAttributes } from 'react';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export default function Skeleton({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className = '',
  style,
  ...props
}: SkeletonProps) {
  const variantStyles = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 bg-[length:200%_100%]',
    none: '',
  };

  const baseStyles = 'bg-gray-200 dark:bg-gray-800';

  return (
    <div
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${animation !== 'wave' && animationStyles[animation]}
        ${className}
      `.trim()}
      style={{
        width: width || (variant === 'circular' ? height : '100%'),
        height: height || (variant === 'text' ? undefined : '100%'),
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
}

/**
 * SkeletonText Component - Multiple lines of skeleton text
 * Single Responsibility: Display multiple skeleton text lines
 */

export interface SkeletonTextProps {
  lines?: number;
  lastLineWidth?: string;
  spacing?: string;
}

export function SkeletonText({ lines = 3, lastLineWidth = '70%', spacing = 'space-y-2' }: SkeletonTextProps) {
  return (
    <div className={spacing}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? lastLineWidth : '100%'}
        />
      ))}
    </div>
  );
}

/**
 * SkeletonCard Component - Card skeleton with avatar and text
 * Single Responsibility: Display card-style skeleton
 */

export function SkeletonCard() {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="60%" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
}
