import { FiCheck, FiX, FiClock, FiCamera } from 'react-icons/fi';
import Button from '../common/Button';
import { APPOINTMENT_STATUS, BUTTON_TEXTS, PHOTO_MODAL_TEXTS } from '../../constants/barberAppointments';

const AppointmentActions = ({
  appointment,
  onMarkAttendance,
  onStartService,
  onCompleteService
}) => {
  const { status, id, hasPhotos } = appointment;

  if (status === APPOINTMENT_STATUS.PENDING) {
    return (
      <div className="flex space-x-2">
        <Button
          onClick={() => onMarkAttendance(id, true)}
          variant="success"
          size="sm"
          leftIcon={FiCheck}
        >
          {BUTTON_TEXTS.PRESENT}
        </Button>
        <Button
          onClick={() => onMarkAttendance(id, false)}
          variant="danger"
          size="sm"
          leftIcon={FiX}
        >
          {BUTTON_TEXTS.NO_SHOW}
        </Button>
      </div>
    );
  }

  if (status === APPOINTMENT_STATUS.CONFIRMED) {
    return (
      <Button
        onClick={() => onStartService(id)}
        variant="primary"
        size="sm"
        leftIcon={FiClock}
      >
        {BUTTON_TEXTS.START_SERVICE}
      </Button>
    );
  }

  if (status === APPOINTMENT_STATUS.IN_PROGRESS) {
    return (
      <Button
        onClick={() => onCompleteService(id)}
        variant="purple"
        size="sm"
        leftIcon={FiCamera}
      >
        {BUTTON_TEXTS.COMPLETE}
      </Button>
    );
  }

  if (status === APPOINTMENT_STATUS.COMPLETED && hasPhotos) {
    return (
      <div className="flex items-center text-sm text-green-600 dark:text-green-400">
        <FiCamera className="h-4 w-4 mr-1" />
        {PHOTO_MODAL_TEXTS.WITH_PHOTOS}
      </div>
    );
  }

  return null;
};

export default AppointmentActions;