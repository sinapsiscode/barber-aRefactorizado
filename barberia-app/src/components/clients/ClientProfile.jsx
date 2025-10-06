import { useState } from 'react';
import { FiX, FiEdit, FiGift, FiCalendar, FiPhone, FiMail, FiMapPin, FiStar, FiBell, FiSettings, FiAlertTriangle, FiShield, FiXCircle, FiUserX } from 'react-icons/fi';
import { useClientStore, useAuthStore } from '../../stores';
import ClientAppointmentForm from './ClientAppointmentForm';
import { getPaymentMethodName } from '../../utils/paymentUtils';
import Swal from 'sweetalert2';

const ClientProfile = ({ client, onClose, onEdit }) => {
  const { calculateLoyaltyTier, getLoyaltyRecommendations, updateClientWarningSettings, clearSecurityFlags } = useClientStore();
  const { user } = useAuthStore();
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [warningSettings, setWarningSettings] = useState({
    enabled: client.warningEnabled !== false,
    interval: client.cutoffWarningInterval || 15
  });
  
  const tier = calculateLoyaltyTier(client);
  const recommendations = getLoyaltyRecommendations(client.id);

  const getTierColor = (tierName) => {
    const colors = {
      'Platinum': 'bg-purple-100 text-purple-800 border-purple-300',
      'Gold': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Silver': 'bg-gray-100 text-gray-800 border-gray-300',
      'Bronze': 'bg-orange-100 text-orange-800 border-orange-300'
    };
    return colors[tierName] || colors['Bronze'];
  };

  const handleWarningSettingsChange = (field, value) => {
    setWarningSettings(prev => ({ ...prev, [field]: value }));
    updateClientWarningSettings(client.id, 
      field === 'interval' ? value : warningSettings.interval,
      field === 'enabled' ? value : warningSettings.enabled
    );
  };

  const getDaysSinceLastVisit = () => {
    if (!client.lastVisit) return 'Nunca';
    const days = Math.floor((new Date() - new Date(client.lastVisit)) / (1000 * 60 * 60 * 24));
    return `${days} días`;
  };

  const mockAppointmentHistory = [
    {
      id: 1,
      date: '2024-01-15',
      service: 'Corte + Barba',
      barber: 'Miguel Rodríguez',
      price: 40,
      rating: 5
    },
    {
      id: 2,
      date: '2023-12-20',
      service: 'Fade Moderno',
      barber: 'Luis Martínez',
      price: 35,
      rating: 4
    },
    {
      id: 3,
      date: '2023-11-28',
      service: 'Corte Clásico',
      barber: 'Miguel Rodríguez',
      price: 25,
      rating: 5
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white dark:bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white dark:bg-dark-800 px-6 py-4 border-b border-gray-200 dark:border-dark-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-medium">
                    {client.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    {client.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTierColor(tier)}`}>
                      {tier}
                    </span>
                    <div className="flex items-center space-x-1">
                      <FiGift className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {client.loyaltyPoints} puntos
                      </span>
                    </div>
                    {/* Solo visible para staff/admin, NO para el propio cliente */}
                    {user?.role !== 'client' && client.isUnwelcome && (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full flex items-center space-x-1">
                        <FiUserX className="h-3 w-3" />
                        <span>NO GRATO</span>
                      </span>
                    )}
                    {user?.role !== 'client' && client.securityFlags?.blacklisted && (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full flex items-center space-x-1">
                        <FiAlertTriangle className="h-3 w-3" />
                        <span>BLOQUEADO</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={onEdit}
                  className="btn-secondary"
                >
                  <FiEdit className="h-4 w-4 mr-2" />
                  Editar
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Client Info */}
              <div className="lg:col-span-1 space-y-6">
                {/* Contact Information */}
                <div className="card">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                    Información de Contacto
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <FiMail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">{client.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FiPhone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">{client.phone}</span>
                    </div>
                    {client.address && (
                      <div className="flex items-center space-x-3">
                        <FiMapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900 dark:text-white">{client.address}</span>
                      </div>
                    )}
                    {client.birthDate && (
                      <div className="flex items-center space-x-3">
                        <FiCalendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {new Date(client.birthDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Unwelcome Status Alert - Solo visible para staff/admin */}
                {user?.role !== 'client' && client.isUnwelcome && (
                  <div className="card border-red-200 bg-red-50 dark:bg-red-900/20">
                    <div className="flex items-start space-x-3">
                      <FiUserX className="h-5 w-5 text-red-500 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-md font-semibold text-red-900 dark:text-red-100 mb-2">
                          Cliente No Grato
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p className="text-red-800 dark:text-red-200">
                            <strong>Motivo:</strong> {client.unwelcomeReason}
                          </p>
                          <p className="text-red-700 dark:text-red-300">
                            <strong>Fecha:</strong> {new Date(client.unwelcomeDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="card">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                    Estadísticas
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Total Visitas</span>
                      <span className="font-semibold text-blue-600">{client.totalVisits}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Total Gastado</span>
                      <span className="font-semibold text-green-600">
                        S/{client.totalSpent?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Puntos Disponibles</span>
                      <span className="font-semibold text-yellow-600">{client.loyaltyPoints}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Última Visita</span>
                      <span className="font-semibold">
                        {client.lastVisit 
                          ? new Date(client.lastVisit).toLocaleDateString()
                          : 'Nunca'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Cliente desde</span>
                      <span className="font-semibold">
                        {new Date(client.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Warning Configuration */}
                <div className="card">
                  <div className="flex items-center space-x-2 mb-4">
                    <FiBell className="h-5 w-5 text-yellow-500" />
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white">
                      Configuración de Avisos
                    </h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Notificaciones habilitadas
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
                            Intervalo de Aviso
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
                              <p className="font-medium mb-1">Estado Actual:</p>
                              <p>Días desde última visita: <strong>{getDaysSinceLastVisit()}</strong></p>
                              <p>Próximo aviso en: <strong>
                                {client.lastVisit 
                                  ? Math.max(0, warningSettings.interval - Math.floor((new Date() - new Date(client.lastVisit)) / (1000 * 60 * 60 * 24)))
                                  : warningSettings.interval
                                } días
                              </strong></p>
                              {client.lastWarningDate && (
                                <p>Último aviso: <strong>{new Date(client.lastWarningDate).toLocaleDateString()}</strong></p>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {!warningSettings.enabled && (
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Las notificaciones están deshabilitadas para este cliente
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preferences */}
                {client.preferredServices && client.preferredServices.length > 0 && (
                  <div className="card">
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                      Servicios Preferidos
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {client.preferredServices.map((service, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {/* SECCIÓN DE ALERTAS DE SEGURIDAD
                    Solo visible para admin/superadmin cuando el cliente tiene problemas
                    Muestra:
                    - Resumen de banderas de seguridad
                    - Historial completo de rechazos
                    - Opción para limpiar banderas (solo si está bloqueado) */}
                {(user?.role === 'super_admin' || user?.role === 'branch_admin') && 
                 (client.securityFlags?.falseVouchersCount > 0 || client.paymentHistory?.length > 0) && (
                  <div className="card border-2 border-red-200 dark:border-red-800">
                    <div className="flex items-center space-x-2 mb-4">
                      <FiShield className="h-5 w-5 text-red-500" />
                      <h4 className="text-md font-semibold text-red-800 dark:text-red-200">
                        Alertas de Seguridad
                      </h4>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Resumen de banderas */}
                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-red-800 dark:text-red-200">
                            Estado de Seguridad
                          </span>
                          {client.securityFlags?.blacklisted && (
                            <span className="px-2 py-1 text-xs font-bold bg-red-600 text-white rounded">
                              BLOQUEADO
                            </span>
                          )}
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-red-700 dark:text-red-300">Vouchers falsos:</span>
                            <span className="font-bold text-red-900 dark:text-red-100">
                              {client.securityFlags?.falseVouchersCount || 0}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-red-700 dark:text-red-300">Pagos rechazados:</span>
                            <span className="font-bold text-red-900 dark:text-red-100">
                              {client.securityFlags?.rejectedPaymentsCount || 0}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Historial de rechazos */}
                      {client.paymentHistory && client.paymentHistory.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Historial de Rechazos
                          </h5>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {client.paymentHistory.map((rejection) => (
                              <div key={rejection.id} className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-xs">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-medium text-gray-900 dark:text-white">
                                      {new Date(rejection.date).toLocaleDateString()} - S/{rejection.amount}
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-400">
                                      {getPaymentMethodName(rejection.paymentMethod)} - N° {rejection.voucherNumber}
                                    </div>
                                    <div className="text-red-600 dark:text-red-400 italic">
                                      "{rejection.reason}"
                                    </div>
                                  </div>
                                  <div className="text-gray-500 dark:text-gray-400">
                                    por {rejection.verifiedBy}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* BOTÓN DE ACCIÓN - Solo aparece si el cliente está bloqueado
                          Permite al admin dar una segunda oportunidad limpiando las banderas */}
                      {client.securityFlags?.blacklisted && (
                        <div className="pt-2 border-t border-red-200 dark:border-red-800">
                          <button
                            onClick={async () => {
                              const result = await Swal.fire({
                                title: '¿Limpiar banderas de seguridad?',
                                text: 'Esto eliminará todas las marcas de seguridad y reactivará al cliente',
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonText: 'Sí, limpiar',
                                cancelButtonText: 'Cancelar',
                                confirmButtonColor: '#10b981'
                              });
                              
                              if (result.isConfirmed) {
                                clearSecurityFlags(client.id);
                                Swal.fire({
                                  icon: 'success',
                                  title: 'Banderas limpiadas',
                                  text: 'El cliente ha sido reactivado',
                                  confirmButtonColor: '#ffc000'
                                });
                                onClose();
                              }
                            }}
                            className="text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center space-x-1"
                          >
                            <FiXCircle className="h-4 w-4" />
                            <span>Limpiar banderas de seguridad</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* History and Recommendations */}
              <div className="lg:col-span-2 space-y-6">
                {/* Recommendations */}
                {recommendations.length > 0 && (
                  <div className="card">
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                      Recomendaciones Personalizadas
                    </h4>
                    <div className="space-y-3">
                      {recommendations.map((rec, index) => (
                        <div key={index} className={`p-3 rounded-lg border-l-4 ${
                          rec.type === 'service' ? 'border-blue-400 bg-blue-50 dark:bg-blue-900' :
                          rec.type === 'loyalty' ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900' :
                          'border-green-400 bg-green-50 dark:bg-green-900'
                        }`}>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {rec.title}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {rec.description}
                          </div>
                          {rec.discount && (
                            <div className="text-sm font-medium text-green-600 mt-1">
                              {rec.discount}% de descuento disponible
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Appointment History */}
                <div className="card">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                    Historial de Citas
                  </h4>
                  <div className="space-y-4">
                    {mockAppointmentHistory.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {appointment.service}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {appointment.barber} • {new Date(appointment.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="font-semibold text-green-600">
                              S/{appointment.price.toLocaleString()}
                            </div>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < appointment.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {client.notes && (
                  <div className="card">
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                      Notas
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">{client.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-dark-700 px-6 py-3 flex justify-between">
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowAppointmentForm(true)}
                className="btn-secondary text-sm"
              >
                <FiCalendar className="h-4 w-4 mr-1" />
                Nueva Cita
              </button>
              <button 
                onClick={() => {
                  // Mostrar los puntos disponibles y recompensas
                  alert(`Tienes ${client.loyaltyPoints} puntos disponibles.\n\nRecompensas disponibles:\n• 100 pts: Descuento 10%\n• 200 pts: Servicio Gratis\n• 300 pts: Descuento 25%`);
                }}
                className="btn-secondary text-sm"
              >
                <FiGift className="h-4 w-4 mr-1" />
                Canjear Puntos
              </button>
            </div>
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
      
      {/* Modal de Nueva Cita */}
      {showAppointmentForm && (
        <ClientAppointmentForm
          client={client}
          onClose={() => setShowAppointmentForm(false)}
          onSuccess={() => {
            setShowAppointmentForm(false);
            // Mostrar mensaje de éxito
            Swal.fire({
              icon: 'success',
              title: 'Cita Creada',
              text: 'Tu cita ha sido programada exitosamente',
              confirmButtonColor: '#ffc000'
            });
          }}
        />
      )}
    </div>
  );
};

export default ClientProfile;