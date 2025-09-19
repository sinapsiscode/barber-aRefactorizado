// ===================================================================
// 📈 PROGRESO DE CLIENTE - COMPONENTE ESPECIALIZADO
// ===================================================================
// Panel de progreso de lealtad y estadísticas del cliente
import React from 'react';
import { FiStar, FiGift } from 'react-icons/fi';

const ClientProgress = ({
  loyaltyPoints = 0,
  totalVisits = 0,
  tier = 'Bronze',
  title = "Mi Progreso"
}) => {
  const hasAvailableRewards = loyaltyPoints >= 100;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <FiStar className="h-5 w-5 text-primary-500 mr-2" />
          {title}
        </h3>
        <span className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 px-3 py-1 rounded-full text-sm font-medium">
          {tier}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {loyaltyPoints}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Puntos</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {totalVisits}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Visitas</div>
        </div>
      </div>

      {/* Próxima recompensa disponible */}
      {hasAvailableRewards && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-2">
            <FiGift className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              ¡Tienes descuentos disponibles!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientProgress;