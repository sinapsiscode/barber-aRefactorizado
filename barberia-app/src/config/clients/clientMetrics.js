/**
 * Configuración de métricas para el dashboard de clientes
 */

import { FiUsers, FiTrendingUp, FiStar, FiUserX, FiGift } from 'react-icons/fi';

/**
 * Define las métricas principales del dashboard de clientes
 * @param {Object} data - Datos calculados
 * @param {Object} user - Usuario actual
 * @returns {Array} - Array de configuración de métricas
 */
export const getClientMetricsConfig = (data, user) => {
  const { clientStats, vipClients, unwelcomeClients } = data;

  const metrics = [
    {
      key: 'total',
      title: 'Clientes Totales',
      value: clientStats.totalClients?.toLocaleString() || '0',
      icon: FiUsers,
      color: 'bg-blue-500',
      visible: true
    },
    {
      key: 'newThisMonth',
      title: 'Nuevos Este Mes',
      value: clientStats.newClientsThisMonth || 0,
      icon: FiTrendingUp,
      color: 'bg-green-500',
      visible: true
    },
    {
      key: 'vip',
      title: 'Clientes VIP',
      value: vipClients.length || 0,
      icon: FiStar,
      color: 'bg-purple-500',
      visible: true
    },
    {
      key: 'unwelcome',
      title: 'Clientes No Gratos',
      value: unwelcomeClients.length || 0,
      icon: FiUserX,
      color: 'bg-red-500',
      description: 'Marcados como problemáticos',
      visible: user?.role === 'super_admin' || user?.role === 'branch_admin'
    },
    {
      key: 'avgSpending',
      title: 'Gasto Promedio',
      value: `S/${(clientStats.avgSpendingPerClient || 0).toFixed(0)}`,
      icon: FiGift,
      color: 'bg-yellow-500',
      description: 'Por cliente',
      visible: true
    }
  ];

  // Filtrar métricas visibles
  return metrics.filter(m => m.visible);
};

/**
 * Colores condicionales para el gasto promedio
 * @param {number} avgSpending
 * @returns {string} - Clase CSS
 */
export const getAvgSpendingColor = (avgSpending) => {
  if (avgSpending >= 100) return 'text-green-600';
  if (avgSpending >= 50) return 'text-yellow-600';
  return 'text-red-600';
};
