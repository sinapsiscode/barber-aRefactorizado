import { FiGift } from 'react-icons/fi';
import {
  CLIENT_SECTION_TEXTS,
  CLIENT_STATS_TEXTS,
  CLIENT_TIERS,
  CLIENT_TABLE_CONFIG
} from '../../constants/clients';
import {
  formatClientSpending,
  formatClientName,
  calculateTierPercentage,
  getSpendingColorClass
} from '../../utils/clientHelpers';

const ClientsOverview = ({ vipClients, clientStats }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <VIPClientsCard vipClients={vipClients} />
      <TierDistributionCard clientStats={clientStats} />
      <GeneralStatsCard clientStats={clientStats} />
    </div>
  );
};

const VIPClientsCard = ({ vipClients }) => (
  <div className="card">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      {CLIENT_SECTION_TEXTS.VIP_CLIENTS}
    </h3>
    <div className="space-y-3">
      {vipClients.slice(0, CLIENT_TABLE_CONFIG.MAX_VIP_DISPLAY).map((client) => (
        <VIPClientItem key={client.id} client={client} />
      ))}
    </div>
  </div>
);

const VIPClientItem = ({ client }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
        <span className="text-white text-sm font-medium">
          {formatClientName(client.name)}
        </span>
      </div>
      <div>
        <div className="font-medium text-gray-900 dark:text-white">
          {client.name}
        </div>
        <div className="text-sm text-gray-500">
          {client.totalVisits} {CLIENT_SECTION_TEXTS.VISITS}
        </div>
      </div>
    </div>
    <div className="text-right">
      <div className="font-semibold text-green-600">
        {formatClientSpending(client.totalSpent)}
      </div>
      <div className="flex items-center space-x-1">
        <FiGift className="h-3 w-3 text-yellow-500" />
        <span className="text-sm text-gray-500">
          {client.loyaltyPoints}{CLIENT_SECTION_TEXTS.POINTS}
        </span>
      </div>
    </div>
  </div>
);

const TierDistributionCard = ({ clientStats }) => (
  <div className="card">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      {CLIENT_SECTION_TEXTS.TIER_DISTRIBUTION}
    </h3>
    <div className="space-y-3">
      {Object.entries(clientStats.loyaltyTiers || {}).map(([tier, count]) => {
        const tierInfo = CLIENT_TIERS[tier.toUpperCase()] || CLIENT_TIERS.BRONZE;
        const percentage = calculateTierPercentage(count, clientStats.total);

        return (
          <TierDistributionItem
            key={tier}
            tier={tier}
            count={count}
            percentage={percentage}
            bgColor={tierInfo.bgColor}
          />
        );
      })}
    </div>
  </div>
);

const TierDistributionItem = ({ tier, count, percentage, bgColor }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <div className={`w-4 h-4 rounded-full ${bgColor}`}></div>
      <span className="font-medium text-gray-900 dark:text-white">{tier}</span>
    </div>
    <div className="text-right">
      <span className="font-semibold">{count}</span>
      <div className="text-xs text-gray-500">{percentage}%</div>
    </div>
  </div>
);

const GeneralStatsCard = ({ clientStats }) => (
  <div className="card">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      {CLIENT_SECTION_TEXTS.GENERAL_STATS}
    </h3>
    <div className="space-y-3">
      <StatItem
        label={CLIENT_STATS_TEXTS.AVERAGE_SPENDING}
        value={`S/${clientStats.avgSpendingPerClient?.toLocaleString() || '0'}`}
        className="text-green-600"
      />
      <StatItem
        label={CLIENT_STATS_TEXTS.LOYALTY_POINTS}
        value={clientStats.totalLoyaltyPoints?.toLocaleString() || '0'}
        className="font-semibold"
      />
      <StatItem
        label={CLIENT_STATS_TEXTS.TOTAL_REVENUE}
        value={`S/${((clientStats.totalSpending || 0) / 1000).toFixed(1)}K`}
        className="text-blue-600"
      />
      <StatItem
        label={CLIENT_STATS_TEXTS.AVERAGE_PER_CLIENT}
        value={`S/${(clientStats.avgSpendingPerClient || 0).toFixed(0)}`}
        className={getSpendingColorClass(clientStats.avgSpendingPerClient || 0)}
      />
    </div>
  </div>
);

const StatItem = ({ label, value, className = "font-semibold" }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-600 dark:text-gray-400">{label}</span>
    <span className={`font-semibold ${className}`}>{value}</span>
  </div>
);

export default ClientsOverview;