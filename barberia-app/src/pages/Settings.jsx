import { useState, useEffect } from 'react';
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
  FiImage,
  FiShield,
  FiGift
} from 'react-icons/fi';
import { useAuthStore, useBranchStore } from '../stores';
import useTheme from '../hooks/useTheme';
import BackgroundSettings from '../components/settings/BackgroundSettings';
import BranchAdminsSettings from '../components/settings/BranchAdminsSettings';
import LoyaltySettings from '../components/settings/LoyaltySettings';

const Settings = () => {
  const { user, updateUser } = useAuthStore();
  const { branches, loadMockBranches } = useBranchStore();
  const [activeTab, setActiveTab] = useState('profile');
  const { themeMode, isDark, setLightMode, setDarkMode, setAutoMode } = useTheme();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
    preferredBranch: user?.preferredBranch || ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [notifications, setNotifications] = useState({
    appointments: true,
    payments: true,
    newClients: false,
    reviews: true,
    promotions: false
  });

  // Cargar sedes al montar el componente
  useEffect(() => {
    if (!branches || branches.length === 0) {
      loadMockBranches();
    }
  }, [branches, loadMockBranches]);

  // Función para manejar la subida de avatar
  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 5MB');
        return;
      }

      setAvatarFile(file);

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
        setFormData({ ...formData, avatar: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

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
        { id: 'branches', name: 'Sedes', icon: FiMapPin },
        { id: 'admins', name: 'Administradores', icon: FiShield },
        { id: 'loyalty', name: 'Fidelización', icon: FiGift }
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
        { id: 'commissions', name: 'Mis Comisiones', icon: FiDollarSign }
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
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="h-20 w-20 rounded-full object-cover border-2 border-primary-300"
              />
            ) : (
              <div className="h-20 w-20 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 cursor-pointer transition-colors"
            >
              <FiCamera className="h-4 w-4" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
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

          {user?.role === 'client' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FiMapPin className="inline h-4 w-4 mr-1" />
                Sede Favorita
              </label>
              <select
                value={formData.preferredBranch}
                onChange={(e) => setFormData({ ...formData, preferredBranch: parseInt(e.target.value) })}
                className="input-field"
              >
                <option value="">Selecciona tu sede favorita</option>
                {branches?.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} - {branch.city}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Esta será tu sede preferida para reservar citas
              </p>
            </div>
          )}

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

  const BarberScheduleTab = () => {
    // Horario por defecto para barberos (solo lectura)
    const defaultSchedule = {
      lunes: { isWorking: true, start: '09:00', end: '18:00' },
      martes: { isWorking: true, start: '09:00', end: '18:00' },
      miercoles: { isWorking: true, start: '09:00', end: '18:00' },
      jueves: { isWorking: true, start: '09:00', end: '18:00' },
      viernes: { isWorking: true, start: '09:00', end: '18:00' },
      sabado: { isWorking: true, start: '09:00', end: '17:00' },
      domingo: { isWorking: false, start: '', end: '' }
    };

    // Horario del barbero (puede venir del backend en el futuro)
    const barberSchedule = user?.schedule || defaultSchedule;

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-dark-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Mi Horario de Trabajo
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Solo lectura
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(barberSchedule).map(([day, schedule]) => {
              const dayNames = {
                lunes: 'Lunes',
                martes: 'Martes',
                miercoles: 'Miércoles',
                jueves: 'Jueves',
                viernes: 'Viernes',
                sabado: 'Sábado',
                domingo: 'Domingo'
              };

              return (
                <div key={day} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${schedule.isWorking ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {dayNames[day]}
                    </span>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      schedule.isWorking
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {schedule.isWorking ? 'Trabajando' : 'Descanso'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {schedule.isWorking ? (
                      <>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {schedule.start}
                        </span>
                        <span className="text-gray-500">-</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {schedule.end}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400 italic">
                        Día libre
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <FiClock className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200">
                  Información sobre horarios
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Tu horario de trabajo es configurado por la administración. Para solicitar cambios,
                  contacta con tu administrador de sede.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const BarberCommissionsTab = () => {
    // Datos mock de servicios realizados por el barbero
    const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');

    const mockServices = [
      { id: 1, date: '2024-01-20', client: 'Juan Pérez', service: 'Corte + Barba', price: 40, commission: 12, status: 'completed' },
      { id: 2, date: '2024-01-19', client: 'Carlos López', service: 'Fade Moderno', price: 35, commission: 10.5, status: 'completed' },
      { id: 3, date: '2024-01-18', client: 'Miguel Torres', service: 'Corte Clásico', price: 25, commission: 7.5, status: 'completed' },
      { id: 4, date: '2024-01-17', client: 'Roberto Silva', service: 'Diseño Especial', price: 50, commission: 15, status: 'completed' },
      { id: 5, date: '2024-01-16', client: 'Diego Martín', service: 'Corte + Barba', price: 40, commission: 12, status: 'completed' },
    ];

    const totalEarnings = mockServices.reduce((sum, service) => sum + service.price, 0);
    const totalCommissions = mockServices.reduce((sum, service) => sum + service.commission, 0);
    const totalServices = mockServices.length;
    const commissionRate = totalCommissions > 0 ? ((totalCommissions / totalEarnings) * 100).toFixed(1) : 0;

    return (
      <div className="space-y-6">
        {/* Resumen de comisiones */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FiDollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Comisiones</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">S/{totalCommissions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <FiSettings className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Servicios</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalServices}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <FiGift className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ingresos Totales</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">S/{totalEarnings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <FiUser className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">% Comisión</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{commissionRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de servicios */}
        <div className="bg-white dark:bg-dark-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Mis Servicios Realizados
            </h3>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="input-field !py-2"
            >
              <option value="thisWeek">Esta semana</option>
              <option value="thisMonth">Este mes</option>
              <option value="lastMonth">Mes pasado</option>
              <option value="last3Months">Últimos 3 meses</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-dark-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Servicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Mi Comisión
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-gray-700">
                {mockServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(service.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {service.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {service.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      S/{service.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600 dark:text-green-400">
                      S/{service.commission}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        Completado
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Información sobre comisiones */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <FiDollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200">
                Información sobre comisiones
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Tu porcentaje de comisión se calcula sobre el precio final de cada servicio.
                Las comisiones se pagan quincenalmente junto con tu salario.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
      case 'commissions':
        return <BarberCommissionsTab />;
      case 'admins':
        return <BranchAdminsSettings />;
      case 'loyalty':
        return <LoyaltySettings />;
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