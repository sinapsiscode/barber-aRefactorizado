import { FiCalendar, FiGift } from 'react-icons/fi';
import { CLIENT_PROFILE_TEXTS } from '../../../constants/clientProfile';

/**
 * Footer del modal de perfil con botones de acción
 */
const ClientProfileFooter = ({ onNewAppointment, onRedeemPoints, onClose }) => {
  return (
    <div className="bg-gray-50 dark:bg-dark-700 px-6 py-3 flex justify-between">
      <div className="flex space-x-2">
        <button
          onClick={onNewAppointment}
          className="btn-secondary text-sm"
        >
          <FiCalendar className="h-4 w-4 mr-1" />
          {CLIENT_PROFILE_TEXTS.newAppointmentButton}
        </button>
        <button
          onClick={onRedeemPoints}
          className="btn-secondary text-sm"
        >
          <FiGift className="h-4 w-4 mr-1" />
          {CLIENT_PROFILE_TEXTS.redeemPointsButton}
        </button>
      </div>
      <button
        onClick={onClose}
        className="btn-secondary"
      >
        {CLIENT_PROFILE_TEXTS.closeButton}
      </button>
    </div>
  );
};

export default ClientProfileFooter;
