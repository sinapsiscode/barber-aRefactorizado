import { useSettings } from '../hooks/useSettings';
import SettingsLayout from '../components/settings/SettingsLayout';
import ProfileTab from '../components/settings/tabs/ProfileTab';
import NotificationsTab from '../components/settings/tabs/NotificationsTab';
import SecurityTab from '../components/settings/tabs/SecurityTab';
import PreferencesTab from '../components/settings/tabs/PreferencesTab';
import BarberScheduleTab from '../components/settings/tabs/BarberScheduleTab';
import BackgroundSettings from '../components/settings/BackgroundSettings';
import { TAB_IDS } from '../constants/settingsPage';

const Settings = () => {
  const {
    user,
    activeTab,
    formData,
    notifications,
    availableTabs,
    themeMode,
    isDark,
    handleTabChange,
    handleFormChange,
    handleNotificationChange,
    handleThemeChange,
    handleSave,
    handlePasswordChange,
    handleSetup2FA
  } = useSettings();


  const renderTabContent = () => {
    switch (activeTab) {
      case TAB_IDS.PROFILE:
        return (
          <ProfileTab
            user={user}
            formData={formData}
            onFormChange={handleFormChange}
          />
        );
      case TAB_IDS.NOTIFICATIONS:
        return (
          <NotificationsTab
            user={user}
            notifications={notifications}
            onNotificationChange={handleNotificationChange}
          />
        );
      case TAB_IDS.SECURITY:
        return (
          <SecurityTab
            onPasswordChange={handlePasswordChange}
            onSetup2FA={handleSetup2FA}
          />
        );
      case TAB_IDS.BACKGROUND:
        return <BackgroundSettings />;
      case TAB_IDS.PREFERENCES:
        return (
          <PreferencesTab
            themeMode={themeMode}
            isDark={isDark}
            onThemeChange={handleThemeChange}
          />
        );
      case TAB_IDS.SCHEDULE:
        return <BarberScheduleTab />;
      default:
        return (
          <ProfileTab
            user={user}
            formData={formData}
            onFormChange={handleFormChange}
          />
        );
    }
  };

  return (
    <SettingsLayout
      availableTabs={availableTabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onSave={handleSave}
    >
      {renderTabContent()}
    </SettingsLayout>
  );
};

export default Settings;