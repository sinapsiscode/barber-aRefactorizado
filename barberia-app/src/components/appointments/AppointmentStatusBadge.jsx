import PropTypes from 'prop-types';
import { APPOINTMENT_STATUS_COLORS, APPOINTMENT_STATUS_LABELS } from '../../constants/appointmentConstants';

/**
 * Componente Badge para mostrar el estado de una cita
 * @param {string} status - Estado de la cita
 * @param {string} className - Clases CSS adicionales
 */
const AppointmentStatusBadge = ({ status, className = '' }) => {
  const colorClass = APPOINTMENT_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
  const label = APPOINTMENT_STATUS_LABELS[status] || status;

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass} ${className}`}>
      {label}
    </span>
  );
};

AppointmentStatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default AppointmentStatusBadge;
