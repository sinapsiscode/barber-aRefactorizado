import { FiSave } from 'react-icons/fi';
import { SETTINGS_TEXTS } from '../../constants/settingsPage';

const SettingsLayout = ({
  availableTabs,
  activeTab,
  onTabChange,
  onSave,
  children
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SettingsHeader />

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <SettingsSidebar
            availableTabs={availableTabs}
            activeTab={activeTab}
            onTabChange={onTabChange}
          />

          <SettingsContent onSave={onSave}>
            {children}
          </SettingsContent>
        </div>
      </div>
    </div>
  );
};

const SettingsHeader = () => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
      {SETTINGS_TEXTS.MAIN_TITLE}
    </h1>
    <p className="text-gray-600 dark:text-gray-400 mt-2">
      {SETTINGS_TEXTS.MAIN_SUBTITLE}
    </p>
  </div>
);

const SettingsSidebar = ({ availableTabs, activeTab, onTabChange }) => (
  <div className="lg:col-span-1">
    <nav className="space-y-1">
      {availableTabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === tab.id
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
              : 'text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
          }`}
        >
          <tab.icon className="h-5 w-5 mr-3" />
          {tab.name}
        </button>
      ))}
    </nav>
  </div>
);

const SettingsContent = ({ onSave, children }) => (
  <div className="mt-8 lg:mt-0 lg:col-span-3">
    {children}

    <div className="mt-8 flex justify-end">
      <button
        onClick={onSave}
        className="btn-primary flex items-center space-x-2"
      >
        <FiSave className="h-4 w-4" />
        <span>{SETTINGS_TEXTS.SAVE_CHANGES}</span>
      </button>
    </div>
  </div>
);

export default SettingsLayout;