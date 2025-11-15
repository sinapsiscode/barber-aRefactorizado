import { FiUsers, FiCalendar, FiDollarSign, FiClock, FiUserCheck, FiCamera } from 'react-icons/fi';

const ReceptionDashboard = ({ onPageChange }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Dashboard - Recepción</h1>
        <p className="text-purple-100">Gestión de citas, pagos y atención al cliente</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Citas Hoy</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">15</p>
            </div>
            <div className="p-3 rounded-full bg-blue-500">
              <FiCalendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pagos Procesados</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">S/1,250</p>
            </div>
            <div className="p-3 rounded-full bg-green-500">
              <FiDollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Clientes Atendidos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
            </div>
            <div className="p-3 rounded-full bg-purple-500">
              <FiUsers className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Barberos Activos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">4/5</p>
            </div>
            <div className="p-3 rounded-full bg-orange-500">
              <FiUserCheck className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="text-center p-6">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <FiCalendar className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Agendar Cita
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Programa una nueva cita para un cliente
            </p>
            <button
              onClick={() => onPageChange?.('appointments')}
              className="btn-primary w-full"
            >
              Nueva Cita
            </button>
          </div>
        </div>

        <div className="card">
          <div className="text-center p-6">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <FiDollarSign className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Procesar Pago
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Registrar pagos y generar facturas
            </p>
            <button
              onClick={() => onPageChange?.('financial')}
              className="btn-secondary w-full"
            >
              Nuevo Pago
            </button>
          </div>
        </div>

        <div className="card">
          <div className="text-center p-6">
            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <FiCamera className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Ver Portafolios
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Mostrar trabajos de barberos a clientes
            </p>
            <button
              onClick={() => onPageChange?.('portfolio')}
              className="btn-secondary w-full"
            >
              Ver Portafolios
            </button>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Agenda de Hoy
          </h2>
          <button
            onClick={() => onPageChange?.('appointments')}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Ver Calendario Completo
          </button>
        </div>

        <div className="space-y-3">
          {[
            { time: '09:00', client: 'Juan Pérez', barber: 'Miguel', service: 'Corte + Barba', status: 'confirmed' },
            { time: '09:30', client: 'Carlos López', barber: 'Ana', service: 'Corte', status: 'pending' },
            { time: '10:00', client: 'Luis García', barber: 'Miguel', service: 'Barba', status: 'in_progress' },
            { time: '10:30', client: 'Pedro Martín', barber: 'José', service: 'Corte + Barba', status: 'confirmed' }
          ].map((appointment, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white min-w-[60px]">
                  {appointment.time}
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {appointment.client}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {appointment.barber} • {appointment.service}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                  appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  appointment.status === 'in_progress' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {appointment.status === 'confirmed' ? 'Confirmada' :
                   appointment.status === 'pending' ? 'Pendiente' :
                   appointment.status === 'in_progress' ? 'En Proceso' : appointment.status}
                </span>
                {appointment.status === 'pending' && (
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Confirmar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReceptionDashboard;