import PropTypes from 'prop-types';
import { FiDollarSign, FiEye, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { APPOINTMENT_STATUS } from '../../constants/appointmentConstants';

/**
 * Componente para mostrar botones de acción según el estado de la cita y permisos
 */
const AppointmentActionButtons = ({
  appointment,
  permissions,
  onVerifyPayment,
  onViewDetails,
  onApprove,
  onReject
}) => {
  const { status } = appointment;
  const { canVerifyPayment, canApprove, isReception } = permissions;

  // Botón de verificación de pago
  if (status === APPOINTMENT_STATUS.PENDING_PAYMENT && canVerifyPayment) {
    return (
      <button
        onClick={() => onVerifyPayment(appointment)}
        className="text-xs px-2 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 flex items-center space-x-1"
      >
        <FiDollarSign className="h-3 w-3" />
        <span>Verificar</span>
      </button>
    );
  }

  // Botones para citas pendientes de aprobación
  if (status === APPOINTMENT_STATUS.PENDING || status === APPOINTMENT_STATUS.UNDER_REVIEW) {
    // Admins pueden aprobar/rechazar
    if (canApprove) {
      return (
        <div className="flex space-x-1">
          <button
            onClick={() => onViewDetails(appointment)}
            className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center space-x-1"
          >
            <FiEye className="h-3 w-3" />
            <span>Ver</span>
          </button>
          <button
            onClick={() => onApprove(appointment)}
            className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center space-x-1"
          >
            <FiCheckCircle className="h-3 w-3" />
            <span>Aprobar</span>
          </button>
          <button
            onClick={() => onReject(appointment)}
            className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center space-x-1"
          >
            <FiXCircle className="h-3 w-3" />
            <span>Rechazar</span>
          </button>
        </div>
      );
    }

    // Recepción solo puede ver
    if (isReception) {
      return (
        <button
          onClick={() => onViewDetails(appointment)}
          className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center space-x-1"
        >
          <FiEye className="h-3 w-3" />
          <span>Ver Detalles</span>
        </button>
      );
    }
  }

  return null;
};

AppointmentActionButtons.propTypes = {
  appointment: PropTypes.object.isRequired,
  permissions: PropTypes.object.isRequired,
  onVerifyPayment: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired
};

export default AppointmentActionButtons;
