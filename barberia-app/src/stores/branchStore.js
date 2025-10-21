/**
 * BRANCH STORE - REFACTORIZADO CON JSON SERVER
 *
 * Cambios:
 * ✅ Migrado a API real
 * ✅ Eliminado TODO el hardcode (445+ líneas de mock data)
 * ✅ CRUD completo contra JSON Server
 * ✅ Lógica de negocio mantenida localmente
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sucursalesApi } from '../services/api';

const useBranchStore = create(
  persist(
    (set, get) => ({
      branches: [],
      selectedBranch: null,
      isLoading: false,
      error: null,
      availableCountries: [],

      setBranches: (branches) => set({ branches }),
      setSelectedBranch: (branch) => set({ selectedBranch: branch }),

      /**
       * CARGAR SUCURSALES - Fetch desde API
       */
      loadBranches: async () => {
        set({ isLoading: true, error: null });
        try {
          const sucursales = await sucursalesApi.getAll();

          // Mapear estructura backend (español) a frontend (inglés)
          const branches = sucursales.map(s => ({
            id: s.id,
            name: s.nombre,
            city: s.ciudad,
            country: s.pais,
            address: s.direccion,
            phone: s.telefono,
            email: s.email,
            manager: s.encargado,
            managerPhone: s.telefonoEncargado,
            coordinates: s.coordenadas || { lat: 0, lng: 0 },
            workingHours: s.horarios || {},
            services: s.servicios || [],
            amenities: s.amenidades || [],
            status: s.activo ? 'active' : 'inactive',
            stats: s.estadisticas || {
              totalAppointments: 0,
              monthlyRevenue: 0,
              staffCount: 0,
              clientCount: 0
            },
            images: s.imagenes || [],
            createdAt: s.createdAt,
            updatedAt: s.updatedAt
          }));

          set({ branches, isLoading: false });
          return { success: true };
        } catch (error) {
          console.error('Error cargando sucursales:', error);
          set({ branches: [], isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * AGREGAR SUCURSAL - POST a API
       */
      addBranch: async (branchData) => {
        set({ isLoading: true, error: null });
        try {
          // Mapear estructura frontend (inglés) a backend (español)
          const sucursalData = {
            nombre: branchData.name,
            ciudad: branchData.city,
            pais: branchData.country,
            direccion: branchData.address,
            telefono: branchData.phone,
            email: branchData.email,
            encargado: branchData.manager,
            telefonoEncargado: branchData.managerPhone,
            coordenadas: branchData.coordinates || { lat: 0, lng: 0 },
            horarios: branchData.workingHours || {},
            servicios: branchData.services || [],
            amenidades: branchData.amenities || [],
            activo: true,
            estadisticas: {
              totalAppointments: 0,
              monthlyRevenue: 0,
              staffCount: 0,
              clientCount: 0
            },
            imagenes: branchData.images || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          const createdSucursal = await sucursalesApi.create(sucursalData);

          // Mapear de vuelta a frontend
          const newBranch = {
            id: createdSucursal.id,
            name: createdSucursal.nombre,
            city: createdSucursal.ciudad,
            country: createdSucursal.pais,
            address: createdSucursal.direccion,
            phone: createdSucursal.telefono,
            email: createdSucursal.email,
            manager: createdSucursal.encargado,
            managerPhone: createdSucursal.telefonoEncargado,
            coordinates: createdSucursal.coordenadas,
            workingHours: createdSucursal.horarios,
            services: createdSucursal.servicios,
            amenities: createdSucursal.amenidades,
            status: createdSucursal.activo ? 'active' : 'inactive',
            stats: createdSucursal.estadisticas,
            images: createdSucursal.imagenes,
            createdAt: createdSucursal.createdAt,
            updatedAt: createdSucursal.updatedAt
          };

          set(state => ({
            branches: [...state.branches, newBranch],
            isLoading: false
          }));

          return { success: true, branch: newBranch };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * ACTUALIZAR SUCURSAL - PATCH a API
       */
      updateBranch: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          // Mapear updates a estructura backend
          const sucursalUpdates = {};
          if (updates.name) sucursalUpdates.nombre = updates.name;
          if (updates.city) sucursalUpdates.ciudad = updates.city;
          if (updates.country) sucursalUpdates.pais = updates.country;
          if (updates.address) sucursalUpdates.direccion = updates.address;
          if (updates.phone) sucursalUpdates.telefono = updates.phone;
          if (updates.email) sucursalUpdates.email = updates.email;
          if (updates.manager) sucursalUpdates.encargado = updates.manager;
          if (updates.managerPhone) sucursalUpdates.telefonoEncargado = updates.managerPhone;
          if (updates.coordinates) sucursalUpdates.coordenadas = updates.coordinates;
          if (updates.workingHours) sucursalUpdates.horarios = updates.workingHours;
          if (updates.services) sucursalUpdates.servicios = updates.services;
          if (updates.amenities) sucursalUpdates.amenidades = updates.amenities;
          if (updates.status) sucursalUpdates.activo = updates.status === 'active';
          if (updates.stats) sucursalUpdates.estadisticas = updates.stats;
          if (updates.images) sucursalUpdates.imagenes = updates.images;

          sucursalUpdates.updatedAt = new Date().toISOString();

          const updatedSucursal = await sucursalesApi.patch(id, sucursalUpdates);

          // Mapear de vuelta
          const updatedBranch = {
            id: updatedSucursal.id,
            name: updatedSucursal.nombre,
            city: updatedSucursal.ciudad,
            country: updatedSucursal.pais,
            address: updatedSucursal.direccion,
            phone: updatedSucursal.telefono,
            email: updatedSucursal.email,
            manager: updatedSucursal.encargado,
            managerPhone: updatedSucursal.telefonoEncargado,
            coordinates: updatedSucursal.coordenadas,
            workingHours: updatedSucursal.horarios,
            services: updatedSucursal.servicios,
            amenities: updatedSucursal.amenidades,
            status: updatedSucursal.activo ? 'active' : 'inactive',
            stats: updatedSucursal.estadisticas,
            images: updatedSucursal.imagenes,
            createdAt: updatedSucursal.createdAt,
            updatedAt: updatedSucursal.updatedAt
          };

          set(state => ({
            branches: state.branches.map(branch =>
              branch.id === id ? updatedBranch : branch
            ),
            isLoading: false
          }));

          return { success: true, branch: updatedBranch };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * ELIMINAR SUCURSAL - DELETE a API
       */
      deleteBranch: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await sucursalesApi.delete(id);

          set(state => ({
            branches: state.branches.filter(branch => branch.id !== id),
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * TOGGLE STATUS - Activar/Desactivar
       */
      toggleBranchStatus: async (id) => {
        const branch = get().getBranchById(id);
        if (!branch) return { success: false, error: 'Sucursal no encontrada' };

        const newStatus = branch.status === 'active' ? 'inactive' : 'active';
        return await get().updateBranch(id, { status: newStatus });
      },

      /**
       * MÉTODOS DE CONSULTA LOCAL (No requieren API)
       */
      getActiveBranches: () => {
        const { branches } = get();
        return branches.filter(branch => branch.status === 'active');
      },

      getBranchById: (id) => {
        const { branches } = get();
        return branches.find(branch => branch.id === id);
      },

      /**
       * ACTUALIZAR ESTADÍSTICAS DE SUCURSAL
       */
      updateBranchStats: async (branchId, stats) => {
        const branch = get().getBranchById(branchId);
        if (!branch) return { success: false, error: 'Sucursal no encontrada' };

        const updatedStats = { ...branch.stats, ...stats };
        return await get().updateBranch(branchId, { stats: updatedStats });
      },

      /**
       * GESTIÓN DE PAÍSES
       */
      addCountry: (countryData) => {
        const { availableCountries } = get();
        if (!availableCountries.find(c => c.code === countryData.code)) {
          set(state => ({
            availableCountries: [...state.availableCountries, countryData]
          }));
          return { success: true };
        }
        return { success: false, error: 'País ya existe' };
      },

      getCountryByCode: (code) => {
        const { availableCountries } = get();
        return availableCountries.find(c => c.code === code);
      },

      /**
       * PERFORMANCE Y ANALYTICS
       */
      getBranchPerformance: () => {
        const { branches } = get();

        return branches.map(branch => ({
          id: branch.id,
          name: branch.name,
          city: branch.city,
          country: branch.country,
          revenue: branch.stats?.monthlyRevenue || 0,
          appointments: branch.stats?.totalAppointments || 0,
          staff: branch.stats?.staffCount || 0,
          clients: branch.stats?.clientCount || 0,
          efficiency: (branch.stats?.staffCount || 0) > 0
            ? Math.round((branch.stats?.totalAppointments || 0) / branch.stats.staffCount)
            : 0,
          revenuePerClient: (branch.stats?.clientCount || 0) > 0
            ? Math.round((branch.stats?.monthlyRevenue || 0) / branch.stats.clientCount)
            : 0
        })).sort((a, b) => b.revenue - a.revenue);
      },

      getTopPerformingBranches: (limit = 3) => {
        return get().getBranchPerformance().slice(0, limit);
      },

      getTotalStats: () => {
        const { branches } = get();
        const activeBranches = branches.filter(b => b.status === 'active');

        return {
          totalBranches: activeBranches.length,
          totalRevenue: activeBranches.reduce((sum, b) => sum + (b.stats?.monthlyRevenue || 0), 0),
          totalAppointments: activeBranches.reduce((sum, b) => sum + (b.stats?.totalAppointments || 0), 0),
          totalStaff: activeBranches.reduce((sum, b) => sum + (b.stats?.staffCount || 0), 0),
          totalClients: activeBranches.reduce((sum, b) => sum + (b.stats?.clientCount || 0), 0),
          avgRevenuePerBranch: activeBranches.length > 0
            ? activeBranches.reduce((sum, b) => sum + (b.stats?.monthlyRevenue || 0), 0) / activeBranches.length
            : 0
        };
      },

      /**
       * HORARIOS DE OPERACIÓN
       */
      getBranchOperatingHours: (branchId, day) => {
        const branch = get().getBranchById(branchId);
        if (!branch || !branch.workingHours || !branch.workingHours[day]) {
          return null;
        }
        return branch.workingHours[day];
      },

      isBranchOpen: (branchId) => {
        const now = new Date();
        const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
        const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);

        const hours = get().getBranchOperatingHours(branchId, currentDay);

        if (!hours || !hours.open || !hours.close) {
          return false;
        }

        return currentTime >= hours.open && currentTime <= hours.close;
      },

      /**
       * GEOLOCALIZACIÓN
       */
      getNearbyBranches: (lat, lng, radius = 10) => {
        const { branches } = get();

        const calculateDistance = (lat1, lng1, lat2, lng2) => {
          const R = 6371; // Radio de la Tierra en km
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLng = (lng2 - lng1) * Math.PI / 180;
          const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        };

        return branches
          .filter(branch => branch.coordinates && branch.coordinates.lat && branch.coordinates.lng)
          .map(branch => ({
            ...branch,
            distance: calculateDistance(lat, lng, branch.coordinates.lat, branch.coordinates.lng)
          }))
          .filter(branch => branch.distance <= radius)
          .sort((a, b) => a.distance - b.distance);
      }
    }),
    {
      name: 'branch-storage',
      partialize: (state) => ({
        // Solo persistir branches como cache
        branches: state.branches
      })
    }
  )
);

export default useBranchStore;
