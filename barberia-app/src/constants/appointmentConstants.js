/**
 * Constantes para el módulo de citas
 * Centraliza todos los valores hardcodeados para facilitar mantenimiento
 */

export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  PENDING_PAYMENT: 'pending_payment',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected'
};

export const APPOINTMENT_STATUS_COLORS = {
  [APPOINTMENT_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [APPOINTMENT_STATUS.UNDER_REVIEW]: 'bg-purple-100 text-purple-800',
  [APPOINTMENT_STATUS.PENDING_PAYMENT]: 'bg-orange-100 text-orange-800',
  [APPOINTMENT_STATUS.CONFIRMED]: 'bg-blue-100 text-blue-800',
  [APPOINTMENT_STATUS.COMPLETED]: 'bg-green-100 text-green-800',
  [APPOINTMENT_STATUS.CANCELLED]: 'bg-red-100 text-red-800',
  [APPOINTMENT_STATUS.REJECTED]: 'bg-red-100 text-red-800'
};

export const APPOINTMENT_STATUS_LABELS = {
  [APPOINTMENT_STATUS.PENDING]: 'Pendiente Aprobación',
  [APPOINTMENT_STATUS.UNDER_REVIEW]: 'En Revisión',
  [APPOINTMENT_STATUS.PENDING_PAYMENT]: 'Pago por verificar',
  [APPOINTMENT_STATUS.CONFIRMED]: 'Confirmada',
  [APPOINTMENT_STATUS.COMPLETED]: 'Completada',
  [APPOINTMENT_STATUS.CANCELLED]: 'Cancelada',
  [APPOINTMENT_STATUS.REJECTED]: 'Rechazada'
};

export const REJECTION_REASONS = [
  { value: 'horario_no_disponible', label: 'Horario no disponible' },
  { value: 'barbero_no_disponible', label: 'Barbero no disponible' },
  { value: 'información_incompleta', label: 'Información incompleta' },
  { value: 'conflicto_horario', label: 'Conflicto de horarios' },
  { value: 'mantenimiento', label: 'Mantenimiento programado' },
  { value: 'otro', label: 'Otro motivo' }
];

export const FRAUD_KEYWORDS = [
  'falso',
  'fake',
  'editado',
  'no válido',
  'no existe',
  'fraudulent',
  'manipulado'
];

export const TAB_TYPES = {
  ALL: 'all',
  PENDING_PAYMENT: 'pending_payment',
  PENDING_APPROVAL: 'pending_approval'
};

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  BRANCH_ADMIN: 'branch_admin',
  RECEPTION: 'reception',
  BARBER: 'barber',
  CLIENT: 'client'
};
