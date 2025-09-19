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

// ===================================================================
// 💳 CONSTANTES PARA VERIFICACIÓN DE PAGOS - AÑADIDAS
// ===================================================================

export const PAYMENT_STATUS = {
  PENDING_PAYMENT: 'pending_payment'
};

export const PAYMENT_VERIFICATION_LABELS = {
  TITLE: 'Verificar Pago',
  APPROVE: '✓ Aprobar Pago',
  REJECT: '✗ Rechazar Pago',
  CANCEL: 'Cancelar',
  VERIFY_BUTTON: 'Verificar',
  SECURITY_ALERT: '⚠️ ALERTA DE SEGURIDAD',
  CLIENT_BLOCKED: 'Cliente BLOQUEADO por múltiples vouchers falsos',
  FALSE_VOUCHERS_COUNT: 'Este cliente tiene {count} voucher(es) falso(s) registrado(s)',
  LAST_REJECTION: 'Último rechazo: {date}',
  CLIENT_LABEL: 'Cliente:',
  DATE_LABEL: 'Fecha:',
  TIME_LABEL: 'Hora:',
  TOTAL_LABEL: 'Total:',
  METHOD_LABEL: 'Método:',
  OPERATION_LABEL: 'N° Operación:',
  VOUCHER_LABEL: 'Comprobante:',
  NO_VOUCHER: 'No se subió comprobante',
  NO_OPERATION: 'No especificado',
  APPROVED_TITLE: 'Pago Aprobado',
  APPROVED_MESSAGE: 'La cita ha sido confirmada',
  REJECTED_TITLE: 'Pago Rechazado',
  REJECTED_MESSAGE: 'La cita ha sido cancelada',
  CLIENT_BLACKLISTED: '⚠️ CLIENTE BLOQUEADO por múltiples intentos de fraude',
  REJECTION_REASON_TITLE: 'Razón del rechazo',
  REJECTION_REASON_PLACEHOLDER: 'Ingrese el motivo del rechazo...',
  REJECTION_REASON_LABEL: 'Razón del rechazo'
};

export const FRAUD_DETECTION_KEYWORDS = [
  'falso',
  'fake',
  'editado',
  'no válido',
  'no existe'
];

export const PAYMENT_VERIFICATION_COLORS = {
  APPROVE: '#10b981',
  REJECT: '#ef4444',
  SUCCESS: '#ffc000'
};

export const APPOINTMENTS_PAGE_LABELS = {
  TITLE: 'Gestión de Citas',
  SUBTITLE: 'Administra las citas y horarios',
  SUBTITLE_WITH_BRANCH: 'Administra las citas y horarios de {branch}',
  NEW_APPOINTMENT: 'Nueva Cita',
  CALENDAR: 'Calendario',
  LIST: 'Lista',
  SUCCESS_TITLE: 'Cita creada',
  SUCCESS_MESSAGE: 'La cita se ha programado correctamente'
};

export const APPOINTMENTS_TABS = {
  ALL: 'all',
  PENDING_PAYMENT: 'pending_payment',
  LABELS: {
    ALL_APPOINTMENTS: 'Todas las citas',
    PENDING_PAYMENTS: 'Pagos pendientes'
  }
};

export const APPOINTMENTS_TABLE_COLUMNS = {
  DATE: 'Fecha',
  TIME: 'Hora',
  CLIENT: 'Cliente',
  BARBER: 'Barbero',
  SERVICES: 'Servicios',
  PRICE: 'Precio',
  STATUS: 'Estado',
  MULTIPLE_SERVICES: '{count} servicios',
  SINGLE_SERVICE: 'Corte',
  EMPTY_MESSAGE: 'No hay citas programadas'
};

export const APPOINTMENTS_STATS_LABELS = {
  TOTAL: 'Total Citas',
  TODAY: 'Citas Hoy',
  CONFIRMED: 'Confirmadas',
  COMPLETED: 'Completadas'
};

export const APPOINTMENTS_STYLES = {
  TAB: {
    ACTIVE: 'border-primary-500 text-primary-600 dark:text-primary-400',
    INACTIVE: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
    PENDING_ACTIVE: 'border-orange-500 text-orange-600 dark:text-orange-400',
    BASE: 'py-2 px-1 border-b-2 font-medium text-sm'
  },
  BUTTON: {
    CALENDAR_ACTIVE: 'btn-secondary bg-primary-100',
    CALENDAR_INACTIVE: 'btn-secondary',
    PRIMARY: 'btn-primary',
    VERIFY: 'text-xs px-2 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 flex items-center space-x-1'
  },
  BADGE: {
    COUNT: 'bg-orange-100 text-orange-800 text-xs font-medium px-2 py-0.5 rounded-full',
    STATUS: 'px-2 py-1 text-xs font-medium rounded-full'
  },
  MODAL: {
    PAYMENT_WIDTH: '600px'
  }
};