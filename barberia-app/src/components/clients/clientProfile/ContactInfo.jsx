import { FiMail, FiPhone, FiMapPin, FiCalendar } from 'react-icons/fi';
import { CLIENT_PROFILE_TEXTS } from '../../../constants/clientProfile';

/**
 * Card de información de contacto del cliente
 */
const ContactInfo = ({ client }) => {
  return (
    <div className="card">
      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
        {CLIENT_PROFILE_TEXTS.contactInfoTitle}
      </h4>
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <FiMail className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-900 dark:text-white">{client.email}</span>
        </div>
        <div className="flex items-center space-x-3">
          <FiPhone className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-900 dark:text-white">{client.phone}</span>
        </div>
        {client.address && (
          <div className="flex items-center space-x-3">
            <FiMapPin className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-900 dark:text-white">{client.address}</span>
          </div>
        )}
        {client.birthDate && (
          <div className="flex items-center space-x-3">
            <FiCalendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-900 dark:text-white">
              {new Date(client.birthDate).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactInfo;
