import { AVAILABLE_SERVICES } from '../../constants/publicBooking';

/**
 * Selector de servicios con checkboxes
 */
const ServiceSelector = ({
  selectedServices,
  otherService,
  otherServiceText,
  formErrors,
  onServiceToggle,
  onOtherServiceToggle,
  onOtherServiceTextChange
}) => {
  const isServiceSelected = (serviceId) => {
    return selectedServices.some(s => s.id === serviceId);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-4">
        Servicios a realizarse
      </label>
      <div className="space-y-3 border border-gray-200 rounded-lg p-4">
        {AVAILABLE_SERVICES.map((service) => (
          <label
            key={service.id}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={isServiceSelected(service.id)}
                onChange={() => onServiceToggle(service)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="ml-3 flex items-center space-x-2">
                <span className="text-2xl">{service.icon}</span>
                <span className="font-medium text-gray-700">
                  {service.name}:
                  {service.description && (
                    <span className="text-sm text-gray-500 ml-1">{service.description}</span>
                  )}
                </span>
                <span className="text-gray-600">S/ {service.price}</span>
              </div>
            </div>
            <span className="text-sm text-gray-500">{service.duration} min</span>
          </label>
        ))}

        {/* Checkbox OTROS */}
        <div className="p-3 border border-gray-200 rounded-lg">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={otherService}
              onChange={(e) => onOtherServiceToggle(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-3 font-medium text-gray-700">OTROS</span>
          </label>
          {otherService && (
            <input
              type="text"
              value={otherServiceText}
              onChange={(e) => onOtherServiceTextChange(e.target.value)}
              placeholder="Especifica el servicio..."
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>
      </div>
      {formErrors.services && (
        <p className="mt-1 text-sm text-red-500">{formErrors.services}</p>
      )}
    </div>
  );
};

export default ServiceSelector;
