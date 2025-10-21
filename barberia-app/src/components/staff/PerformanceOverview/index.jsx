import TopPerformersCard from './TopPerformersCard';
import CurrentStatusCard from './CurrentStatusCard';

/**
 * Performance Overview - Vista general del rendimiento del staff
 * Líneas 943-1023 del original
 */
const PerformanceOverview = ({ barbers }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <TopPerformersCard barbers={barbers} />
      <CurrentStatusCard barbers={barbers} />
    </div>
  );
};

export default PerformanceOverview;
