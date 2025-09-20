import { WEEK_DAYS, CALENDAR_STATUS_COLORS, UI_TEXTS } from '../../../constants/barberAppointments';
import { getWeekDates, getAppointmentsForDate } from '../../../utils/appointmentHelpers';

const WeeklyView = ({ currentDate, appointments, onDateSelect }) => {
  const weekDates = getWeekDates(currentDate);

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-600">
      <div className="p-4 border-b border-gray-200 dark:border-dark-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {UI_TEXTS.WEEKLY_CALENDAR}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {UI_TEXTS.WEEK_OF} {weekDates[0].toLocaleDateString('es-ES')}
        </p>
      </div>

      <div className="grid grid-cols-7 gap-0 border-b border-gray-200 dark:border-dark-600">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="p-3 text-center font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-dark-600 last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0">
        {weekDates.map((date, index) => {
          const dayAppointments = getAppointmentsForDate(appointments, date);
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <WeekDay
              key={index}
              date={date}
              appointments={dayAppointments}
              isToday={isToday}
              onDateSelect={onDateSelect}
            />
          );
        })}
      </div>
    </div>
  );
};

const WeekDay = ({ date, appointments, isToday, onDateSelect }) => {
  return (
    <div
      className={`min-h-[120px] p-2 border-r border-b border-gray-200 dark:border-dark-600 last:border-r-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors ${
        isToday ? 'bg-primary-50 dark:bg-primary-900/20' : ''
      }`}
      onClick={() => onDateSelect && onDateSelect(date)}
    >
      <div className={`text-sm font-medium mb-2 ${
        isToday ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'
      }`}>
        {date.getDate()}
      </div>

      <div className="space-y-1">
        {appointments.slice(0, 3).map((appointment, index) => (
          <div
            key={index}
            className={`text-xs p-1 rounded text-white ${
              CALENDAR_STATUS_COLORS[appointment.status] || 'bg-gray-500'
            }`}
          >
            {appointment.time} {appointment.clientName}
          </div>
        ))}

        {appointments.length > 3 && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            +{appointments.length - 3} más
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyView;