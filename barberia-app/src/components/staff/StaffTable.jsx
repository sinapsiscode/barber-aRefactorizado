import { FiStar, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { DataTable } from '../common';
import CountryFlag from '../common/CountryFlag';
import { STAFF_TEXTS, LIMITS } from '../../constants/staffPage';
import { formatCurrency } from '../../utils/staffHelpers';

const StaffTable = ({
  filteredBarbers,
  expandedServicesBarber,
  onExpandServices,
  onCheckIn,
  onCheckOut,
  getBarberServices
}) => {
  const columns = [
    {
      key: 'name',
      label: STAFF_TEXTS.BARBER,
      render: (value, barber) => (
        <BarberInfo barber={barber} />
      )
    },
    {
      key: 'specialties',
      label: STAFF_TEXTS.SPECIALTIES,
      render: (value) => (
        <SpecialtiesDisplay specialties={value} />
      )
    },
    {
      key: 'rating',
      label: STAFF_TEXTS.RATING,
      render: (value) => (
        <RatingDisplay rating={value} />
      )
    },
    {
      key: 'totalServices',
      label: STAFF_TEXTS.SERVICES,
      render: (value) => value.toLocaleString()
    },
    {
      key: 'servicesPerformed',
      label: STAFF_TEXTS.SERVICES_PERFORMED,
      render: (value, barber) => (
        <ServicesPerformedCell
          barber={barber}
          isExpanded={expandedServicesBarber === barber.id}
          onExpand={() => onExpandServices(barber.id)}
          getBarberServices={getBarberServices}
        />
      )
    },
    {
      key: 'totalEarnings',
      label: STAFF_TEXTS.INCOME,
      render: (value) => formatCurrency(value, 'K')
    },
    {
      key: 'isPresent',
      label: STAFF_TEXTS.STATUS,
      render: (value, barber) => (
        <StatusCell
          barber={barber}
          isPresent={value}
          onCheckIn={onCheckIn}
          onCheckOut={onCheckOut}
        />
      )
    }
  ];

  return (
    <DataTable
      data={filteredBarbers}
      columns={columns}
      searchable
      pagination={false}
      className="w-full"
      emptyMessage={STAFF_TEXTS.NO_BARBERS}
    />
  );
};

const BarberInfo = ({ barber }) => (
  <div className="flex items-center space-x-3">
    <div className="h-10 w-10 bg-primary-500 rounded-full flex items-center justify-center">
      <span className="text-white font-medium">
        {barber.name.charAt(0)}
      </span>
    </div>
    <div>
      <div className="flex items-center space-x-2">
        <span className="font-medium text-gray-900 dark:text-white">{barber.name}</span>
        <CountryFlag countryCode={barber.country || 'PE'} size={16} />
      </div>
      <div className="text-sm text-gray-500">{barber.email}</div>
    </div>
  </div>
);

const SpecialtiesDisplay = ({ specialties }) => (
  <div className="flex flex-wrap gap-1">
    {specialties.slice(0, LIMITS.SERVICES_PREVIEW).map((specialty, index) => (
      <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
        {specialty}
      </span>
    ))}
    {specialties.length > LIMITS.SERVICES_PREVIEW && (
      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
        +{specialties.length - LIMITS.SERVICES_PREVIEW}
      </span>
    )}
  </div>
);

const RatingDisplay = ({ rating }) => (
  <div className="flex items-center space-x-1">
    <FiStar className="h-4 w-4 text-yellow-400 fill-current" />
    <span className="font-medium">{rating}</span>
  </div>
);

const ServicesPerformedCell = ({ barber, isExpanded, onExpand, getBarberServices }) => {
  const servicesData = getBarberServices(barber.id);

  if (servicesData.services.length === 0) {
    return (
      <span className="text-gray-500 text-sm">{STAFF_TEXTS.NO_SERVICES}</span>
    );
  }

  return (
    <div className="relative">
      <ServicesButton
        servicesCount={servicesData.services.length}
        isExpanded={isExpanded}
        onClick={onExpand}
      />

      {isExpanded && (
        <ServicesDropdown
          barber={barber}
          servicesData={servicesData}
        />
      )}
    </div>
  );
};

const ServicesButton = ({ servicesCount, isExpanded, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-sm transition-colors min-w-[120px]"
  >
    <span className="text-gray-900 dark:text-white font-medium">
      {servicesCount} {STAFF_TEXTS.SERVICES_COUNT}
    </span>
    {isExpanded ? (
      <FiChevronUp className="h-4 w-4 text-gray-600 dark:text-gray-300" />
    ) : (
      <FiChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-300" />
    )}
  </button>
);

const ServicesDropdown = ({ barber, servicesData }) => (
  <div className={`absolute top-full left-0 mt-1 ${LIMITS.DROPDOWN_WIDTH} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50`}>
    <ServicesDropdownHeader barber={barber} />
    <ServicesDropdownContent servicesData={servicesData} />
    <ServicesDropdownFooter servicesData={servicesData} />
  </div>
);

const ServicesDropdownHeader = ({ barber }) => (
  <div className="p-3 border-b border-gray-100 dark:border-gray-700">
    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
      {barber.name} - {STAFF_TEXTS.SERVICES_PERFORMED}
    </h4>
  </div>
);

const ServicesDropdownContent = ({ servicesData }) => (
  <div className={`${LIMITS.MAX_DROPDOWN_HEIGHT} overflow-y-auto`}>
    {servicesData.services.map((service, index) => (
      <ServiceItem
        key={service.id}
        service={service}
        isLast={index === servicesData.services.length - 1}
      />
    ))}
  </div>
);

const ServiceItem = ({ service, isLast }) => (
  <div className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
    !isLast ? 'border-b border-gray-100 dark:border-gray-700' : ''
  }`}>
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
);

const ServicesDropdownFooter = ({ servicesData }) => (
  <div className="p-3 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-600 rounded-b-lg">
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-600 dark:text-gray-400">
        Total: {servicesData.totalServices} {STAFF_TEXTS.SERVICES_COUNT}
      </span>
      <span className="font-bold text-green-600 dark:text-green-400">
        S/{servicesData.totalRevenue.toFixed(0)}
      </span>
    </div>
  </div>
);

const StatusCell = ({ barber, isPresent, onCheckIn, onCheckOut }) => (
  <div className="flex items-center space-x-2">
    <StatusBadge isPresent={isPresent} />
    <CheckInOutButton
      barber={barber}
      isPresent={isPresent}
      onCheckIn={onCheckIn}
      onCheckOut={onCheckOut}
    />
  </div>
);

const StatusBadge = ({ isPresent }) => (
  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
    isPresent
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-600'
  }`}>
    {isPresent ? STAFF_TEXTS.PRESENT : STAFF_TEXTS.ABSENT}
  </span>
);

const CheckInOutButton = ({ barber, isPresent, onCheckIn, onCheckOut }) => (
  <button
    onClick={() => isPresent ? onCheckOut(barber.id) : onCheckIn(barber.id)}
    className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
  >
    {isPresent ? STAFF_TEXTS.CHECK_OUT : STAFF_TEXTS.CHECK_IN}
  </button>
);

export default StaffTable;