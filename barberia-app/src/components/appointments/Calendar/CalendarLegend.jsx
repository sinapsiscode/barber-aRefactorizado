import { CALENDAR_LEGEND } from '../../../constants/calendar';

/**
 * Leyenda del calendario
 */
const CalendarLegend = () => {
  return (
    <div className="mt-4 flex items-center space-x-6 text-sm">
      {CALENDAR_LEGEND.map(({ color, label, status }) => (
        <div key={status} className="flex items-center space-x-2">
          <div className={`w-3 h-3 ${color} rounded`}></div>
          <span className="text-gray-600 dark:text-gray-400">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default CalendarLegend;
