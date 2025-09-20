import { FiX, FiCalendar, FiUser, FiClock, FiStar, FiMapPin } from 'react-icons/fi';
import {
  CLIENT_UI_TEXTS,
  CLIENT_BUTTON_TEXTS,
  APPOINTMENT_DETAIL_TEXTS,
  CLIENT_DEFAULT_CONFIG
} from '../../constants/clientAppointments';
import {
  getClientStatusColor,
  getClientStatusText,
  formatClientAppointmentDate,
  formatAppointmentServices,
  canCancelAppointment
} from '../../utils/clientAppointmentHelpers';

const AppointmentDetailsModal = ({
  appointment,
  onClose,
  onCancelAppointment
}) => {
  if (!appointment) return null;

  const handleCancelAndClose = () => {
    onCancelAppointment(appointment.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-800 rounded-lg p-6 max-w-lg w-full mx-4">
        <AppointmentModalHeader onClose={onClose} />
        <AppointmentModalContent appointment={appointment} />
        <AppointmentModalActions
          appointment={appointment}
          onCancel={handleCancelAndClose}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

const AppointmentModalHeader = ({ onClose }) => (
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
      {CLIENT_UI_TEXTS.APPOINTMENT_DETAILS}
    </h3>
    <button
      onClick={onClose}
      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
    >
      <FiX className="h-5 w-5" />
    </button>
  </div>
);

const AppointmentModalContent = ({ appointment }) => (
  <div className="space-y-4">
    <AppointmentDetailItem
      icon={FiCalendar}
      title={formatClientAppointmentDate(appointment.date)}
      subtitle={appointment.time}
      colorClass="bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400"
    />

    <AppointmentDetailItem
      icon={FiUser}
      title={appointment.barberName}
      subtitle={APPOINTMENT_DETAIL_TEXTS.BARBER}
    />

    <AppointmentDetailItem
      icon={FiClock}
      content={
        <span className={`px-2 py-1 text-sm font-medium rounded-full ${getClientStatusColor(appointment.status)}`}>
          {getClientStatusText(appointment.status)}
        </span>
      }
    />

    <AppointmentDetailItem
      icon={FiStar}
      title={APPOINTMENT_DETAIL_TEXTS.SERVICES}
      subtitle={formatAppointmentServices(appointment.services)}
      description={`${APPOINTMENT_DETAIL_TEXTS.DURATION}: ${appointment.duration || CLIENT_DEFAULT_CONFIG.APPOINTMENT_DURATION} ${APPOINTMENT_DETAIL_TEXTS.MINUTES} • ${APPOINTMENT_DETAIL_TEXTS.PRICE}: S/${appointment.totalPrice?.toLocaleString()}`}
    />

    <AppointmentDetailItem
      icon={FiMapPin}
      title={APPOINTMENT_DETAIL_TEXTS.MAIN_BRANCH}
      subtitle={APPOINTMENT_DETAIL_TEXTS.LOCATION}
    />

    {appointment.notes && (
      <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
        <div className="font-medium text-gray-900 dark:text-white mb-1">
          {APPOINTMENT_DETAIL_TEXTS.NOTES}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {appointment.notes}
        </div>
      </div>
    )}
  </div>
);

const AppointmentDetailItem = ({
  icon: Icon,
  title,
  subtitle,
  description,
  content,
  colorClass = "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
}) => (
  <div className="flex items-start space-x-3">
    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${colorClass}`}>
      <Icon className="h-5 w-5" />
    </div>
    <div>
      {content ? (
        content
      ) : (
        <>
          {title && (
            <div className="font-medium text-gray-900 dark:text-white">
              {title}
            </div>
          )}
          {subtitle && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </div>
          )}
          {description && (
            <div className="text-sm text-gray-500 mt-1">
              {description}
            </div>
          )}
        </>
      )}
    </div>
  </div>
);

const AppointmentModalActions = ({ appointment, onCancel, onClose }) => (
  <div className="mt-6 flex space-x-3">
    {canCancelAppointment(appointment) && (
      <button
        onClick={onCancel}
        className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
      >
        {CLIENT_BUTTON_TEXTS.CANCEL_APPOINTMENT}
      </button>
    )}
    <button
      onClick={onClose}
      className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
    >
      {CLIENT_BUTTON_TEXTS.CLOSE}
    </button>
  </div>
);

export default AppointmentDetailsModal;