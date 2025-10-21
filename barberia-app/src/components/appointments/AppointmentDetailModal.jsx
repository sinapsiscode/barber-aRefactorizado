import PropTypes from 'prop-types';
import { FiX, FiUser, FiCalendar, FiScissors, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import AppointmentStatusBadge from './AppointmentStatusBadge';
import { APPOINTMENT_STATUS } from '../../constants/appointmentConstants';

/**
 * Modal para mostrar detalles completos de una cita
 */
const AppointmentDetailModal = ({
  appointment,
  permissions,
  onClose,
  onApprove,
  onReject
}) => {
  if (!appointment) return null;

  const { canApprove } = permissions;
  const isPending = appointment.status === APPOINTMENT_STATUS.PENDING ||
                    appointment.status === APPOINTMENT_STATUS.UNDER_REVIEW;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white dark:bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-white dark:bg-dark-800 px-6 py-4 border-b border-gray-200 dark:border-dark-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Detalle de Cita
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Información del Cliente */}
            <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <FiUser className="h-4 w-4 mr-2" />
                Información del Cliente
              </h4>
              <div className="space-y-2 text-sm">
                <p><strong>Nombre:</strong> {appointment.clientName}</p>
                <p><strong>Teléfono:</strong> {appointment.clientPhone || 'No especificado'}</p>
                <p><strong>Email:</strong> {appointment.clientEmail || 'No especificado'}</p>
              </div>
            </div>

            {/* Información de la Cita */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <FiCalendar className="h-4 w-4 mr-2" />
                Detalles de la Cita
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Fecha:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                  <p><strong>Hora:</strong> {appointment.time}</p>
                  <p><strong>Duración:</strong> {appointment.duration} min</p>
                </div>
                <div>
                  <p><strong>Barbero:</strong> {appointment.barberName}</p>
                  <p><strong>Precio Total:</strong> S/{appointment.totalPrice}</p>
                  <p className="flex items-center">
                    <strong>Estado:</strong>
                    <AppointmentStatusBadge status={appointment.status} className="ml-2" />
                  </p>
                </div>
              </div>
            </div>

            {/* Servicios Solicitados */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <FiScissors className="h-4 w-4 mr-2" />
                Servicios Solicitados
              </h4>
              <div className="space-y-2">
                {appointment.services?.map((serviceId, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>Servicio {serviceId}</span>
                    <span>S/{(appointment.totalPrice / appointment.services.length).toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notas */}
            {appointment.notes && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Notas Especiales</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">{appointment.notes}</p>
              </div>
            )}

            {/* Información de Revisión */}
            {appointment.reviewData && (
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Información de Revisión</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Revisado por:</strong> {appointment.reviewData.reviewedBy}</p>
                  <p><strong>Fecha:</strong> {new Date(appointment.reviewData.reviewedAt).toLocaleString()}</p>
                  {appointment.reviewData.notes && (
                    <p><strong>Notas:</strong> {appointment.reviewData.notes}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="bg-gray-50 dark:bg-dark-700 px-6 py-4 flex justify-end space-x-3">
            <button onClick={onClose} className="btn-secondary">
              Cerrar
            </button>

            {isPending && canApprove && (
              <>
                <button
                  onClick={() => {
                    onClose();
                    onApprove(appointment);
                  }}
                  className="btn-primary bg-green-600 hover:bg-green-700"
                >
                  <FiCheckCircle className="h-4 w-4 mr-2" />
                  Aprobar
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onReject(appointment);
                  }}
                  className="btn-primary bg-red-600 hover:bg-red-700"
                >
                  <FiXCircle className="h-4 w-4 mr-2" />
                  Rechazar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

AppointmentDetailModal.propTypes = {
  appointment: PropTypes.object,
  permissions: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired
};

export default AppointmentDetailModal;
