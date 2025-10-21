import { useState } from 'react';
import { useAuthStore } from '../../stores';
import { useClientDashboardData } from '../../hooks/clientDashboard/useClientDashboardData';
import { useClientRewards } from '../../hooks/clientDashboard/useClientRewards';
import { useWarningSettings } from '../../hooks/clientDashboard/useWarningSettings';
import { DASHBOARD_VIEWS, DASHBOARD_TEXTS } from '../../constants/clientDashboard';
import ClientAppointmentForm from '../clients/ClientAppointmentForm';
import ClientProfile from '../clients/ClientProfile';
import RewardsStore from '../loyalty/RewardsStore';
import PointsHistory from '../loyalty/PointsHistory';
import ActiveRewards from '../loyalty/ActiveRewards';
import BackButton from './clientDashboard/BackButton';
import ClientHeader from './clientDashboard/ClientHeader';
import HeroSection from './clientDashboard/HeroSection';
import QuickAccessButtons from './clientDashboard/QuickAccessButtons';
import ProgressCard from './clientDashboard/ProgressCard';
import PreferencesCard from './clientDashboard/PreferencesCard';
import RecentHistoryCard from './clientDashboard/RecentHistoryCard';
import LoyaltyActionsCard from './clientDashboard/LoyaltyActionsCard';
import WarningConfigCard from './clientDashboard/WarningConfigCard';
import BranchInfoCard from './clientDashboard/BranchInfoCard';

/**
 * ClientDashboard Refactorizado
 * Reducido de 617 líneas a ~120 líneas
 *
 * Funcionalidades:
 * - Vista de dashboard principal del cliente
 * - Gestión de vistas (store, history, activeRewards)
 * - Sistema de puntos y recompensas
 * - Configuración de avisos
 * - Historial de citas
 * - Información de preferencias
 */
const ClientDashboard = () => {
  const { user } = useAuthStore();
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [currentView, setCurrentView] = useState(DASHBOARD_VIEWS.DASHBOARD);

  // Hooks personalizados
  const {
    currentClient,
    nextAppointment,
    preferredBarber,
    preferredBranch,
    tier,
    recentHistory,
    getDaysSinceLastVisit
  } = useClientDashboardData(user);

  const {
    currentPoints,
    activeRewards,
    handleRewardRedeemed
  } = useClientRewards(currentClient);

  const {
    warningSettings,
    handleWarningSettingsChange,
    getDaysUntilNextWarning
  } = useWarningSettings(currentClient);

  // Renderizado condicional - Vista de Tienda
  if (currentView === DASHBOARD_VIEWS.STORE) {
    return (
      <div className="space-y-6">
        <BackButton onClick={() => setCurrentView(DASHBOARD_VIEWS.DASHBOARD)} />
        <RewardsStore clientId={currentClient?.id} onRewardRedeemed={handleRewardRedeemed} />
      </div>
    );
  }

  // Renderizado condicional - Vista de Historial
  if (currentView === DASHBOARD_VIEWS.HISTORY) {
    return (
      <div className="space-y-6">
        <BackButton onClick={() => setCurrentView(DASHBOARD_VIEWS.DASHBOARD)} />
        <PointsHistory clientId={currentClient?.id} />
      </div>
    );
  }

  // Renderizado condicional - Vista de Recompensas Activas
  if (currentView === DASHBOARD_VIEWS.ACTIVE_REWARDS) {
    return (
      <div className="space-y-6">
        <BackButton onClick={() => setCurrentView(DASHBOARD_VIEWS.DASHBOARD)} />
        <ActiveRewards clientId={currentClient?.id} />
      </div>
    );
  }

  // Mostrar mensaje si no hay datos del cliente
  if (!currentClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500">{DASHBOARD_TEXTS.notFound}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con saludo y tier */}
      <ClientHeader
        currentClient={currentClient}
        tier={tier}
        currentPoints={currentPoints}
        onViewProfile={() => setShowProfile(true)}
      />

      {/* Hero Section con horarios y CTA */}
      <HeroSection
        preferredBranch={preferredBranch}
        nextAppointment={nextAppointment}
        onBookAppointment={() => setShowAppointmentForm(true)}
      />

      {/* Botones de acceso rápido */}
      <QuickAccessButtons
        activeRewardsCount={activeRewards.length}
        onNavigate={setCurrentView}
        onShowProfile={() => setShowProfile(true)}
      />

      {/* Status Overview - Información consolidada */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressCard
          currentClient={currentClient}
          tier={tier}
          currentPoints={currentPoints}
          activeRewardsCount={activeRewards.length}
          onNavigateStore={() => setCurrentView(DASHBOARD_VIEWS.STORE)}
          onNavigateRewards={() => setCurrentView(DASHBOARD_VIEWS.ACTIVE_REWARDS)}
        />
        <PreferencesCard
          preferredBarber={preferredBarber}
          preferredBranch={preferredBranch}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentHistoryCard recentHistory={recentHistory} />

        {/* Columna lateral - Loyalty Actions */}
        <div className="space-y-6">
          <LoyaltyActionsCard
            currentPoints={currentPoints}
            activeRewardsCount={activeRewards.length}
            onNavigate={setCurrentView}
          />

          <WarningConfigCard
            currentClient={currentClient}
            warningSettings={warningSettings}
            onWarningSettingsChange={handleWarningSettingsChange}
            getDaysSinceLastVisit={getDaysSinceLastVisit}
            getDaysUntilNextWarning={getDaysUntilNextWarning}
          />

          <BranchInfoCard preferredBranch={preferredBranch} />
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
