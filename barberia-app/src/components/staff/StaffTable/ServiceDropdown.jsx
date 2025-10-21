import { FiChevronUp, FiChevronDown } from 'react-icons/fi';

/**
 * Dropdown expandible de servicios realizados por barbero
 * Líneas 294-366 del original
 */
const ServiceDropdown = ({
  barber,
  servicesData,
  isExpanded,
  onToggle
}) => {
  if (servicesData.services.length === 0) {
    return (
      <span className="text-gray-500 text-sm">Sin servicios</span>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-sm transition-colors min-w-[120px]"
      >
        <span className="text-gray-900 dark:text-white font-medium">
          {servicesData.services.length} servicios
        </span>
        {isExpanded ? (
          <FiChevronUp className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        ) : (
          <FiChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {isExpanded && (
        <div className="absolute top-full left-0 mt-1 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-100 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-white text-sm">
              {barber.name} - Servicios Realizados
            </h4>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {servicesData.services.map((service, index) => (
              <div
                key={service.id}
                className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  index !== servicesData.services.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      {service.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {service.count} realizados
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                      S/{service.revenue.toFixed(0)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-600 rounded-b-lg">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Total: {servicesData.totalServices} servicios
              </span>
              <span className="font-bold text-green-600 dark:text-green-400">
                S/{servicesData.totalRevenue.toFixed(0)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDropdown;
