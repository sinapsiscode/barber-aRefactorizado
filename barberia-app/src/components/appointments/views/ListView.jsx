import AppointmentCard from '../AppointmentCard';
import { UI_TEXTS } from '../../../constants/barberAppointments';
import { formatAppointmentDate } from '../../../utils/appointmentHelpers';

const ListView = ({
  currentDate,
  appointments,
  onMarkAttendance,
  onStartService,
  onCompleteService
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {UI_TEXTS.APPOINTMENTS_FOR_DATE} {formatAppointmentDate(currentDate)}
        </h3>
      </div>

      {appointments.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onMarkAttendance={onMarkAttendance}
              onStartService={onStartService}
              onCompleteService={onCompleteService}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const EmptyState = () => (
  <div className="text-center py-12">
    <div className="text-gray-400 dark:text-gray-600 mb-4">
      <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
      {UI_TEXTS.NO_APPOINTMENTS}
    </h3>
    <p className="text-gray-500 dark:text-gray-400">
      {UI_TEXTS.NO_APPOINTMENTS_SUBTITLE}
    </p>
  </div>
);

export default ListView;