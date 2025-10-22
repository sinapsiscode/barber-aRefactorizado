import { FiCamera, FiMapPin, FiAward, FiCalendar, FiStar, FiTrendingUp } from 'react-icons/fi';
import { useClientStore, useAppointmentStore, useLoyaltyStore } from '../../../stores';
import { useEffect, useState } from 'react';

/**
 * Tab de configuración de perfil mejorado
 */
const ProfileTab = ({
  user,
  formData,
  avatarPreview,
  branches,
  onFormDataChange,
  onAvatarUpload
}) => {
  const { clients } = useClientStore();
  const { appointments } = useAppointmentStore();
  const { getClientLevel } = useLoyaltyStore();
  const [clientData, setClientData] = useState(null);
  const [clientStats, setClientStats] = useState({
    totalVisits: 0,
    loyaltyPoints: 0,
    nextAppointment: null,
    loyaltyLevel: null
  });

  // Obtener datos del cliente si es un cliente
  useEffect(() => {
    if (user?.role === 'client') {
      const client = clients.find(c => c.email === user.email || c.name === user.name);
      if (client) {
        setClientData(client);
        const level = getClientLevel(client.id);
        const nextAppt = appointments
          .filter(a => a.clientId === client.id && a.status === 'pending' && new Date(a.date) >= new Date())
          .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

        setClientStats({
          totalVisits: client.totalVisits || 0,
          loyaltyPoints: client.loyaltyPoints || 0,
          nextAppointment: nextAppt,
          loyaltyLevel: level
        });
      }
    }
  }, [user, clients, appointments, getClientLevel]);

  return (
    <div className="space-y-6">
      {/* Stats Cards - Solo para clientes */}
      {user?.role === 'client' && clientData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Visitas Totales</p>
                <p className="text-3xl font-bold mt-1">{clientStats.totalVisits}</p>
              </div>
              <FiCalendar className="h-8 w-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Puntos de Lealtad</p>
                <p className="text-3xl font-bold mt-1">{clientStats.loyaltyPoints}</p>
              </div>
              <FiAward className="h-8 w-8 text-yellow-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Nivel</p>
                <p className="text-xl font-bold mt-1">{clientStats.loyaltyLevel?.name || 'Bronce'}</p>
              </div>
              <FiStar className="h-8 w-8 text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Gastado</p>
                <p className="text-2xl font-bold mt-1">S/ {clientData?.totalSpent || 0}</p>
              </div>
              <FiTrendingUp className="h-8 w-8 text-green-200" />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Información Personal
        </h3>

        <div className="flex items-center space-x-6 mb-8">
          <div className="relative group">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="h-24 w-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg ring-2 ring-primary-400"
              />
            ) : (
              <div className="h-24 w-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-primary-400">
                <span className="text-white text-3xl font-bold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            )}
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white hover:from-primary-600 hover:to-primary-700 cursor-pointer transition-all shadow-lg group-hover:scale-110 transform"
            >
              <FiCamera className="h-5 w-5" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={onAvatarUpload}
              className="hidden"
            />
          </div>
          <div>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user?.name || 'Usuario'}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 capitalize mt-1 flex items-center space-x-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
              <span>{user?.role?.replace('_', ' ') || 'Cliente'}</span>
            </p>
            {user?.email && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onFormDataChange({ name: e.target.value })}
              className="input-field focus:ring-2 focus:ring-primary-500 transition-all"
              placeholder="Ingresa tu nombre completo"
              required
            />
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onFormDataChange({ email: e.target.value })}
              className="input-field focus:ring-2 focus:ring-primary-500 transition-all"
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                // Solo permitir números y espacios
                const value = e.target.value.replace(/[^\d\s+]/g, '');
                onFormDataChange({ phone: value });
              }}
              className="input-field focus:ring-2 focus:ring-primary-500 transition-all"
              placeholder="+51 999 999 999"
              pattern="[\d\s+]+"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Incluye el código de país (ej: +51)
            </p>
          </div>

          {user?.role === 'client' && (
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FiMapPin className="inline h-4 w-4 mr-1" />
                Sede Favorita
              </label>
              <select
                value={formData.preferredBranch}
                onChange={(e) => onFormDataChange({ preferredBranch: parseInt(e.target.value) })}
                className="input-field focus:ring-2 focus:ring-primary-500 transition-all"
              >
                <option value="">Selecciona tu sede favorita</option>
                {branches?.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} - {branch.city}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-start">
                <FiMapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                <span>Esta será tu sede preferida para reservar citas</span>
              </p>
            </div>
          )}

          {user?.role === 'barber' && (
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Especialidad
              </label>
              <input
                type="text"
                className="input-field focus:ring-2 focus:ring-primary-500 transition-all"
                placeholder="Corte clásico, Diseños, Barba..."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Servicios en los que te especializas
              </p>
            </div>
          )}
        </div>

        {/* Próxima cita - Solo para clientes */}
        {user?.role === 'client' && clientStats.nextAppointment && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <FiCalendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                  Próxima Cita Agendada
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  {new Date(clientStats.nextAppointment.date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} a las {clientStats.nextAppointment.time}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Barbero: {clientStats.nextAppointment.barberName}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileTab;
