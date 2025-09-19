import { useState, useEffect } from 'react';
import { FiCalendar, FiUser, FiStar, FiGift, FiClock, FiPlus, FiMapPin, FiBell, FiSettings } from 'react-icons/fi';
import { useAuthStore, useAppointmentStore, useClientStore, useStaffStore, useBranchStore } from '../../stores';
import { MetricCard, BranchStatus } from '../common';
import ClientAppointmentForm from '../clients/ClientAppointmentForm';
import ClientProfile from '../clients/ClientProfile';

const ClientDashboard = () => {
  const { user } = useAuthStore();
  const { appointments, getAppointmentsByClient } = useAppointmentStore();
  const { getCurrentClientData, calculateLoyaltyTier, updateClientWarningSettings } = useClientStore();
  const { barbers } = useStaffStore();
  const { branches } = useBranchStore();
  
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Obtener datos del cliente actual
  const currentClient = getCurrentClientData(user);
  
  const [warningSettings, setWarningSettings] = useState({
    enabled: currentClient?.warningEnabled !== false,
    interval: currentClient?.cutoffWarningInterval || 15
  });

  const clientAppointments = currentClient ? getAppointmentsByClient(currentClient.id) : [];
  const upcomingAppointments = clientAppointments.filter(apt => 
    new Date(apt.date) >= new Date() && apt.status !== 'cancelled'
  );
  const nextAppointment = upcomingAppointments[0];

  const preferredBarber = barbers.find(b => b.id === currentClient?.preferredBarber) || barbers[0];
  const preferredBranch = branches.find(b => b.id === currentClient?.preferredBranch);
  const tier = currentClient ? calculateLoyaltyTier(currentClient) : 'Bronze';

  const recentHistory = clientAppointments
    .filter(apt => apt.status === 'completed')
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const availableRewards = [
    { points: 100, reward: 'Descuento 10%', description: 'En cualquier servicio' },
    { points: 200, reward: 'Servicio Gratis', description: 'Corte básico' },
    { points: 300, reward: 'Descuento 25%', description: 'Combo completo' }
  ];

  const handleWarningSettingsChange = (field, value) => {
    setWarningSettings(prev => ({ ...prev, [field]: value }));
    if (currentClient) {
      updateClientWarningSettings(currentClient.id, 
        field === 'interval' ? value : warningSettings.interval,
        field === 'enabled' ? value : warningSettings.enabled
      );
    }
  };

  const getDaysSinceLastVisit = () => {
    if (!currentClient?.lastVisit) return 'Nunca';
    const days = Math.floor((new Date() - new Date(currentClient.lastVisit)) / (1000 * 60 * 60 * 24));
    return `${days} días`;
  };

  // Mostrar mensaje si no hay datos del cliente
  if (!currentClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500">No se encontraron datos del cliente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600/20 via-primary-500/25 to-primary-600/20 rounded-lg p-6 relative overflow-hidden shadow-lg border border-primary-400/20">
        {/* Premium golden overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-400/5 to-transparent" />
        
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">¡Hola, {currentClient.name}!</h1>
            <p className="text-gray-700 dark:text-gray-300">Bienvenido a tu área personal</p>
            <div className="flex items-center space-x-4 mt-3">
              <span className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-medium border border-primary-300 dark:border-primary-700">
                Categoría {tier}
              </span>
              <span className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-medium border border-primary-300 dark:border-primary-700">
                {currentClient.loyaltyPoints} puntos
              </span>
            </div>
          </div>
          <div className="text-right">
            <button
              onClick={() => setShowProfile(true)}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-all font-medium shadow-md hover:shadow-lg"
            >
              Ver Perfil
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section - Horarios y CTA Principal */}
      <div className="bg-gradient-to-r from-primary-100 via-primary-50 to-primary-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-xl p-6 relative overflow-hidden shadow-lg border border-primary-300 dark:border-gray-600">
        {/* Golden overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-400/5 to-transparent" />
        
        <div className="relative flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
          {/* Información de Horarios */}
          <div className="flex items-center space-x-6">
            <div className="p-4 bg-primary-200 dark:bg-primary-900/30 backdrop-blur-sm rounded-full">
              <FiClock className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {preferredBranch?.name || 'Tu Barbería'}
              </h2>
              <div className="flex items-center space-x-3">
                <BranchStatus branchId={preferredBranch?.id || 1} showText={true} />
              </div>
              {preferredBranch && (
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 flex items-center">
                  <FiMapPin className="h-4 w-4 mr-1" />
                  {preferredBranch.address}
                </p>
              )}
            </div>
          </div>

          {/* CTA Principal */}
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {nextAppointment && (
              <div className="text-center sm:text-right">
                <p className="text-primary-600 dark:text-primary-400 font-medium text-sm">Próxima cita</p>
                <p className="text-gray-700 dark:text-white text-sm">
                  {new Date(nextAppointment.date).toLocaleDateString()} • {nextAppointment.time}
                </p>
              </div>
            )}
            <button
              onClick={() => setShowAppointmentForm(true)}
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
            >
              <FiPlus className="h-5 w-5" />
              <span>{nextAppointment ? 'Nueva Cita' : 'Reservar Ahora'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setShowProfile(true)}
          className="card hover:shadow-lg transition-all text-left group hover:border-primary-400/40"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
              <FiUser className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Mi Perfil</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Configuración</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => {/* Toggle rewards view */}}
          className="card hover:shadow-lg transition-all text-left group hover:border-primary-400/40"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
              <FiGift className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Recompensas</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{currentClient.loyaltyPoints} puntos</p>
            </div>
          </div>
        </button>

        <button
          className="card hover:shadow-lg transition-all text-left group hover:border-primary-400/40"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
              <FiClock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Mi Historial</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{currentClient.totalVisits} visitas</p>
            </div>
          </div>
        </button>
      </div>

      {/* Status Overview - Información consolidada */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mi Progreso */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <FiStar className="h-5 w-5 text-primary-500 mr-2" />
              Mi Progreso
            </h3>
            <span className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 px-3 py-1 rounded-full text-sm font-medium">
              {tier}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{currentClient.loyaltyPoints}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Puntos</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{currentClient.totalVisits}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Visitas</div>
            </div>
          </div>

          {/* Próxima recompensa disponible */}
          {currentClient.loyaltyPoints >= 100 && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-2">
                <FiGift className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  ¡Tienes descuentos disponibles!
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Mi Barbero y Sucursal */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
            <FiUser className="h-5 w-5 text-green-500 mr-2" />
            Mis Preferencias
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <FiUser className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">
                  {preferredBarber?.name || 'Sin barbero preferido'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {preferredBarber?.specialties?.[0] || 'Selecciona tu barbero favorito'}
                </div>
              </div>
            </div>

            {preferredBranch && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <FiMapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {preferredBranch.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {preferredBranch.city}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent History */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Historial Reciente
            </h3>
            <FiClock className="h-5 w-5 text-gray-400" />
          </div>
          
          {recentHistory.length > 0 ? (
            <div className="space-y-4">
              {recentHistory.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <FiCalendar className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {appointment.services?.map(s => s).join(', ') || 'Servicio'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(appointment.date).toLocaleDateString()} • {appointment.barberName}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      S/{appointment.totalPrice?.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      +{Math.floor(appointment.totalPrice / 25)} pts
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FiClock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No hay historial de citas</p>
            </div>
          )}
        </div>

        {/* Rewards & Info */}
        <div className="space-y-6">
          {/* Available Rewards */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recompensas Disponibles
            </h3>
            <div className="space-y-3">
              {availableRewards.map((reward, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    currentClient.loyaltyPoints >= reward.points
                      ? 'border-green-200 bg-green-50 dark:bg-green-900'
                      : 'border-gray-200 bg-gray-50 dark:bg-dark-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {reward.reward}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {reward.description}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-semibold ${
                        currentClient.loyaltyPoints >= reward.points
                          ? 'text-green-600'
                          : 'text-gray-500'
                      }`}>
                        {reward.points} pts
                      </div>
                      {currentClient.loyaltyPoints >= reward.points && (
                        <button className="text-xs bg-green-600 text-white px-2 py-1 rounded mt-1">
                          Canjear
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warning Configuration */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <FiBell className="h-5 w-5 text-yellow-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Configuración de Avisos
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Recibir notificaciones
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={warningSettings.enabled}
                    onChange={(e) => handleWarningSettingsChange('enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500"></div>
                </label>
              </div>

              {warningSettings.enabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Frecuencia de Avisos
                    </label>
                    <select
                      value={warningSettings.interval}
                      onChange={(e) => handleWarningSettingsChange('interval', parseInt(e.target.value))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-dark-700 dark:border-dark-600 dark:text-white"
                    >
                      <option value={7}>Cada 7 días</option>
                      <option value={10}>Cada 10 días</option>
                      <option value={15}>Cada 15 días</option>
                      <option value={20}>Cada 20 días</option>
                      <option value={30}>Cada 30 días</option>
                    </select>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900 p-3 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <FiSettings className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div className="text-sm text-yellow-800 dark:text-yellow-200">
                        <p className="font-medium mb-1">Estado:</p>
                        <p>Última visita: <strong>{getDaysSinceLastVisit()}</strong></p>
                        <p>Próximo aviso en: <strong>
                          {currentClient.lastVisit 
                            ? Math.max(0, warningSettings.interval - Math.floor((new Date() - new Date(currentClient.lastVisit)) / (1000 * 60 * 60 * 24)))
                            : warningSettings.interval
                          } días
                        </strong></p>
                        {currentClient.lastWarningDate && (
                          <p>Último aviso: <strong>{new Date(currentClient.lastWarningDate).toLocaleDateString()}</strong></p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {!warningSettings.enabled && (
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No recibirás recordatorios automáticos
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Branch Info */}
          {preferredBranch && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Mi Sede Preferida
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FiMapPin className="h-5 w-5 text-primary-500" />
                  <div>
                    <div className="font-medium">{preferredBranch.name}</div>
                    <div className="text-sm text-gray-600">{preferredBranch.address}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Horarios:</strong><br />
                  Lun-Vie: 8:00 AM - 8:00 PM<br />
                  Sáb: 8:00 AM - 6:00 PM<br />
                  Dom: 9:00 AM - 5:00 PM
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAppointmentForm && (
        <ClientAppointmentForm
          client={currentClient}
          onClose={() => setShowAppointmentForm(false)}
          onSuccess={() => setShowAppointmentForm(false)}
        />
      )}

      {showProfile && (
        <ClientProfile
          client={currentClient}
          onClose={() => setShowProfile(false)}
          onEdit={() => setShowProfile(false)}
        />
      )}
    </div>
  );
};

export default ClientDashboard;