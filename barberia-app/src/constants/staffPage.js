import {
  FiUsers,
  FiUserCheck,
  FiStar,
  FiClock,
  FiPlus,
  FiCalendar,
  FiDollarSign,
  FiChevronDown,
  FiChevronUp,
  FiTrendingUp,
  FiAward
} from 'react-icons/fi';

// Configuración de métricas
export const METRICS_CONFIG = {
  TOTAL_STAFF: {
    title: 'Personal Total',
    icon: FiUsers,
    color: 'bg-blue-500'
  },
  PRESENT_TODAY: {
    title: 'Presentes Hoy',
    icon: FiUserCheck,
    color: 'bg-green-500'
  },
  AVG_RATING: {
    title: 'Calificación Promedio',
    icon: FiStar,
    color: 'bg-yellow-500'
  },
  TOTAL_SERVICES: {
    title: 'Servicios Total',
    icon: FiClock,
    color: 'bg-purple-500'
  },
  COMMISSIONS: {
    title: 'Comisiones (70%)',
    icon: FiDollarSign,
    color: 'bg-[#D4AF37]'
  }
};

// Configuración de comisiones
export const COMMISSION_RATES = {
  BARBER_COMMISSION: 0.7,
  COMPANY_RETENTION: 0.3,
  PREVIOUS_MONTH_SIMULATION: 0.85
};

// Textos de la interfaz
export const STAFF_TEXTS = {
  // Títulos principales
  MAIN_TITLE: 'Gestión de Personal',
  MAIN_SUBTITLE: 'Administra barberos, asistencia y productividad',
  BRANCH_SUBTITLE: 'Administra barberos, asistencia y productividad de',

  // Botones
  ADD_BARBER: 'Agregar Barbero',
  ATTENDANCE: 'Asistencia',
  CHECK_IN: 'Entrada',
  CHECK_OUT: 'Salida',
  APPLY_TO_ALL: 'Aplicar a todos los días activos',

  // Estados
  PRESENT: 'Presente',
  ABSENT: 'Ausente',
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',

  // Columnas de tabla
  BARBER: 'Barbero',
  SPECIALTIES: 'Especialidades',
  RATING: 'Calificación',
  SERVICES: 'Servicios',
  SERVICES_PERFORMED: 'Servicios Realizados',
  INCOME: 'Ingresos',
  STATUS: 'Estado',

  // Detalles de comisiones
  COMMISSION_ANALYSIS: 'Análisis Detallado de Comisiones',
  COMMISSION_SYSTEM: 'Sistema de comisiones del 70% para barberos',
  GROSS_INCOME: 'Ingresos Brutos',
  COMMISSIONS_PAID: 'Comisiones Pagadas',
  TOTAL_SERVICES: 'Servicios Totales',
  AVERAGE_PER_BARBER: 'Promedio/Barbero',
  TOP_PERFORMERS_COMMISSIONS: 'Top Performers - Comisiones',
  FINANCIAL_BREAKDOWN: 'Desglose Financiero',
  MONTHLY_COMPARISON: 'Comparación Mensual',
  CURRENT_MONTH: 'Mes Actual',
  PREVIOUS_MONTH: 'Mes Anterior',
  DIFFERENCE: 'Diferencia: ',
  TOTAL_INCOME: 'Ingresos Totales',
  RETENTION: 'Retención (30%)',
  NET_MARGIN: 'Margen Neto',
  AFTER_COMMISSIONS: 'Después del pago de comisiones',

  // Análisis de servicios
  SERVICES_ANALYSIS: 'Análisis Detallado de Servicios',
  SERVICES_SUBTITLE: 'Cantidad de citas atendidas por barbero',
  AVERAGE_PER_BARBER_SERVICES: 'Promedio/Barbero',
  SERVICES_PER_DAY: 'Servicios/Día',
  BEST_BARBER: 'Mejor Barbero',
  TOP_5_BARBERS: 'Top 5 Barberos por Servicios',
  DISTRIBUTION_BY_BRANCH: 'Distribución por Sucursal',
  CURRENT_BRANCH: 'Sucursal Actual',
  ACTIVE_BARBERS: 'Barberos Activos',
  AVERAGE_RATING: 'Promedio Calificación',
  EFFICIENCY: 'Eficiencia',
  SERVICES_DAY_BARBER: 'servicios/día/barbero',

  // Performance
  TOP_PERFORMERS: 'Top Performers',
  CURRENT_STATUS: 'Estado Actual',

  // Mensajes
  NO_SERVICES: 'Sin servicios',
  NO_BARBERS: 'No hay barberos registrados',
  VS_PREVIOUS_MONTH: 'vs mes ant.',
  SERVICES_COUNT: 'servicios',
  OF_TOTAL: 'del total'
};

// Configuración de colores para rankings
export const RANKING_COLORS = {
  FIRST: {
    bg: 'bg-yellow-500',
    text: 'text-yellow-800',
    bgLight: 'bg-yellow-100'
  },
  SECOND: {
    bg: 'bg-gray-400',
    text: 'text-gray-800',
    bgLight: 'bg-gray-100'
  },
  THIRD: {
    bg: 'bg-yellow-600',
    text: 'text-orange-800',
    bgLight: 'bg-orange-100'
  },
  OTHER: {
    bg: 'bg-blue-500',
    text: 'text-blue-800',
    bgLight: 'bg-blue-100'
  }
};

// Configuración de gradientes para métricas
export const METRIC_GRADIENTS = {
  GREEN: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700',
  GOLD: 'bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/20 border-[#D4AF37]/30',
  BLUE: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700',
  PURPLE: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700',
  YELLOW: 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700'
};

// Configuración de límites y valores por defecto
export const LIMITS = {
  TOP_PERFORMERS: 5,
  SERVICES_PREVIEW: 2,
  MAX_DROPDOWN_HEIGHT: 'max-h-64',
  DROPDOWN_WIDTH: 'w-72',
  DAYS_IN_MONTH: 30
};

// Configuración de animaciones
export const ANIMATIONS = {
  TRANSITION_ALL: 'transition-all duration-300 ease-in-out',
  MAX_HEIGHT_EXPANDED: 'max-h-[2000px] opacity-100',
  MAX_HEIGHT_COLLAPSED: 'max-h-0 opacity-0',
  HOVER_SCALE: 'transition-transform hover:scale-105',
  PROGRESS_BAR: 'transition-all duration-500'
};

// Configuración de variaciones individuales para simulación
export const SIMULATION_CONFIG = {
  MIN_CHANGE: -10,
  MAX_CHANGE: 25,
  SERVICES_CHANGE_MULTIPLIER: 0.88
};