import { CLIENT_PROFILE_TEXTS } from '../../../constants/clientProfile';

/**
 * Card de servicios preferidos del cliente
 */
const PreferredServices = ({ client }) => {
  if (!client.preferredServices || client.preferredServices.length === 0) {
    return null;
  }

  return (
    <div className="card">
      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
        {CLIENT_PROFILE_TEXTS.preferredServicesTitle}
      </h4>
      <div className="flex flex-wrap gap-2">
        {client.preferredServices.map((service, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
          >
            {service}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PreferredServices;
