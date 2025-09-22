import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { CALENDAR_TEXTS, MAX_APPOINTMENTS_PER_DAY } from '../../constants/receptionCalendar';
import { formatMonthYear, isToday } from '../../utils/receptionCalendarHelpers';
import CalendarDay from './CalendarDay';

const CalendarGrid = ({
  currentDate,
  calendarDays,
  onNavigateMonth,
  onStatusUpdate,
  onMarkAttendance
}) => {
  return (
    <div className="card">
      <CalendarNavigation
        currentDate={currentDate}
        onNavigateMonth={onNavigateMonth}
      />

      <div className="grid grid-cols-7 gap-1">
        <WeekDaysHeader />
        <CalendarDays
          calendarDays={calendarDays}
          onStatusUpdate={onStatusUpdate}
          onMarkAttendance={onMarkAttendance}
        />
      </div>

      <CalendarLegend />
    </div>
  );
};

const CalendarNavigation = ({ currentDate, onNavigateMonth }) => (
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
      {CALENDAR_TEXTS.CALENDAR_TITLE}
    </h2>
    <div className="flex items-center space-x-4">
      <button
        onClick={() => onNavigateMonth(-1)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-600 dark:text-gray-400"
      >
        <FiChevronLeft className="h-5 w-5" />
      </button>
      <span className="text-lg font-medium text-gray-900 dark:text-white min-w-[200px] text-center">
        {formatMonthYear(currentDate)}
      </span>
      <button
        onClick={() => onNavigateMonth(1)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-600 dark:text-gray-400"
      >
        <FiChevronRight className="h-5 w-5" />
      </button>
    </div>
  </div>
);

const WeekDaysHeader = () => (
  <>
    {CALENDAR_TEXTS.DAYS_OF_WEEK.map((day) => (
      <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
        {day}
      </div>
    ))}
  </>
);

const CalendarDays = ({ calendarDays, onStatusUpdate, onMarkAttendance }) => (
  <>
    {calendarDays.map((dayData, index) => (
      <CalendarDayCell
        key={index}
        dayData={dayData}
        onStatusUpdate={onStatusUpdate}
        onMarkAttendance={onMarkAttendance}
      />
    ))}
  </>
);

const CalendarDayCell = ({ dayData, onStatusUpdate, onMarkAttendance }) => (
  <div
    className={`min-h-[120px] p-2 border border-gray-200 dark:border-dark-600 ${
      dayData ? 'bg-white dark:bg-dark-800' : 'bg-gray-50 dark:bg-dark-700'
    }`}
  >
    {dayData && (
      <>
        <DayNumber date={dayData.date} />
        <CalendarDay
          appointments={dayData.appointments}
          maxAppointments={MAX_APPOINTMENTS_PER_DAY}
          onStatusUpdate={onStatusUpdate}
          onMarkAttendance={onMarkAttendance}
        />
      </>
    )}
  </div>
);

const DayNumber = ({ date }) => (
  <div className={`text-sm font-medium mb-2 ${
    isToday(date)
      ? 'text-primary-600 dark:text-primary-400'
      : 'text-gray-900 dark:text-white'
  }`}>
    {date.getDate()}
  </div>
);

const CalendarLegend = () => (
  <div className="mt-6 flex flex-wrap gap-4 text-sm">
    <LegendItem color="bg-yellow-500" label={CALENDAR_TEXTS.STATUS_PENDING} />
    <LegendItem color="bg-blue-500" label={CALENDAR_TEXTS.STATUS_CONFIRMED} />
    <LegendItem color="bg-green-500" label={CALENDAR_TEXTS.STATUS_IN_PROGRESS} />
    <LegendItem color="bg-purple-500" label={CALENDAR_TEXTS.STATUS_COMPLETED} />
    <LegendItem color="bg-red-500" label={CALENDAR_TEXTS.STATUS_CANCELLED} />
  </div>
);

const LegendItem = ({ color, label }) => (
  <div className="flex items-center space-x-2">
    <div className={`w-3 h-3 ${color} rounded`}></div>
    <span className="text-gray-600 dark:text-gray-400">{label}</span>
  </div>
);

export default CalendarGrid;