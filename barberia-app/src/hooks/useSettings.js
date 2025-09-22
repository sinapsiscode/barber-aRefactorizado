import { useState } from 'react';
import { useAuthStore } from '../stores';
import useTheme from '../hooks/useTheme';
import {
  INITIAL_NOTIFICATIONS,
  TAB_IDS
} from '../constants/settingsPage';
import {
  getTabsByRole,
  getInitialFormData,
  getNotificationConfigByRole
} from '../utils/settingsHelpers';

export const useSettings = () => {
  const { user, updateUser } = useAuthStore();
  const { themeMode, isDark, setLightMode, setDarkMode, setAutoMode } = useTheme();

  // Estados del componente
  const [activeTab, setActiveTab] = useState(TAB_IDS.PROFILE);
  const [formData, setFormData] = useState(getInitialFormData(user));
  const [notifications, setNotifications] = useState({
    ...INITIAL_NOTIFICATIONS,
    ...getNotificationConfigByRole(user?.role)
  });

  // Datos computados
  const availableTabs = getTabsByRole(user?.role);

  // Handlers para pestañas
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // Handlers para formulario de perfil
  const handleFormDataChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    handleFormDataChange(name, value);
  };

  // Handlers para notificaciones
  const handleNotificationChange = (key, value) => {
    setNotifications({
      ...notifications,
      [key]: value
    });
  };

  // Handlers para tema
  const handleThemeChange = (mode) => {
    switch (mode) {
      case 'light':
        setLightMode();
        break;
      case 'dark':
        setDarkMode();
        break;
      case 'auto':
        setAutoMode();
        break;
      default:
        break;
    }
  };

  // Handler para guardar cambios
  const handleSave = async () => {
    try {
      // Actualizar datos del usuario
      await updateUser(formData);

      // Aquí se podrían guardar las notificaciones en el backend
      console.log('Configuración de notificaciones:', notifications);

      // Mostrar mensaje de éxito
      alert('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      alert('Error al guardar la configuración');
    }
  };

  // Handler para cambio de contraseña
  const handlePasswordChange = async (passwordData) => {
    try {
      // Aquí se implementaría la lógica de cambio de contraseña
      console.log('Cambiar contraseña:', passwordData);
      alert('Contraseña actualizada exitosamente');
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      alert('Error al cambiar la contraseña');
    }
  };

  // Handler para configurar 2FA
  const handleSetup2FA = () => {
    // Aquí se implementaría la configuración de 2FA
    console.log('Configurar 2FA');
    alert('Función de 2FA en desarrollo');
  };

  return {
    // Estado
    activeTab,
    formData,
    notifications,

    // Datos
    user,
    availableTabs,
    themeMode,
    isDark,

    // Handlers
    handleTabChange,
    handleFormDataChange,
    handleFormChange,
    handleNotificationChange,
    handleThemeChange,
    handleSave,
    handlePasswordChange,
    handleSetup2FA
  };
};