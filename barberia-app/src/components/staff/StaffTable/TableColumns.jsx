import { FiStar } from 'react-icons/fi';
import CountryFlag from '../../common/CountryFlag';
import ServiceDropdown from './ServiceDropdown';
import { getServicesPerformedByBarber } from '../../../utils/staff/servicesAnalytics';

/**
 * Configuración de columnas para la tabla de staff
 * Líneas 207-413 del original
 *
 * @param {Object} params
 * @param {Array} params.branches - Lista de sucursales
 * @param {Array} params.appointments - Lista de citas
 * @param {Array} params.services - Lista de servicios
 * @param {string} params.expandedServicesBarber - ID del barbero con dropdown expandido
 * @param {Function} params.setExpandedServicesBarber - Setter para barbero expandido
 * @param {Function} params.setSelectedBarber - Setter para barbero seleccionado
 * @param {Function} params.setShowReviews - Setter para mostrar reviews
 * @param {Function} params.handleCheckIn - Handler para check-in
 * @param {Function} params.handleCheckOut - Handler para check-out
 */
export const getTableColumns = ({
  branches,
  appointments = [],
  services = [],
  expandedServicesBarber,
  setExpandedServicesBarber,
  setSelectedBarber,
  setShowReviews,
  handleCheckIn,
  handleCheckOut
}) => [
  {
    key: 'name',
    label: 'Barbero',
    render: (value, barber) => (
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 bg-primary-500 rounded-full flex items-center justify-center">
          <span className="text-white font-medium">
            {value.charAt(0)}
          </span>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900 dark:text-white">{value}</span>
            <CountryFlag countryCode={barber.country || 'PE'} size={16} />
          </div>
          <div className="text-sm text-gray-500">{barber.email}</div>
        </div>
      </div>
    )
  },
  {
    key: 'specialties',
    label: 'Especialidades',
    render: (value) => (
      <div className="flex flex-wrap gap-1">
        {value.slice(0, 2).map((specialty, index) => (
          <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
            {specialty}
          </span>
        ))}
        {value.length > 2 && (
          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
            +{value.length - 2}
          </span>
        )}
      </div>
    )
  },
  {
    key: 'branchId',
    label: 'Sede',
    render: (value, barber) => {
      const branch = branches.find(b => b.id === value);
      return (
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {branch ? branch.name : 'Sin asignar'}
          </span>
          {branch && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {branch.city}
            </span>
          )}
        </div>
      );
    }
  },
  {
    key: 'rating',
    label: 'Calificación',
    render: (value, barber) => (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <FiStar className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="font-medium">{value}</span>
        </div>
        <button
          onClick={() => {
            setSelectedBarber(barber);
            setShowReviews(true);
          }}
          className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 rounded bg-blue-50 hover:bg-blue-100"
          title="Ver reseñas detalladas"
        >
          Ver reseñas
        </button>
      </div>
    )
  },
  {
    key: 'totalServices',
    label: 'Servicios',
    render: (value) => value.toLocaleString()
  },
  {
    key: 'servicesPerformed',
    label: 'Servicios Realizados',
    render: (value, barber) => {
      const servicesData = getServicesPerformedByBarber(barber.id, appointments, services);
      const isExpanded = expandedServicesBarber === barber.id;

      return (
        <ServiceDropdown
          barber={barber}
          servicesData={servicesData}
          isExpanded={isExpanded}
          onToggle={() => setExpandedServicesBarber(isExpanded ? null : barber.id)}
        />
      );
    }
  },
  {
    key: 'totalEarnings',
    label: 'Ingresos',
    render: (value) => `S/${(value / 1000).toFixed(1)}K`
  },
  {
    key: 'commissions',
    label: 'Comisiones',
    render: (value, barber) => {
      const servicesData = getServicesPerformedByBarber(barber.id);
      const commission = servicesData.totalRevenue * (barber.commission || 0.7);

      return (
        <div className="flex flex-col items-start">
          <span className="font-medium text-green-600 dark:text-green-400">
            S/{commission.toFixed(0)}
          </span>
          <span className="text-xs text-gray-500">
            ({((barber.commission || 0.7) * 100).toFixed(0)}%)
          </span>
        </div>
      );
    }
  },
  {
    key: 'isPresent',
    label: 'Estado',
    render: (value, barber) => (
      <div className="flex items-center space-x-2">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-600'
        }`}>
          {value ? 'Presente' : 'Ausente'}
        </span>
        <button
          onClick={() => value ? handleCheckOut(barber.id) : handleCheckIn(barber.id)}
          className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
        >
          {value ? 'Salida' : 'Entrada'}
        </button>
      </div>
    )
  }
];
