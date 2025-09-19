// ===================================================================
// 💰 ESTADÍSTICAS DE COMISIÓN - COMPONENTE ESPECIALIZADO
// ===================================================================
// Panel de comisiones y ganancias para barberos
import React from 'react';
import { FiTrendingUp } from 'react-icons/fi';

const CommissionStats = ({
  currentBarber,
  title = "Comisiones del Mes"
}) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">
            Ingresos totales
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            S/{currentBarber.totalEarnings.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">
            Comisión (70%)
          </span>
          <span className="font-semibold text-green-600">
            S/{(currentBarber.totalEarnings * 0.7).toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">
            Promedio por servicio
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            S/{Math.round(currentBarber.totalEarnings / currentBarber.totalServices)}
          </span>
        </div>

        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <FiTrendingUp className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              ¡Sigue así! Estás en el top 3 de barberos
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionStats;