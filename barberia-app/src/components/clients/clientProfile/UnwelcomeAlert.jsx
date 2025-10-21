import { FiUserX } from 'react-icons/fi';
import { CLIENT_PROFILE_TEXTS } from '../../../constants/clientProfile';

/**
 * Alerta de cliente no grato (solo visible para staff/admin)
 */
const UnwelcomeAlert = ({ client }) => {
  if (!client.isUnwelcome) return null;

  return (
    <div className="card border-red-200 bg-red-50 dark:bg-red-900/20">
      <div className="flex items-start space-x-3">
        <FiUserX className="h-5 w-5 text-red-500 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-md font-semibold text-red-900 dark:text-red-100 mb-2">
            {CLIENT_PROFILE_TEXTS.unwelcomeClientTitle}
          </h4>
          <div className="space-y-2 text-sm">
            <p className="text-red-800 dark:text-red-200">
              <strong>{CLIENT_PROFILE_TEXTS.reasonLabel}</strong> {client.unwelcomeReason}
            </p>
            <p className="text-red-700 dark:text-red-300">
              <strong>{CLIENT_PROFILE_TEXTS.dateLabel}</strong> {new Date(client.unwelcomeDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnwelcomeAlert;
