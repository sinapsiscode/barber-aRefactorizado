/**
 * CLIENT STORE - REFACTORIZADO CON JSON SERVER
 *
 * Cambios principales:
 * 1. ✅ Usa API real en lugar de mocks
 * 2. ✅ CRUD completo contra json-server
 * 3. ✅ Manejo de errores mejorado
 * 4. ✅ Mantiene lógica de negocio local
 * 5. ✅ Sincronización automática
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { clientsApiExtended } from '../services/api';
import useAuthStore from './authStore.js';

const useClientStore = create(
  persist(
    (set, get) => ({
      clients: [],
      selectedClient: null,
      isLoading: false,
      error: null,

      setClients: (clients) => set({ clients }),
      setSelectedClient: (client) => set({ selectedClient: client }),

      /**
       * CARGAR CLIENTES - Fetch desde API
       */
      loadMockClients: async () => {
        set({ isLoading: true, error: null });
        try {
          const clients = await clientsApiExtended.getAll();
          set({ clients, isLoading: false });
          return { success: true };
        } catch (error) {
          console.error('Error cargando clientes:', error);
          set({ clients: [], isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * AGREGAR CLIENTE - POST a API
       */
      addClient: async (clientData) => {
        set({ isLoading: true, error: null });
        try {
          const newClient = {
            ...clientData,
            status: 'active',
            loyaltyPoints: 0,
            totalVisits: 0,
            totalSpent: 0,
            cutoffWarningInterval: clientData.cutoffWarningInterval || 15,
            lastWarningDate: null,
            warningEnabled: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          // Crear en API
          const createdClient = await clientsApiExtended.create(newClient);

          // Actualizar estado local
          set(state => ({
            clients: [...state.clients, createdClient],
            isLoading: false
          }));

          return { success: true, client: createdClient };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * ACTUALIZAR CLIENTE - PATCH a API
       */
      updateClient: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          const updatedData = {
            ...updates,
            updatedAt: new Date().toISOString()
          };

          // Actualizar en API
          const updatedClient = await clientsApiExtended.patch(id, updatedData);

          // Actualizar estado local
          set(state => ({
            clients: state.clients.map(client =>
              client.id === id ? updatedClient : client
            ),
            isLoading: false
          }));

          return { success: true, client: updatedClient };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * ELIMINAR CLIENTE - DELETE a API
       */
      deleteClient: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await clientsApiExtended.delete(id);

          // Actualizar estado local
          set(state => ({
            clients: state.clients.filter(client => client.id !== id),
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * MÉTODOS DE CONSULTA LOCAL (No requieren API)
       */
      getActiveClients: () => {
        const { clients } = get();
        return clients.filter(client => client.status === 'active');
      },

      getClientById: (id) => {
        const { clients } = get();
        return clients.find(client => client.id === id);
      },

      getClientByEmail: (email) => {
        const { clients } = get();
        return clients.find(client => client.email === email);
      },

      searchClients: (searchTerm) => {
        const { clients } = get();
        const term = searchTerm.toLowerCase();

        return clients.filter(client =>
          client.name.toLowerCase().includes(term) ||
          client.email.toLowerCase().includes(term) ||
          client.phone.includes(term)
        );
      },

      /**
       * ACTUALIZAR LOYALTY POINTS - Con sincronización API
       */
      updateClientLoyalty: async (clientId, points = 10) => {
        const client = get().getClientById(clientId);
        if (!client) return { success: false, error: 'Cliente no encontrado' };

        try {
          const newPoints = client.loyaltyPoints + points;
          await get().updateClient(clientId, { loyaltyPoints: newPoints });
          return { success: true };
        } catch (error) {
          return { success: false, error: error.message };
        }
      },

      /**
       * ACTUALIZAR ESTADÍSTICAS DEL CLIENTE
       */
      updateClientStats: async (clientId, visitAmount) => {
        const client = get().getClientById(clientId);
        if (!client) return { success: false, error: 'Cliente no encontrado' };

        try {
          await get().updateClient(clientId, {
            totalVisits: client.totalVisits + 1,
            totalSpent: client.totalSpent + visitAmount,
            lastVisit: new Date().toISOString()
          });
          return { success: true };
        } catch (error) {
          return { success: false, error: error.message };
        }
      },

      /**
       * GESTIÓN DE ADVERTENCIAS Y FLAGS
       */
      getClientsNeedingReminders: () => {
        const { clients } = get();
        const today = new Date();

        return clients.filter(client => {
          if (!client.warningEnabled || !client.lastVisit) return false;

          const daysSinceLastVisit = Math.floor(
            (today - new Date(client.lastVisit)) / (1000 * 60 * 60 * 24)
          );

          return daysSinceLastVisit >= client.cutoffWarningInterval;
        });
      },

      getClientsForWarning: () => {
        const { clients } = get();
        const today = new Date();

        return clients.filter(client => {
          if (!client.warningEnabled || !client.lastVisit) return false;

          const daysSinceLastVisit = Math.floor(
            (today - new Date(client.lastVisit)) / (1000 * 60 * 60 * 24)
          );

          const daysSinceLastWarning = client.lastWarningDate
            ? Math.floor((today - new Date(client.lastWarningDate)) / (1000 * 60 * 60 * 24))
            : Infinity;

          return daysSinceLastVisit >= client.cutoffWarningInterval &&
                 daysSinceLastWarning >= client.cutoffWarningInterval;
        });
      },

      markWarningAsSent: async (clientId) => {
        return await get().updateClient(clientId, {
          lastWarningDate: new Date().toISOString()
        });
      },

      updateClientWarningSettings: async (clientId, settings) => {
        return await get().updateClient(clientId, {
          cutoffWarningInterval: settings.interval,
          warningEnabled: settings.enabled
        });
      },

      sendCutoffWarning: async (clientId) => {
        const client = get().getClientById(clientId);
        if (!client) return { success: false, error: 'Cliente no encontrado' };

        await get().markWarningAsSent(clientId);

        console.log(`Enviando advertencia a ${client.name} (${client.email})`);

        return {
          success: true,
          message: `Advertencia enviada a ${client.name}`
        };
      },

      /**
       * GESTIÓN DE FLAGS Y BLACKLIST
       */
      flagClient: async (clientId, reason) => {
        return await get().updateClient(clientId, {
          isFlagged: true,
          flagReason: reason,
          flaggedAt: new Date().toISOString()
        });
      },

      unflagClient: async (clientId) => {
        return await get().updateClient(clientId, {
          isFlagged: false,
          flagReason: null,
          flaggedAt: null
        });
      },

      blacklistClient: async (clientId, reason) => {
        return await get().updateClient(clientId, {
          status: 'blacklisted',
          blacklistReason: reason,
          blacklistedAt: new Date().toISOString()
        });
      },

      reactivateClient: async (clientId) => {
        return await get().updateClient(clientId, {
          status: 'active',
          blacklistReason: null,
          blacklistedAt: null,
          isUnwelcome: false,
          unwelcomeReason: null,
          unwelcomeDate: null
        });
      },

      markAsUnwelcome: async (clientId, reason) => {
        return await get().updateClient(clientId, {
          isUnwelcome: true,
          unwelcomeReason: reason,
          unwelcomeDate: new Date().toISOString()
        });
      },

      removeUnwelcomeStatus: async (clientId) => {
        return await get().updateClient(clientId, {
          isUnwelcome: false,
          unwelcomeReason: null,
          unwelcomeDate: null
        });
      },

      getUnwelcomeClients: () => {
        const { clients } = get();
        return clients.filter(client => client.isUnwelcome);
      },

      getBlacklistedClients: () => {
        const { clients } = get();
        return clients.filter(client => client.status === 'blacklisted');
      },

      getFlaggedClients: () => {
        const { clients } = get();
        const today = new Date();

        return clients.filter(client => {
          if (!client.lastVisit) return false;

          const daysSinceLastVisit = Math.floor(
            (today - new Date(client.lastVisit)) / (1000 * 60 * 60 * 24)
          );

          return daysSinceLastVisit > 60;
        }).sort((a, b) => {
          const daysA = Math.floor((today - new Date(a.lastVisit)) / (1000 * 60 * 60 * 24));
          const daysB = Math.floor((today - new Date(b.lastVisit)) / (1000 * 60 * 60 * 24));
          return daysB - daysA;
        });
      },

      incrementFakeVouchers: async (clientId) => {
        const client = get().getClientById(clientId);
        if (!client) return { success: false };

        return await get().updateClient(clientId, {
          fakeVouchers: (client.fakeVouchers || 0) + 1
        });
      },

      clearSecurityFlags: async (clientId) => {
        return await get().updateClient(clientId, {
          securityFlags: {
            isFlagged: false,
            blacklisted: false,
            falseVouchersCount: 0,
            lastFlagDate: null,
            flagReason: null
          }
        });
      },

      /**
       * PREFERENCIAS Y CONFIGURACIÓN
       */
      updateClientPreferences: async (clientId, preferences) => {
        return await get().updateClient(clientId, {
          preferredBranch: preferences.branchId,
          preferredBarber: preferences.barberId,
          preferredServices: preferences.services
        });
      },

      /**
       * ESTADÍSTICAS Y ANALYTICS
       */
      getClientStats: () => {
        const { clients } = get();
        const activeClients = clients.filter(c => c.status === 'active');

        const totalClients = activeClients.length;
        const totalLoyaltyPoints = activeClients.reduce((sum, c) => sum + (c.loyaltyPoints || 0), 0);
        const totalSpending = activeClients.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
        const avgSpendingPerClient = totalClients > 0 ? totalSpending / totalClients : 0;
        const totalVisits = activeClients.reduce((sum, c) => sum + (c.totalVisits || 0), 0);

        const clientsNeedingReminders = get().getClientsNeedingReminders().length;

        const vipClients = activeClients.filter(c => c.totalSpent >= 1000);
        const newClientsThisMonth = activeClients.filter(c => {
          const createdDate = new Date(c.createdAt);
          const now = new Date();
          return createdDate.getMonth() === now.getMonth() &&
                 createdDate.getFullYear() === now.getFullYear();
        }).length;

        const loyaltyTiers = {
          Platinum: activeClients.filter(c => c.totalSpent >= 2000).length,
          Gold: activeClients.filter(c => c.totalSpent >= 1000 && c.totalSpent < 2000).length,
          Silver: activeClients.filter(c => c.totalSpent >= 500 && c.totalSpent < 1000).length,
          Bronze: activeClients.filter(c => c.totalSpent < 500).length
        };

        const lastMonthClients = activeClients.filter(c => {
          if (!c.lastVisit) return false;
          const lastVisitDate = new Date(c.lastVisit);
          const now = new Date();
          const daysSince = Math.floor((now - lastVisitDate) / (1000 * 60 * 60 * 24));
          return daysSince <= 30;
        }).length;

        const retentionRate = totalClients > 0 ? (lastMonthClients / totalClients) * 100 : 0;

        return {
          total: totalClients,
          totalClients,
          totalLoyaltyPoints,
          totalSpending,
          totalSpent: totalSpending,
          avgSpendingPerClient: Math.round(avgSpendingPerClient),
          clientsNeedingReminders,
          newClientsThisMonth,
          newThisMonth: newClientsThisMonth,
          vipCount: vipClients.length,
          loyaltyTiers,
          totalVisits,
          retentionRate
        };
      },

      getTopClients: (limit = 10) => {
        const { clients } = get();
        return clients
          .filter(c => c.status === 'active')
          .sort((a, b) => b.totalSpent - a.totalSpent)
          .slice(0, limit);
      },

      getVIPClients: () => {
        const { clients } = get();
        return clients
          .filter(c => c.status === 'active' && c.totalSpent >= 1000)
          .sort((a, b) => b.totalSpent - a.totalSpent)
          .slice(0, 10);
      },

      getClientsBirthdays: (month) => {
        const { clients } = get();
        return clients.filter(client => {
          if (!client.birthDate) return false;
          const birthMonth = new Date(client.birthDate).getMonth();
          return birthMonth === month;
        });
      },

      /**
       * LOYALTY TIER LOGIC
       */
      calculateLoyaltyTier: (client) => {
        if (client.totalSpent >= 2000) return 'Platinum';
        if (client.totalSpent >= 1000) return 'Gold';
        if (client.totalSpent >= 500) return 'Silver';
        return 'Bronze';
      },

      getLoyaltyRecommendations: (clientId) => {
        const client = get().getClientById(clientId);
        if (!client) return [];

        const recommendations = [];
        const tier = get().calculateLoyaltyTier(client);

        if (tier === 'Bronze' && client.totalSpent >= 400) {
          recommendations.push({
            type: 'upgrade',
            message: `¡Está muy cerca del nivel Silver! Solo necesita gastar S/${500 - client.totalSpent} más.`,
            action: 'Ofrecer servicios premium'
          });
        } else if (tier === 'Silver' && client.totalSpent >= 800) {
          recommendations.push({
            type: 'upgrade',
            message: `¡Está muy cerca del nivel Gold! Solo necesita gastar S/${1000 - client.totalSpent} más.`,
            action: 'Ofrecer paquetes VIP'
          });
        } else if (tier === 'Gold' && client.totalSpent >= 1500) {
          recommendations.push({
            type: 'upgrade',
            message: `¡Está muy cerca del nivel Platinum! Solo necesita gastar S/${2000 - client.totalSpent} más.`,
            action: 'Ofrecer servicios exclusivos'
          });
        }

        if (client.loyaltyPoints >= 100) {
          recommendations.push({
            type: 'redeem',
            message: `Tiene ${client.loyaltyPoints} puntos disponibles para canjear.`,
            action: 'Sugerir canjeo de recompensas'
          });
        }

        if (client.lastVisit) {
          const daysSinceLastVisit = Math.floor((new Date() - new Date(client.lastVisit)) / (1000 * 60 * 60 * 24));
          if (daysSinceLastVisit > 30) {
            recommendations.push({
              type: 'retention',
              message: `No ha visitado en ${daysSinceLastVisit} días. Considerar contacto proactivo.`,
              action: 'Enviar oferta especial'
            });
          }
        }

        return recommendations;
      },

      /**
       * HISTORIAL Y DATOS DEL CLIENTE
       */
      getClientHistory: (clientId) => {
        // TODO: Integrar con appointmentStore API
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        return appointments
          .filter(apt => apt.clientId === clientId)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
      },

      getCurrentClientData: () => {
        const { user } = useAuthStore.getState();
        if (!user || user.role !== 'client') return null;

        const client = get().getClientByEmail(user.email);
        if (!client) return null;

        return {
          ...client,
          appointments: get().getClientHistory(client.id),
          loyaltyTier: get().calculateLoyaltyTier(client)
        };
      },

      /**
       * IMPORT/EXPORT (Mantener local por ahora)
       */
      exportClientsData: () => {
        const { clients } = get();
        const dataStr = JSON.stringify(clients, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `clientes_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
      },

      importClientsData: async (file) => {
        try {
          const text = await file.text();
          const importedClients = JSON.parse(text);

          if (!Array.isArray(importedClients)) {
            throw new Error('El archivo no contiene un formato válido');
          }

          // Importar cada cliente a la API
          set({ isLoading: true });
          for (const client of importedClients) {
            await clientsApiExtended.create(client);
          }

          // Recargar desde API
          await get().loadMockClients();

          return { success: true, count: importedClients.length };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
      },
    }),
    {
      name: 'client-storage',
      partialize: (state) => ({
        // Solo persistir clients como cache, la verdad está en la API
        clients: state.clients
      })
    }
  )
);

export default useClientStore;
