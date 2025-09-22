import { FiCheckCircle } from 'react-icons/fi';
import { STATUS_COLORS, CALENDAR_TEXTS, APPOINTMENT_STATUSES } from '../../constants/receptionCalendar';
import {
  getAppointmentTooltip,
  shouldShowConfirmButton,
  shouldShowAttendanceButton
} from '../../utils/receptionCalendarHelpers';

const AppointmentCard = ({
  appointment,
  onStatusUpdate,
  onMarkAttendance
}) => {
  const statusColors = STATUS_COLORS[appointment.status] || STATUS_COLORS[APPOINTMENT_STATUSES.PENDING];
  const tooltip = getAppointmentTooltip(appointment);

  return (
    <div
      className={`text-xs p-1 rounded cursor-pointer group relative ${statusColors.bg} ${statusColors.text}`}
      title={tooltip}
    >
      <div className="truncate">
        {appointment.time} - {appointment.clientName}
      </div>

      <QuickActions
        appointment={appointment}
        onStatusUpdate={onStatusUpdate}
        onMarkAttendance={onMarkAttendance}
      />
    </div>
  );
};

const QuickActions = ({ appointment, onStatusUpdate, onMarkAttendance }) => {
  if (shouldShowConfirmButton(appointment.status)) {
    return <ConfirmAction appointment={appointment} onStatusUpdate={onStatusUpdate} />;
  }

  if (shouldShowAttendanceButton(appointment.status)) {
    return <AttendanceAction appointment={appointment} onMarkAttendance={onMarkAttendance} />;
  }

  return null;
};

const ConfirmAction = ({ appointment, onStatusUpdate }) => (
  <div className="absolute top-0 right-0 hidden group-hover:flex bg-white dark:bg-dark-800 border rounded shadow-lg p-1 space-x-1 z-10">
    <button
      onClick={() => onStatusUpdate(appointment.id, APPOINTMENT_STATUSES.CONFIRMED)}
      className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      {CALENDAR_TEXTS.CONFIRM}
    </button>
  </div>
);

const AttendanceAction = ({ appointment, onMarkAttendance }) => (
  <div className="absolute top-0 right-0 hidden group-hover:flex bg-white dark:bg-dark-800 border rounded shadow-lg p-1 space-x-1 z-10">
    <button
      onClick={() => onMarkAttendance(appointment)}
      className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center space-x-1"
      title={CALENDAR_TEXTS.ATTENDANCE_TOOLTIP}
    >
      <FiCheckCircle className="h-3 w-3" />
      <span>{CALENDAR_TEXTS.PRESENT}</span>
    </button>
  </div>
);

export default AppointmentCard;