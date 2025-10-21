import { FiCalendar, FiClock, FiUser, FiMapPin } from 'react-icons/fi';
import { getStatusColor, getStatusText, formatLongDate, formatServices } from '../../../utils/clients/appointmentUI';
import { DEFAULTS } from '../../../constants/appointments';

/**
 * Card de cita individual para vista de lista
 * Líneas 359-428 del original
 */
const AppointmentCard = ({ appointment, onCancel }) => {
  const canCancel = appointment.status === 'pending';
  const isConfirmed = appointment.status === 'confirmed';

  return (
    <div className="border border-gray-200 dark:border-dark-600 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Icono */}
          <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
            <FiCalendar className="h-8 w-8 text-primary-600" />
          </div>

          <div>
            {/* Fecha y Estado */}
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatLongDate(appointment.date)}
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                {getStatusText(appointment.status)}
              </span>
            </div>

            {/* Hora, Barbero, Sede */}
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
                <span>{DEFAULTS.BRANCH_NAME}</span>
              </div>
            </div>

            {/* Servicios, Duración, Precio */}
            <div className="mt-2">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Servicios: {formatServices(appointment.services)}
              </span>
              <span className="text-sm text-gray-500 ml-2">
                • {appointment.duration || DEFAULTS.DURATION} min • S/{appointment.totalPrice?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col space-y-2">
          {canCancel && (
            <button
              onClick={() => onCancel(appointment.id)}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Cancelar
            </button>
          )}
          {isConfirmed && (
            <div className="text-sm text-green-600 font-medium">
              ✓ Confirmada
            </div>
          )}
        </div>
      </div>

      {/* Notas */}
      {appointment.notes && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Notas:</strong> {appointment.notes}
          </p>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
