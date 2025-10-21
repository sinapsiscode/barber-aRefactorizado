import { FiX, FiUser, FiClock, FiScissors, FiCalendar } from 'react-icons/fi';
import { STATUS_COLORS, STATUS_TEXTS } from '../../../constants/calendar';

/**
 * Modal de vista de día
 */
const DayViewModal = ({
  selectedDay,
  appointments,
  userRole,
  onClose,
  onAppointmentClick,
  onStatusUpdate
}) => {
  if (!selectedDay) return null;

  const isAdmin = userRole === 'super_admin' || userRole === 'branch_admin';
  const sortedAppointments = [...appointments].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{zIndex: 1000}}>
      <div className="bg-white dark:bg-gray-950 rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Programación del {selectedDay.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {appointments.length} citas programadas
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          {sortedAppointments.length > 0 ? (
            <div className="space-y-4">
              {sortedAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onAppointmentClick(appointment)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                        <FiUser className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {appointment.clientName}
                          </h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[appointment.status]}`}>
                            {STATUS_TEXTS[appointment.status]}
                          </span>
                        </div>
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
                            <FiScissors className="h-4 w-4" />
                            <span>{appointment.services?.map(s => `Servicio ${s}`).join(', ') || 'Corte'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="font-medium">S/{appointment.totalPrice?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    {isAdmin && (
                      <div className="flex space-x-2">
                        {appointment.status === 'pending' && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onStatusUpdate(appointment.id, 'confirmed');
                              }}
                              className="text-xs px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onStatusUpdate(appointment.id, 'cancelled');
                              }}
                              className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                            >
                              Cancelar
                            </button>
                          </>
                        )}
                        {appointment.status === 'confirmed' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onStatusUpdate(appointment.id, 'completed');
                            }}
                            className="text-xs px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                          >
                            Completar
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {appointment.notes && (
                    <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-900 rounded text-sm text-gray-600 dark:text-gray-400">
                      <strong>Notas:</strong> {appointment.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FiCalendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No hay citas programadas
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                No se encontraron citas para este día con los filtros aplicados
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayViewModal;
