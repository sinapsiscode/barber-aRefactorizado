/**
 * Sidebar de navegación para configuraciones
 */
const SettingsSidebar = ({ tabs, activeTab, onTabChange }) => {
  return (
    <nav className="space-y-1">
      {tabs.map((tab) => (
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
  );
};

export default SettingsSidebar;
