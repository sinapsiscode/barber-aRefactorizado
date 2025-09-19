// ===================================================================
// 🧑‍💼 DASHBOARD DE CLIENTE - REFACTORIZADO
// ===================================================================
// Dashboard principal para el rol de cliente
import React from 'react';
import { FiClock, FiPlus, FiMapPin, FiUser, FiGift } from 'react-icons/fi';
import { BranchStatus } from '../common';
import ClientAppointmentForm from '../clients/ClientAppointmentForm';
import ClientProfile from '../clients/ClientProfile';
import { useClientDashboard } from '../../hooks';
import {
  ClientRewards,
  ClientHistory,
  ClientPreferences,
  ClientProgress,
  ClientWarningSettings,
  ClientBranchInfo
} from './components';

const ClientDashboard = () => {
  const {
    currentClient,
    showAppointmentForm,
    showProfile,
    warningSettings,
    nextAppointment,
    preferredBarber,
    preferredBranch,
    tier,
    recentHistory,
    availableRewards,
    setShowAppointmentForm,
    setShowProfile,
    handleWarningSettingsChange,
    getDaysSinceLastVisit,
    getNextWarningDays
  } = useClientDashboard();

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
        <ClientProgress
          loyaltyPoints={currentClient.loyaltyPoints}
          totalVisits={currentClient.totalVisits}
          tier={tier}
        />

        <ClientPreferences
          preferredBarber={preferredBarber}
          preferredBranch={preferredBranch}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ClientHistory recentHistory={recentHistory} />
        </div>

        <div className="space-y-6">
          <ClientRewards
            availableRewards={availableRewards}
            loyaltyPoints={currentClient.loyaltyPoints}
          />

          <ClientWarningSettings
            warningSettings={warningSettings}
            onSettingsChange={handleWarningSettingsChange}
            getDaysSinceLastVisit={getDaysSinceLastVisit}
            getNextWarningDays={getNextWarningDays}
            lastWarningDate={currentClient.lastWarningDate}
          />

          <ClientBranchInfo preferredBranch={preferredBranch} />
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