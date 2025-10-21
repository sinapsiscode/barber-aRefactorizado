import { FiClock, FiUser, FiEye, FiCheckCircle, FiX, FiTrash2 } from 'react-icons/fi';
import { isToday } from '../../../utils/calendar/calendarUtils';
import { MAX_APPOINTMENTS_PER_DAY_PREVIEW } from '../../../constants/calendar';

/**
 * Celda de día del calendario
 */
const CalendarDay = ({
  date,
  appointments,
  userRole,
  onDayClick,
  onAppointmentClick,
  onStatusUpdate,
  onDeleteAppointment
}) => {
  if (!date) {
    return (
      <div className="min-h-24 p-2 border border-[#FFB800]/10 bg-gray-50 dark:bg-black" />
    );
  }

  const isCurrentDay = isToday(date);
  const visibleAppointments = appointments.slice(0, MAX_APPOINTMENTS_PER_DAY_PREVIEW);
  const hasMoreAppointments = appointments.length > MAX_APPOINTMENTS_PER_DAY_PREVIEW;

  const getAppointmentColor = (status) => {
    const colors = {
      confirmed: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      in_progress: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    };
    return colors[status] || colors.pending;
  };

  const isAdmin = userRole === 'super_admin' || userRole === 'branch_admin';

  return (
    <div
      onClick={() => onDayClick(date)}
      className={`min-h-24 p-2 border border-[#FFB800]/10 cursor-pointer transition-all bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary-500/30 hover:shadow-md ${
        isCurrentDay ? 'ring-2 ring-primary-500 shadow-md' : ''
      }`}
    >
      <div className={`text-sm font-bold mb-1 ${
        isCurrentDay ? 'text-primary-500' : 'text-gray-800 dark:text-gray-100'
      }`}>
        {date.getDate()}
      </div>

      <div className="space-y-1">
        {visibleAppointments.map(appointment => (
          <div
            key={appointment.id}
            onClick={(e) => {
              e.stopPropagation();
              onAppointmentClick(appointment);
            }}
            className={`text-xs p-1 rounded truncate relative group cursor-pointer transition-all hover:shadow-sm ${
              getAppointmentColor(appointment.status)
            }`}
            title={`${appointment.time} - ${appointment.clientName} - Click para ver detalles`}
          >
            <div className="flex items-center space-x-1">
              <FiClock className="h-3 w-3" />
              <span>{appointment.time}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FiUser className="h-3 w-3" />
              <span className="truncate">{appointment.clientName}</span>
            </div>

            {/* Quick Actions para admin */}
            {isAdmin && (
              <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-80 rounded hidden group-hover:flex items-center justify-center space-x-1 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAppointmentClick(appointment);
                  }}
                  className="p-1 bg-primary-500 text-white rounded hover:bg-primary-600"
                  title="Ver detalles"
                >
                  <FiEye className="h-3 w-3" />
                </button>
                {appointment.status === 'pending' && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusUpdate(appointment.id, 'confirmed');
                      }}
                      className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                      title="Confirmar"
                    >
                      <FiCheckCircle className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusUpdate(appointment.id, 'cancelled');
                      }}
                      className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                      title="Cancelar"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </>
                )}
                {appointment.status === 'confirmed' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusUpdate(appointment.id, 'completed');
                    }}
                    className="p-1 bg-purple-500 text-white rounded hover:bg-purple-600"
                    title="Completar"
                  >
                    <FiCheckCircle className="h-3 w-3" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteAppointment(appointment.id);
                  }}
                  className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                  title="Eliminar"
                >
                  <FiTrash2 className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        ))}

        {hasMoreAppointments && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onDayClick(date);
            }}
            className="text-xs text-center text-primary-600 dark:text-primary-400 cursor-pointer hover:underline py-1"
          >
            Ver todas ({appointments.length})
          </div>
        )}

        {appointments.length === 0 && (
          <div className="text-xs text-center text-gray-500 dark:text-gray-600 py-2">
            Sin citas
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarDay;
