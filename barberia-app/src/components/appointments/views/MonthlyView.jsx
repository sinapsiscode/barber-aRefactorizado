import { WEEK_DAYS, CALENDAR_STATUS_COLORS, UI_TEXTS } from '../../../constants/barberAppointments';
import { getMonthDates, getAppointmentsForDate } from '../../../utils/appointmentHelpers';

const MonthlyView = ({ currentDate, appointments, onDateSelect }) => {
  const monthDates = getMonthDates(currentDate);
  const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-600">
      <div className="p-4 border-b border-gray-200 dark:border-dark-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {UI_TEXTS.MONTHLY_CALENDAR}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
          {monthName}
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
        {monthDates.map((date, index) => {
          const dayAppointments = getAppointmentsForDate(appointments, date);
          const isToday = date.toDateString() === new Date().toDateString();
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();

          return (
            <MonthDay
              key={index}
              date={date}
              appointments={dayAppointments}
              isToday={isToday}
              isCurrentMonth={isCurrentMonth}
              onDateSelect={onDateSelect}
            />
          );
        })}
      </div>
    </div>
  );
};

const MonthDay = ({ date, appointments, isToday, isCurrentMonth, onDateSelect }) => {
  return (
    <div
      className={`min-h-[100px] p-2 border-r border-b border-gray-200 dark:border-dark-600 last:border-r-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors ${
        isToday ? 'bg-primary-50 dark:bg-primary-900/20' : ''
      } ${!isCurrentMonth ? 'bg-gray-50 dark:bg-dark-900' : ''}`}
      onClick={() => onDateSelect && onDateSelect(date)}
    >
      <div className={`text-sm font-medium mb-1 ${
        isToday
          ? 'text-primary-600 dark:text-primary-400'
          : isCurrentMonth
          ? 'text-gray-900 dark:text-white'
          : 'text-gray-400 dark:text-gray-600'
      }`}>
        {date.getDate()}
      </div>

      <div className="space-y-1">
        {appointments.slice(0, 2).map((appointment, index) => (
          <div
            key={index}
            className={`text-xs p-1 rounded text-white ${
              CALENDAR_STATUS_COLORS[appointment.status] || 'bg-gray-500'
            }`}
          >
            {appointment.time}
          </div>
        ))}

        {appointments.length > 2 && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            +{appointments.length - 2}
          </div>
        )}

        {appointments.length > 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {appointments.length} {UI_TEXTS.SCHEDULED_APPOINTMENTS}
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyView;