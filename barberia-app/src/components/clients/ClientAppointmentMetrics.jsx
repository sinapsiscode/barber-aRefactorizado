import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { MetricCard } from '../common';
import { CLIENT_METRICS_TEXTS } from '../../constants/clientAppointments';

const ClientAppointmentMetrics = ({ metrics }) => {
  const metricItems = [
    {
      title: CLIENT_METRICS_TEXTS.UPCOMING,
      value: metrics.upcoming,
      icon: FiCalendar,
      color: 'bg-blue-500'
    },
    {
      title: CLIENT_METRICS_TEXTS.COMPLETED,
      value: metrics.completed,
      icon: FiUser,
      color: 'bg-green-500'
    },
    {
      title: CLIENT_METRICS_TEXTS.TOTAL,
      value: metrics.total,
      icon: FiClock,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metricItems.map((item) => (
        <MetricCard
          key={item.title}
          title={item.title}
          value={item.value}
          icon={item.icon}
          color={item.color}
        />
      ))}
    </div>
  );
};

export default ClientAppointmentMetrics;