import { FiX, FiUser, FiClock, FiCheckCircle } from 'react-icons/fi';
import { STATUS_COLORS, STATUS_TEXTS } from '../../../constants/calendar';

/**
 * Modal de detalles de cita
 */
const AppointmentDetailModal = ({
  appointment,
  userRole,
  onClose,
  onStatusUpdate,
  onDeleteAppointment
}) => {
  if (!appointment) return null;

  const isAdmin = userRole === 'super_admin' || userRole === 'branch_admin';

  const handleActionAndClose = async (action) => {
    await action();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center" style={{zIndex: 9999}}>
      <div className="bg-white dark:bg-gray-950 rounded-lg p-6 max-w-lg w-full mx-4">
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
          {/* Cliente */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
              <FiUser className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {appointment.clientName}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Cliente
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

          {/* Fecha y Hora */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <FiClock className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {new Date(appointment.date).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {appointment.time}
              </div>
            </div>
          </div>

          {/* Estado */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <FiCheckCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <span className={`px-2 py-1 text-sm font-medium rounded-full ${STATUS_COLORS[appointment.status]}`}>
                {STATUS_TEXTS[appointment.status]}
              </span>
            </div>
          </div>

          {/* Servicios y Precio */}
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="font-medium text-gray-900 dark:text-white mb-2">
              Servicios
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {appointment.services?.map(s => `Servicio ${s}`).join(', ') || 'Corte'}
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium">Total:</span>
              <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                S/{appointment.totalPrice?.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Notas */}
          {appointment.notes && (
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
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
        {isAdmin && (
          <div className="mt-6 flex space-x-3">
            {appointment.status === 'pending' && (
              <>
                <button
                  onClick={() => handleActionAndClose(() => onStatusUpdate(appointment.id, 'confirmed'))}
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => handleActionAndClose(() => onStatusUpdate(appointment.id, 'cancelled'))}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Cancelar
                </button>
              </>
            )}
            {appointment.status === 'confirmed' && (
              <button
                onClick={() => handleActionAndClose(() => onStatusUpdate(appointment.id, 'completed'))}
                className="flex-1 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
              >
                Marcar Completada
              </button>
            )}
            <button
              onClick={() => handleActionAndClose(() => onDeleteAppointment(appointment.id))}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Eliminar
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetailModal;
