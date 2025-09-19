import { useState } from 'react';
import { 
  FiUser, 
  FiBell, 
  FiLock, 
  FiGlobe, 
  FiMoon, 
  FiSun,
  FiSave,
  FiEdit3,
  FiCamera,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiSettings,
  FiMonitor,
  FiCheck,
  FiImage
} from 'react-icons/fi';
import { useAuthStore } from '../stores';
import useTheme from '../hooks/useTheme';
import BackgroundSettings from '../components/settings/BackgroundSettings';

const Settings = () => {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const { themeMode, isDark, setLightMode, setDarkMode, setAutoMode } = useTheme();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || ''
  });
  const [notifications, setNotifications] = useState({
    appointments: true,
    payments: true,
    newClients: false,
    reviews: true,
    promotions: false
  });

  const tabs = [
    { id: 'profile', name: 'Perfil', icon: FiUser },
    { id: 'notifications', name: 'Notificaciones', icon: FiBell },
    { id: 'security', name: 'Seguridad', icon: FiLock },
    { id: 'background', name: 'Personalización', icon: FiImage },
    { id: 'preferences', name: 'Preferencias', icon: FiSettings }
  ];

  // Pestañas específicas por rol
  const getTabsByRole = () => {
    const baseTabs = tabs;
    
    if (user?.role === 'super_admin') {
      return [...baseTabs, 
        { id: 'system', name: 'Sistema', icon: FiGlobe },
        { id: 'branches', name: 'Sedes', icon: FiMapPin }
      ];
    }
    
    if (user?.role === 'branch_admin') {
      return [...baseTabs, 
        { id: 'branch', name: 'Mi Sede', icon: FiMapPin },
        { id: 'business', name: 'Negocio', icon: FiDollarSign }
      ];
    }
    
    if (user?.role === 'barber') {
      return [...baseTabs, 
        { id: 'schedule', name: 'Horarios', icon: FiClock },
        { id: 'services', name: 'Servicios', icon: FiSettings }
      ];
    }
    
    return baseTabs;
  };

  const handleSave = () => {
    updateUser(formData);
    // Mostrar mensaje de éxito
  };

  const ProfileTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Información Personal
        </h3>
        
        <div className="flex items-center space-x-6 mb-6">
          <div className="relative">
            <div className="h-20 w-20 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <button className="absolute bottom-0 right-0 h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700">
              <FiCamera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
              {user?.name}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 capitalize">
              {user?.role?.replace('_', ' ')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input-field"
              placeholder="+51 999 999 999"
            />
          </div>
          
          {user?.role === 'barber' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Especialidad
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Corte clásico, Diseños, Barba..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const NotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Configuración de Notificaciones
        </h3>
        
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-3">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {key === 'appointments' && 'Recordatorios de Citas'}
                  {key === 'payments' && 'Notificaciones de Pagos'}
                  {key === 'newClients' && 'Nuevos Clientes'}
                  {key === 'reviews' && 'Reseñas y Calificaciones'}
                  {key === 'promotions' && 'Promociones y Ofertas'}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {key === 'appointments' && 'Recibe recordatorios 30 min antes de cada cita'}
                  {key === 'payments' && 'Notificaciones de pagos recibidos y pendientes'}
                  {key === 'newClients' && 'Alerta cuando se registre un nuevo cliente'}
                  {key === 'reviews' && 'Notificaciones de nuevas reseñas'}
                  {key === 'promotions' && 'Recibe ofertas y promociones especiales'}
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                  className="sr-only"
                />
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Seguridad de la Cuenta
        </h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Cambiar Contraseña
            </h4>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Contraseña actual"
                className="input-field"
              />
              <input
                type="password"
                placeholder="Nueva contraseña"
                className="input-field"
              />
              <input
                type="password"
                placeholder="Confirmar nueva contraseña"
                className="input-field"
              />
              <button className="btn-primary">
                Actualizar Contraseña
              </button>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Autenticación en Dos Pasos
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Agrega una capa adicional de seguridad a tu cuenta
            </p>
            <button className="btn-secondary">
              Configurar 2FA
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const PreferencesTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Preferencias de la Aplicación
        </h3>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Apariencia
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Configura el tema de la aplicación
                </p>
              </div>
              <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                {themeMode === 'auto' ? 'Automático' : themeMode === 'dark' ? 'Oscuro' : 'Claro'}
              </span>
            </div>
            
            {/* Opciones de tema */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={setLightMode}
                className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                  themeMode === 'light'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <FiSun className={`h-6 w-6 mb-2 ${
                  themeMode === 'light' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
                }`} />
                <span className={`text-sm font-medium ${
                  themeMode === 'light' ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Claro
                </span>
                {themeMode === 'light' && (
                  <FiCheck className="h-4 w-4 text-primary-600 dark:text-primary-400 mt-1" />
                )}
              </button>
              
              <button
                onClick={setDarkMode}
                className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                  themeMode === 'dark'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <FiMoon className={`h-6 w-6 mb-2 ${
                  themeMode === 'dark' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
                }`} />
                <span className={`text-sm font-medium ${
                  themeMode === 'dark' ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Oscuro
                </span>
                {themeMode === 'dark' && (
                  <FiCheck className="h-4 w-4 text-primary-600 dark:text-primary-400 mt-1" />
                )}
              </button>
              
              <button
                onClick={setAutoMode}
                className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                  themeMode === 'auto'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <FiMonitor className={`h-6 w-6 mb-2 ${
                  themeMode === 'auto' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
                }`} />
                <span className={`text-sm font-medium ${
                  themeMode === 'auto' ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Auto
                </span>
                {themeMode === 'auto' && (
                  <FiCheck className="h-4 w-4 text-primary-600 dark:text-primary-400 mt-1" />
                )}
              </button>
            </div>
            
            {themeMode === 'auto' && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-2">
                  <FiMonitor className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="text-xs text-blue-700 dark:text-blue-300">
                    <p className="font-medium mb-1">Modo Automático Activado</p>
                    <p>La aplicación cambiará automáticamente entre claro y oscuro según la configuración de tu sistema operativo.</p>
                    <p className="mt-1">
                      <strong>Actual:</strong> {isDark ? 'Oscuro' : 'Claro'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Idioma
            </label>
            <select className="input-field">
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Zona Horaria
            </label>
            <select className="input-field">
              <option value="America/Lima">Lima, Perú (GMT-5)</option>
              <option value="America/Bogota">Bogotá, Colombia (GMT-5)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const BarberScheduleTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Configuración de Horarios
        </h3>
        
        <div className="space-y-4">
          {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => (
            <div key={day} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <input type="checkbox" defaultChecked={day !== 'Domingo'} className="rounded" />
                <span className="font-medium text-gray-900 dark:text-white">{day}</span>
              </div>
              <div className="flex items-center space-x-2">
                <input type="time" defaultValue="09:00" className="input-field !py-1" />
                <span className="text-gray-500">-</span>
                <input type="time" defaultValue="18:00" className="input-field !py-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />;
      case 'notifications':
        return <NotificationsTab />;
      case 'security':
        return <SecurityTab />;
      case 'background':
        return <BackgroundSettings />;
      case 'preferences':
        return <PreferencesTab />;
      case 'schedule':
        return <BarberScheduleTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <nav className="space-y-1">
              {getTabsByRole().map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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

          {/* Content */}
          <div className="mt-8 lg:mt-0 lg:col-span-3">
            {renderTabContent()}
            
            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                className="btn-primary flex items-center space-x-2"
              >
                <FiSave className="h-4 w-4" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;