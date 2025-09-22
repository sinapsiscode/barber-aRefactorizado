import { FiStar } from 'react-icons/fi';
import { STAFF_TEXTS, LIMITS } from '../../constants/staffPage';
import { formatCurrency, getRankingColor } from '../../utils/staffHelpers';

const PerformanceOverview = ({ filteredBarbers }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <TopPerformersCard filteredBarbers={filteredBarbers} />
      <CurrentStatusCard filteredBarbers={filteredBarbers} />
    </div>
  );
};

const TopPerformersCard = ({ filteredBarbers }) => (
  <div className="card">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      {STAFF_TEXTS.TOP_PERFORMERS}
    </h3>
    <div className="space-y-4">
      {filteredBarbers
        .sort((a, b) => b.totalEarnings - a.totalEarnings)
        .slice(0, LIMITS.TOP_PERFORMERS)
        .map((barber, index) => (
          <TopPerformerItem
            key={barber.id}
            barber={barber}
            index={index}
          />
        ))}
    </div>
  </div>
);

const TopPerformerItem = ({ barber, index }) => {
  const rankingColor = getRankingColor(index);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${rankingColor.bg}`}>
          {index + 1}
        </div>
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {barber.name}
          </div>
          <div className="text-sm text-gray-500">
            {barber.totalServices} {STAFF_TEXTS.SERVICES_COUNT}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold text-green-600">
          {formatCurrency(barber.totalEarnings, 'K')}
        </div>
        <div className="flex items-center space-x-1">
          <FiStar className="h-3 w-3 text-yellow-400 fill-current" />
          <span className="text-sm text-gray-500">{barber.rating}</span>
        </div>
      </div>
    </div>
  );
};

const CurrentStatusCard = ({ filteredBarbers }) => (
  <div className="card">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      {STAFF_TEXTS.CURRENT_STATUS}
    </h3>
    <div className="space-y-4">
      {filteredBarbers.slice(0, LIMITS.TOP_PERFORMERS).map(barber => (
        <CurrentStatusItem
          key={barber.id}
          barber={barber}
        />
      ))}
    </div>
  </div>
);

const CurrentStatusItem = ({ barber }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
    <div className="flex items-center space-x-3">
      <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
        <span className="text-white text-sm font-medium">
          {barber.name.charAt(0)}
        </span>
      </div>
      <div>
        <div className="font-medium text-gray-900 dark:text-white">
          {barber.name}
        </div>
        <div className="text-sm text-gray-500">
          {barber.specialties[0]}
        </div>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <StatusBadge isPresent={barber.isPresent} />
      {barber.isPresent && (
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      )}
    </div>
  </div>
);

const StatusBadge = ({ isPresent }) => (
  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
    isPresent
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-600'
  }`}>
    {isPresent ? STAFF_TEXTS.ACTIVE : STAFF_TEXTS.INACTIVE}
  </span>
);

export default PerformanceOverview;