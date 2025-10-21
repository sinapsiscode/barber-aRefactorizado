import { getCalendarColor } from '../../../../utils/clients/appointmentUI';
import { isToday, isFutureOrToday } from '../../../../utils/clients/calendarHelpers';
import { DEFAULTS } from '../../../../constants/appointments';

/**
 * Celda individual del calendario
 * Líneas 262-319 del original
 */
const CalendarDay = ({ dayData, onDayClick, onAppointmentClick }) => {
  if (!dayData) {
    // Día vacío del mes anterior
    return (
      <div className="min-h-[100px] p-2 border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700" />
    );
  }

  const { date, appointments } = dayData;
  const showAddIndicator = appointments.length === 0 && isFutureOrToday(date);
  const hasRingHover = showAddIndicator;

  return (
    <div
      onClick={() => onDayClick(dayData)}
      className={`min-h-[100px] p-2 border border-gray-200 dark:border-dark-600 transition-colors bg-white dark:bg-dark-800 hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer ${
        hasRingHover ? 'hover:ring-2 hover:ring-primary-300 dark:hover:ring-primary-600' : ''
      }`}
    >
      {/* Número del día */}
      <div className={`text-sm font-medium mb-1 ${
        isToday(date)
          ? 'text-primary-600 dark:text-primary-400'
          : 'text-gray-900 dark:text-white'
      }`}>
        {date.getDate()}
      </div>

      {/* Citas del día */}
      <div className="space-y-1">
        {/* Mostrar máximo 2 citas */}
        {appointments.slice(0, DEFAULTS.MAX_CALENDAR_APPOINTMENTS_VISIBLE).map((appointment) => (
          <div
            key={appointment.id}
            onClick={(e) => {
              e.stopPropagation();
              onAppointmentClick(appointment);
            }}
            className={`text-xs p-1 rounded text-white truncate cursor-pointer hover:opacity-80 transition-opacity ${getCalendarColor(appointment.status)}`}
            title={`${appointment.time} - ${appointment.barberName} - Click para ver detalles`}
          >
            {appointment.time}
          </div>
        ))}

        {/* Indicador +X más */}
        {appointments.length > DEFAULTS.MAX_CALENDAR_APPOINTMENTS_VISIBLE && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            +{appointments.length - DEFAULTS.MAX_CALENDAR_APPOINTMENTS_VISIBLE} más
          </div>
        )}

        {/* Indicador "Agregar cita" */}
        {showAddIndicator && (
          <div className="text-xs text-center text-gray-400 dark:text-gray-500 py-2 mt-4">
            + Agregar cita
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarDay;
