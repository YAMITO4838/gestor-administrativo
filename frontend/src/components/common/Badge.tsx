import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  warning: 'bg-[#fff7e5] text-[#8a641c] border border-[#e7c878]',
  danger: 'bg-red-50 text-red-700 border border-red-200',
  info: 'bg-[#edf6ff] text-[#17486a] border border-[#b8d7ef]',
  neutral: 'bg-stone-100 text-graphite border border-stone-200',
};

const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children, className = '' }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${variantClasses[variant]} ${className}`}
  >
    {children}
  </span>
);

export default Badge;
