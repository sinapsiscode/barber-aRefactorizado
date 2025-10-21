import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Fondos predefinidos disponibles para elegir
const PREDEFINED_BACKGROUNDS = {
  // Fondos por defecto
  default: {
    id: 'default',
    name: 'Fondo Blanco',
    type: 'color',
    value: '#ffffff',
    preview: '#ffffff',
    category: 'default',
    allowedRoles: ['all']
  },
  
  // Degradados de marca
  brandGradient1: {
    id: 'brandGradient1',
    name: 'Degradado Dorado Sutil',
    type: 'gradient',
    value: 'linear-gradient(135deg, rgba(255,192,0,0.03) 0%, rgba(255,255,255,1) 50%, rgba(255,192,0,0.03) 100%)',
    preview: 'linear-gradient(135deg, #ffc000 0%, #ffffff 50%, #ffc000 100%)',
    category: 'gradient',
    allowedRoles: ['all']
  },
  
  brandGradient2: {
    id: 'brandGradient2',
    name: 'Degradado Vertical',
    type: 'gradient',
    value: 'linear-gradient(to bottom, rgba(255,192,0,0.05) 0%, rgba(255,255,255,1) 30%, rgba(255,255,255,1) 100%)',
    preview: 'linear-gradient(to bottom, #ffc000 0%, #ffffff 100%)',
    category: 'gradient',
    allowedRoles: ['all']
  },

  // Imágenes predefinidas
  barberTexture: {
    id: 'barberTexture',
    name: 'Textura Barbería',
    type: 'image',
    value: 'linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), url("https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=100&h=100&fit=crop&crop=center")',
    preview: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=200&h=200&fit=crop',
    category: 'texture',
    allowedRoles: ['branch_admin', 'super_admin']
  },

  woodTexture: {
    id: 'woodTexture',
    name: 'Madera Elegante',
    type: 'image',
    value: 'linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.92)), url("https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=100&h=100&fit=crop")',
    preview: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=200&h=200&fit=crop',
    category: 'texture',
    allowedRoles: ['branch_admin', 'super_admin']
  },

  marbleTexture: {
    id: 'marbleTexture',
    name: 'Mármol Premium',
    type: 'image',
    value: 'linear-gradient(rgba(255,255,255,0.93), rgba(255,255,255,0.93)), url("https://images.unsplash.com/photo-1615873968403-89e068629265?w=100&h=100&fit=crop")',
    preview: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=200&h=200&fit=crop',
    category: 'texture',
    allowedRoles: ['branch_admin', 'super_admin']
  },

  // Patrones
  geometricPattern: {
    id: 'geometricPattern',
    name: 'Patrón Geométrico',
    type: 'pattern',
    value: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffc000' fill-opacity='0.03'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    preview: 'linear-gradient(45deg, #ffc000, #ffffff)',
    category: 'pattern',
    allowedRoles: ['super_admin']
  }
};

const useBackgroundStore = create(
  persist(
    (set, get) => ({
      // Estado actual
      currentBackground: 'default',
      customBackgrounds: {}, // Fondos subidos por usuarios/admins
      branchBackgrounds: {}, // Fondos asignados por sede
      userPreference: null, // Preferencia individual del usuario
      opacity: 0.95,
      blur: 0,

      // Getters
      getPredefinedBackgrounds: () => PREDEFINED_BACKGROUNDS,
      
      getAvailableBackgrounds: (userRole, branchId) => {
        const { customBackgrounds, branchBackgrounds } = get();
        const available = { ...PREDEFINED_BACKGROUNDS };
        
        // Filtrar por rol
        Object.keys(available).forEach(key => {
          const bg = available[key];
          if (bg.allowedRoles.includes('all') || bg.allowedRoles.includes(userRole)) {
            // Permitido
          } else {
            delete available[key];
          }
        });

        // Agregar fondos personalizados de la sede si es admin
        if ((userRole === 'branch_admin' || userRole === 'super_admin') && branchId) {
          const branchCustom = branchBackgrounds[branchId] || {};
          Object.assign(available, branchCustom);
        }

        // Agregar fondos globales si es super admin
        if (userRole === 'super_admin') {
          Object.assign(available, customBackgrounds);
        }

        return available;
      },

      getCurrentBackgroundStyle: (userRole, branchId, userId) => {
        const { currentBackground, userPreference, branchBackgrounds, opacity, blur } = get();
        const backgrounds = get().getAvailableBackgrounds(userRole, branchId);
        
        // Prioridad: 1) Preferencia usuario, 2) Configuración sede, 3) Default
        let activeId = currentBackground;
        
        if (userPreference && backgrounds[userPreference]) {
          activeId = userPreference;
        } else if (branchId && branchBackgrounds[branchId]?.default) {
          activeId = branchBackgrounds[branchId].default;
        }

        const activeBg = backgrounds[activeId] || backgrounds.default;
        
        // Aplicar efectos
        let style = {};
        
        if (activeBg.type === 'gradient' || activeBg.type === 'color') {
          style.background = activeBg.value;
        } else if (activeBg.type === 'image' || activeBg.type === 'pattern') {
          style.background = activeBg.value;
          style.backgroundSize = activeBg.type === 'image' ? 'cover' : 'repeat';
          style.backgroundAttachment = activeBg.type === 'image' ? 'fixed' : 'scroll';
        }

        // Aplicar blur si está configurado
        if (blur > 0) {
          style.filter = `blur(${blur}px)`;
        }

        return {
          style,
          info: {
            id: activeId,
            name: activeBg.name,
            type: activeBg.type,
            category: activeBg.category
          }
        };
      },

      // Actions
      setCurrentBackground: (backgroundId) => {
        set({ currentBackground: backgroundId });
      },

      setUserPreference: (backgroundId) => {
        set({ userPreference: backgroundId });
      },

      setBranchBackground: (branchId, backgroundId) => {
        set(state => ({
          branchBackgrounds: {
            ...state.branchBackgrounds,
            [branchId]: {
              ...state.branchBackgrounds[branchId],
              default: backgroundId
            }
          }
        }));
      },

      addCustomBackground: (backgroundData, scope = 'global') => {
        const { customBackgrounds, branchBackgrounds } = get();
        const newBg = {
          id: `custom_${Date.now()}`,
          ...backgroundData,
          createdAt: new Date().toISOString(),
          scope
        };

        if (scope === 'global') {
          set({
            customBackgrounds: {
              ...customBackgrounds,
              [newBg.id]: newBg
            }
          });
        } else {
          // Scope específico por sede
          const branchId = backgroundData.branchId;
          set({
            branchBackgrounds: {
              ...branchBackgrounds,
              [branchId]: {
                ...branchBackgrounds[branchId],
                [newBg.id]: newBg
              }
            }
          });
        }

        return newBg.id;
      },

      removeCustomBackground: (backgroundId, branchId = null) => {
        if (branchId) {
          set(state => {
            const newBranchBgs = { ...state.branchBackgrounds };
            if (newBranchBgs[branchId]) {
              delete newBranchBgs[branchId][backgroundId];
            }
            return { branchBackgrounds: newBranchBgs };
          });
        } else {
          set(state => {
            const newCustomBgs = { ...state.customBackgrounds };
            delete newCustomBgs[backgroundId];
            return { customBackgrounds: newCustomBgs };
          });
        }
      },

      setOpacity: (value) => {
        set({ opacity: Math.max(0.1, Math.min(1, value)) });
      },

      setBlur: (value) => {
        set({ blur: Math.max(0, Math.min(10, value)) });
      },

      // Utilidades
      uploadBackgroundImage: async (file, branchId = null) => {
        try {
          // Validar archivo
          if (!file.type.startsWith('image/')) {
            throw new Error('Solo se permiten archivos de imagen');
          }

          if (file.size > 5 * 1024 * 1024) { // 5MB max
            throw new Error('La imagen no debe superar los 5MB');
          }

          // Convertir a base64
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const base64 = e.target.result;
              const backgroundData = {
                name: `Imagen personalizada - ${file.name}`,
                type: 'image',
                value: `linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), url("${base64}")`,
                preview: base64,
                category: 'custom',
                allowedRoles: branchId ? ['branch_admin', 'super_admin'] : ['super_admin'],
                branchId
              };

              const bgId = get().addCustomBackground(backgroundData, branchId ? 'branch' : 'global');
              resolve(bgId);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        } catch (error) {
          throw error;
        }
      },

      // Reset
      resetToDefaults: () => {
        set({
          currentBackground: 'default',
          userPreference: null,
          opacity: 0.95,
          blur: 0
        });
      }
    }),
    {
      name: 'background-settings',
      partialize: (state) => ({
        currentBackground: state.currentBackground,
        customBackgrounds: state.customBackgrounds,
        branchBackgrounds: state.branchBackgrounds,
        userPreference: state.userPreference,
        opacity: state.opacity,
        blur: state.blur
      })
    }
  )
);

export default useBackgroundStore;