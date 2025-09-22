import { FiPlus } from 'react-icons/fi';
import { SERVICES_TEXTS } from '../../constants/servicesPage';

const ServicesHeader = ({
  user,
  userPermissions,
  onAddService
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {SERVICES_TEXTS.MANAGEMENT_TITLE}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {SERVICES_TEXTS.MANAGEMENT_SUBTITLE}
        </p>
      </div>

      <div className="flex items-center space-x-4">
        {user?.role !== 'client' && userPermissions.canAddService && (
          <button
            onClick={onAddService}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            <FiPlus className="h-4 w-4" />
            <span>{SERVICES_TEXTS.NEW_SERVICE}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ServicesHeader;