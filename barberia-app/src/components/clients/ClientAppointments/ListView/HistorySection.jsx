import AppointmentCardCompact from '../AppointmentCardCompact';
import { DEFAULTS } from '../../../../constants/appointments';

/**
 * Sección de historial de citas
 * Líneas 445-494 del original
 */
const HistorySection = ({ appointments }) => {
  if (appointments.length === 0) return null;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Historial de Citas
        </h2>
        <span className="text-sm text-gray-500">
          {appointments.length} citas completadas
        </span>
      </div>

      <div className="space-y-3">
        {appointments.slice(0, DEFAULTS.MAX_HISTORY_ITEMS).map((appointment) => (
          <AppointmentCardCompact
            key={appointment.id}
            appointment={appointment}
          />
        ))}
      </div>
    </div>
  );
};

export default HistorySection;
