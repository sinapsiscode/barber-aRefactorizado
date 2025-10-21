/**
 * Configuración de roles para el portafolio
 */

export const PORTFOLIO_ROLES = {
  BARBER: 'barber',
  CLIENT: 'client',
  RECEPTION: 'reception',
  SUPER_ADMIN: 'super_admin',
  BRANCH_ADMIN: 'branch_admin'
};

/**
 * Títulos según rol
 */
export const PORTFOLIO_TITLES = {
  [PORTFOLIO_ROLES.BARBER]: 'Mi Portafolio',
  [PORTFOLIO_ROLES.CLIENT]: 'Mis Fotos Antes y Después',
  [PORTFOLIO_ROLES.RECEPTION]: 'Portafolio de Barberos',
  [PORTFOLIO_ROLES.SUPER_ADMIN]: 'Portafolio de Barberos',
  [PORTFOLIO_ROLES.BRANCH_ADMIN]: 'Portafolio de Barberos'
};

/**
 * Descripciones según rol
 */
export const PORTFOLIO_DESCRIPTIONS = {
  [PORTFOLIO_ROLES.BARBER]: 'Gestiona tus trabajos y fotos del antes y después',
  [PORTFOLIO_ROLES.CLIENT]: 'Ve las fotos de tus servicios realizados por nuestros barberos',
  [PORTFOLIO_ROLES.RECEPTION]: 'Muestra los trabajos realizados a nuevos clientes',
  [PORTFOLIO_ROLES.SUPER_ADMIN]: 'Muestra los trabajos realizados a nuevos clientes',
  [PORTFOLIO_ROLES.BRANCH_ADMIN]: 'Muestra los trabajos realizados en tu sucursal'
};

/**
 * Permisos por rol
 */
export const PORTFOLIO_PERMISSIONS = {
  canAddWork: (role) => role === PORTFOLIO_ROLES.BARBER,
  canRate: (role) => role === PORTFOLIO_ROLES.CLIENT,
  canViewAll: (role) => [
    PORTFOLIO_ROLES.SUPER_ADMIN,
    PORTFOLIO_ROLES.BRANCH_ADMIN,
    PORTFOLIO_ROLES.RECEPTION
  ].includes(role),
  canFilterByBarber: (role) => role !== PORTFOLIO_ROLES.BARBER && role !== PORTFOLIO_ROLES.CLIENT,
  showBarberStats: (role) => role === PORTFOLIO_ROLES.RECEPTION
};
