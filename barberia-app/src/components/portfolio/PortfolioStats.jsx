import { FiUser, FiStar, FiCamera } from 'react-icons/fi';
import { PORTFOLIO_TEXTS, METRIC_COLORS } from '../../constants/portfolio';
import {
  calculateAverageRating,
  getThisMonthWork,
  getUniqueServicesCount,
  getLastServiceDate
} from '../../utils/portfolioHelpers';

const PortfolioStats = ({ user, filteredPortfolio, portfolioByBarber }) => {
  // Estadísticas por barbero (recepción)
  if (user?.role === 'reception') {
    return <BarberStats portfolioByBarber={portfolioByBarber} />;
  }

  // Estadísticas para barbero
  if (user?.role === 'barber') {
    return <BarberPersonalStats filteredPortfolio={filteredPortfolio} />;
  }

  // Estadísticas para cliente
  if (user?.role === 'client') {
    return <ClientStats filteredPortfolio={filteredPortfolio} />;
  }

  return null;
};

const BarberStats = ({ portfolioByBarber }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {portfolioByBarber.map(barber => (
      <div key={barber.id} className="card">
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <FiUser className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {barber.name}
            </h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <FiStar className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {barber.avgRating || 0}
                </span>
              </div>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {PORTFOLIO_TEXTS.WORKS_COUNT.replace('{count}', barber.workCount)}
              </span>
            </div>
          </div>
        </div>

        {barber.latestWork && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <strong>{PORTFOLIO_TEXTS.LATEST_WORK}</strong> {barber.latestWork.service}
            <br />
            <span className="text-xs">
              {new Date(barber.latestWork.date).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    ))}
  </div>
);

const BarberPersonalStats = ({ filteredPortfolio }) => {
  const totalWorks = filteredPortfolio.length;
  const averageRating = calculateAverageRating(filteredPortfolio);
  const thisMonthWorks = getThisMonthWork(filteredPortfolio);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard
        title={PORTFOLIO_TEXTS.TOTAL_WORKS}
        value={totalWorks}
        icon={FiCamera}
        color={METRIC_COLORS.BLUE}
      />
      <MetricCard
        title={PORTFOLIO_TEXTS.AVERAGE_RATING}
        value={averageRating}
        icon={FiStar}
        color={METRIC_COLORS.YELLOW}
      />
      <MetricCard
        title={PORTFOLIO_TEXTS.THIS_MONTH}
        value={thisMonthWorks}
        icon={FiUser}
        color={METRIC_COLORS.GREEN}
      />
    </div>
  );
};

const ClientStats = ({ filteredPortfolio }) => {
  const totalPhotos = filteredPortfolio.length;
  const servicesCount = getUniqueServicesCount(filteredPortfolio);
  const lastServiceDate = getLastServiceDate(filteredPortfolio);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard
        title={PORTFOLIO_TEXTS.TOTAL_PHOTOS}
        value={totalPhotos}
        icon={FiCamera}
        color={METRIC_COLORS.BLUE}
      />
      <MetricCard
        title={PORTFOLIO_TEXTS.SERVICES_DONE}
        value={servicesCount}
        icon={FiUser}
        color={METRIC_COLORS.GREEN}
      />
      <MetricCard
        title={PORTFOLIO_TEXTS.LAST_SERVICE}
        value={lastServiceDate}
        icon={FiStar}
        color={METRIC_COLORS.PURPLE}
        isDateValue
      />
    </div>
  );
};

const MetricCard = ({ title, value, icon: Icon, color, isDateValue = false }) => {
  const colorClasses = {
    [METRIC_COLORS.BLUE]: 'bg-blue-500',
    [METRIC_COLORS.YELLOW]: 'bg-yellow-500',
    [METRIC_COLORS.GREEN]: 'bg-green-500',
    [METRIC_COLORS.PURPLE]: 'bg-purple-500'
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className={`${isDateValue ? 'text-sm' : 'text-2xl'} font-bold text-gray-900 dark:text-white`}>
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default PortfolioStats;