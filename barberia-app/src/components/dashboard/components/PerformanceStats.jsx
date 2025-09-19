// ===================================================================
// 📈 ESTADÍSTICAS DE RENDIMIENTO - COMPONENTE ESPECIALIZADO
// ===================================================================
// Panel de estadísticas de rendimiento para barberos
import React from 'react';
import { FiStar, FiTrendingUp } from 'react-icons/fi';

const PerformanceStats = ({
  currentBarber,
  barberStats,
  title = "Mi Rendimiento Mensual"
}) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">
            Horas trabajadas este mes
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {barberStats.thisMonthHours.toFixed(1)}h
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">
            Días trabajados
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {barberStats.totalDays} días
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">
            Promedio diario
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {barberStats.averageHours.toFixed(1)}h
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">
            Calificación promedio
          </span>
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-yellow-600">
              {currentBarber.rating}/5.0
            </span>
            <FiStar className="h-4 w-4 text-yellow-500 fill-current" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceStats;