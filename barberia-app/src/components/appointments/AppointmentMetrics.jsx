import { FiCalendar, FiClock, FiCheck, FiUsers } from 'react-icons/fi';
import Card from '../common/Card';
import { METRICS_TEXTS } from '../../constants/barberAppointments';

const AppointmentMetrics = ({ metrics }) => {
  const metricItems = [
    {
      icon: FiCalendar,
      label: METRICS_TEXTS.TODAY,
      value: metrics.total,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      icon: FiClock,
      label: METRICS_TEXTS.PENDING,
      value: metrics.pending,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900'
    },
    {
      icon: FiUsers,
      label: METRICS_TEXTS.CONFIRMED,
      value: metrics.confirmed,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      icon: FiCheck,
      label: METRICS_TEXTS.COMPLETED,
      value: metrics.completed,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metricItems.map((item) => (
        <MetricCard key={item.label} {...item} />
      ))}
    </div>
  );
};

const MetricCard = ({ icon: Icon, label, value, color, bgColor }) => (
  <Card className="p-4">
    <div className="flex items-center">
      <div className={`p-2 rounded-lg ${bgColor}`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  </Card>
);

export default AppointmentMetrics;