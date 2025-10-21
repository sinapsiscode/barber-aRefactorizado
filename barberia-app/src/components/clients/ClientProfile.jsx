import { useState } from 'react';
import { useAuthStore } from '../../stores';
import { useClientProfileData } from '../../hooks/clientProfile/useClientProfileData';
import { useWarningSettings } from '../../hooks/clientProfile/useWarningSettings';
import { useSecurityActions } from '../../hooks/clientProfile/useSecurityActions';
import ClientAppointmentForm from './ClientAppointmentForm';
import Swal from 'sweetalert2';
import { CLIENT_PROFILE_TEXTS } from '../../constants/clientProfile';

// Componentes modulares
import ClientProfileHeader from './clientProfile/ClientProfileHeader';
import ContactInfo from './clientProfile/ContactInfo';
import UnwelcomeAlert from './clientProfile/UnwelcomeAlert';
import ClientStats from './clientProfile/ClientStats';
import WarningSettings from './clientProfile/WarningSettings';
import PreferredServices from './clientProfile/PreferredServices';
import SecurityAlerts from './clientProfile/SecurityAlerts';
import RecommendationsPanel from './clientProfile/RecommendationsPanel';
import AppointmentHistory from './clientProfile/AppointmentHistory';
import ClientNotes from './clientProfile/ClientNotes';
import ClientProfileFooter from './clientProfile/ClientProfileFooter';

/**
 * ClientProfile Refactorizado
 * Reducido de 577 líneas a ~140 líneas
 *
 * Funcionalidades:
 * - Visualización completa del perfil del cliente
 * - Información de contacto y estadísticas
 * - Sistema de avisos/recordatorios
 * - Alertas de seguridad (para admins)
 * - Recomendaciones personalizadas
 * - Historial de citas
 * - Acciones rápidas (nueva cita, canjear puntos)
 */
const ClientProfile = ({ client, onClose, onEdit }) => {
  const { user } = useAuthStore();
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  // Determinar si es vista de staff (no es el propio cliente viendo su perfil)
  const isStaffView = user?.role !== 'client';
  const isAdmin = user?.role === 'super_admin' || user?.role === 'branch_admin';

  // Hooks personalizados
  const {
    tier,
    recommendations,
    daysSinceLastVisit,
    getDaysUntilNextWarning
  } = useClientProfileData(client);

  const {
    warningSettings,
    handleWarningSettingsChange
  } = useWarningSettings(client);

  const {
    handleClearSecurityFlags,
    handleRedeemPoints
  } = useSecurityActions(client, onClose);

  const handleNewAppointment = () => {
    setShowAppointmentForm(true);
  };

  const handleAppointmentSuccess = () => {
    setShowAppointmentForm(false);
    Swal.fire({
      icon: 'success',
      title: CLIENT_PROFILE_TEXTS.appointmentCreatedTitle,
      text: CLIENT_PROFILE_TEXTS.appointmentCreatedText,
      confirmButtonColor: '#ffc000'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white dark:bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <ClientProfileHeader
            client={client}
            tier={tier}
            isStaffView={isStaffView}
            onEdit={onEdit}
            onClose={onClose}
          />

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Columna Izquierda - Info del Cliente */}
              <div className="lg:col-span-1 space-y-6">
                <ContactInfo client={client} />

                {/* Alerta de No Grato - Solo visible para staff */}
                {isStaffView && <UnwelcomeAlert client={client} />}

                <ClientStats client={client} />

                <WarningSettings
                  client={client}
                  warningSettings={warningSettings}
                  onSettingsChange={handleWarningSettingsChange}
                  daysSinceLastVisit={daysSinceLastVisit}
                  getDaysUntilNextWarning={getDaysUntilNextWarning}
                />

                <PreferredServices client={client} />

                {/* Alertas de Seguridad - Solo para admins */}
                {isAdmin && (
                  <SecurityAlerts
                    client={client}
                    onClearFlags={handleClearSecurityFlags}
                  />
                )}
              </div>

              {/* Columna Derecha - Historial y Recomendaciones */}
              <div className="lg:col-span-2 space-y-6">
                <RecommendationsPanel recommendations={recommendations} />
                <AppointmentHistory />
                <ClientNotes client={client} />
              </div>
            </div>
          </div>

          {/* Footer */}
          <ClientProfileFooter
            onNewAppointment={handleNewAppointment}
            onRedeemPoints={handleRedeemPoints}
            onClose={onClose}
          />
        </div>
      </div>

      {/* Modal de Nueva Cita */}
      {showAppointmentForm && (
        <ClientAppointmentForm
          client={client}
          onClose={() => setShowAppointmentForm(false)}
          onSuccess={handleAppointmentSuccess}
        />
      )}
    </div>
  );
};

export default ClientProfile;
