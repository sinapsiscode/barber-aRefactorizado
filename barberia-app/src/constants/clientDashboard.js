/**
 * Constantes para ClientDashboard
 */

/**
 * Vistas disponibles en el dashboard del cliente
 */
export const DASHBOARD_VIEWS = {
  DASHBOARD: 'dashboard',
  STORE: 'store',
  HISTORY: 'history',
  ACTIVE_REWARDS: 'activeRewards'
};

/**
 * Configuración de las tarjetas de acceso rápido
 */
export const QUICK_ACCESS_CARDS = [
  {
    id: 'profile',
    view: null,
    icon: 'FiUser',
    title: 'Mi Perfil',
    subtitle: 'Configuración',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    hoverBg: 'group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50',
    iconColor: 'text-blue-600 dark:text-blue-400',
    borderHover: 'hover:border-primary-400/40'
  },
  {
    id: 'store',
    view: DASHBOARD_VIEWS.STORE,
    icon: 'FiShoppingCart',
    title: 'Tienda',
    subtitle: 'Canjea puntos',
    bgColor: 'bg-primary-100 dark:bg-primary-900/30',
    hoverBg: 'group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50',
    iconColor: 'text-primary-600 dark:text-primary-400',
    borderHover: 'hover:border-primary-400/40'
  },
  {
    id: 'rewards',
    view: DASHBOARD_VIEWS.ACTIVE_REWARDS,
    icon: 'FiGift',
    title: 'Mis Recompensas',
    subtitle: '{count} activas',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    hoverBg: 'group-hover:bg-green-200 dark:group-hover:bg-green-900/50',
    iconColor: 'text-green-600 dark:text-green-400',
    borderHover: 'hover:border-primary-400/40',
    showBadge: true
  },
  {
    id: 'history',
    view: DASHBOARD_VIEWS.HISTORY,
    icon: 'FiList',
    title: 'Historial',
    subtitle: 'Puntos ganados',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    hoverBg: 'group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50',
    iconColor: 'text-purple-600 dark:text-purple-400',
    borderHover: 'hover:border-primary-400/40'
  }
];

/**
 * Configuración de acciones de lealtad
 */
export const LOYALTY_ACTIONS = [
  {
    id: 'store',
    view: DASHBOARD_VIEWS.STORE,
    icon: 'FiShoppingCart',
    title: 'Tienda de Recompensas',
    subtitle: 'Canjea tus {points} puntos',
    bgGradient: 'from-primary-50 to-primary-100 hover:from-primary-100 hover:to-primary-200',
    borderHover: 'hover:border-primary-400',
    iconColor: 'text-primary-600',
    textColor: 'text-primary-600',
    arrow: '→'
  },
  {
    id: 'history',
    view: DASHBOARD_VIEWS.HISTORY,
    icon: 'FiList',
    title: 'Historial de Puntos',
    subtitle: 'Ver todas las transacciones',
    bgGradient: 'from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200',
    borderHover: 'hover:border-purple-400',
    iconColor: 'text-purple-600',
    textColor: 'text-purple-600',
    arrow: '→'
  },
  {
    id: 'active-rewards',
    view: DASHBOARD_VIEWS.ACTIVE_REWARDS,
    icon: 'FiGift',
    title: 'Mis Recompensas',
    subtitle: '{count} activas para usar',
    bgGradient: 'from-green-50 to-green-100 hover:from-green-100 hover:to-green-200',
    borderHover: 'hover:border-green-400',
    iconColor: 'text-green-600',
    textColor: 'text-green-600',
    arrow: '→',
    showBadge: true,
    condition: 'hasActiveRewards'
  }
];

/**
 * Opciones de intervalo de avisos (en días)
 */
export const WARNING_INTERVAL_OPTIONS = [
  { value: 7, label: 'Cada 7 días' },
  { value: 10, label: 'Cada 10 días' },
  { value: 15, label: 'Cada 15 días' },
  { value: 20, label: 'Cada 20 días' },
  { value: 30, label: 'Cada 30 días' }
];

/**
 * Configuración de horarios de la sucursal
 */
export const DEFAULT_WORKING_HOURS = {
  weekdays: '8:00 AM - 8:00 PM',
  saturday: '8:00 AM - 6:00 PM',
  sunday: '9:00 AM - 5:00 PM'
};

/**
 * Umbral de puntos para mostrar alerta de canje
 */
export const POINTS_REDEEM_THRESHOLD = 50;

/**
 * Límite de items del historial reciente
 */
export const RECENT_HISTORY_LIMIT = 5;

/**
 * Textos del dashboard
 */
export const DASHBOARD_TEXTS = {
  greeting: '¡Hola, {name}!',
  welcome: 'Bienvenido a tu área personal',
  category: 'Categoría {tier}',
  points: '{points} puntos',
  viewProfile: 'Ver Perfil',
  bookNow: 'Reservar Ahora',
  newAppointment: 'Nueva Cita',
  nextAppointment: 'Próxima cita',
  noHistory: 'No hay historial de citas',
  noNotifications: 'No recibirás recordatorios automáticos',
  pointsAvailable: '¡Tienes puntos para canjear!',
  viewStore: 'Ver Tienda',
  activeRewards: 'Tienes {count} recompensa(s) activa(s)',
  viewMyRewards: 'Ver Mis Recompensas',
  backToDashboard: '← Volver al Dashboard',
  notFound: 'No se encontraron datos del cliente'
};
