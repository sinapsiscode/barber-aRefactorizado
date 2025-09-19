import { useState, useEffect } from 'react';

/**
 * Hook para gestión automática del tema oscuro
 * Detecta la preferencia del sistema y permite sobreescribir manualmente
 */
const useTheme = () => {
  // Estados: 'light', 'dark', 'auto'
  const [themeMode, setThemeMode] = useState(() => {
    const saved = localStorage.getItem('theme-mode');
    return saved || 'auto';
  });
  
  const [actualTheme, setActualTheme] = useState('light');

  // Detectar preferencia del sistema
  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Aplicar tema al DOM
  const applyTheme = (theme) => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    setActualTheme(theme);
  };

  // Efecto principal para gestionar el tema
  useEffect(() => {
    let theme;
    
    if (themeMode === 'auto') {
      theme = getSystemTheme();
    } else {
      theme = themeMode;
    }
    
    applyTheme(theme);
    
    // Guardar preferencia
    localStorage.setItem('theme-mode', themeMode);
    
    // Listener para cambios en la preferencia del sistema (solo en modo auto)
    if (themeMode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        applyTheme(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode]);

  // Funciones públicas
  const setLightMode = () => setThemeMode('light');
  const setDarkMode = () => setThemeMode('dark');
  const setAutoMode = () => setThemeMode('auto');
  
  const toggleTheme = () => {
    if (themeMode === 'auto') {
      setThemeMode('light');
    } else if (themeMode === 'light') {
      setThemeMode('dark');
    } else {
      setThemeMode('auto');
    }
  };

  return {
    themeMode,        // 'light', 'dark', 'auto'
    actualTheme,      // tema real aplicado: 'light' o 'dark'
    isAuto: themeMode === 'auto',
    isDark: actualTheme === 'dark',
    setLightMode,
    setDarkMode,
    setAutoMode,
    toggleTheme
  };
};

export default useTheme;