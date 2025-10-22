import { useEffect } from 'react';
import { FiSave, FiCheck, FiLoader } from 'react-icons/fi';
import { useAuthStore } from '../stores';
import { useProfileSettings } from '../hooks/settings/useProfileSettings';
import { useNotificationSettings } from '../hooks/settings/useNotificationSettings';
import { useTabNavigation } from '../hooks/settings/useTabNavigation';
import SettingsSidebar from '../components/settings/SettingsSidebar';
import { ProfileTab, NotificationsTab, PreferencesTab } from '../components/settings/SettingsTabs';
import BackgroundSettings from '../components/settings/BackgroundSettings';
import BranchAdminsSettings from '../components/settings/BranchAdminsSettings';
import LoyaltySettings from '../components/settings/LoyaltySettings';
// Tabs complejos mantenidos inline (pueden refactorizarse después)
import SecurityTab from '../components/settings/SettingsTabs/SecurityTab';
import BarberScheduleTab from '../components/settings/SettingsTabs/BarberScheduleTab';
import BarberCommissionsTab from '../components/settings/SettingsTabs/BarberCommissionsTab';

/**
 * Página de Configuraciones Refactorizada
 * Reducido de 814 líneas a ~100 líneas
 */
const Settings = () => {
  const { user } = useAuthStore();

  // Hooks custom
  const {
    formData,
    avatarPreview,
    branches,
    handleAvatarUpload,
    updateFormData,
    handleSave,
    loadBranches,
    isSaving,
    saveSuccess
  } = useProfileSettings();

  const {
    notifications,
    toggleNotification
  } = useNotificationSettings();

  const {
    activeTab,
    availableTabs,
    changeTab
  } = useTabNavigation(user?.role);

  // Cargar sedes al montar
  useEffect(() => {
    if (!branches || branches.length === 0) {
      loadBranches();
    }
  }, [branches, loadBranches]);

  // Renderizar contenido del tab activo
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileTab
            user={user}
            formData={formData}
            avatarPreview={avatarPreview}
            branches={branches}
            onFormDataChange={updateFormData}
            onAvatarUpload={handleAvatarUpload}
          />
        );

      case 'notifications':
        return (
          <NotificationsTab
            notifications={notifications}
            onToggleNotification={toggleNotification}
          />
        );

      case 'security':
        return <SecurityTab />;

      case 'background':
        return <BackgroundSettings />;

      case 'preferences':
        return <PreferencesTab />;

      case 'schedule':
        return <BarberScheduleTab user={user} />;

      case 'commissions':
        return <BarberCommissionsTab />;

      case 'admins':
        return <BranchAdminsSettings />;

      case 'loyalty':
        return <LoyaltySettings />;

      default:
        return (
          <ProfileTab
            user={user}
            formData={formData}
            avatarPreview={avatarPreview}
            branches={branches}
            onFormDataChange={updateFormData}
            onAvatarUpload={handleAvatarUpload}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Configuración
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gestiona tu cuenta y preferencias de la aplicación
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SettingsSidebar
              tabs={availableTabs}
              activeTab={activeTab}
              onTabChange={changeTab}
            />
          </div>

          {/* Content */}
          <div className="mt-8 lg:mt-0 lg:col-span-3">
            {renderTabContent()}

            {/* Save Button */}
            {(activeTab === 'profile' || activeTab === 'notifications' || activeTab === 'preferences') && (
              <div className="mt-8 flex justify-end items-center space-x-3">
                {saveSuccess && (
                  <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 animate-fadeIn">
                    <FiCheck className="h-5 w-5" />
                    <span className="text-sm font-medium">Cambios guardados exitosamente</span>
                  </div>
                )}
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`btn-primary flex items-center space-x-2 min-w-[180px] justify-center transition-all ${
                    isSaving ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg'
                  }`}
                >
                  {isSaving ? (
                    <>
                      <FiLoader className="h-4 w-4 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : saveSuccess ? (
                    <>
                      <FiCheck className="h-4 w-4" />
                      <span>Guardado</span>
                    </>
                  ) : (
                    <>
                      <FiSave className="h-4 w-4" />
                      <span>Guardar Cambios</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
