import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-emerald-900/60 text-emerald-300 border border-emerald-700',
  warning: 'bg-amber-900/60 text-amber-300 border border-amber-700',
  danger: 'bg-red-900/60 text-red-300 border border-red-700',
  info: 'bg-indigo-900/60 text-indigo-300 border border-indigo-700',
  neutral: 'bg-slate-800 text-slate-300 border border-slate-600',
};

const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children, className = '' }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variantClasses[variant]} ${className}`}
  >
    {children}
  </span>
);

export default Badge;

// Helper functions for task/project status badges
export const getStatusVariant = (status?: string): BadgeVariant => {
  switch (status) {
    case 'COMPLETED': return 'success';
    case 'IN_PROGRESS': return 'info';
    case 'PENDING': return 'warning';
    case 'ACTIVO': case 'ACTIVE': return 'success';
    case 'INACTIVO': case 'INACTIVE': return 'danger';
    default: return 'neutral';
  }
};

export const getStatusLabel = (status?: string): string => {
  switch (status) {
    case 'PENDING': return 'Pendiente';
    case 'IN_PROGRESS': return 'En Progreso';
    case 'COMPLETED': return 'Completada';
    default: return status || 'Sin estado';
  }
};

export const getPriorityVariant = (priority?: string): BadgeVariant => {
  switch (priority?.toUpperCase()) {
    case 'HIGH': case 'CRITICAL': return 'danger';
    case 'MEDIUM': return 'warning';
    case 'LOW': return 'success';
    default: return 'neutral';
  }
};
