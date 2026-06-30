import type { BadgeVariant } from './Badge';

export const getStatusVariant = (status?: string): BadgeVariant => {
  switch (status) {
    case 'COMPLETED':
    case 'COMPLETADO':
      return 'success';
    case 'IN_PROGRESS':
    case 'EN_PROGRESO':
      return 'info';
    case 'PENDING':
    case 'PENDIENTE':
    case 'EN_ESPERA':
      return 'warning';
    case 'PAUSADO':
    case 'INACTIVO':
    case 'INACTIVE':
      return 'danger';
    case 'ACTIVO':
    case 'ACTIVE':
      return 'success';
    default:
      return 'neutral';
  }
};

export const getStatusLabel = (status?: string): string => {
  switch (status) {
    case 'PENDING':
    case 'PENDIENTE':
      return 'Pendiente';
    case 'IN_PROGRESS':
    case 'EN_PROGRESO':
      return 'En progreso';
    case 'COMPLETED':
    case 'COMPLETADO':
      return 'Completada';
    case 'EN_ESPERA':
      return 'En espera';
    case 'PAUSADO':
      return 'Pausado';
    default:
      return status || 'Sin estado';
  }
};

export const getPriorityVariant = (priority?: string): BadgeVariant => {
  switch (priority?.toUpperCase()) {
    case 'HIGH':
    case 'CRITICAL':
      return 'danger';
    case 'MEDIUM':
      return 'warning';
    case 'LOW':
      return 'success';
    default:
      return 'neutral';
  }
};
