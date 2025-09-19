// ===================================================================
// 🎨 HOOK DE CONFIGURACIÓN DE FONDOS - REFACTORIZADO
// ===================================================================
// Hook especializado para la gestión completa de configuración de fondos

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppointmentStore, useBranchStore, useAuthStore } from '../stores';
import { SETTINGS_CONFIG, BACKGROUND_CATEGORIES } from '../constants/settings';
import Swal from 'sweetalert2';

export const useBackgroundSettings = () => {
  const { user } = useAuthStore();
  const { selectedBranch } = useBranchStore();
  const { backgrounds, updateBranchBackground, updateUserBackground, uploadCustomBackground } = useAppointmentStore();

  // Estados locales
  const [activeTab, setActiveTab] = useState('gallery');
  const [activeCategory, setActiveCategory] = useState(BACKGROUND_CATEGORIES.DEFAULT);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewBackground, setPreviewBackground] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [opacity, setOpacity] = useState(SETTINGS_CONFIG.OPACITY.DEFAULT);
  const [blur, setBlur] = useState(SETTINGS_CONFIG.BLUR.DEFAULT);

  // Datos calculados
  const currentBranchId = useMemo(() =>
    selectedBranch?.id || user?.branchId || 1,
    [selectedBranch, user]
  );

  const branchData = useMemo(() =>
    selectedBranch || { name: `Sede ${currentBranchId}` },
    [selectedBranch, currentBranchId]
  );

  const userPermissions = useMemo(() => ({
    canUploadGlobal: user?.role === 'super_admin',
    canUploadBranch: ['super_admin', 'branch_admin'].includes(user?.role),
    autoApply: user?.role === 'super_admin'
  }), [user?.role]);

  // Filtrar fondos por categoría
  const filteredBackgrounds = useMemo(() => {
    if (!backgrounds) return [];
    return backgrounds.filter(bg => bg.category === activeCategory);
  }, [backgrounds, activeCategory]);

  // Obtener fondo actual
  const currentBackground = useMemo(() => {
    const branchBg = backgrounds?.find(bg => bg.branchId === currentBranchId && bg.isActive);
    const userBg = backgrounds?.find(bg => bg.userId === user?.id && bg.isActive);
    return userBg || branchBg || backgrounds?.find(bg => bg.isDefault);
  }, [backgrounds, currentBranchId, user?.id]);

  /**
   * Manejar cambio de categoría
   */
  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category);
  }, []);

  /**
   * Manejar vista previa de fondo
   */
  const handlePreviewBackground = useCallback((background) => {
    setPreviewBackground(background);
    setPreviewMode(true);
  }, []);

  /**
   * Salir de vista previa
   */
  const exitPreview = useCallback(() => {
    setPreviewMode(false);
    setPreviewBackground(null);
  }, []);

  /**
   * Aplicar fondo con opciones
   */
  const handleApplyBackground = useCallback(async (background) => {
    if (userPermissions.autoApply) {
      const result = await Swal.fire({
        title: '¿Cómo aplicar este fondo?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Para mi sede',
        denyButtonText: 'Para toda la aplicación',
        cancelButtonText: 'Solo para mí'
      });

      let success = false;
      let message = '';

      if (result.isConfirmed) {
        success = await updateBranchBackground(currentBranchId, background.id);
        message = 'Fondo aplicado para la sede';
      } else if (result.isDenied) {
        success = await updateBranchBackground(null, background.id); // Global
        message = 'Fondo aplicado globalmente';
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        success = await updateUserBackground(user.id, background.id);
        message = 'Fondo aplicado a tu perfil';
      }

      if (success) {
        await Swal.fire({
          title: '¡Éxito!',
          text: message,
          icon: 'success',
          timer: SETTINGS_CONFIG.NOTIFICATION_TIMER,
          showConfirmButton: false
        });
        exitPreview();
      }
    } else {
      // Solo puede aplicar para su perfil
      const success = await updateUserBackground(user.id, background.id);
      if (success) {
        await Swal.fire({
          title: '¡Éxito!',
          text: 'Fondo aplicado a tu perfil',
          icon: 'success',
          timer: SETTINGS_CONFIG.NOTIFICATION_TIMER,
          showConfirmButton: false
        });
        exitPreview();
      }
    }
  }, [userPermissions, currentBranchId, user?.id, updateBranchBackground, updateUserBackground, exitPreview]);

  /**
   * Subir imagen personalizada
   */
  const handleFileUpload = useCallback(async (file) => {
    // Validaciones
    if (!SETTINGS_CONFIG.UPLOAD.ACCEPTED_TYPES.includes(file.type)) {
      await Swal.fire({
        title: 'Formato no válido',
        text: 'Solo se permiten archivos JPG, PNG o WebP',
        icon: 'error'
      });
      return;
    }

    if (file.size > SETTINGS_CONFIG.UPLOAD.MAX_SIZE) {
      await Swal.fire({
        title: 'Archivo muy grande',
        text: 'El archivo debe ser menor a 5MB',
        icon: 'error'
      });
      return;
    }

    // Validar resolución
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = async () => {
      const { width, height } = SETTINGS_CONFIG.UPLOAD.MIN_RESOLUTION;

      if (img.width < width || img.height < height) {
        await Swal.fire({
          title: 'Resolución muy baja',
          text: `La imagen debe ser de al menos ${width}x${height}px`,
          icon: 'error'
        });
        URL.revokeObjectURL(url);
        return;
      }

      // Proceder con la subida
      setIsUploading(true);
      setUploadProgress(0);

      try {
        const result = await uploadCustomBackground(file, {
          branchId: userPermissions.canUploadBranch ? currentBranchId : null,
          userId: user.id,
          opacity,
          blur,
          onProgress: setUploadProgress
        });

        if (result.success) {
          await Swal.fire({
            title: '¡Imagen subida!',
            text: 'Tu fondo personalizado ha sido creado exitosamente',
            icon: 'success',
            timer: SETTINGS_CONFIG.NOTIFICATION_TIMER,
            showConfirmButton: false
          });

          // Cambiar a la galería para ver el nuevo fondo
          setActiveTab('gallery');
          setActiveCategory(BACKGROUND_CATEGORIES.CUSTOM);
        }
      } catch (error) {
        await Swal.fire({
          title: 'Error al subir imagen',
          text: error.message || 'Intenta nuevamente',
          icon: 'error'
        });
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
        URL.revokeObjectURL(url);
      }
    };

    img.src = url;
  }, [uploadCustomBackground, userPermissions, currentBranchId, user?.id, opacity, blur]);

  /**
   * Restaurar configuración por defecto
   */
  const handleResetToDefault = useCallback(async () => {
    const confirmed = await Swal.fire({
      title: '¿Restaurar valores por defecto?',
      text: 'Esto restaurará el fondo blanco original',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, restaurar',
      cancelButtonText: 'Cancelar'
    });

    if (confirmed.isConfirmed) {
      setOpacity(SETTINGS_CONFIG.OPACITY.DEFAULT);
      setBlur(SETTINGS_CONFIG.BLUR.DEFAULT);
      exitPreview();

      await Swal.fire({
        title: 'Configuración restaurada',
        icon: 'success',
        timer: SETTINGS_CONFIG.NOTIFICATION_TIMER,
        showConfirmButton: false
      });
    }
  }, [exitPreview]);

  /**
   * Generar imagen de respaldo
   */
  const getFallbackImage = useCallback(() => {
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <g transform="translate(150,100)">
          <circle cx="0" cy="-20" r="15" fill="#d1d5db"/>
          <rect x="-10" y="-5" width="20" height="25" rx="3" fill="#d1d5db"/>
        </g>
        <text x="50%" y="80%" text-anchor="middle" fill="#9ca3af" font-family="Arial" font-size="12">
          Vista previa no disponible
        </text>
      </svg>
    `)}`;
  }, []);

  /**
   * Aplicar estilos de fondo actual
   */
  const applyBackgroundStyles = useCallback((element = document.body) => {
    const background = previewMode ? previewBackground : currentBackground;

    if (!background) return;

    const backgroundImage = background.type === 'color'
      ? background.value
      : `url(${background.url})`;

    element.style.background = backgroundImage;
    element.style.backgroundSize = 'cover';
    element.style.backgroundPosition = 'center';
    element.style.backgroundRepeat = 'no-repeat';

    if (background.type === 'image') {
      element.style.filter = `blur(${blur}px)`;
      element.style.opacity = opacity;
    }
  }, [currentBackground, previewBackground, previewMode, opacity, blur]);

  // Efectos
  useEffect(() => {
    if (currentBackground) {
      applyBackgroundStyles();
    }
  }, [currentBackground, applyBackgroundStyles]);

  return {
    // Estados
    activeTab,
    setActiveTab,
    activeCategory,
    previewMode,
    previewBackground,
    uploadProgress,
    isUploading,
    opacity,
    setOpacity,
    blur,
    setBlur,

    // Datos
    currentBranchId,
    branchData,
    userPermissions,
    filteredBackgrounds,
    currentBackground,

    // Funciones
    handleCategoryChange,
    handlePreviewBackground,
    exitPreview,
    handleApplyBackground,
    handleFileUpload,
    handleResetToDefault,
    getFallbackImage,
    applyBackgroundStyles
  };
};

export default useBackgroundSettings;