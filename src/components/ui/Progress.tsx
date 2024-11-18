import React, { forwardRef, HTMLAttributes } from 'react';

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  value?: number;
  max?: number;
  // Add any progress-specific props here
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(({
  value = 0,
  max = 100,
  className = '',
  ...props
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={`relative h-4 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800 ${className}`}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-primary-600 transition-all duration-300 ease-in-out"
        style={{
          transform: `translateX(-${100 - percentage}%)`,
          backgroundColor: '#2563eb' // Blue-600 color
        }}
      />
    </div>
  );
});

Progress.displayName = 'Progress';

export { Progress };