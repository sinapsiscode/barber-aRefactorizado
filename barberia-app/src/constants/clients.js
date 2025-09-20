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

// ===================================================================
// 👥 CONSTANTES PARA GESTIÓN DE CLIENTES - REFACTORIZADO
// ===================================================================

// Estados y configuración de tabs
export const CLIENT_TABS = {
  ALL: 'all',
  FLAGGED: 'flagged'
};

// Textos de la interfaz principal
export const CLIENT_MANAGEMENT_TEXTS = {
  TITLE: 'Gestión de Clientes',
  SUBTITLE: 'Administra clientes y programa de fidelización',
  SUBTITLE_WITH_BRANCH: 'Administra clientes y programa de fidelización de',
  NEW_CLIENT: 'Nuevo Cliente',
  SEARCH_PLACEHOLDER: 'Buscar cliente...',
  ALL_CLIENTS: 'Todos los clientes',
  SUSPICIOUS_CLIENTS: 'Clientes sospechosos',
  EMPTY_MESSAGE: 'No se encontraron clientes'
};

// Textos de métricas
export const CLIENT_METRICS_TEXTS = {
  TOTAL_CLIENTS: 'Clientes Totales',
  NEW_THIS_MONTH: 'Nuevos Este Mes',
  VIP_CLIENTS: 'Clientes VIP',
  AVERAGE_SPENDING: 'Gasto Promedio',
  PER_CLIENT: 'Por cliente'
};

// Textos de secciones
export const CLIENT_SECTION_TEXTS = {
  VIP_CLIENTS: 'Clientes VIP',
  TIER_DISTRIBUTION: 'Distribución por Categoría',
  GENERAL_STATS: 'Estadísticas Generales',
  VISITS: 'visitas',
  POINTS: 'pts'
};

// Textos de estadísticas
export const CLIENT_STATS_TEXTS = {
  AVERAGE_SPENDING: 'Gasto Promedio',
  LOYALTY_POINTS: 'Puntos de Lealtad',
  TOTAL_REVENUE: 'Ingresos Totales',
  AVERAGE_PER_CLIENT: 'Promedio por Cliente'
};

// Configuración de niveles de cliente
export const CLIENT_TIERS = {
  PLATINUM: {
    name: 'Platinum',
    threshold: 1000000,
    color: 'bg-purple-100 text-purple-800',
    bgColor: 'bg-purple-500'
  },
  GOLD: {
    name: 'Gold',
    threshold: 500000,
    color: 'bg-yellow-100 text-yellow-800',
    bgColor: 'bg-yellow-500'
  },
  SILVER: {
    name: 'Silver',
    threshold: 200000,
    color: 'bg-gray-100 text-gray-800',
    bgColor: 'bg-gray-400'
  },
  BRONZE: {
    name: 'Bronze',
    threshold: 0,
    color: 'bg-orange-100 text-orange-800',
    bgColor: 'bg-orange-500'
  }
};

// Configuración de colores para estados de cliente
export const CLIENT_STATUS_COLORS = {
  BLOCKED: 'bg-red-100 text-red-800',
  FLAGGED: 'bg-red-500',
  NORMAL: 'bg-primary-500'
};

// Textos de estado de cliente
export const CLIENT_STATUS_TEXTS = {
  BLOCKED: 'BLOQUEADO',
  NEVER_VISITED: 'Nunca'
};

// Configuración de tabla de clientes
export const CLIENT_TABLE_CONFIG = {
  MAX_VIP_DISPLAY: 5,
  COLUMNS: {
    NAME: 'name',
    PHONE: 'phone',
    TOTAL_VISITS: 'totalVisits',
    TOTAL_SPENT: 'totalSpent',
    LOYALTY_POINTS: 'loyaltyPoints',
    LAST_VISIT: 'lastVisit',
    TIER: 'tier'
  }
};

// Labels para columnas de tabla
export const CLIENT_TABLE_LABELS = {
  CLIENT: 'Cliente',
  PHONE: 'Teléfono',
  VISITS: 'Visitas',
  TOTAL_SPENT: 'Total Gastado',
  POINTS: 'Puntos',
  LAST_VISIT: 'Última Visita',
  CATEGORY: 'Categoría',
  TIMES: 'veces'
};

// Configuración de alertas de seguridad
export const CLIENT_SECURITY_CONFIG = {
  FLAGS: {
    IS_FLAGGED: 'isFlagged',
    BLACKLISTED: 'blacklisted',
    FALSE_VOUCHERS_COUNT: 'falseVouchersCount'
  }
};

// Roles con acceso a funciones de seguridad
export const CLIENT_SECURITY_ROLES = ['super_admin', 'branch_admin'];

// Configuración de umbrales para estadísticas
export const CLIENT_STATS_THRESHOLDS = {
  HIGH_SPENDING: 100,
  MEDIUM_SPENDING: 50,
  COLORS: {
    HIGH: 'text-green-600',
    MEDIUM: 'text-yellow-600',
    LOW: 'text-red-600'
  }
};