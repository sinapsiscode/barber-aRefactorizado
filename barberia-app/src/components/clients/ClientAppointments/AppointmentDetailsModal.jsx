import { FiX, FiCalendar, FiUser, FiClock, FiStar, FiMapPin } from 'react-icons/fi';
import { getStatusColor, getStatusText, formatLongDate, formatServices } from '../../../utils/clients/appointmentUI';
import { DEFAULTS } from '../../../constants/appointments';

/**
 * Modal con detalles completos de una cita
 * Líneas 514-652 del original
 */
const AppointmentDetailsModal = ({
  appointment,
  onClose,
  onCancel
}) => {
  if (!appointment) return null;

  const canCancel = appointment.status === 'pending' && new Date(appointment.date) > new Date();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-800 rounded-lg p-6 max-w-lg w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Detalles de la Cita
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Fecha y Hora */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <FiCalendar className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {formatLongDate(appointment.date)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {appointment.time}
              </div>
            </div>
          </div>

          {/* Barbero */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <FiUser className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {appointment.barberName}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Barbero
              </div>
            </div>
          </div>

          {/* Estado */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <FiClock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <span className={`px-2 py-1 text-sm font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                {getStatusText(appointment.status)}
              </span>
            </div>
          </div>

          {/* Servicios */}
          <div className="flex items-start space-x-3">
            <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <FiStar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white mb-1">
                Servicios
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {formatServices(appointment.services)}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Duración: {appointment.duration || DEFAULTS.DURATION} min • Precio: S/{appointment.totalPrice?.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Sede */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <FiMapPin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {DEFAULTS.BRANCH_NAME}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Ubicación
              </div>
            </div>
          </div>

          {/* Notas */}
          {appointment.notes && (
            <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <div className="font-medium text-gray-900 dark:text-white mb-1">
                Notas
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {appointment.notes}
              </div>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="mt-6 flex space-x-3">
          {canCancel && (
            <button
              onClick={() => {
                onCancel(appointment.id);
                onClose();
              }}
              className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Cancelar Cita
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;
