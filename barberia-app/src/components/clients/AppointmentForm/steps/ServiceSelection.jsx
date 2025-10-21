import { FiCheck } from 'react-icons/fi';

/**
 * Paso 2: Selección de Servicios
 */
const ServiceSelection = ({
  services,
  selectedServices,
  totalPrice,
  totalDuration,
  onToggleService
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-xl font-semibold text-gray-900">
          ¿Qué servicios necesitas?
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          {services.map(service => {
            const isSelected = selectedServices.includes(service.id);
            return (
              <div
                key={service.id}
                onClick={() => onToggleService(service.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{service.name}</h4>
                    <p className="text-sm text-gray-600">{service.duration} min</p>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3 text-lg font-bold text-primary-600">
                      S/{service.price}
                    </span>
                    {isSelected && (
                      <FiCheck className="w-5 h-5 text-primary-600" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {selectedServices.length > 0 && (
          <div className="p-4 mt-4 rounded-lg bg-primary-50">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Total:</span>
              <div className="text-right">
                <div className="text-xl font-bold text-primary-600">
                  S/{totalPrice}
                </div>
                <div className="text-sm text-gray-600">
                  Duración: {totalDuration} min
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceSelection;
