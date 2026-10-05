import React from 'react';
import { Sprout } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  subMessage?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading CropPilot AI...',
  subMessage,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
      <div className="relative flex items-center justify-center">
        {/* Animated Glow */}
        <div className="absolute inset-0 rounded-full bg-brand-400/30 blur-xl animate-pulse" />
        
        {/* Outer Spinner */}
        <div className={`${sizeClasses[size]} border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin`} />
        
        {/* Central Sprout Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Sprout className="w-5 h-5 text-brand-700 animate-bounce" />
        </div>
      </div>

      {message && (
        <p className="text-sm font-semibold text-slate-700 tracking-wide">
          {message}
        </p>
      )}

      {subMessage && (
        <p className="text-xs text-slate-500 max-w-sm">
          {subMessage}
        </p>
      )}
    </div>
  );
};
