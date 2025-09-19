import { cn } from '../../styles/components';

const Tabs = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const baseClasses = {
    container: 'border-b border-gray-200 dark:border-gray-700',
    list: 'flex space-x-8',
    tab: {
      base: `
        py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200
        cursor-pointer focus:outline-none
      `,
      active: `
        border-primary-500 text-primary-600 dark:text-primary-400
      `,
      inactive: `
        border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300
        dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600
      `
    }
  };

  const sizeClasses = {
    sm: 'text-xs py-1 px-1',
    md: 'text-sm py-2 px-1',
    lg: 'text-base py-3 px-2'
  };

  const variantClasses = {
    default: '',
    pills: {
      list: 'bg-gray-100 dark:bg-gray-800 p-1 rounded-lg',
      tab: {
        base: 'px-3 py-1.5 rounded-md transition-all duration-200',
        active: 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm',
        inactive: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
      }
    }
  };

  const getTabClasses = (isActive, tabId) => {
    if (variant === 'pills') {
      return cn(
        variantClasses.pills.tab.base,
        sizeClasses[size],
        isActive ? variantClasses.pills.tab.active : variantClasses.pills.tab.inactive
      );
    }

    return cn(
      baseClasses.tab.base,
      sizeClasses[size],
      isActive ? baseClasses.tab.active : baseClasses.tab.inactive
    );
  };

  const getListClasses = () => {
    if (variant === 'pills') {
      return cn(variantClasses.pills.list, className);
    }
    return cn(baseClasses.list, className);
  };

  return (
    <div className={variant === 'default' ? baseClasses.container : ''}>
      <nav className={getListClasses()}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={getTabClasses(isActive)}
              type="button"
            >
              <span className="flex items-center">
                {Icon && (
                  <Icon className="w-4 h-4 mr-2" />
                )}
                {tab.name}
                {tab.badge && (
                  <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-1.5 py-0.5 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Tabs;