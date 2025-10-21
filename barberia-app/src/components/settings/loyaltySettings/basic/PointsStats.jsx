import { FiTrendingUp, FiGift, FiStar } from 'react-icons/fi';
import { LOYALTY_TEXTS } from '../../../../constants/loyaltySettings';

/**
 * Estadísticas de puntos (ganados, canjeados, activos)
 */
const PointsStats = ({ totalEarned, totalRedeemed, totalActive }) => {
  const stats = [
    {
      icon: FiTrendingUp,
      label: LOYALTY_TEXTS.pointsEarnedLabel,
      value: totalEarned,
      bgColor: 'bg-green-500'
    },
    {
      icon: FiGift,
      label: LOYALTY_TEXTS.pointsRedeemedLabel,
      value: totalRedeemed,
      bgColor: 'bg-purple-500'
    },
    {
      icon: FiStar,
      label: LOYALTY_TEXTS.pointsActiveLabel,
      value: totalActive,
      bgColor: 'bg-blue-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-white dark:bg-dark-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className={`h-8 w-8 ${stat.bgColor} rounded-lg flex items-center justify-center mr-3`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {stat.value.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PointsStats;
