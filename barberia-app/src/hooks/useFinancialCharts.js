// ===================================================================
// 📊 HOOK PERSONALIZADO PARA GRÁFICOS FINANCIEROS - REFACTORIZADO
// ===================================================================
// Lógica centralizada para gráficos financieros
import { useMemo } from 'react';
import { useFinancialStore } from '../stores';
import { CHART_CONFIG } from '../constants/financial';

export const useFinancialCharts = (period = 'month') => {
  const { getChartData } = useFinancialStore();

  // Datos procesados para gráficos
  const processedData = useMemo(() => {
    const chartData = getChartData(period);
    const maxValue = Math.max(...chartData.map(d => Math.max(d.income, d.expenses)));
    const recentData = chartData.slice(-CHART_CONFIG.DEFAULT_DAYS);
    const totalProfit = chartData.reduce((sum, day) => sum + day.profit, 0);

    return {
      chartData,
      recentData,
      maxValue,
      totalProfit
    };
  }, [getChartData, period]);

  // Utilidades para formateo
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', CHART_CONFIG.DATE_FORMAT_OPTIONS);
  };

  const formatCurrency = (amount) => {
    return `S/${amount.toLocaleString()}`;
  };

  const calculateBarWidth = (value, maxValue) => {
    return maxValue > 0 ? (Math.abs(value) / maxValue) * 100 : 0;
  };

  const isProfitable = (profit) => {
    return profit >= 0;
  };

  const getProfitPrefix = (profit) => {
    return profit >= 0 ? '+' : '';
  };

  return {
    // Datos procesados
    ...processedData,

    // Utilidades
    formatDate,
    formatCurrency,
    calculateBarWidth,
    isProfitable,
    getProfitPrefix
  };
};