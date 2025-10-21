/**
 * Componente de Métricas principales para clientes
 * 5 cards con estadísticas clave
 */

import { MetricCard } from '../../common';
import { useClientStore } from '../../../stores';
import { getClientMetricsConfig } from '../../../config/clients/clientMetrics';

const ClientMetrics = ({ user, vipClients, unwelcomeClients }) => {
  const { getClientStats } = useClientStore();
  const clientStats = getClientStats();

  // Obtener configuración de métricas
  const metrics = getClientMetricsConfig(
    {
      clientStats,
      vipClients,
      unwelcomeClients
    },
    user
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.key}
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

export default ClientMetrics;
