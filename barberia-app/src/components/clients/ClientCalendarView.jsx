import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import {
  CLIENT_UI_TEXTS,
  CLIENT_CALENDAR_COLORS,
  WEEK_DAYS,
  CLIENT_DEFAULT_CONFIG
} from '../../constants/clientAppointments';
import { isDateInPast } from '../../utils/clientAppointmentHelpers';

const ClientCalendarView = ({
  currentDate,
  calendarDays,
  onNavigateMonth,
  onDayClick,
  onAppointmentClick
}) => {
  return (
    <div className="card">
      {/* Header del Calendario */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {CLIENT_UI_TEXTS.CALENDAR_TITLE}
        </h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onNavigateMonth(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-600 dark:text-gray-400"
          >
            <FiChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-lg font-medium text-gray-900 dark:text-white min-w-[200px] text-center">
            {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => onNavigateMonth(1)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-600 dark:text-gray-400"
          >
            <FiChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Calendario Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Headers de días de la semana */}
        {WEEK_DAYS.map((day) => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}

        {/* Días del calendario */}
        {calendarDays.map((dayData, index) => (
          <CalendarDay
            key={index}
            dayData={dayData}
            onDayClick={onDayClick}
            onAppointmentClick={onAppointmentClick}
          />
        ))}
      </div>

      {/* Leyenda */}
      <CalendarLegend />
    </div>
  );
};

const CalendarDay = ({ dayData, onDayClick, onAppointmentClick }) => {
  if (!dayData) {
    return <div className="min-h-[100px] p-2 border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-700" />;
  }

  const { date, appointments } = dayData;
  const isToday = date.toDateString() === new Date().toDateString();
  const canAddAppointment = appointments.length === 0 && !isDateInPast(date.toISOString().split('T')[0]);

  return (
    <div
      onClick={() => onDayClick(dayData)}
      className={`min-h-[100px] p-2 border border-gray-200 dark:border-dark-600 transition-colors cursor-pointer bg-white dark:bg-dark-800 hover:bg-gray-50 dark:hover:bg-dark-700 ${
        canAddAppointment ? 'hover:ring-2 hover:ring-primary-300 dark:hover:ring-primary-600' : ''
      }`}
    >
      <div className={`text-sm font-medium mb-1 ${
        isToday
          ? 'text-primary-600 dark:text-primary-400'
          : 'text-gray-900 dark:text-white'
      }`}>
        {date.getDate()}
      </div>

      {/* Citas del día */}
      <div className="space-y-1">
        {appointments.slice(0, CLIENT_DEFAULT_CONFIG.MAX_CALENDAR_APPOINTMENTS).map((appointment) => (
          <div
            key={appointment.id}
            onClick={(e) => {
              e.stopPropagation();
              onAppointmentClick(appointment);
            }}
            className={`text-xs p-1 rounded text-white truncate cursor-pointer hover:opacity-80 transition-opacity ${
              CLIENT_CALENDAR_COLORS[appointment.status] || 'bg-gray-500'
            }`}
            title={`${appointment.time} - ${appointment.barberName} - Click para ver detalles`}
          >
            {appointment.time}
          </div>
        ))}
        {appointments.length > CLIENT_DEFAULT_CONFIG.MAX_CALENDAR_APPOINTMENTS && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            +{appointments.length - CLIENT_DEFAULT_CONFIG.MAX_CALENDAR_APPOINTMENTS} más
          </div>
        )}

        {/* Indicador para días sin citas */}
        {canAddAppointment && (
          <div className="text-xs text-center text-gray-400 dark:text-gray-500 py-2 mt-4">
            {CLIENT_UI_TEXTS.ADD_APPOINTMENT}
          </div>
        )}
      </div>
    </div>
  );
};

const CalendarLegend = () => {
  const legendItems = [
    { color: 'bg-blue-500', label: 'Confirmada' },
    { color: 'bg-yellow-500', label: 'Pendiente' },
    { color: 'bg-green-500', label: 'Completada' },
    { color: 'bg-red-500', label: 'Cancelada' }
  ];

  return (
    <div className="mt-6 flex flex-wrap gap-4 text-sm">
      {legendItems.map(({ color, label }) => (
        <div key={label} className="flex items-center space-x-2">
          <div className={`w-3 h-3 ${color} rounded`}></div>
          <span className="text-gray-600 dark:text-gray-400">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default ClientCalendarView;