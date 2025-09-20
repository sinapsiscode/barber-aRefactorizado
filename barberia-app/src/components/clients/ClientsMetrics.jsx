import { FiUsers, FiTrendingUp, FiStar, FiGift } from 'react-icons/fi';
import { MetricCard } from '../common';
import { CLIENT_METRICS_TEXTS } from '../../constants/clients';

const ClientsMetrics = ({ clientStats, vipClientsCount }) => {
  const metrics = [
    {
      title: CLIENT_METRICS_TEXTS.TOTAL_CLIENTS,
      value: clientStats.totalClients?.toLocaleString() || '0',
      icon: FiUsers,
      color: 'bg-blue-500'
    },
    {
      title: CLIENT_METRICS_TEXTS.NEW_THIS_MONTH,
      value: clientStats.newClientsThisMonth || 0,
      icon: FiTrendingUp,
      color: 'bg-green-500'
    },
    {
      title: CLIENT_METRICS_TEXTS.VIP_CLIENTS,
      value: vipClientsCount || 0,
      icon: FiStar,
      color: 'bg-purple-500'
    },
    {
      title: CLIENT_METRICS_TEXTS.AVERAGE_SPENDING,
      value: `S/${(clientStats.avgSpendingPerClient || 0).toFixed(0)}`,
      icon: FiGift,
      color: 'bg-yellow-500',
      description: CLIENT_METRICS_TEXTS.PER_CLIENT
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          icon={metric.icon}
          color={metric.color}
          description={metric.description}
        />
      ))}
    </div>
  );
};

export default ClientsMetrics;