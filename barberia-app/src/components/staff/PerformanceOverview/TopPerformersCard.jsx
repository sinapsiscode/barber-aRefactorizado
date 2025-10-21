import { FiStar } from 'react-icons/fi';
import { MEDAL_COLORS, DISPLAY_LIMITS } from '../../../constants/staff';
import { formatEarningsK } from '../../../utils/staff/staffMetrics';

/**
 * Top Performers Card - muestra los 5 mejores barberos
 * Líneas 944-983 del original
 */
const TopPerformersCard = ({ barbers }) => {
  const topPerformers = barbers
    .sort((a, b) => b.totalEarnings - a.totalEarnings)
    .slice(0, DISPLAY_LIMITS.TOP_PERFORMERS);

  const getMedalColor = (index) => {
    if (index === 0) return MEDAL_COLORS.FIRST;
    if (index === 1) return MEDAL_COLORS.SECOND;
    if (index === 2) return MEDAL_COLORS.THIRD;
    return MEDAL_COLORS.OTHER;
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Top Performers
      </h3>
      <div className="space-y-4">
        {topPerformers.map((barber, index) => (
          <div key={barber.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${getMedalColor(index)}`}>
                {index + 1}
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {barber.name}
                </div>
                <div className="text-sm text-gray-500">
                  {barber.totalServices} servicios
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-green-600">
                S/{formatEarningsK(barber.totalEarnings)}
              </div>
              <div className="flex items-center space-x-1">
                <FiStar className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-500">{barber.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPerformersCard;
