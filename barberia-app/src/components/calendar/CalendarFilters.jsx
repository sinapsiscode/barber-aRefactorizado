import { FiSearch, FiX } from 'react-icons/fi';
import { CALENDAR_TEXTS, APPOINTMENT_STATUSES, TIME_FILTERS } from '../../constants/receptionCalendar';

const CalendarFilters = ({
  showFilters,
  selectedFilters,
  searchTerm,
  availableBarbers,
  services,
  onFilterChange,
  onSearchChange,
  onClearSearch,
  onClearFilters
}) => {
  if (!showFilters) return null;

  return (
    <div className="card">
      <FilterHeader onClearFilters={onClearFilters} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <ClientSearchFilter
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          onClearSearch={onClearSearch}
        />

        <BarberFilter
          selectedBarber={selectedFilters.barber}
          availableBarbers={availableBarbers}
          onChange={(value) => onFilterChange('barber', value)}
        />

        <ServiceFilter
          selectedService={selectedFilters.service}
          services={services}
          onChange={(value) => onFilterChange('service', value)}
        />

        <StatusFilter
          selectedStatus={selectedFilters.status}
          onChange={(value) => onFilterChange('status', value)}
        />

        <TimeFilter
          selectedTime={selectedFilters.time}
          onChange={(value) => onFilterChange('time', value)}
        />
      </div>
    </div>
  );
};

const FilterHeader = ({ onClearFilters }) => (
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
      {CALENDAR_TEXTS.FILTERS}
    </h3>
    <button
      onClick={onClearFilters}
      className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
    >
      {CALENDAR_TEXTS.CLEAR_FILTERS}
    </button>
  </div>
);

const ClientSearchFilter = ({ searchTerm, onSearchChange, onClearSearch }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {CALENDAR_TEXTS.SEARCH_CLIENT}
    </label>
    <div className="relative">
      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={CALENDAR_TEXTS.CLIENT_NAME_PLACEHOLDER}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
      />
      {searchTerm && (
        <button
          onClick={onClearSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <FiX className="h-4 w-4" />
        </button>
      )}
    </div>
  </div>
);

const BarberFilter = ({ selectedBarber, availableBarbers, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {CALENDAR_TEXTS.BARBER_FILTER}
    </label>
    <select
      value={selectedBarber}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
    >
      <option value="">{CALENDAR_TEXTS.ALL_BARBERS}</option>
      {availableBarbers.map(barber => (
        <option key={barber.id} value={barber.id}>
          {barber.name}
        </option>
      ))}
    </select>
  </div>
);

const ServiceFilter = ({ selectedService, services, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {CALENDAR_TEXTS.SERVICE_FILTER}
    </label>
    <select
      value={selectedService}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
    >
      <option value="">{CALENDAR_TEXTS.ALL_SERVICES}</option>
      {services.map(service => (
        <option key={service.id} value={service.id}>
          {service.name}
        </option>
      ))}
    </select>
  </div>
);

const StatusFilter = ({ selectedStatus, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {CALENDAR_TEXTS.STATUS_FILTER}
    </label>
    <select
      value={selectedStatus}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
    >
      <option value="">{CALENDAR_TEXTS.ALL_STATUSES}</option>
      <option value={APPOINTMENT_STATUSES.PENDING}>{CALENDAR_TEXTS.STATUS_PENDING}</option>
      <option value={APPOINTMENT_STATUSES.CONFIRMED}>{CALENDAR_TEXTS.STATUS_CONFIRMED}</option>
      <option value={APPOINTMENT_STATUSES.IN_PROGRESS}>{CALENDAR_TEXTS.STATUS_IN_PROGRESS}</option>
      <option value={APPOINTMENT_STATUSES.COMPLETED}>{CALENDAR_TEXTS.STATUS_COMPLETED}</option>
      <option value={APPOINTMENT_STATUSES.CANCELLED}>{CALENDAR_TEXTS.STATUS_CANCELLED}</option>
    </select>
  </div>
);

const TimeFilter = ({ selectedTime, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {CALENDAR_TEXTS.TIME_FILTER}
    </label>
    <select
      value={selectedTime}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
    >
      <option value="">{CALENDAR_TEXTS.ALL_DAY}</option>
      <option value={TIME_FILTERS.MORNING}>{CALENDAR_TEXTS.MORNING}</option>
      <option value={TIME_FILTERS.AFTERNOON}>{CALENDAR_TEXTS.AFTERNOON}</option>
      <option value={TIME_FILTERS.EVENING}>{CALENDAR_TEXTS.EVENING}</option>
    </select>
  </div>
);

export default CalendarFilters;