import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import CalendarLegend from './CalendarLegend';

/**
 * Vista completa del calendario
 * Líneas 226-342 del original
 */
const CalendarView = ({
  currentDate,
  calendarDays,
  onNavigateMonth,
  onDayClick,
  onAppointmentClick
}) => {
  return (
    <div className="card">
      <CalendarHeader
        currentDate={currentDate}
        onNavigate={onNavigateMonth}
      />

      <CalendarGrid
        calendarDays={calendarDays}
        onDayClick={onDayClick}
        onAppointmentClick={onAppointmentClick}
      />

      <CalendarLegend />
    </div>
  );
};

export default CalendarView;
