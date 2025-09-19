// ===================================================================
// 🎁 RECOMPENSAS DE CLIENTE - COMPONENTE ESPECIALIZADO
// ===================================================================
// Panel de recompensas y sistema de puntos para el cliente
import React from 'react';
import { FiGift } from 'react-icons/fi';

const ClientRewards = ({
  availableRewards = [],
  loyaltyPoints = 0,
  title = "Recompensas Disponibles",
  onRedeemReward
}) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>

      <div className="space-y-3">
        {availableRewards.map((reward, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border transition-all ${
              loyaltyPoints >= reward.points
                ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800'
                : 'border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  loyaltyPoints >= reward.points
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <FiGift className={`h-4 w-4 ${
                    loyaltyPoints >= reward.points
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-400'
                  }`} />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {reward.reward}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {reward.description}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className={`text-sm font-semibold ${
                  loyaltyPoints >= reward.points
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-500'
                }`}>
                  {reward.points} pts
                </div>
                {loyaltyPoints >= reward.points && (
                  <button
                    onClick={() => onRedeemReward?.(reward)}
                    className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded mt-1 transition-colors"
                  >
                    Canjear
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {availableRewards.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <FiGift className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No hay recompensas disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientRewards;