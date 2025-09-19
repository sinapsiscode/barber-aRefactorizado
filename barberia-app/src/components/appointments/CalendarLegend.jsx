import React from 'react';
import { APPOINTMENT_LEGEND_COLORS } from '../../constants/appointments';
import { cn } from '../../styles/components';

const CalendarLegend = ({ className = '' }) => {
  return (
    <div className={cn('flex items-center space-x-6 text-sm', className)}>
      {APPOINTMENT_LEGEND_COLORS.map(({ status, color, label }) => (
        <div key={status} className="flex items-center space-x-2">
          <div className={cn('w-3 h-3 rounded', color)} />
          <span className="text-gray-600 dark:text-gray-400">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CalendarLegend;