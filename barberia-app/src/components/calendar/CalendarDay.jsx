import { CALENDAR_TEXTS } from '../../constants/receptionCalendar';
import AppointmentCard from './AppointmentCard';

const CalendarDay = ({
  appointments,
  maxAppointments,
  onStatusUpdate,
  onMarkAttendance
}) => {
  const visibleAppointments = appointments.slice(0, maxAppointments);
  const remainingCount = appointments.length - maxAppointments;

  return (
    <div className="space-y-1">
      {visibleAppointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          onStatusUpdate={onStatusUpdate}
          onMarkAttendance={onMarkAttendance}
        />
      ))}

      {remainingCount > 0 && (
        <MoreAppointmentsIndicator count={remainingCount} />
      )}
    </div>
  );
};

const MoreAppointmentsIndicator = ({ count }) => (
  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
    {CALENDAR_TEXTS.MORE_APPOINTMENTS.replace('{count}', count)}
  </div>
);

export default CalendarDay;