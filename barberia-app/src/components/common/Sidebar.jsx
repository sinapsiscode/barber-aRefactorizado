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

const Sidebar = ({ isCollapsed, onToggle, currentPage, onPageChange }) => {
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

  return (
    <div className={`relative transition-all duration-300 bg-white dark:bg-black ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4">
          {!isCollapsed && (
            <div className="flex items-center justify-between">
              <img
                src="/logo.png"
                alt="Awaken World"
                className="w-16 h-16 object-contain"
              />
              <button
                onClick={onToggle}
                className="p-2 text-gray-700 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-gray-300 ripple"
              >
                <FiMenu className="w-5 h-5" />
              </button>
            </div>
          )}
          {isCollapsed && (
            <div className="flex flex-col items-center gap-2">
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

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-1">
            {filteredMenuItems.map((item, index) => (
              <li key={item.name}>
                <button
                  onClick={() => onPageChange && onPageChange(item.page)}
                  className={`flex items-center px-4 py-3 w-full rounded-lg transition-all duration-200 ripple ${
                    currentPage === item.page 
                      ? 'bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}
                  title={isCollapsed ? item.name : ''}
                >
                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
                    <item.icon className={`h-5 w-5 ${
                      currentPage === item.page ? '' : 'text-gray-500 dark:text-gray-400'
                    }`} />
                    {!isCollapsed && (
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

        {/* User Info & Settings */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="mb-4 space-y-1">
            <button 
              onClick={() => onPageChange && onPageChange('settings')}
              className={`flex items-center px-4 py-3 w-full rounded-lg transition-all duration-200 ripple ${
                currentPage === 'settings' 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
                <FiSettings className={`h-5 w-5 ${
                  currentPage === 'settings' ? '' : 'text-gray-500 dark:text-gray-400'
                }`} />
                {!isCollapsed && (
                  <span className="ml-3 text-sm font-medium">
                    Configuración
                  </span>
                )}
              </div>
            </button>
            
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-gray-700 transition-all duration-200 rounded-lg ripple dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
            >
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
                <FiLogOut className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                {!isCollapsed && (
                  <span className="ml-3 text-sm font-medium">
                    Cerrar Sesión
                  </span>
                )}
              </div>
            </button>
          </div>

          {!isCollapsed && user && (
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-950">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="flex items-center justify-center w-10 h-10 font-medium text-white rounded-full bg-primary-600">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute w-3 h-3 bg-green-500 border-2 border-white rounded-full -bottom-1 -right-1 dark:border-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-100">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-600 capitalize dark:text-gray-400">
                    {(user.roleSlug || user.role)?.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;