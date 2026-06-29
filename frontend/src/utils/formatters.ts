/**
 * Formats a date string to a localized display format.
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return '—';
  try {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  } catch {
    return dateString;
  }
};

/**
 * Formats a number as currency.
 */
export const formatCurrency = (amount?: number): string => {
  if (amount == null) return '—';
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Returns the initials from a full name string.
 */
export const getInitials = (name?: string): string => {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n.charAt(0).toUpperCase())
    .join('');
};
