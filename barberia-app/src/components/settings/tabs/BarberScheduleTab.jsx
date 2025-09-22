import { useState } from 'react';
import { FiClock } from 'react-icons/fi';
import { SETTINGS_TEXTS, WEEK_DAYS, DEFAULT_SCHEDULE } from '../../../constants/settingsPage';
import { isDayActiveByDefault, formatTime, generateDefaultSchedule } from '../../../utils/settingsHelpers';

const BarberScheduleTab = () => {
  const [schedule, setSchedule] = useState(
    WEEK_DAYS.reduce((acc, day) => {
      acc[day.id] = {
        ...generateDefaultSchedule(),
        isActive: isDayActiveByDefault(day.id)
      };
      return acc;
    }, {})
  );

  const handleScheduleChange = (dayId, field, value) => {
    setSchedule({
      ...schedule,
      [dayId]: {
        ...schedule[dayId],
        [field]: value
      }
    });
  };

  const handleDayToggle = (dayId) => {
    setSchedule({
      ...schedule,
      [dayId]: {
        ...schedule[dayId],
        isActive: !schedule[dayId].isActive
      }
    });
  };

  const handleApplyToAll = (dayId) => {
    const sourceSchedule = schedule[dayId];
    const newSchedule = { ...schedule };

    Object.keys(newSchedule).forEach(key => {
      if (newSchedule[key].isActive) {
        newSchedule[key] = {
          ...newSchedule[key],
          startTime: sourceSchedule.startTime,
          endTime: sourceSchedule.endTime
        };
      }
    });

    setSchedule(newSchedule);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-800 rounded-lg p-6">
        <div className="flex items-center mb-6">
          <FiClock className="h-6 w-6 text-primary-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {SETTINGS_TEXTS.SCHEDULE_CONFIG}
          </h3>
        </div>

        <div className="space-y-4">
          {WEEK_DAYS.map((day) => (
            <ScheduleDay
              key={day.id}
              day={day}
              schedule={schedule[day.id]}
              onScheduleChange={(field, value) => handleScheduleChange(day.id, field, value)}
              onDayToggle={() => handleDayToggle(day.id)}
              onApplyToAll={() => handleApplyToAll(day.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ScheduleDay = ({
  day,
  schedule,
  onScheduleChange,
  onDayToggle,
  onApplyToAll
}) => (
  <div className={`p-4 rounded-lg border ${
    schedule.isActive
      ? 'border-primary-200 bg-primary-50 dark:bg-primary-900 dark:border-primary-700'
      : 'border-gray-200 bg-gray-50 dark:bg-dark-700 dark:border-gray-600'
  }`}>
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={schedule.isActive}
          onChange={onDayToggle}
          className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mr-3"
        />
        <label className={`text-sm font-medium ${
          schedule.isActive
            ? 'text-primary-700 dark:text-primary-300'
            : 'text-gray-500 dark:text-gray-400'
        }`}>
          {day.name}
        </label>
      </div>

      {schedule.isActive && (
        <button
          onClick={onApplyToAll}
          className="text-xs text-primary-600 hover:text-primary-700 font-medium"
        >
          Aplicar a todos los días activos
        </button>
      )}
    </div>

    {schedule.isActive && (
      <div className="grid grid-cols-2 gap-4">
        <TimeField
          label="Hora de inicio"
          value={schedule.startTime}
          onChange={(value) => onScheduleChange('startTime', value)}
        />
        <TimeField
          label="Hora de fin"
          value={schedule.endTime}
          onChange={(value) => onScheduleChange('endTime', value)}
        />
      </div>
    )}
  </div>
);

const TimeField = ({ label, value, onChange }) => (
  <div>
    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <input
      type="time"
      value={formatTime(value)}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md
                 focus:ring-primary-500 focus:border-primary-500
                 bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
    />
  </div>
);

export default BarberScheduleTab;