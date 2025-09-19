// ===================================================================
// 📅 CONSTANTES DE CITAS - REFACTORIZADO
// ===================================================================
// Constantes específicas para el módulo de appointments

export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const APPOINTMENT_STATUS_LABELS = {
  [APPOINTMENT_STATUS.PENDING]: 'Pendiente',
  [APPOINTMENT_STATUS.CONFIRMED]: 'Confirmada',
  [APPOINTMENT_STATUS.IN_PROGRESS]: 'En Proceso',
  [APPOINTMENT_STATUS.COMPLETED]: 'Completada',
  [APPOINTMENT_STATUS.CANCELLED]: 'Cancelada'
};

export const APPOINTMENT_STATUS_COLORS = {
  [APPOINTMENT_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [APPOINTMENT_STATUS.CONFIRMED]: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
  [APPOINTMENT_STATUS.IN_PROGRESS]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  [APPOINTMENT_STATUS.COMPLETED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [APPOINTMENT_STATUS.CANCELLED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
};

export const APPOINTMENT_LEGEND_COLORS = [
  { status: APPOINTMENT_STATUS.PENDING, color: 'bg-yellow-200', label: 'Pendiente' },
  { status: APPOINTMENT_STATUS.CONFIRMED, color: 'bg-blue-200', label: 'Confirmada' },
  { status: APPOINTMENT_STATUS.IN_PROGRESS, color: 'bg-purple-200', label: 'En Proceso' },
  { status: APPOINTMENT_STATUS.COMPLETED, color: 'bg-green-200', label: 'Completada' }
];

export const APPOINTMENT_MESSAGES = {
  SUCCESS: {
    CREATED: 'Cita creada exitosamente',
    UPDATED: 'Cita actualizada exitosamente',
    CONFIRMED: 'La cita ha sido confirmada exitosamente',
    CANCELLED: 'La cita ha sido cancelada exitosamente',
    COMPLETED: 'La cita ha sido completada exitosamente',
    DELETED: 'La cita ha sido eliminada exitosamente'
  },
  ERRORS: {
    SAVE: 'Error al guardar la cita',
    LOAD: 'Error al cargar las citas',
    DELETE: 'Error al eliminar la cita',
    UPDATE_STATUS: 'Error al actualizar el estado de la cita'
  },
  CONFIRM: {
    DELETE: {
      TITLE: '¿Eliminar Cita?',
      TEXT: 'Esta acción no se puede deshacer'
    }
  }
};

export const APPOINTMENT_FORM_LABELS = {
  TITLE_NEW: 'Nueva Cita',
  TITLE_EDIT: 'Editar Cita',
  CLIENT: 'Cliente',
  BARBER: 'Barbero',
  DATE: 'Fecha',
  TIME: 'Hora',
  SERVICES: 'Servicios',
  NOTES: 'Notas adicionales',
  SUMMARY: 'Resumen',
  DURATION_TOTAL: 'Duración total',
  TOTAL: 'Total',
  PLACEHOLDER: {
    CLIENT: 'Seleccionar cliente',
    BARBER: 'Seleccionar barbero',
    TIME: 'Seleccionar hora',
    NOTES: 'Preferencias del cliente, instrucciones especiales...'
  },
  BUTTONS: {
    CANCEL: 'Cancelar',
    CREATE: 'Crear Cita',
    UPDATE: 'Actualizar',
    SAVING: 'Guardando...'
  }
};

export const APPOINTMENT_CALENDAR_LABELS = {
  FILTERS: 'Filtros',
  CLEAR_FILTERS: 'Limpiar filtros',
  SHOW_FILTERS: 'Mostrar',
  HIDE_FILTERS: 'Ocultar',
  BRANCH: 'Sede',
  ALL_BRANCHES: 'Todas las sedes',
  BARBER: 'Barbero',
  ALL_BARBERS: 'Todos los barberos',
  SERVICE_TYPE: 'Tipo de Servicio',
  ALL_SERVICES: 'Todos los servicios',
  NO_APPOINTMENTS: 'Sin citas',
  VIEW_ALL: 'Ver todas',
  APPOINTMENT_DETAILS: 'Detalles de la Cita',
  SCHEDULE_FOR: 'Programación del',
  APPOINTMENTS_SCHEDULED: 'citas programadas',
  NO_APPOINTMENTS_FOUND: 'No hay citas programadas',
  NO_APPOINTMENTS_DAY: 'No se encontraron citas para este día con los filtros aplicados',
  PREVIOUS_MONTH: 'Mes anterior',
  NEXT_MONTH: 'Mes siguiente',
  TODAY: 'Hoy'
};

export const APPOINTMENT_ACTIONS = {
  VIEW: 'Ver detalles',
  EDIT: 'Editar',
  DELETE: 'Eliminar',
  CONFIRM: 'Confirmar',
  CANCEL: 'Cancelar',
  COMPLETE: 'Completar',
  MARK_COMPLETED: 'Marcar Completada',
  CLOSE: 'Cerrar'
};

export const APPOINTMENT_VALIDATION = {
  MIN_SERVICES: 1,
  REQUIRED_FIELDS: ['clientId', 'barberId', 'date', 'time', 'services']
};

export const APPOINTMENT_TIME_SLOTS = {
  INTERVAL_MINUTES: 30,
  START_HOUR: 8,
  END_HOUR: 20,
  LUNCH_START: 13,
  LUNCH_END: 14
};