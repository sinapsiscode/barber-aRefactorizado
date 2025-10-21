import { FiClock, FiChevronUp, FiUsers, FiCalendar, FiAward } from 'react-icons/fi';
import { sortBarbersByServices, calculateServicePercentage } from '../../../utils/staff/servicesAnalytics';
import { calculateAvgServicesPerBarber, calculateServicesPerDay, getBestBarberServices } from '../../../utils/staff/staffMetrics';
import { DISPLAY_LIMITS, MEDAL_COLORS } from '../../../constants/staff';

/**
 * Panel expandible de servicios
 * Líneas 754-940 del original
 */
const ServicesPanel = ({
  show,
  staffSummary,
  filteredBarbers,
  selectedBranch,
  onClose
}) => {
  if (!show) return null;

  const topBarbers = sortBarbersByServices(filteredBarbers).slice(0, DISPLAY_LIMITS.TOP_PERFORMERS);
  const avgPerBarber = calculateAvgServicesPerBarber(staffSummary.totalServices, filteredBarbers.length);
  const servicesPerDay = calculateServicesPerDay(staffSummary.totalServices);
  const bestBarberServices = getBestBarberServices(filteredBarbers);

  return (
    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
      show ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
    }`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <FiClock className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Análisis Detallado de Servicios
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Cantidad de citas atendidas por barbero
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <FiChevronUp className="h-5 w-5" />
          </button>
        </div>

        {/* Métricas de servicios */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-purple-100 dark:bg-purple-800/50 rounded-lg flex items-center justify-center">
                <FiClock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-800 dark:text-purple-200">Total Servicios</p>
                <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                  {staffSummary.totalServices.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-100 dark:bg-blue-800/50 rounded-lg flex items-center justify-center">
                <FiUsers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Promedio/Barbero</p>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                  {avgPerBarber.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-green-100 dark:bg-green-800/50 rounded-lg flex items-center justify-center">
                <FiCalendar className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">Servicios/Día</p>
                <p className="text-xl font-bold text-green-900 dark:text-green-100">
                  {servicesPerDay.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-yellow-100 dark:bg-yellow-800/50 rounded-lg flex items-center justify-center">
                <FiAward className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Mejor Barbero</p>
                <p className="text-xl font-bold text-yellow-900 dark:text-yellow-100">
                  {bestBarberServices}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top 5 Barberos y Distribución */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top 5 Barberos por Servicios */}
          <div className="card">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FiAward className="h-5 w-5 text-purple-500 mr-2" />
              Top 5 Barberos por Servicios
            </h4>
            <div className="space-y-3">
              {topBarbers.map((barber, index) => {
                const percentage = calculateServicePercentage(barber.totalServices, staffSummary.totalServices);
                const medalColor = index === 0 ? MEDAL_COLORS.FIRST :
                                  index === 1 ? MEDAL_COLORS.SECOND :
                                  index === 2 ? MEDAL_COLORS.THIRD : 'bg-purple-500';

                return (
                  <div key={barber.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${medalColor}`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {barber.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {percentage.toFixed(1)}% del total
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-600">
                          {barber.totalServices.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          servicios
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Distribución por Sucursal */}
          <div className="card">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Distribución por Sucursal
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Sucursal Actual</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {selectedBranch?.name || 'Todas'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Barberos Activos</span>
                <span className="font-semibold text-purple-600">
                  {filteredBarbers.filter(b => b.status === 'active').length}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Promedio Calificación</span>
                <span className="font-semibold text-yellow-600">
                  {staffSummary.avgRating}/5.0
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 dark:text-gray-400">Eficiencia</span>
                <span className="font-semibold text-green-600">
                  {Math.round((staffSummary.totalServices / filteredBarbers.length) / 30)}
                  <span className="text-xs text-gray-500"> servicios/día/barbero</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPanel;
