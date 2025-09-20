import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Button from '../common/Button';
import ViewModeSelector from './ViewModeSelector';
import { UI_TEXTS, VIEW_MODES } from '../../constants/barberAppointments';

const AppointmentHeader = ({
  currentDate,
  viewMode,
  onNavigate,
  onViewModeChange,
  onDateChange
}) => {
  const getDateDisplayText = () => {
    switch (viewMode) {
      case VIEW_MODES.WEEKLY:
        return currentDate.toLocaleDateString('es-ES', {
          month: 'long',
          year: 'numeric'
        }) + ` - ${UI_TEXTS.WEEK_OF} ${currentDate.getDate()}`;
      case VIEW_MODES.MONTHLY:
        return currentDate.toLocaleDateString('es-ES', {
          month: 'long',
          year: 'numeric'
        });
      default:
        return currentDate.toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {UI_TEXTS.TITLE}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {UI_TEXTS.SUBTITLE}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <ViewModeSelector
          currentMode={viewMode}
          onModeChange={onViewModeChange}
        />

        <div className="flex items-center space-x-2">
          {viewMode === VIEW_MODES.LIST ? (
            <input
              type="date"
              value={currentDate.toISOString().split('T')[0]}
              onChange={(e) => onDateChange && onDateChange(new Date(e.target.value))}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            />
          ) : (
            <>
              <Button
                onClick={() => onNavigate(-1)}
                variant="secondary"
                size="sm"
                leftIcon={FiChevronLeft}
              />

              <div className="min-w-[200px] text-center">
                <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                  {getDateDisplayText()}
                </span>
              </div>

              <Button
                onClick={() => onNavigate(1)}
                variant="secondary"
                size="sm"
                leftIcon={FiChevronRight}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentHeader;