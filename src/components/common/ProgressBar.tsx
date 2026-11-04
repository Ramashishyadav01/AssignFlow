import React from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  color?: 'indigo' | 'emerald' | 'amber' | 'red' | 'violet';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const colorClasses = {
  indigo: 'bg-indigo-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  violet: 'bg-violet-500',
};

const heightClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export default function ProgressBar({
  value,
  color = 'indigo',
  size = 'md',
  showLabel = false,
  className = '',
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={['flex items-center gap-2', className].join(' ')}>
      <div className={['flex-1 bg-gray-100 rounded-full overflow-hidden', heightClasses[size]].join(' ')}>
        <div
          className={['rounded-full transition-all duration-500', colorClasses[color], heightClasses[size]].join(' ')}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-gray-500 w-10 text-right">
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
}
