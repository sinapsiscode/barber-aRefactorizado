// ===================================================================
// 📊 HOOK DE DASHBOARD - REFACTORIZADO
// ===================================================================
// Hook base para lógica común de dashboards
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuthStore } from '../stores';
import { DASHBOARD_STATES } from '../constants/dashboard';
import {
  isValidRole,
  getDashboardComponent,
  getUserPermissions,
  getDashboardNavigation,
  getDashboardMetrics,
  getDashboardColors,
  getRoleDisplayName,
  getDashboardTitle
} from '../utils/dashboardHelpers';

export const useDashboard = (dashboardType, refreshInterval = 30000) => {
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  // Función de actualización
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setError(DASHBOARD_MESSAGES.ERROR);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh
  useEffect(() => {
    refresh();

    if (refreshInterval > 0) {
      const interval = setInterval(refresh, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refresh, refreshInterval]);

  return {
    loading,
    lastUpdated,
    error,
    refresh
  };
};

// Hook específico para el router de dashboards
export const useDashboardRouter = () => {
  const [dashboardState, setDashboardState] = useState(DASHBOARD_STATES.LOADING);
  const { user, isAuthenticated } = useAuthStore();

  // Datos computados basados en el rol del usuario
  const dashboardData = useMemo(() => {
    if (!user?.role) {
      return {
        component: null,
        permissions: [],
        navigation: [],
        metrics: [],
        colors: {},
        title: '',
        roleDisplayName: ''
      };
    }

    return {
      component: getDashboardComponent(user.role),
      permissions: getUserPermissions(user.role),
      navigation: getDashboardNavigation(user.role),
      metrics: getDashboardMetrics(user.role),
      colors: getDashboardColors(user.role),
      title: getDashboardTitle(user.role),
      roleDisplayName: getRoleDisplayName(user.role)
    };
  }, [user?.role]);

  // Efecto para determinar el estado del dashboard
  useEffect(() => {
    if (!isAuthenticated) {
      setDashboardState(DASHBOARD_STATES.UNAUTHORIZED);
      return;
    }

    if (!user?.role) {
      setDashboardState(DASHBOARD_STATES.ERROR);
      return;
    }

    if (!isValidRole(user.role)) {
      setDashboardState(DASHBOARD_STATES.ERROR);
      return;
    }

    setDashboardState(DASHBOARD_STATES.READY);
  }, [isAuthenticated, user?.role]);

  // Estado de validación
  const isLoading = dashboardState === DASHBOARD_STATES.LOADING;
  const isReady = dashboardState === DASHBOARD_STATES.READY;
  const hasError = dashboardState === DASHBOARD_STATES.ERROR;
  const isUnauthorized = dashboardState === DASHBOARD_STATES.UNAUTHORIZED;
  const hasValidRole = user?.role && isValidRole(user.role);

  return {
    // Estado
    user,
    dashboardState,
    isLoading,
    isReady,
    hasError,
    isUnauthorized,
    hasValidRole,

    // Datos del dashboard
    dashboardComponent: dashboardData.component,
    permissions: dashboardData.permissions,
    navigation: dashboardData.navigation,
    metrics: dashboardData.metrics,
    colors: dashboardData.colors,
    title: dashboardData.title,
    roleDisplayName: dashboardData.roleDisplayName
  };
};