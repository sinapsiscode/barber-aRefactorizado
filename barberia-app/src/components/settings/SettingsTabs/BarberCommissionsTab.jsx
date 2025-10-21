import { useState } from 'react';
import { FiDollarSign, FiSettings, FiGift, FiUser } from 'react-icons/fi';
import { TIME_PERIODS } from '../../../constants/settings';

/**
 * Tab de comisiones del barbero
 */
const BarberCommissionsTab = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');

  // Datos mock de servicios realizados
  const mockServices = [
    { id: 1, date: '2024-01-20', client: 'Juan Pérez', service: 'Corte + Barba', price: 40, commission: 12, status: 'completed' },
    { id: 2, date: '2024-01-19', client: 'Carlos López', service: 'Fade Moderno', price: 35, commission: 10.5, status: 'completed' },
    { id: 3, date: '2024-01-18', client: 'Miguel Torres', service: 'Corte Clásico', price: 25, commission: 7.5, status: 'completed' },
    { id: 4, date: '2024-01-17', client: 'Roberto Silva', service: 'Diseño Especial', price: 50, commission: 15, status: 'completed' },
    { id: 5, date: '2024-01-16', client: 'Diego Martín', service: 'Corte + Barba', price: 40, commission: 12, status: 'completed' },
  ];

  const totalEarnings = mockServices.reduce((sum, service) => sum + service.price, 0);
  const totalCommissions = mockServices.reduce((sum, service) => sum + service.commission, 0);
  const totalServices = mockServices.length;
  const commissionRate = totalCommissions > 0 ? ((totalCommissions / totalEarnings) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Resumen de comisiones */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FiDollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Comisiones</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">S/{totalCommissions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <FiSettings className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Servicios</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalServices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <FiGift className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ingresos Totales</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">S/{totalEarnings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <FiUser className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">% Comisión</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{commissionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de servicios */}
      <div className="bg-white dark:bg-dark-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Mis Servicios Realizados
          </h3>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input-field !py-2"
          >
            {TIME_PERIODS.map(period => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Servicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Mi Comisión
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-gray-700">
              {mockServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(service.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {service.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {service.service}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    S/{service.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600 dark:text-green-400">
                    S/{service.commission}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      Completado
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Información sobre comisiones */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <FiDollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200">
              Información sobre comisiones
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Tu porcentaje de comisión se calcula sobre el precio final de cada servicio.
              Las comisiones se pagan quincenalmente junto con tu salario.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberCommissionsTab;
