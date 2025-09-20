import {
  USER_ROLES,
  DASHBOARD_CONFIG,
  DASHBOARD_NAVIGATION,
  DASHBOARD_METRICS,
  DASHBOARD_COLORS
} from '../constants/dashboard';

export const isValidRole = (role) => {
  return Object.values(USER_ROLES).includes(role);
};

export const getDashboardComponent = (role) => {
  return DASHBOARD_CONFIG[role]?.component || null;
};

export const getUserPermissions = (role) => {
  return DASHBOARD_CONFIG[role]?.permissions || [];
};

export const hasPermission = (userRole, permission) => {
  const permissions = getUserPermissions(userRole);
  return permissions.includes(permission);
};

export const getDashboardNavigation = (role) => {
  return DASHBOARD_NAVIGATION[role] || [];
};

export const getDashboardMetrics = (role) => {
  return DASHBOARD_METRICS[role] || [];
};

export const getDashboardColors = (role) => {
  return DASHBOARD_COLORS[role] || DASHBOARD_COLORS[USER_ROLES.CLIENT];
};

export const getRoleDisplayName = (role) => {
  const roleNames = {
    [USER_ROLES.SUPER_ADMIN]: 'Super Administrador',
    [USER_ROLES.BRANCH_ADMIN]: 'Administrador de Sede',
    [USER_ROLES.BARBER]: 'Barbero',
    [USER_ROLES.RECEPTION]: 'Recepcionista',
    [USER_ROLES.CLIENT]: 'Cliente'
  };

  return roleNames[role] || 'Usuario';
};

export const canAccessDashboard = (userRole, targetRole) => {
  const hierarchy = {
    [USER_ROLES.SUPER_ADMIN]: 5,
    [USER_ROLES.BRANCH_ADMIN]: 4,
    [USER_ROLES.BARBER]: 3,
    [USER_ROLES.RECEPTION]: 2,
    [USER_ROLES.CLIENT]: 1
  };

  return hierarchy[userRole] >= hierarchy[targetRole];
};

export const getDashboardTitle = (role) => {
  const titles = {
    [USER_ROLES.SUPER_ADMIN]: 'Panel de Control General',
    [USER_ROLES.BRANCH_ADMIN]: 'Panel de Administración',
    [USER_ROLES.BARBER]: 'Panel del Barbero',
    [USER_ROLES.RECEPTION]: 'Panel de Recepción',
    [USER_ROLES.CLIENT]: 'Mi Dashboard'
  };

  return titles[role] || 'Dashboard';
};

export const shouldShowMetric = (metric, userRole) => {
  const roleMetrics = getDashboardMetrics(userRole);
  return roleMetrics.includes(metric);
};

export const getDefaultDashboardRoute = (role) => {
  const defaultRoutes = {
    [USER_ROLES.SUPER_ADMIN]: '/admin/overview',
    [USER_ROLES.BRANCH_ADMIN]: '/branch/overview',
    [USER_ROLES.BARBER]: '/barber/appointments',
    [USER_ROLES.RECEPTION]: '/reception/appointments',
    [USER_ROLES.CLIENT]: '/client/appointments'
  };

  return defaultRoutes[role] || '/dashboard';
};