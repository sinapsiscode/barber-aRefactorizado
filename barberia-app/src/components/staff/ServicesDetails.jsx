import { FiClock, FiChevronUp, FiUsers, FiCalendar, FiAward } from 'react-icons/fi';
import { STAFF_TEXTS, METRIC_GRADIENTS, ANIMATIONS, LIMITS } from '../../constants/staffPage';

const ServicesDetails = ({
  staffSummary,
  filteredBarbers,
  selectedBranch,
  showServicesDetails,
  onClose,
  getServicePercentage
}) => {
  if (!showServicesDetails) return null;

  return (
    <div className={`${ANIMATIONS.TRANSITION_ALL} overflow-hidden ${
      showServicesDetails ? ANIMATIONS.MAX_HEIGHT_EXPANDED : ANIMATIONS.MAX_HEIGHT_COLLAPSED
    }`}>
      <div className="space-y-6">
        {/* Header de la sección */}
        <ServicesHeader onClose={onClose} />

        {/* Métricas de servicios */}
        <ServicesMetrics
          staffSummary={staffSummary}
          filteredBarbers={filteredBarbers}
        />

        {/* Top 5 Barberos y Distribución */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopBarbersByServices
            filteredBarbers={filteredBarbers}
            staffSummary={staffSummary}
            getServicePercentage={getServicePercentage}
          />
          <ServicesDistribution
            selectedBranch={selectedBranch}
            filteredBarbers={filteredBarbers}
            staffSummary={staffSummary}
          />
        </div>
      </div>
    </div>
  );
};

const ServicesHeader = ({ onClose }) => (
  <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
    <div className="flex items-center space-x-3">
      <div className="h-8 w-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
        <FiClock className="h-5 w-5 text-purple-500" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {STAFF_TEXTS.SERVICES_ANALYSIS}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {STAFF_TEXTS.SERVICES_SUBTITLE}
        </p>
      </div>
    </div>
    <button
      onClick={onClose}
      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
    >
      <FiChevronUp className="h-5 w-5" />
    </button>
  </div>
);

const ServicesMetrics = ({ staffSummary, filteredBarbers }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <MetricCard
      gradient={METRIC_GRADIENTS.PURPLE}
      icon={FiClock}
      iconColor="text-purple-600 dark:text-purple-400"
      iconBg="bg-purple-100 dark:bg-purple-800/50"
      title={STAFF_TEXTS.TOTAL_SERVICES}
      value={staffSummary.totalServices.toLocaleString()}
    />

    <MetricCard
      gradient={METRIC_GRADIENTS.BLUE}
      icon={FiUsers}
      iconColor="text-blue-600 dark:text-blue-400"
      iconBg="bg-blue-100 dark:bg-blue-800/50"
      title={STAFF_TEXTS.AVERAGE_PER_BARBER_SERVICES}
      value={Math.round(staffSummary.totalServices / (filteredBarbers.length || 1)).toLocaleString()}
    />

    <MetricCard
      gradient={METRIC_GRADIENTS.GREEN}
      icon={FiCalendar}
      iconColor="text-green-600 dark:text-green-400"
      iconBg="bg-green-100 dark:bg-green-800/50"
      title={STAFF_TEXTS.SERVICES_PER_DAY}
      value={Math.round(staffSummary.totalServices / LIMITS.DAYS_IN_MONTH).toLocaleString()}
    />

    <MetricCard
      gradient={METRIC_GRADIENTS.YELLOW}
      icon={FiAward}
      iconColor="text-yellow-600 dark:text-yellow-400"
      iconBg="bg-yellow-100 dark:bg-yellow-800/50"
      title={STAFF_TEXTS.BEST_BARBER}
      value={filteredBarbers.sort((a, b) => b.totalServices - a.totalServices)[0]?.totalServices || 0}
    />
  </div>
);

const MetricCard = ({ gradient, icon: Icon, iconColor, iconBg, title, value }) => (
  <div className={`card ${gradient}`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`h-10 w-10 ${iconBg} rounded-lg flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div>
          <p className={`text-sm font-medium ${iconColor}`}>{title}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  </div>
);

const TopBarbersByServices = ({ filteredBarbers, staffSummary, getServicePercentage }) => (
  <div className="card">
    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
      <FiAward className="h-5 w-5 text-purple-500 mr-2" />
      {STAFF_TEXTS.TOP_5_BARBERS}
    </h4>
    <div className="space-y-3">
      {filteredBarbers
        .sort((a, b) => b.totalServices - a.totalServices)
        .slice(0, LIMITS.TOP_PERFORMERS)
        .map((barber, index) => {
          const percentage = getServicePercentage(barber.totalServices);

          return (
            <BarberServiceCard
              key={barber.id}
              barber={barber}
              index={index}
              percentage={percentage}
            />
          );
        })}
    </div>
  </div>
);

const BarberServiceCard = ({ barber, index, percentage }) => {
  const getRankingStyle = (index) => {
    const styles = [
      'bg-yellow-500',
      'bg-gray-400',
      'bg-yellow-700',
      'bg-purple-500'
    ];
    return styles[index] || styles[3];
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${getRankingStyle(index)}`}>
            {index + 1}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {barber.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {percentage.toFixed(1)}% {STAFF_TEXTS.OF_TOTAL}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-purple-600">
            {barber.totalServices.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {STAFF_TEXTS.SERVICES_COUNT}
          </p>
        </div>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={`bg-purple-500 h-2 rounded-full ${ANIMATIONS.PROGRESS_BAR}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const ServicesDistribution = ({ selectedBranch, filteredBarbers, staffSummary }) => (
  <div className="card">
    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      {STAFF_TEXTS.DISTRIBUTION_BY_BRANCH}
    </h4>
    <div className="space-y-4">
      <DistributionItem
        label={STAFF_TEXTS.CURRENT_BRANCH}
        value={selectedBranch?.name || 'Todas'}
        textColor="text-gray-900 dark:text-white"
      />

      <DistributionItem
        label={STAFF_TEXTS.ACTIVE_BARBERS}
        value={filteredBarbers.filter(b => b.status === 'active').length}
        textColor="text-purple-600"
      />

      <DistributionItem
        label={STAFF_TEXTS.AVERAGE_RATING}
        value={`${staffSummary.avgRating}/5.0`}
        textColor="text-yellow-600"
      />

      <DistributionItem
        label={STAFF_TEXTS.EFFICIENCY}
        value={
          <>
            {Math.round((staffSummary.totalServices / filteredBarbers.length) / LIMITS.DAYS_IN_MONTH)}
            <span className="text-xs text-gray-500"> {STAFF_TEXTS.SERVICES_DAY_BARBER}</span>
          </>
        }
        textColor="text-green-600"
        isLast
      />
    </div>
  </div>
);

const DistributionItem = ({ label, value, textColor, isLast = false }) => (
  <div className={`flex justify-between items-center py-2 ${
    !isLast ? 'border-b border-gray-200 dark:border-gray-700' : ''
  }`}>
    <span className="text-gray-600 dark:text-gray-400">{label}</span>
    <span className={`font-semibold ${textColor}`}>
      {value}
    </span>
  </div>
);

export default ServicesDetails;