// ===================================================================
// 📊 CONSTANTES DE DASHBOARDS - REFACTORIZADO
// ===================================================================
// Constantes específicas para los diferentes tipos de dashboard

// Labels y títulos principales de dashboards
export const DASHBOARD_LABELS = {
  RECEPTION: {
    TITLE: 'Dashboard - Recepción',
    SUBTITLE: 'Gestión de citas, pagos y atención al cliente',
    GRADIENT: 'from-purple-500 to-purple-600'
  },
  BARBER: {
    TITLE: 'Dashboard - Barbero',
    SUBTITLE: 'Tus citas y horarios del día',
    GRADIENT: 'from-orange-500 to-orange-600'
  },
  BRANCH_ADMIN: {
    TITLE: 'Dashboard - {branchName}',
    SUBTITLE: 'Gestión completa de la sucursal',
    GRADIENT: 'from-blue-500 to-blue-600'
  },
  SUPER_ADMIN: {
    TITLE: 'Dashboard - Super Admin',
    SUBTITLE: 'Control total del sistema',
    GRADIENT: 'from-red-500 to-red-600'
  },
  CLIENT: {
    TITLE: 'Mi Dashboard',
    SUBTITLE: 'Tus citas y servicios',
    GRADIENT: 'from-green-500 to-green-600'
  }
};

// Métricas y textos de tarjetas de estadísticas
export const DASHBOARD_METRICS = {
  APPOINTMENTS: {
    TODAY: 'Citas Hoy',
    PENDING: 'Citas Pendientes',
    COMPLETED: 'Completadas',
    CANCELLED: 'Canceladas',
    TOTAL: 'Total Citas',
    THIS_WEEK: 'Esta Semana',
    THIS_MONTH: 'Este Mes'
  },
  PAYMENTS: {
    PROCESSED: 'Pagos Procesados',
    TOTAL_TODAY: 'Ingresos Hoy',
    TOTAL_WEEK: 'Ingresos Semana',
    TOTAL_MONTH: 'Ingresos Mes',
    PENDING: 'Pagos Pendientes'
  },
  CLIENTS: {
    ATTENDED: 'Clientes Atendidos',
    NEW_TODAY: 'Nuevos Hoy',
    TOTAL: 'Total Clientes',
    RETURNING: 'Clientes Frecuentes'
  },
  STAFF: {
    PRESENT: 'Personal Presente',
    ABSENT: 'Ausentes',
    ON_TIME: 'Puntuales',
    LATE: 'Tardanzas',
    TOTAL: 'Total Personal'
  },
  REVENUE: {
    TODAY: 'Ingresos Hoy',
    WEEK: 'Ingresos Semana',
    MONTH: 'Ingresos Mes',
    AVERAGE: 'Promedio Diario'
  }
};

// Configuración de colores para métricas
export const METRIC_COLORS = {
  APPOINTMENTS: {
    icon: 'bg-blue-500',
    text: 'text-blue-600'
  },
  PAYMENTS: {
    icon: 'bg-green-500',
    text: 'text-green-600'
  },
  CLIENTS: {
    icon: 'bg-purple-500',
    text: 'text-purple-600'
  },
  STAFF: {
    icon: 'bg-orange-500',
    text: 'text-orange-600'
  },
  REVENUE: {
    icon: 'bg-emerald-500',
    text: 'text-emerald-600'
  },
  PERFORMANCE: {
    icon: 'bg-yellow-500',
    text: 'text-yellow-600'
  },
  ALERT: {
    icon: 'bg-red-500',
    text: 'text-red-600'
  }
};

// Secciones de dashboards
export const DASHBOARD_SECTIONS = {
  OVERVIEW: 'Resumen General',
  APPOINTMENTS: 'Gestión de Citas',
  STAFF_MANAGEMENT: 'Gestión de Personal',
  FINANCIAL: 'Informes Financieros',
  CLIENT_MANAGEMENT: 'Gestión de Clientes',
  PERFORMANCE: 'Rendimiento',
  QUICK_ACTIONS: 'Acciones Rápidas',
  RECENT_ACTIVITY: 'Actividad Reciente',
  NOTIFICATIONS: 'Notificaciones'
};

// Acciones rápidas por tipo de dashboard
export const QUICK_ACTIONS = {
  RECEPTION: [
    {
      label: 'Nueva Cita',
      icon: 'FiPlus',
      action: 'newAppointment',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      label: 'Procesar Pago',
      icon: 'FiCreditCard',
      action: 'processPayment',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      label: 'Nuevo Cliente',
      icon: 'FiUserPlus',
      action: 'newClient',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      label: 'Check-in',
      icon: 'FiCheckCircle',
      action: 'checkIn',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ],
  BARBER: [
    {
      label: 'Marcar Inicio',
      icon: 'FiPlay',
      action: 'startService',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      label: 'Completar Cita',
      icon: 'FiCheck',
      action: 'completeAppointment',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      label: 'Tomar Descanso',
      icon: 'FiPause',
      action: 'takeBreak',
      color: 'bg-yellow-500 hover:bg-yellow-600'
    }
  ],
  BRANCH_ADMIN: [
    {
      label: 'Gestionar Personal',
      icon: 'FiUsers',
      action: 'manageStaff',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      label: 'Ver Reportes',
      icon: 'FiBarChart',
      action: 'viewReports',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      label: 'Configuración',
      icon: 'FiSettings',
      action: 'settings',
      color: 'bg-gray-500 hover:bg-gray-600'
    }
  ],
  SUPER_ADMIN: [
    {
      label: 'Gestionar Sedes',
      icon: 'FiMapPin',
      action: 'manageBranches',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      label: 'Sistema',
      icon: 'FiServer',
      action: 'systemSettings',
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      label: 'Analytics',
      icon: 'FiTrendingUp',
      action: 'analytics',
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ],
  CLIENT: [
    {
      label: 'Nueva Cita',
      icon: 'FiCalendar',
      action: 'bookAppointment',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      label: 'Mi Historial',
      icon: 'FiClock',
      action: 'viewHistory',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      label: 'Mis Puntos',
      icon: 'FiGift',
      action: 'viewPoints',
      color: 'bg-yellow-500 hover:bg-yellow-600'
    }
  ]
};

// Estados y mensajes
export const DASHBOARD_MESSAGES = {
  LOADING: 'Cargando dashboard...',
  ERROR: 'Error al cargar los datos',
  NO_DATA: 'No hay datos disponibles',
  LAST_UPDATED: 'Última actualización: {time}',
  REFRESH: 'Actualizar',
  VIEW_ALL: 'Ver todo',
  SHOW_MORE: 'Mostrar más',
  SHOW_LESS: 'Mostrar menos'
};

// Configuración de gráficos
export const CHART_CONFIG = {
  COLORS: {
    PRIMARY: '#3b82f6',
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    DANGER: '#ef4444',
    INFO: '#6366f1'
  },
  APPOINTMENT_STATUS: {
    confirmed: { color: '#3b82f6', label: 'Confirmadas' },
    completed: { color: '#10b981', label: 'Completadas' },
    cancelled: { color: '#ef4444', label: 'Canceladas' },
    pending: { color: '#f59e0b', label: 'Pendientes' },
    in_progress: { color: '#10b981', label: 'En Proceso' }
  }
};

// Estados de citas y sus estilos
export const APPOINTMENT_STYLES = {
  STYLES: {
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
    in_progress: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
    completed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
  },
  LABELS: {
    confirmed: 'Confirmada',
    pending: 'Pendiente',
    in_progress: 'En Proceso',
    completed: 'Completada',
    cancelled: 'Cancelada'
  }
};

// Filtros de tiempo
export const TIME_FILTERS = [
  { value: 'today', label: 'Hoy' },
  { value: 'week', label: 'Esta Semana' },
  { value: 'month', label: 'Este Mes' },
  { value: 'quarter', label: 'Este Trimestre' },
  { value: 'year', label: 'Este Año' }
];

export default {
  DASHBOARD_LABELS,
  DASHBOARD_METRICS,
  METRIC_COLORS,
  DASHBOARD_SECTIONS,
  QUICK_ACTIONS,
  DASHBOARD_MESSAGES,
  CHART_CONFIG,
  APPOINTMENT_STATUS,
  TIME_FILTERS
};