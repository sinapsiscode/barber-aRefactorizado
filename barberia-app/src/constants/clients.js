// ===================================================================
// 👥 CONSTANTES DE CLIENTES - REFACTORIZADO
// ===================================================================
// Constantes específicas para el módulo de clientes

export const CLIENT_LABELS = {
  FORM: {
    NEW_TITLE: 'Nuevo Cliente',
    EDIT_TITLE: 'Editar Cliente',
    NAME: 'Nombre Completo',
    EMAIL: 'Email',
    PHONE: 'Teléfono',
    BIRTH_DATE: 'Fecha de Nacimiento',
    ADDRESS: 'Dirección',
    PREFERRED_BRANCH: 'Sede Preferida',
    ADDITIONAL_NOTES: 'Notas Adicionales',
    CANCEL: 'Cancelar',
    CREATE: 'Crear Cliente',
    UPDATE: 'Actualizar',
    SAVING: 'Guardando...'
  },
  STATS: {
    VISITS: 'Visitas',
    SPENT: 'Gastado',
    POINTS: 'Puntos'
  },
  BENEFITS: {
    TITLE: 'Beneficios del Cliente Nuevo',
    LOYALTY_PROGRAM: 'Programa de puntos de fidelización',
    BIRTHDAY_DISCOUNTS: 'Descuentos especiales en cumpleaños',
    AUTOMATIC_REMINDERS: 'Recordatorios automáticos de citas',
    COMPLETE_HISTORY: 'Historial completo de servicios'
  }
};

export const CLIENT_PLACEHOLDERS = {
  NAME: 'Juan Carlos Pérez',
  EMAIL: 'juan@email.com',
  PHONE: '+57 300 123 4567',
  ADDRESS: 'Calle 123 #45-67, Ciudad',
  NOTES: 'Preferencias, alergias, instrucciones especiales...'
};

export const CLIENT_MESSAGES = {
  SUCCESS: {
    CREATED: 'Cliente creado correctamente',
    UPDATED: 'Cliente actualizado correctamente',
    TITLE: '¡Éxito!'
  },
  ERROR: {
    SAVE_FAILED: 'No se pudo guardar el cliente. Por favor intenta nuevamente.',
    TITLE: 'Error'
  }
};

export const CLIENT_VALIDATION_RULES = {
  NAME: {
    REQUIRED: true,
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
    PATTERN: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/
  },
  EMAIL: {
    REQUIRED: true,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MAX_LENGTH: 100
  },
  PHONE: {
    REQUIRED: true,
    PATTERN: /^[+]?[\d\s-()]+$/,
    MIN_LENGTH: 9,
    MAX_LENGTH: 20
  },
  ADDRESS: {
    REQUIRED: false,
    MAX_LENGTH: 200
  },
  NOTES: {
    REQUIRED: false,
    MAX_LENGTH: 500
  }
};

export const CLIENT_DEFAULT_VALUES = {
  PREFERRED_BRANCH: 1,
  FORM_DATA: {
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    address: '',
    preferredBranch: 1,
    notes: ''
  }
};

export const CLIENT_BENEFITS_LIST = [
  CLIENT_LABELS.BENEFITS.LOYALTY_PROGRAM,
  CLIENT_LABELS.BENEFITS.BIRTHDAY_DISCOUNTS,
  CLIENT_LABELS.BENEFITS.AUTOMATIC_REMINDERS,
  CLIENT_LABELS.BENEFITS.COMPLETE_HISTORY
];

// Constantes específicas para ClientProfile
export const CLIENT_PROFILE_LABELS = {
  SECTIONS: {
    CONTACT_INFO: 'Información de Contacto',
    STATISTICS: 'Estadísticas',
    WARNING_CONFIG: 'Configuración de Avisos',
    SECURITY_ALERTS: 'Alertas de Seguridad',
    PREFERRED_SERVICES: 'Servicios Preferidos',
    RECOMMENDATIONS: 'Recomendaciones Personalizadas',
    APPOINTMENT_HISTORY: 'Historial de Citas',
    NOTES: 'Notas'
  },
  STATS: {
    TOTAL_VISITS: 'Total Visitas',
    TOTAL_SPENT: 'Total Gastado',
    AVAILABLE_POINTS: 'Puntos Disponibles',
    LAST_VISIT: 'Última Visita',
    CLIENT_SINCE: 'Cliente desde',
    NEVER: 'Nunca'
  },
  ACTIONS: {
    EDIT: 'Editar',
    NEW_APPOINTMENT: 'Nueva Cita',
    REDEEM_POINTS: 'Canjear Puntos',
    CLOSE: 'Cerrar',
    CLEAR_FLAGS: 'Limpiar banderas de seguridad'
  },
  WARNINGS: {
    NOTIFICATIONS_ENABLED: 'Notificaciones habilitadas',
    WARNING_INTERVAL: 'Intervalo de Aviso',
    CURRENT_STATUS: 'Estado Actual:',
    DAYS_SINCE_VISIT: 'Días desde última visita:',
    NEXT_WARNING_IN: 'Próximo aviso en:',
    LAST_WARNING: 'Último aviso:',
    DISABLED_MESSAGE: 'Las notificaciones están deshabilitadas para este cliente'
  },
  SECURITY: {
    SECURITY_STATUS: 'Estado de Seguridad',
    BLOCKED: 'BLOQUEADO',
    FALSE_VOUCHERS: 'Vouchers falsos:',
    REJECTED_PAYMENTS: 'Pagos rechazados:',
    REJECTION_HISTORY: 'Historial de Rechazos',
    CLEAR_FLAGS_TITLE: '¿Limpiar banderas de seguridad?',
    CLEAR_FLAGS_TEXT: 'Esto eliminará todas las marcas de seguridad y reactivará al cliente',
    CLEAR_FLAGS_CONFIRM: 'Sí, limpiar',
    CLEAR_FLAGS_CANCEL: 'Cancelar',
    FLAGS_CLEARED_TITLE: 'Banderas limpiadas',
    FLAGS_CLEARED_TEXT: 'El cliente ha sido reactivado'
  },
  SUCCESS_MESSAGES: {
    APPOINTMENT_CREATED: 'Cita Creada',
    APPOINTMENT_SUCCESS: 'Tu cita ha sido programada exitosamente'
  }
};

export const CLIENT_LOYALTY_TIERS = {
  COLORS: {
    'Platinum': 'bg-purple-100 text-purple-800 border-purple-300',
    'Gold': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Silver': 'bg-gray-100 text-gray-800 border-gray-300',
    'Bronze': 'bg-orange-100 text-orange-800 border-orange-300'
  },
  DEFAULT_COLOR: 'bg-orange-100 text-orange-800 border-orange-300'
};

export const CLIENT_WARNING_INTERVALS = [
  { value: 7, label: 'Cada 7 días' },
  { value: 10, label: 'Cada 10 días' },
  { value: 15, label: 'Cada 15 días' },
  { value: 20, label: 'Cada 20 días' },
  { value: 30, label: 'Cada 30 días' }
];

export const CLIENT_RECOMMENDATION_TYPES = {
  SERVICE: {
    borderColor: 'border-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900'
  },
  LOYALTY: {
    borderColor: 'border-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900'
  },
  DEFAULT: {
    borderColor: 'border-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900'
  }
};

export const CLIENT_MOCK_REWARDS = [
  { points: 100, reward: 'Descuento 10%' },
  { points: 200, reward: 'Servicio Gratis' },
  { points: 300, reward: 'Descuento 25%' }
];