import { FiSettings } from 'react-icons/fi';
import { SERVICES_TEXTS } from '../../constants/servicesPage';

const ServicesHero = ({
  user,
  selectedBranch,
  userPermissions,
  onShowPricingManager
}) => {
  return (
    <div className="text-center space-y-4 mb-12">
      <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
        {SERVICES_TEXTS.HERO_TITLE}
        {userPermissions.canManagePricing && (
          <button
            onClick={onShowPricingManager}
            className="ml-4 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-base"
            title={SERVICES_TEXTS.PRICING_TOOLTIP}
          >
            <FiSettings className="h-4 w-4 mr-2" />
            {SERVICES_TEXTS.CONFIGURE_PRICES}
          </button>
        )}
        {user?.role === 'super_admin' && selectedBranch && (
          <span className="text-2xl font-normal text-gray-500 dark:text-gray-400 block mt-2">
            {selectedBranch.name}
          </span>
        )}
      </h1>
      <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
        {SERVICES_TEXTS.HERO_SUBTITLE}
      </p>
    </div>
  );
};

export default ServicesHero;