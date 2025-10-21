import PropTypes from 'prop-types';
import { FiUser, FiCalendar, FiScissors, FiDollarSign, FiEye, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import AppointmentStatusBadge from './AppointmentStatusBadge';

/**
 * Tarjeta expandida para mostrar detalles de una cita
 * Usada principalmente en la vista de recepción
 */
const AppointmentCard = ({ appointment, permissions, onViewDetails, onApprove, onReject }) => {
  const { canApprove, isReception } = permissions;

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <FiUser className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              {appointment.clientName}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {appointment.clientPhone || 'Sin teléfono'} • {appointment.clientEmail || 'Sin email'}
            </p>
          </div>
        </div>
        <AppointmentStatusBadge status={appointment.status} />
      </div>

      {/* Detalles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
        {/* Fecha y Hora */}
        <div className="space-y-2">
          <h5 className="font-medium text-gray-900 dark:text-white flex items-center">
            <FiCalendar className="h-4 w-4 mr-2" />
            Fecha y Hora
          </h5>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {new Date(appointment.date).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <p className="text-lg font-semibold text-blue-600">
            {appointment.time}
          </p>
        </div>

        {/* Servicio y Barbero */}
        <div className="space-y-2">
          <h5 className="font-medium text-gray-900 dark:text-white flex items-center">
            <FiScissors className="h-4 w-4 mr-2" />
            Servicio y Barbero
          </h5>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {appointment.barberName}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Duración: {appointment.duration} min
          </p>
        </div>

        {/* Precio */}
        <div className="space-y-2">
          <h5 className="font-medium text-gray-900 dark:text-white flex items-center">
            <FiDollarSign className="h-4 w-4 mr-2" />
            Precio Total
          </h5>
          <p className="text-2xl font-bold text-green-600">
            S/{appointment.totalPrice}
          </p>
        </div>
      </div>

      {/* Notas especiales */}
      {appointment.notes && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
          <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
            Notas Especiales:
          </h5>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            {appointment.notes}
          </p>
        </div>
      )}

      {/* Acciones */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => onViewDetails(appointment)}
          className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 flex items-center space-x-2"
        >
          <FiEye className="h-4 w-4" />
          <span>Ver Detalles</span>
        </button>

        {canApprove && (
          <>
            <button
              onClick={() => onReject(appointment)}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 flex items-center space-x-2"
            >
              <FiXCircle className="h-4 w-4" />
              <span>Rechazar</span>
            </button>
            <button
              onClick={() => onApprove(appointment)}
              className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 flex items-center space-x-2"
            >
              <FiCheckCircle className="h-4 w-4" />
              <span>Aprobar Reserva</span>
            </button>
          </>
        )}

        {isReception && !canApprove && (
          <div className="px-4 py-2 text-sm text-gray-600 bg-gray-50 rounded-md italic">
            Solo el Administrador de Sede puede aprobar/rechazar reservas
          </div>
        )}
      </div>
    </div>
  );
};

AppointmentCard.propTypes = {
  appointment: PropTypes.object.isRequired,
  permissions: PropTypes.object.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired
};

export default AppointmentCard;
