// ===================================================================
// 📊 CONSTANTES PARA DASHBOARD - REFACTORIZADO
// ===================================================================

// Roles del sistema
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  BRANCH_ADMIN: 'branch_admin',
  BARBER: 'barber',
  RECEPTION: 'reception',
  CLIENT: 'client'
};

// Configuración de dashboards por rol
export const DASHBOARD_CONFIG = {
  [USER_ROLES.SUPER_ADMIN]: {
    component: 'SuperAdminDashboard',
    permissions: ['view_all_branches', 'manage_system', 'view_analytics']
  },
  [USER_ROLES.BRANCH_ADMIN]: {
    component: 'BranchAdminDashboard',
    permissions: ['manage_branch', 'view_branch_analytics', 'manage_staff']
  },
  [USER_ROLES.BARBER]: {
    component: 'BarberDashboard',
    permissions: ['view_appointments', 'manage_services', 'view_clients']
  },
  [USER_ROLES.RECEPTION]: {
    component: 'ReceptionDashboard',
    permissions: ['manage_appointments', 'manage_clients', 'handle_payments']
  },
  [USER_ROLES.CLIENT]: {
    component: 'ClientDashboard',
    permissions: ['view_appointments', 'book_services', 'view_history']
  }
};

// Textos de la interfaz
export const DASHBOARD_TEXTS = {
  UNRECOGNIZED_ROLE: {
    TITLE: 'Rol no reconocido',
    DESCRIPTION: 'No se pudo determinar tu rol en el sistema.'
  },
  LOADING: 'Cargando dashboard...',
  UNAUTHORIZED: 'No tienes permisos para acceder a esta sección'
};

// Configuración de navegación
export const DASHBOARD_NAVIGATION = {
  [USER_ROLES.SUPER_ADMIN]: [
    { key: 'overview', label: 'Resumen General', icon: 'BarChart3' },
    { key: 'branches', label: 'Gestión de Sedes', icon: 'Building' },
    { key: 'analytics', label: 'Analíticas', icon: 'TrendingUp' },
    { key: 'system', label: 'Configuración del Sistema', icon: 'Settings' }
  ],
  [USER_ROLES.BRANCH_ADMIN]: [
    { key: 'overview', label: 'Resumen de Sede', icon: 'BarChart3' },
    { key: 'staff', label: 'Personal', icon: 'Users' },
    { key: 'appointments', label: 'Citas', icon: 'Calendar' },
    { key: 'clients', label: 'Clientes', icon: 'UserCheck' }
  ],
  [USER_ROLES.BARBER]: [
    { key: 'today', label: 'Citas de Hoy', icon: 'Calendar' },
    { key: 'clients', label: 'Mis Clientes', icon: 'Users' },
    { key: 'services', label: 'Servicios', icon: 'Scissors' },
    { key: 'earnings', label: 'Ganancias', icon: 'DollarSign' }
  ],
  [USER_ROLES.RECEPTION]: [
    { key: 'appointments', label: 'Gestión de Citas', icon: 'Calendar' },
    { key: 'clients', label: 'Clientes', icon: 'Users' },
    { key: 'payments', label: 'Pagos', icon: 'CreditCard' },
    { key: 'queue', label: 'Cola de Espera', icon: 'Clock' }
  ],
  [USER_ROLES.CLIENT]: [
    { key: 'appointments', label: 'Mis Citas', icon: 'Calendar' },
    { key: 'history', label: 'Historial', icon: 'History' },
    { key: 'profile', label: 'Mi Perfil', icon: 'User' },
    { key: 'rewards', label: 'Recompensas', icon: 'Gift' }
  ]
};

// Configuración de métricas por rol
export const DASHBOARD_METRICS = {
  [USER_ROLES.SUPER_ADMIN]: [
    'total_revenue',
    'total_appointments',
    'active_branches',
    'total_clients',
    'monthly_growth',
    'system_health'
  ],
  [USER_ROLES.BRANCH_ADMIN]: [
    'branch_revenue',
    'branch_appointments',
    'active_staff',
    'branch_clients',
    'satisfaction_rate',
    'efficiency_rate'
  ],
  [USER_ROLES.BARBER]: [
    'today_appointments',
    'week_earnings',
    'client_count',
    'services_completed',
    'rating_average',
    'productivity_score'
  ],
  [USER_ROLES.RECEPTION]: [
    'pending_appointments',
    'daily_checkins',
    'payment_pending',
    'queue_length',
    'processed_today',
    'efficiency_score'
  ],
  [USER_ROLES.CLIENT]: [
    'upcoming_appointments',
    'loyalty_points',
    'services_taken',
    'money_spent',
    'membership_level',
    'available_rewards'
  ]
};

// Configuración de colores por rol
export const DASHBOARD_COLORS = {
  [USER_ROLES.SUPER_ADMIN]: {
    primary: 'purple',
    secondary: 'indigo',
    accent: 'blue'
  },
  [USER_ROLES.BRANCH_ADMIN]: {
    primary: 'blue',
    secondary: 'cyan',
    accent: 'teal'
  },
  [USER_ROLES.BARBER]: {
    primary: 'green',
    secondary: 'emerald',
    accent: 'lime'
  },
  [USER_ROLES.RECEPTION]: {
    primary: 'orange',
    secondary: 'amber',
    accent: 'yellow'
  },
  [USER_ROLES.CLIENT]: {
    primary: 'rose',
    secondary: 'pink',
    accent: 'red'
  }
};

// Estados de carga
export const DASHBOARD_STATES = {
  LOADING: 'loading',
  READY: 'ready',
  ERROR: 'error',
  UNAUTHORIZED: 'unauthorized'
};