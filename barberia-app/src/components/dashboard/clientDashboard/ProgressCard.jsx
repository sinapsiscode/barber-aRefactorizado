import { FiStar, FiGift } from 'react-icons/fi';
import { POINTS_REDEEM_THRESHOLD, DASHBOARD_TEXTS } from '../../../constants/clientDashboard';

/**
 * Card de progreso del cliente (puntos y visitas)
 */
const ProgressCard = ({ currentClient, tier, currentPoints, activeRewardsCount, onNavigateStore, onNavigateRewards }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <FiStar className="h-5 w-5 text-primary-500 mr-2" />
          Mi Progreso
        </h3>
        <span className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 px-3 py-1 rounded-full text-sm font-medium">
          {tier}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{currentPoints}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Puntos</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{currentClient.totalVisits}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Visitas</div>
        </div>
      </div>

      {/* Próxima recompensa disponible */}
      {currentPoints >= POINTS_REDEEM_THRESHOLD && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FiGift className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                {DASHBOARD_TEXTS.pointsAvailable}
              </span>
            </div>
            <button
              onClick={onNavigateStore}
              className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors"
            >
              {DASHBOARD_TEXTS.viewStore}
            </button>
          </div>
        </div>
      )}

      {/* Recompensas activas */}
      {activeRewardsCount > 0 && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FiGift className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                {DASHBOARD_TEXTS.activeRewards.replace('{count}', activeRewardsCount)}
              </span>
            </div>
            <button
              onClick={onNavigateRewards}
              className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
            >
              {DASHBOARD_TEXTS.viewMyRewards}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressCard;
