/**
 * Componente de Analytics para clientes
 * 3 cards: VIP, Distribución por Tier, Estadísticas Generales
 */

import { FiGift } from 'react-icons/fi';
import { useClientStore } from '../../../stores';
import { TIER_CHART_COLORS } from '../../../constants/clients/loyaltyTiers';
import { getAvgSpendingColor } from '../../../config/clients/clientMetrics';

const ClientAnalytics = ({ vipClients }) => {
  const { getClientStats } = useClientStore();
  const clientStats = getClientStats();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Card 1: Clientes VIP */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Clientes VIP
        </h3>
        <div className="space-y-3">
          {vipClients.slice(0, 5).map((client) => (
            <div key={client.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {client.name?.charAt(0) || '?'}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {client.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {client.totalVisits} visitas
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-green-600">
                  S/{(client.totalSpent / 1000).toFixed(1)}K
                </div>
                <div className="flex items-center space-x-1">
                  <FiGift className="h-3 w-3 text-yellow-500" />
                  <span className="text-sm text-gray-500">{client.loyaltyPoints}pts</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card 2: Distribución por Categoría */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Distribución por Categoría
        </h3>
        <div className="space-y-3">
          {Object.entries(clientStats.loyaltyTiers).map(([tier, count]) => {
            const percentage = clientStats.total > 0
              ? ((count / clientStats.total) * 100).toFixed(1)
              : 0;

            return (
              <div key={tier} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${TIER_CHART_COLORS[tier]}`}></div>
                  <span className="font-medium text-gray-900 dark:text-white">{tier}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">{count}</span>
                  <div className="text-xs text-gray-500">{percentage}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card 3: Estadísticas Generales */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Estadísticas Generales
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Gasto Promedio</span>
            <span className="font-semibold text-green-600">
              S/{clientStats.avgSpendingPerClient?.toLocaleString() || '0'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Puntos de Lealtad</span>
            <span className="font-semibold">
              {clientStats.totalLoyaltyPoints?.toLocaleString() || '0'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Ingresos Totales</span>
            <span className="font-semibold text-blue-600">
              S/{((clientStats.totalSpending || 0) / 1000).toFixed(1)}K
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Promedio por Cliente</span>
            <span className={`font-semibold ${getAvgSpendingColor(clientStats.avgSpendingPerClient || 0)}`}>
              S/{(clientStats.avgSpendingPerClient || 0).toFixed(0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientAnalytics;
