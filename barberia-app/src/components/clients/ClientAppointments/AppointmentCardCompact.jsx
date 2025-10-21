import { FiCalendar, FiStar } from 'react-icons/fi';
import { formatShortDate } from '../../../utils/clients/appointmentUI';
import { calculateLoyaltyPoints } from '../../../utils/clients/appointmentFilters';
import { DEFAULTS, APPOINTMENT_STATUS } from '../../../constants/appointments';

/**
 * Card compacto de cita para historial
 * Líneas 459-489 del original
 */
const AppointmentCardCompact = ({ appointment }) => {
  const isCompleted = appointment.status === APPOINTMENT_STATUS.COMPLETED;
  const loyaltyPoints = calculateLoyaltyPoints(appointment.totalPrice, DEFAULTS.LOYALTY_POINTS_DIVISOR);

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
      <div className="flex items-center space-x-4">
        {/* Icono */}
        <div className="h-10 w-10 bg-gray-200 dark:bg-dark-600 rounded-full flex items-center justify-center">
          <FiCalendar className="h-5 w-5 text-gray-500" />
        </div>
        <div>
          {/* Fecha */}
          <div className="font-medium text-gray-900 dark:text-white">
            {formatShortDate(appointment.date)}
          </div>
          {/* Barbero y hora */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {appointment.barberName} • {appointment.time}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Precio y puntos */}
        <div className="text-right">
          <div className="font-semibold text-green-600">
            S/{appointment.totalPrice?.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">
            +{loyaltyPoints} pts
          </div>
        </div>

        {/* Rating - solo si completada */}
        {isCompleted && (
          <div className="flex items-center space-x-1">
            <FiStar className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{DEFAULTS.RATING}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCardCompact;
