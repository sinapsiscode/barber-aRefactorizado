import { useState, useRef, useEffect } from 'react';
import { FiUser, FiSettings, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { useAuthStore } from '../../stores';

/**
 * Perfil de usuario mejorado con dropdown
 */
const UserProfile = ({ user, onPageChange }) => {
  const { logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  if (!user) return null;

  // Determinar color del badge según rol
  const getRoleBadgeColor = (role) => {
    const colors = {
      super_admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      branch_admin: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      reception: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      barber: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      client: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    return colors[role] || colors.client;
  };

  const roleDisplay = (user.roleSlug || user.role)?.replace('_', ' ');
  const roleBadgeColor = getRoleBadgeColor(user.roleSlug || user.role);

  const handleLogout = () => {
    logout();
    window.location.reload(); // Recargar para resetear estado
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-3 border-l border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-r-lg transition-colors p-1.5 sm:p-2 group"
      >
        {/* User Info - responsive text */}
        <div className="text-left min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[100px] sm:max-w-[150px]">
            {user.name}
          </p>
          <span className={`inline-block text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-medium capitalize ${roleBadgeColor}`}>
            {roleDisplay}
          </span>
        </div>

        {/* Avatar with gradient */}
        <div className="relative flex-shrink-0">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover shadow-md ring-2 ring-white dark:ring-gray-800"
            />
          ) : (
            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base shadow-md ring-2 ring-white dark:ring-gray-800">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 sm:h-3 sm:w-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
        </div>

        {/* Dropdown arrow */}
        <FiChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 text-gray-500 dark:text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-fadeIn">
          {/* User Header */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {user.email || 'Sin correo'}
            </p>
          </div>

          {/* Menu Options */}
          <div className="py-1">
            <button
              onClick={() => {
                setShowDropdown(false);
                if (onPageChange) {
                  onPageChange('settings');
                }
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors"
            >
              <FiUser className="h-4 w-4" />
              <span>Ver Perfil</span>
            </button>

            <button
              onClick={() => {
                setShowDropdown(false);
                if (onPageChange) {
                  onPageChange('settings');
                }
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors"
            >
              <FiSettings className="h-4 w-4" />
              <span>Configuración</span>
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-200 dark:border-gray-700 py-1">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 transition-colors"
            >
              <FiLogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
