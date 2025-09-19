// ===================================================================
// 👤 PERFIL DE CLIENTE - COMPONENTE PRINCIPAL REFACTORIZADO
// ===================================================================
// Componente principal del perfil de cliente completamente refactorizado
import React from 'react';
import { FiStar } from 'react-icons/fi';
import {
  CLIENT_PROFILE_LABELS,
  CLIENT_RECOMMENDATION_TYPES
} from '../../constants';
import { useClientProfile, useAuth } from '../../hooks';
import { Modal, Tabs } from '../common';
import {
  ClientHeader,
  ContactInfo,
  ClientStats,
  WarningConfig,
  SecuritySection
} from './profile';
import ClientAppointmentForm from './ClientAppointmentForm';

const ClientProfile = ({ client, onClose, onEdit }) => {
  const { user } = useAuth();
  const {
    showAppointmentForm,
    warningSettings,
    tier,
    recommendations,
    getTierColor,
    handleWarningSettingsChange,
    getDaysSinceLastVisit,
    calculateNextWarningDays,
    getRecommendationStyle,
    handleRedeemPoints,
    handleAppointmentSuccess,
    handleClearSecurityFlags,
    setShowAppointmentForm
  } = useClientProfile(client, onClose);

  // Historial mock simplificado para demostración
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
      date: '2023-11-10',
      service: 'Corte Clásico',
      barber: 'Ana García',
      price: 30,
      rating: 5
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const renderRecommendations = () => {
    if (!recommendations || recommendations.length === 0) return null;

    return (
      <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700">
        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
          {CLIENT_PROFILE_LABELS.SECTIONS.RECOMMENDATIONS}
        </h4>
        <div className="space-y-3">
          {recommendations.map((rec, index) => {
            const style = getRecommendationStyle(rec.type);
            return (
              <div
                key={index}
                className={`p-3 rounded-lg border-l-4 ${style.borderColor} ${style.bgColor}`}
              >
                <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                  {rec.title}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {rec.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAppointmentHistory = () => (
    <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700">
      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
        {CLIENT_PROFILE_LABELS.SECTIONS.APPOINTMENT_HISTORY}
      </h4>
      <div className="space-y-4">
        {mockAppointmentHistory.map((appointment) => (
          <div key={appointment.id} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {appointment.service}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(appointment.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {appointment.barber}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-1">
                    {renderStars(appointment.rating)}
                  </div>
                  <span className="font-semibold text-green-600">
                    S/{appointment.price}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotes = () => {
    if (!client.notes) return null;

    return (
      <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700">
        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
          {CLIENT_PROFILE_LABELS.SECTIONS.NOTES}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {client.notes}
        </p>
      </div>
    );
  };

  const tabsData = [
    {
      id: 'general',
      label: 'General',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <ContactInfo client={client} />
            <ClientStats client={client} />
          </div>
          <div className="space-y-6">
            <WarningConfig
              client={client}
              warningSettings={warningSettings}
              onWarningSettingsChange={handleWarningSettingsChange}
              getDaysSinceLastVisit={getDaysSinceLastVisit}
              calculateNextWarningDays={calculateNextWarningDays}
            />
            <SecuritySection
              client={client}
              onClearSecurityFlags={handleClearSecurityFlags}
              user={user}
            />
          </div>
        </div>
      )
    },
    {
      id: 'history',
      label: 'Historial',
      content: (
        <div className="space-y-6">
          {renderAppointmentHistory()}
          {renderRecommendations()}
          {renderNotes()}
        </div>
      )
    }
  ];

  return (
    <>
      <Modal
        isOpen={true}
        onClose={onClose}
        title=""
        size="6xl"
        className="h-[90vh] overflow-hidden"
      >
        <div className="space-y-6 h-full flex flex-col">
          <ClientHeader
            client={client}
            tier={tier}
            getTierColor={getTierColor}
            onEdit={onEdit}
            onNewAppointment={() => setShowAppointmentForm(true)}
            onRedeemPoints={handleRedeemPoints}
          />

          <div className="flex-1 overflow-hidden">
            <Tabs
              tabs={tabsData}
              defaultTab="general"
              className="h-full"
            />
          </div>
        </div>
      </Modal>

      {showAppointmentForm && (
        <ClientAppointmentForm
          clientData={{
            name: client.name,
            email: client.email,
            phone: client.phone
          }}
          onClose={() => setShowAppointmentForm(false)}
          onSuccess={handleAppointmentSuccess}
        />
      )}
    </>
  );
};

export default ClientProfile;