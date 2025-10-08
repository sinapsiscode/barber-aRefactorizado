import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../services/api.js';

/**
 * AuthStore - Migrado a backend real
 *
 * CAMBIOS:
 * ✅ Conectado al backend JSON Server con sistema de permisos
 * ✅ Login usando endpoint /login del backend
 * ✅ Permisos basados en roles del backend
 * ✅ Headers de autenticación automáticos (x-role-id, x-user-id)
 * ✅ Persistencia en localStorage
 *
 * ESTRUCTURA DEL USUARIO (desde backend):
 * {
 *   id, nombre, email, rolId,
 *   roleId, roleName, roleSlug,
 *   permissions: ['ver_clientes', 'crear_cita', ...],
 *   sucursalId
 * }
 */

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      currentBranch: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /**
       * Establecer usuario autenticado
       */
      setUser: (user) => set({
        user,
        isAuthenticated: !!user,
        error: null
      }),

      /**
       * Establecer sucursal actual
       * Los branch_admin no pueden cambiar su sucursal asignada
       */
      setCurrentBranch: (branch) => {
        const { user } = get();

        if (user?.roleSlug === 'branch_admin') {
          console.warn('Los administradores de sede no pueden cambiar su sede asignada');
          return;
        }

        set({ currentBranch: branch });
      },

      /**
       * Login - Conectado al backend
       * @param {Object} credentials - { email, password }
       * @returns {Promise<{success: boolean, user?: Object, error?: string}>}
       */
      login: async (credentials) => {
        set({ isLoading: true, error: null });

        try {
          // Llamar al endpoint /login del backend
          const userData = await authApi.login(credentials.email, credentials.password);

          // Establecer usuario en el store
          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          return { success: true, user: userData };

        } catch (error) {
          console.error('Error en login:', error);

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message || 'Error al iniciar sesión'
          });

          return {
            success: false,
            error: error.message || 'Credenciales incorrectas'
          };
        }
      },

      /**
       * Logout - Limpia el estado y localStorage
       */
      logout: () => {
        authApi.logout(); // Limpia localStorage en el API layer

        set({
          user: null,
          isAuthenticated: false,
          currentBranch: null,
          error: null,
          isLoading: false
        });
      },

      /**
       * Verificar si el usuario tiene un permiso específico
       * @param {string} permission - Nombre del permiso (ej: 'ver_clientes', 'crear_cita')
       * @returns {boolean}
       */
      hasPermission: (permission) => {
        const { user } = get();

        if (!user || !user.permissions) {
          return false;
        }

        // Super admin tiene todos los permisos
        if (user.roleSlug === 'super_admin') {
          return true;
        }

        return user.permissions.includes(permission);
      },

      /**
       * Verificar si el usuario puede acceder a un módulo
       * Mapea módulos del frontend a permisos del backend
       * @param {string} module - Nombre del módulo
       * @returns {boolean}
       */
      canAccessModule: (module) => {
        const { user, hasPermission } = get();

        if (!user) {
          return false;
        }

        // Super admin puede acceder a todo
        if (user.roleSlug === 'super_admin') {
          return true;
        }

        // Mapeo de módulos del frontend a permisos del backend
        const modulePermissions = {
          dashboard: ['ver_usuarios', 'ver_clientes', 'ver_barberos', 'ver_citas'],
          appointments: ['ver_citas', 'ver_citas_propias'],
          clients: ['ver_clientes'],
          staff: ['ver_barberos'],
          branches: ['ver_sucursales'],
          financial: ['ver_transacciones', 'ver_reportes'],
          portfolio: ['ver_portfolio'],
          loyalty: ['ver_recompensas'],
          reports: ['ver_reportes'],
          settings: ['gestionar_permisos', 'gestionar_roles'],
          users: ['ver_usuarios']
        };

        const requiredPermissions = modulePermissions[module] || [];

        // Si tiene al menos uno de los permisos requeridos, puede acceder
        return requiredPermissions.some(permission => hasPermission(permission));
      },

      /**
       * Verificar si puede realizar una acción específica
       * @param {string} action - Acción a realizar (ej: 'crear', 'editar', 'eliminar')
       * @param {string} resource - Recurso (ej: 'cliente', 'cita', 'barbero')
       * @returns {boolean}
       */
      canPerformAction: (action, resource) => {
        const permission = `${action}_${resource}`;
        return get().hasPermission(permission);
      },

      /**
       * Obtener usuario actual
       */
      getCurrentUser: () => {
        return get().user;
      },

      /**
       * Verificar si es super admin
       */
      isSuperAdmin: () => {
        const { user } = get();
        return user?.roleSlug === 'super_admin';
      },

      /**
       * Verificar si es branch admin
       */
      isBranchAdmin: () => {
        const { user } = get();
        return user?.roleSlug === 'branch_admin';
      },

      /**
       * Obtener ID de sucursal del usuario
       */
      getUserBranchId: () => {
        const { user } = get();
        return user?.sucursalId || null;
      },

      /**
       * Actualizar perfil del usuario actual
       * TODO: Implementar cuando se agregue endpoint de actualización
       */
      updateUserProfile: (profileData) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...profileData } });
        }
      },

      /**
       * Limpiar error
       */
      clearError: () => set({ error: null }),

      /**
       * Reinicializar store (útil para testing)
       */
      reset: () => set({
        user: null,
        currentBranch: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        currentBranch: state.currentBranch,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore;
