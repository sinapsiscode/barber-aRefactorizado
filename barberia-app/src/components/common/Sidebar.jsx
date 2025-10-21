import {
  FiHome,
  FiCalendar,
  FiDollarSign,
  FiUsers,
  FiUserCheck,
  FiMapPin,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiScissors,
  FiCamera,
  FiList
} from 'react-icons/fi';
import { useAuthStore } from '../../stores';

const Sidebar = ({ isCollapsed, onToggle, currentPage, onPageChange, isMobileOpen = false, onMobileClose }) => {
  const { user, logout, canAccessModule } = useAuthStore();

  const menuItems = [
    {
      name: 'Dashboard',
      icon: FiHome,
      page: 'dashboard',
      permission: 'read'
    },
    {
      name: 'Citas',
      icon: FiCalendar,
      page: 'appointments',
      permission: 'read',
      module: 'appointments'
    },
    {
      name: 'Finanzas',
      icon: FiDollarSign,
      page: 'financial',
      permission: 'read',
      module: 'financial'
    },
    {
      name: 'Personal',
      icon: FiUserCheck,
      page: 'staff',
      permission: 'read',
      module: 'staff'
    },
    {
      name: 'Clientes',
      icon: FiUsers,
      page: 'clients',
      permission: 'read',
      module: 'clients'
    },
    {
      name: 'Servicios',
      icon: FiList,
      page: 'services',
      permission: 'read',
      module: 'services'
    },
    {
      name: 'Sedes',
      icon: FiMapPin,
      page: 'branches',
      permission: 'manage_all',
      module: 'branches'
    },
    {
      name: 'Portafolio',
      icon: FiCamera,
      page: 'portfolio',
      permission: 'read_portfolio',
      module: 'portfolio'
    }
  ];

  const handleLogout = async () => {
    logout();
  };

  // Función para obtener y ordenar los items del menú según el rol
  const getOrderedMenuItems = () => {
    let orderedPages = [];
    
    // Definir el orden específico para cada rol
    if (user?.role === 'client') {
      orderedPages = ['dashboard', 'services', 'appointments', 'portfolio'];
    } else if (user?.role === 'barber') {
      orderedPages = ['dashboard', 'appointments', 'services', 'portfolio'];
    } else if (user?.role === 'reception') {
      orderedPages = ['dashboard', 'appointments', 'clients', 'services', 'financial', 'portfolio'];
    } else if (user?.role === 'branch_admin') {
      orderedPages = ['dashboard', 'appointments', 'staff', 'clients', 'services', 'financial'];
    } else {
      // Para super admin, mantener el orden original
      return menuItems.filter(item => {
        if (item.module && !canAccessModule(item.module)) {
          return false;
        }
        return true;
      });
    }
    
    // Ordenar los items según el orden definido
    const orderedItems = [];
    orderedPages.forEach(page => {
      const item = menuItems.find(menuItem => menuItem.page === page);
      if (item && (!item.module || canAccessModule(item.module))) {
        orderedItems.push(item);
      }
    });
    
    return orderedItems;
  };

  const filteredMenuItems = getOrderedMenuItems();

  const handleMenuClick = (page) => {
    if (onPageChange) {
      onPageChange(page);
    }
    // Cerrar sidebar en mobile después de seleccionar
    if (onMobileClose && window.innerWidth < 1024) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50
        transition-all duration-300 bg-white dark:bg-black
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-64 lg:w-16' : 'w-64'}
      `}>
        <div className="flex flex-col h-full">
        {/* Header - always expanded on mobile */}
        <div className="p-3 sm:p-4">
          {/* Mobile & Desktop expanded */}
          {(!isCollapsed || window.innerWidth < 1024) && (
            <div className="flex items-center justify-between">
              <img
                src="/logo.png"
                alt="Awaken World"
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
              />
              <button
                onClick={onToggle}
                className="p-2 text-gray-700 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-gray-300 ripple hidden lg:block"
              >
                <FiMenu className="w-5 h-5" />
              </button>
            </div>
          )}
          {/* Desktop collapsed - only show on lg+ screens */}
          {isCollapsed && (
            <div className="hidden lg:flex flex-col items-center gap-2">
              <img
                src="/logo.png"
                alt="Awaken World"
                className="w-12 h-12 object-contain"
              />
              <button
                onClick={onToggle}
                className="p-2 text-gray-700 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-gray-300 ripple"
              >
                <FiMenu className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation - responsive spacing */}
        <nav className="flex-1 px-2 py-2 sm:py-4 overflow-y-auto">
          <ul className="space-y-0.5 sm:space-y-1">
            {filteredMenuItems.map((item, index) => (
              <li key={item.name}>
                <button
                  onClick={() => handleMenuClick(item.page)}
                  className={`flex items-center px-3 sm:px-4 py-2.5 sm:py-3 w-full rounded-lg transition-all duration-200 ripple ${
                    currentPage === item.page
                      ? 'bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}
                  title={isCollapsed && window.innerWidth >= 1024 ? item.name : ''}
                >
                  <div className={`flex items-center ${isCollapsed && window.innerWidth >= 1024 ? 'justify-center' : ''}`}>
                    <item.icon className={`h-5 w-5 flex-shrink-0 ${
                      currentPage === item.page ? '' : 'text-gray-500 dark:text-gray-400'
                    }`} />
                    {/* Always show text on mobile, conditionally on desktop */}
                    {(!isCollapsed || window.innerWidth < 1024) && (
                      <span className="ml-3 text-sm font-medium">
                        {item.name}
                      </span>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info & Settings - responsive spacing */}
        <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="mb-3 sm:mb-4 space-y-0.5 sm:space-y-1">
            <button
              onClick={() => handleMenuClick('settings')}
              className={`flex items-center px-3 sm:px-4 py-2.5 sm:py-3 w-full rounded-lg transition-all duration-200 ripple ${
                currentPage === 'settings'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <div className={`flex items-center ${isCollapsed && window.innerWidth >= 1024 ? 'justify-center' : ''}`}>
                <FiSettings className={`h-5 w-5 flex-shrink-0 ${
                  currentPage === 'settings' ? '' : 'text-gray-500 dark:text-gray-400'
                }`} />
                {(!isCollapsed || window.innerWidth < 1024) && (
                  <span className="ml-3 text-sm font-medium">
                    Configuración
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 sm:px-4 py-2.5 sm:py-3 text-gray-700 transition-all duration-200 rounded-lg ripple dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
            >
              <div className={`flex items-center ${isCollapsed && window.innerWidth >= 1024 ? 'justify-center' : ''}`}>
                <FiLogOut className="w-5 h-5 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                {(!isCollapsed || window.innerWidth < 1024) && (
                  <span className="ml-3 text-sm font-medium">
                    Cerrar Sesión
                  </span>
                )}
              </div>
            </button>
          </div>

          {/* User info - always show on mobile, conditionally on desktop */}
          {(!isCollapsed || window.innerWidth < 1024) && user && (
            <div className="p-2.5 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-950">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="relative flex-shrink-0">
                  <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 text-sm sm:text-base font-medium text-white rounded-full bg-primary-600">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 border-2 border-white rounded-full -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 dark:border-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate dark:text-gray-100">
                    {user.name}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-600 capitalize dark:text-gray-400 truncate">
                    {(user.roleSlug || user.role)?.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default Sidebar;