import { DAYS_OF_WEEK } from '../../../constants/calendar';

/**
 * Header con los días de la semana
 */
const DaysHeader = () => {
  return (
    <div className="grid grid-cols-7 gap-1 mb-2 bg-gradient-to-r from-primary-500/10 to-primary-400/10 dark:from-primary-500/20 dark:to-primary-400/20 rounded-lg p-2">
      {DAYS_OF_WEEK.map(day => (
        <div key={day} className="p-3 text-center text-sm font-semibold uppercase tracking-wider text-primary-500 dark:text-primary-400">
          {day}
        </div>
      ))}
    </div>
  );
};

export default DaysHeader;
