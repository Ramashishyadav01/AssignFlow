import React, { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color?: 'indigo' | 'emerald' | 'amber' | 'violet' | 'red';
}

const bgColors = {
  indigo: 'bg-indigo-50',
  emerald: 'bg-emerald-50',
  amber: 'bg-amber-50',
  violet: 'bg-violet-50',
  red: 'bg-red-50',
};

const iconColors = {
  indigo: 'text-indigo-600',
  emerald: 'text-emerald-600',
  amber: 'text-amber-600',
  violet: 'text-violet-600',
  red: 'text-red-600',
};

export default function StatCard({
  icon,
  label,
  value,
  sub,
  color = 'indigo',
}: StatCardProps) {
  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 flex items-start gap-4">
      <div className={['p-3 rounded-xl shrink-0', bgColors[color]].join(' ')}>
        <div className={iconColors[color]}>{icon}</div>
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500 truncate">{label}</p>
        <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5 truncate">{sub}</p>}
      </div>
    </div>
  );
}
