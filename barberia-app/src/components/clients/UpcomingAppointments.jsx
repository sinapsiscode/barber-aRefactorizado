import { FiCalendar, FiClock, FiUser, FiMapPin } from 'react-icons/fi';
import { EmptyState } from '../common';
import {
  CLIENT_UI_TEXTS,
  CLIENT_BUTTON_TEXTS,
  CLIENT_DEFAULT_CONFIG
} from '../../constants/clientAppointments';
import {
  getClientStatusColor,
  getClientStatusText,
  formatClientAppointmentDate,
  formatAppointmentServices,
  canCancelAppointment
} from '../../utils/clientAppointmentHelpers';

const UpcomingAppointments = ({
  appointments,
  onCancelAppointment,
  onNewAppointment
}) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {CLIENT_UI_TEXTS.UPCOMING_APPOINTMENTS}
        </h2>
        <FiCalendar className="h-5 w-5 text-gray-400" />
      </div>

      {appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <UpcomingAppointmentCard
              key={appointment.id}
              appointment={appointment}
              onCancelAppointment={onCancelAppointment}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FiCalendar}
          title={CLIENT_UI_TEXTS.NO_UPCOMING_APPOINTMENTS}
          description={CLIENT_UI_TEXTS.NO_UPCOMING_SUBTITLE}
          action={
            <button onClick={onNewAppointment} className="btn-primary">
              {CLIENT_UI_TEXTS.BOOK_NOW}
            </button>
          }
        />
      )}
    </div>
  );
};

const UpcomingAppointmentCard = ({ appointment, onCancelAppointment }) => {
  return (
    <div className="border border-gray-200 dark:border-dark-600 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
            <FiCalendar className="h-8 w-8 text-primary-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatClientAppointmentDate(appointment.date)}
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getClientStatusColor(appointment.status)}`}>
                {getClientStatusText(appointment.status)}
              </span>
            </div>
            <AppointmentDetails appointment={appointment} />
            <AppointmentServices appointment={appointment} />
          </div>
        </div>

        <AppointmentActions
          appointment={appointment}
          onCancelAppointment={onCancelAppointment}
        />
      </div>

      {appointment.notes && (
        <AppointmentNotes notes={appointment.notes} />
      )}
    </div>
  );
};

const AppointmentDetails = ({ appointment }) => (
  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
    <div className="flex items-center space-x-1">
      <FiClock className="h-4 w-4" />
      <span>{appointment.time}</span>
    </div>
    <div className="flex items-center space-x-1">
      <FiUser className="h-4 w-4" />
      <span>{appointment.barberName}</span>
    </div>
    <div className="flex items-center space-x-1">
      <FiMapPin className="h-4 w-4" />
      <span>Sede Principal</span>
    </div>
  </div>
);

const AppointmentServices = ({ appointment }) => (
  <div className="mt-2">
    <span className="text-sm font-medium text-gray-900 dark:text-white">
      Servicios: {formatAppointmentServices(appointment.services)}
    </span>
    <span className="text-sm text-gray-500 ml-2">
      • {appointment.duration || CLIENT_DEFAULT_CONFIG.APPOINTMENT_DURATION} min • S/{appointment.totalPrice?.toLocaleString()}
    </span>
  </div>
);

const AppointmentActions = ({ appointment, onCancelAppointment }) => (
  <div className="flex flex-col space-y-2">
    {canCancelAppointment(appointment) && (
      <button
        onClick={() => onCancelAppointment(appointment.id)}
        className="text-sm text-red-600 hover:text-red-800 font-medium"
      >
        {CLIENT_BUTTON_TEXTS.CANCEL}
      </button>
    )}
    {appointment.status === 'confirmed' && (
      <div className="text-sm text-green-600 font-medium">
        {CLIENT_BUTTON_TEXTS.CONFIRMED}
      </div>
    )}
  </div>
);

const AppointmentNotes = ({ notes }) => (
  <div className="mt-4 p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
    <p className="text-sm text-gray-600 dark:text-gray-400">
      <strong>Notas:</strong> {notes}
    </p>
  </div>
);

export default UpcomingAppointments;