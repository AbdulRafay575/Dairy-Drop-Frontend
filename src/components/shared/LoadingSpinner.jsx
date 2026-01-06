import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const LoadingSpinner = ({ 
  size = 'default',
  message,
  className,
  fullScreen = false 
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    default: 'h-8 w-8',
    large: 'h-12 w-12',
    xlarge: 'h-16 w-16'
  };

  const spinner = (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {message && (
        <p className="mt-4 text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export const InlineLoadingSpinner = ({ size = 'small', className }) => {
  const sizeClasses = {
    small: 'h-3 w-3',
    default: 'h-4 w-4',
    large: 'h-5 w-5'
  };

  return (
    <Loader2 className={cn('animate-spin inline-block', sizeClasses[size], className)} />
  );
};

export const ButtonLoadingSpinner = () => {
  return <Loader2 className="h-4 w-4 animate-spin" />;
};

export const PageLoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="large" message={message} />
    </div>
  );
};

export const CardLoadingSpinner = () => {
  return (
    <div className="border rounded-lg p-8">
      <LoadingSpinner size="default" message="Loading content..." />
    </div>
  );
};

export default LoadingSpinner;