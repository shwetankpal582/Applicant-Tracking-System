import React from 'react';
import { cn } from '~/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}) => {
  const baseClasses = 'bg-gray-200 rounded';
  
  const variantClasses = {
    text: 'h-4 w-full',
    rectangular: 'w-full h-4',
    circular: 'rounded-full',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-wave',
    none: '',
  };

  const style = {
    ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
    />
  );
};

// Predefined skeleton components for common use cases
export const ResumeCardSkeleton: React.FC = () => (
  <div className="resume-card animate-pulse">
    <div className="resume-card-header">
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex-shrink-0">
        <Skeleton variant="circular" width={60} height={60} />
      </div>
    </div>
    <div className="gradient-border">
      <Skeleton className="w-full h-[350px] max-sm:h-[200px]" />
    </div>
  </div>
);

export const SummarySkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-md w-full p-4">
    <div className="flex flex-row items-center gap-8 mb-6">
      <Skeleton variant="circular" width={80} height={40} />
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="resume-summary">
          <div className="category">
            <div className="flex flex-row gap-2 items-center justify-center">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-6 w-12" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ATSSkeleton: React.FC = () => (
  <div className="bg-gradient-to-b from-gray-100 to-white rounded-2xl shadow-md w-full p-6">
    <div className="flex items-center gap-4 mb-6">
      <Skeleton variant="circular" width={48} height={48} />
      <Skeleton className="h-6 w-32" />
    </div>
    <div className="mb-6">
      <Skeleton className="h-6 w-24 mb-2" />
      <Skeleton className="h-4 w-full mb-4" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton variant="circular" width={20} height={20} />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Skeleton;
