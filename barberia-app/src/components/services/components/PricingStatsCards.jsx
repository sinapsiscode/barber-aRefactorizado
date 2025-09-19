// ===================================================================
// 📊 TARJETAS DE ESTADÍSTICAS DE PRECIOS - COMPONENTE ESPECIALIZADO
// ===================================================================
// Tarjetas con estadísticas de precios para el gestor de servicios
import React from 'react';
import { FiDollarSign, FiTrendingUp, FiCheck } from 'react-icons/fi';
import { SERVICE_LABELS, SERVICE_STYLES } from '../../../constants/services';

const PricingStatsCards = ({
  pricingStats = {}
}) => {
  const statsCards = [
    {
      key: 'average',
      label: SERVICE_LABELS.STATS.AVERAGE_PRICE,
      value: `S/${pricingStats.averagePrice?.toFixed(2) || '0.00'}`,
      icon: FiDollarSign,
      style: SERVICE_STYLES.STATS_CARDS.AVERAGE
    },
    {
      key: 'max',
      label: SERVICE_LABELS.STATS.MAX_PRICE,
      value: `S/${pricingStats.maxPrice || 0}`,
      icon: FiTrendingUp,
      style: SERVICE_STYLES.STATS_CARDS.MAX
    },
    {
      key: 'min',
      label: SERVICE_LABELS.STATS.MIN_PRICE,
      value: `S/${pricingStats.minPrice || 0}`,
      icon: FiDollarSign,
      style: SERVICE_STYLES.STATS_CARDS.MIN
    },
    {
      key: 'total',
      label: SERVICE_LABELS.STATS.ACTIVE_SERVICES,
      value: pricingStats.totalServices || 0,
      icon: FiCheck,
      style: SERVICE_STYLES.STATS_CARDS.ACTIVE
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {statsCards.map(({ key, label, value, icon: Icon, style }) => (
        <div key={key} className={`p-4 ${style.bg} rounded-lg`}>
          <div className="flex items-center">
            <Icon className={`h-5 w-5 ${style.iconColor} mr-2`} />
            <div>
              <p className={`text-sm ${style.textColor}`}>
                {label}
              </p>
              <p className={`text-lg font-semibold ${style.valueColor}`}>
                {value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PricingStatsCards;