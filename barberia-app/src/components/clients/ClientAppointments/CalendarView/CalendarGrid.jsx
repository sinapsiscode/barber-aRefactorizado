import CalendarDay from './CalendarDay';
import { DAYS_OF_WEEK } from '../../../../constants/appointments';

/**
 * Grid del calendario con días de la semana y celdas
 * Líneas 253-320 del original
 */
const CalendarGrid = ({ calendarDays, onDayClick, onAppointmentClick }) => {
  return (
    <div className="grid grid-cols-7 gap-1">
      {/* Headers de días de la semana */}
      {DAYS_OF_WEEK.map((day) => (
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
  );
};

export default CalendarGrid;
