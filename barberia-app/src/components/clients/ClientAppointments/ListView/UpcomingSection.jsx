import { FiCalendar } from 'react-icons/fi';
import { EmptyState } from '../../../common';
import AppointmentCard from '../AppointmentCard';

/**
 * Sección de próximas citas
 * Líneas 348-443 del original
 */
const UpcomingSection = ({ appointments, onCancel, onOpenForm }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Próximas Citas
        </h2>
        <FiCalendar className="h-5 w-5 text-gray-400" />
      </div>

      {appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onCancel={onCancel}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FiCalendar}
          title="No tienes citas programadas"
          description="Reserva tu próxima cita para mantener tu estilo impecable"
          action={
            <button onClick={onOpenForm} className="btn-primary">
              Reservar Ahora
            </button>
          }
        />
      )}
    </div>
  );
};

export default UpcomingSection;
