// ===================================================================
// 📈 TARJETA DE MÉTRICA - COMPONENTE REUTILIZABLE
// ===================================================================
// Tarjeta de métrica reutilizable para dashboards
import React from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const MetricCard = ({
  title,
  value,
  icon: Icon,
  color = 'bg-blue-500',
  trend,
  trendValue,
  onClick,
  loading = false,
  className = ''
}) => {
  const cardClass = onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : '';

  const renderTrend = () => {
    if (!trend || !trendValue) return null;

    const isPositive = trend === 'up';
    const TrendIcon = isPositive ? FiTrendingUp : FiTrendingDown;
    const trendColor = isPositive ? 'text-green-600' : 'text-red-600';

    return (
      <div className={`flex items-center space-x-1 text-xs ${trendColor} mt-1`}>
        <TrendIcon className="w-3 h-3" />
        <span>{trendValue}</span>
      </div>
    );
  };

  return (
    <div
      className={`card ${cardClass} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>

          {loading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mt-1"></div>
            </div>
          ) : (
            <>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {value}
              </p>
              {renderTrend()}
            </>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;