import { FiFilter } from 'react-icons/fi';
import { PORTFOLIO_TEXTS } from '../../constants/portfolio';

const PortfolioFilters = ({
  user,
  selectedBarber,
  selectedService,
  availableBarbers,
  services,
  onBarberChange,
  onServiceChange
}) => {
  if (user?.role === 'client') return null;

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <FiFilter className="h-5 w-5 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {PORTFOLIO_TEXTS.FILTERS}
        </h3>
      </div>

      <div className={`grid grid-cols-1 ${user?.role === 'barber' ? 'md:grid-cols-1' : 'md:grid-cols-2'} gap-4`}>
        {user?.role !== 'barber' && (
          <BarberFilter
            selectedBarber={selectedBarber}
            availableBarbers={availableBarbers}
            onBarberChange={onBarberChange}
          />
        )}

        <ServiceFilter
          selectedService={selectedService}
          services={services}
          onServiceChange={onServiceChange}
        />
      </div>
    </div>
  );
};

const BarberFilter = ({ selectedBarber, availableBarbers, onBarberChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {PORTFOLIO_TEXTS.BARBER_LABEL}
    </label>
    <select
      value={selectedBarber}
      onChange={(e) => onBarberChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
    >
      <option value="">{PORTFOLIO_TEXTS.ALL_BARBERS}</option>
      {availableBarbers.map(barber => (
        <option key={barber.id} value={barber.id}>
          {barber.name}
        </option>
      ))}
    </select>
  </div>
);

const ServiceFilter = ({ selectedService, services, onServiceChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {PORTFOLIO_TEXTS.SERVICE_LABEL}
    </label>
    <select
      value={selectedService}
      onChange={(e) => onServiceChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
    >
      <option value="">{PORTFOLIO_TEXTS.ALL_SERVICES}</option>
      {services.map(service => (
        <option key={service.id} value={service.id}>
          {service.name}
        </option>
      ))}
    </select>
  </div>
);

export default PortfolioFilters;