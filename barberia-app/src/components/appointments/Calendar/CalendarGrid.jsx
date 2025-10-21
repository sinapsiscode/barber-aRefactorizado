import CalendarDay from './CalendarDay';
import DaysHeader from './DaysHeader';

/**
 * Grid del calendario
 */
const CalendarGrid = ({
  days,
  getAppointmentsForDay,
  userRole,
  onDayClick,
  onAppointmentClick,
  onStatusUpdate,
  onDeleteAppointment
}) => {
  return (
    <>
      <DaysHeader />
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => (
          <CalendarDay
            key={index}
            date={date}
            appointments={getAppointmentsForDay(date)}
            userRole={userRole}
            onDayClick={onDayClick}
            onAppointmentClick={onAppointmentClick}
            onStatusUpdate={onStatusUpdate}
            onDeleteAppointment={onDeleteAppointment}
          />
        ))}
      </div>
    </>
  );
};

export default CalendarGrid;
