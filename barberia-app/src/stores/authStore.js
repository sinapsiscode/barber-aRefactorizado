import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getDataSection } from '../utils/dataLoader.js';

/**
 * TODO REFACTOR - DEUDA TÉCNICA (Prioridad: ALTA después del release)
 * 
 * PROBLEMAS IDENTIFICADOS:
 * 1. 🔒 SEGURIDAD: Contraseñas en texto plano (línea ~28)
 * 2. 📁 ESTRUCTURA: Mock data mezclada con lógica de store
 * 3. 🔄 SEPARACIÓN: Mover usuarios mock a JSON separado
 * 4. 📝 TYPESCRIPT: Agregar tipado para User, Credentials, etc.
 * 5. 🛡️ VALIDACIÓN: Implementar validación de credenciales más robusta
 * 
 * PLAN DE REFACTOR:
 * - Crear src/data/users.json
 * - Crear src/services/authService.js
 * - Implementar hash de contraseñas o auto-login por URL
 * - Agregar TypeScript types
 * - Separar lógica de demo de lógica de producción
 */

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      currentBranch: null,
      isAuthenticated: false,
      isLoading: false,
      permissions: [],

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        permissions: user?.permissions || []
      }),

      setCurrentBranch: (branch) => set({ currentBranch: branch }),

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          // REFACTORED: Datos cargados desde JSON
          const users = await getDataSection('users');

          await new Promise(resolve => setTimeout(resolve, 1000));

          const user = users.find(
            u => u.email === credentials.email && u.password === credentials.password
          );

          if (user) {
            const { password, ...userWithoutPassword } = user;
            set({ 
              user: userWithoutPassword, 
              isAuthenticated: true,
              permissions: user.permissions,
              isLoading: false 
            });
            return { success: true, user: userWithoutPassword };
          } else {
            set({ isLoading: false });
            return { success: false, error: 'Credenciales incorrectas' };
          }
        } catch (error) {
          console.error('Error en login:', error);
          set({ isLoading: false });
          return { 
            success: false, 
            error: error.message || 'Error cargando datos de usuarios' 
          };
        }
      },

      logout: () => set({ 
        user: null, 
        isAuthenticated: false, 
        currentBranch: null,
        permissions: [],
        isLoading: false 
      }),

      hasPermission: (permission) => {
        const { permissions } = get();
        return permissions.includes(permission) || permissions.includes('manage_all');
      },

      canAccessModule: (module) => {
        const { user, hasPermission } = get();
        
        const modulePermissions = {
          appointments: ['read_appointments', 'write_appointments', 'read', 'write', 'manage_all'],
          financial: ['write', 'write_payments', 'manage_all'],
          staff: ['write', 'manage_all'],
          clients: ['write', 'manage_all'],
          branches: ['manage_all'],
          reports: ['write', 'manage_all'],
          portfolio: ['read_portfolio', 'manage_portfolio', 'write', 'manage_all'],
          services: ['read', 'read_own', 'read_portfolio', 'write', 'manage_all']
        };

        const requiredPermissions = modulePermissions[module] || [];
        return requiredPermissions.some(permission => hasPermission(permission));
      },

      updateUserProfile: (profileData) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...profileData } });
        }
      },

      updateUser: (userData) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...userData } });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        currentBranch: state.currentBranch,
        isAuthenticated: state.isAuthenticated,
        permissions: state.permissions
      })
    }
  )
);

export default useAuthStore;