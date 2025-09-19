// ===================================================================
// 📊 HOOK DE DASHBOARD - REFACTORIZADO
// ===================================================================
// Hook base para lógica común de dashboards
import { useState, useEffect, useCallback } from 'react';
import { DASHBOARD_MESSAGES } from '../constants';

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