import { FiClock, FiUser, FiEye, FiCheckCircle, FiX, FiTrash2 } from 'react-icons/fi';
import { useAuthStore } from '../../stores';
import { APPOINTMENT_STATUS_COLORS, APPOINTMENT_ACTIONS } from '../../constants/appointments';

const AppointmentItem = ({
  appointment,
  onClick,
  onStatusUpdate,
  onDelete,
  showQuickActions = false,
  className = ''
}) => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'super_admin' || user?.role === 'branch_admin';

  const getStatusColor = (status) => {
    return APPOINTMENT_STATUS_COLORS[status] || APPOINTMENT_STATUS_COLORS.pending;
  };

  const handleActionClick = (e, action, ...args) => {
    e.stopPropagation();
    action(...args);
  };

  return (
    <div
      onClick={() => onClick(appointment)}
      className={`text-xs p-1 rounded truncate relative group cursor-pointer transition-all hover:shadow-sm ${getStatusColor(appointment.status)} ${className}`}
      title={`${appointment.time} - ${appointment.clientName} - Click para ver detalles`}
    >
      <div className="flex items-center space-x-1">
        <FiClock className="h-3 w-3 flex-shrink-0" />
        <span className="font-medium">{appointment.time}</span>
      </div>
      <div className="flex items-center space-x-1">
        <FiUser className="h-3 w-3 flex-shrink-0" />
        <span className="truncate">{appointment.clientName}</span>
      </div>

      {/* Quick Actions para admin */}
      {showQuickActions && isAdmin && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-80 rounded hidden group-hover:flex items-center justify-center space-x-1 z-10">
          <button
            onClick={(e) => handleActionClick(e, onClick, appointment)}
            className="p-1 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
            title={APPOINTMENT_ACTIONS.VIEW}
          >
            <FiEye className="h-3 w-3" />
          </button>

          {appointment.status === 'pending' && (
            <>
              <button
                onClick={(e) => handleActionClick(e, onStatusUpdate, appointment.id, 'confirmed')}
                className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                title={APPOINTMENT_ACTIONS.CONFIRM}
              >
                <FiCheckCircle className="h-3 w-3" />
              </button>
              <button
                onClick={(e) => handleActionClick(e, onStatusUpdate, appointment.id, 'cancelled')}
                className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                title={APPOINTMENT_ACTIONS.CANCEL}
              >
                <FiX className="h-3 w-3" />
              </button>
            </>
          )}

          {appointment.status === 'confirmed' && (
            <button
              onClick={(e) => handleActionClick(e, onStatusUpdate, appointment.id, 'completed')}
              className="p-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
              title={APPOINTMENT_ACTIONS.COMPLETE}
            >
              <FiCheckCircle className="h-3 w-3" />
            </button>
          )}

          <button
            onClick={(e) => handleActionClick(e, onDelete, appointment.id)}
            className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            title={APPOINTMENT_ACTIONS.DELETE}
          >
            <FiTrash2 className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentItem;