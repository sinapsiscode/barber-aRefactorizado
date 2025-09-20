import { FiList, FiCalendar, FiGrid } from 'react-icons/fi';
import Button from '../common/Button';
import { VIEW_MODES, BUTTON_TEXTS } from '../../constants/barberAppointments';

const ViewModeSelector = ({ currentMode, onModeChange }) => {
  const modes = [
    {
      mode: VIEW_MODES.LIST,
      icon: FiList,
      label: BUTTON_TEXTS.LIST
    },
    {
      mode: VIEW_MODES.WEEKLY,
      icon: FiCalendar,
      label: BUTTON_TEXTS.WEEKLY
    },
    {
      mode: VIEW_MODES.MONTHLY,
      icon: FiGrid,
      label: BUTTON_TEXTS.MONTHLY
    }
  ];

  return (
    <div className="flex space-x-2">
      {modes.map(({ mode, icon, label }) => (
        <Button
          key={mode}
          onClick={() => onModeChange(mode)}
          variant={currentMode === mode ? 'primary' : 'secondary'}
          size="sm"
          leftIcon={icon}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};

export default ViewModeSelector;