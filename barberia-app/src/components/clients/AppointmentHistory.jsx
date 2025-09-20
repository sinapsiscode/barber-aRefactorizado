import { FiCalendar, FiStar } from 'react-icons/fi';
import {
  CLIENT_UI_TEXTS,
  CLIENT_DEFAULT_CONFIG
} from '../../constants/clientAppointments';
import { calculatePoints } from '../../utils/clientAppointmentHelpers';

const AppointmentHistory = ({ appointments }) => {
  if (appointments.length === 0) {
    return null;
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {CLIENT_UI_TEXTS.APPOINTMENT_HISTORY}
        </h2>
        <span className="text-sm text-gray-500">
          {appointments.length} {CLIENT_UI_TEXTS.COMPLETED_APPOINTMENTS}
        </span>
      </div>

      <div className="space-y-3">
        {appointments.slice(0, CLIENT_DEFAULT_CONFIG.MAX_APPOINTMENTS_TO_SHOW).map((appointment) => (
          <AppointmentHistoryCard key={appointment.id} appointment={appointment} />
        ))}
      </div>
    </div>
  );
};

const AppointmentHistoryCard = ({ appointment }) => {
  const points = calculatePoints(appointment.totalPrice);

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="h-10 w-10 bg-gray-200 dark:bg-dark-600 rounded-full flex items-center justify-center">
          <FiCalendar className="h-5 w-5 text-gray-500" />
        </div>
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {new Date(appointment.date).toLocaleDateString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {appointment.barberName} • {appointment.time}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className="font-semibold text-green-600">
            S/{appointment.totalPrice?.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">
            +{points} pts
          </div>
        </div>
        {appointment.status === 'completed' && (
          <div className="flex items-center space-x-1">
            <FiStar className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{CLIENT_DEFAULT_CONFIG.DEFAULT_RATING}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentHistory;