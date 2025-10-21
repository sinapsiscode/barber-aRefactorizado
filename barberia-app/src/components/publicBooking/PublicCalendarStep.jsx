import DateTimeCalendar from './DateTimeCalendar';
import TimeSlotSelector from './TimeSlotSelector';

/**
 * Paso 1: Selección de fecha y hora
 */
const PublicCalendarStep = ({
  currentDate,
  selectedDate,
  selectedTime,
  days,
  totalDuration,
  onNavigateMonth,
  onDateSelect,
  onTimeSelect,
  onProceed,
  isDateSelected,
  isCurrentMonth
}) => {
  return (
    <div className="flex flex-col lg:flex-row">
      {/* Panel Izquierdo - Información y Calendario */}
      <DateTimeCalendar
        currentDate={currentDate}
        selectedDate={selectedDate}
        days={days}
        totalDuration={totalDuration}
        onNavigateMonth={onNavigateMonth}
        onDateSelect={onDateSelect}
        isDateSelected={isDateSelected}
        isCurrentMonth={isCurrentMonth}
      />

      {/* Panel Derecho - Horarios */}
      <TimeSlotSelector
        selectedTime={selectedTime}
        onTimeSelect={onTimeSelect}
        onProceed={onProceed}
      />
    </div>
  );
};

export default PublicCalendarStep;
