import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { MetricCard } from '../../common';

/**
 * Componente de estadísticas de citas
 * Líneas 204-223 del original
 */
const AppointmentStats = ({ upcoming, completed, total }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard
        title="Próximas Citas"
        value={upcoming}
        icon={FiCalendar}
        color="bg-blue-500"
      />
      <MetricCard
        title="Citas Completadas"
        value={completed}
        icon={FiUser}
        color="bg-green-500"
      />
      <MetricCard
        title="Total de Citas"
        value={total}
        icon={FiClock}
        color="bg-purple-500"
      />
    </div>
  );
};

export default AppointmentStats;
