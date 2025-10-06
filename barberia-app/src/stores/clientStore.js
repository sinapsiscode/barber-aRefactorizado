import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getDataSection } from '../utils/dataLoader.js';
import useAuthStore from './authStore.js';

const useClientStore = create(
  persist(
    (set, get) => ({
      clients: [],
      selectedClient: null,
      isLoading: false,

      setClients: (clients) => set({ clients }),

      setSelectedClient: (client) => set({ selectedClient: client }),

      addClient: async (clientData) => {
        set({ isLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const newClient = {
            id: Date.now(),
            ...clientData,
            status: 'active',
            loyaltyPoints: 0,
            totalVisits: 0,
            totalSpent: 0,
            cutoffWarningInterval: clientData.cutoffWarningInterval || 15,
            lastWarningDate: null,
            warningEnabled: true,
            createdAt: new Date(),
            updatedAt: new Date()
          };

          set(state => ({
            clients: [...state.clients, newClient],
            isLoading: false
          }));

          return { success: true, client: newClient };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: 'Error al agregar el cliente' };
        }
      },

      updateClient: async (id, updates) => {
        set({ isLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            clients: state.clients.map(client => 
              client.id === id 
                ? { ...client, ...updates, updatedAt: new Date() }
                : client
            ),
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: 'Error al actualizar el cliente' };
        }
      },

      deleteClient: async (id) => {
        set({ isLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            clients: state.clients.filter(client => client.id !== id),
            isLoading: false
          }));

          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: 'Error al eliminar el cliente' };
        }
      },

      getActiveClients: () => {
        const { clients } = get();
        return clients.filter(client => client.status === 'active');
      },

      getClientById: (id) => {
        const { clients } = get();
        return clients.find(client => client.id === id);
      },

      updateClientLoyalty: (clientId, points = 10) => {
        set(state => ({
          clients: state.clients.map(client =>
            client.id === clientId
              ? {
                  ...client,
                  loyaltyPoints: client.loyaltyPoints + points,
                  updatedAt: new Date()
                }
              : client
          )
        }));
      },

      updateClientStats: (clientId, visitAmount) => {
        set(state => ({
          clients: state.clients.map(client =>
            client.id === clientId
              ? {
                  ...client,
                  totalVisits: client.totalVisits + 1,
                  totalSpent: client.totalSpent + visitAmount,
                  lastVisit: new Date(),
                  updatedAt: new Date()
                }
              : client
          )
        }));
      },

      getClientByEmail: (email) => {
        const { clients } = get();
        return clients.find(client => client.email === email);
      },

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

      getClientHistory: (clientId) => {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        return appointments
          .filter(apt => apt.clientId === clientId)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
      },

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
          
          set({ clients: importedClients });
          return { success: true, count: importedClients.length };
        } catch (error) {
          return { success: false, error: error.message };
        }
      },

      flagClient: (clientId, reason) => {
        set(state => ({
          clients: state.clients.map(client =>
            client.id === clientId
              ? {
                  ...client,
                  isFlagged: true,
                  flagReason: reason,
                  flaggedAt: new Date(),
                  updatedAt: new Date()
                }
              : client
          )
        }));
      },

      unflagClient: (clientId) => {
        set(state => ({
          clients: state.clients.map(client =>
            client.id === clientId
              ? {
                  ...client,
                  isFlagged: false,
                  flagReason: null,
                  flaggedAt: null,
                  updatedAt: new Date()
                }
              : client
          )
        }));
      },

      blacklistClient: (clientId, reason) => {
        set(state => ({
          clients: state.clients.map(client =>
            client.id === clientId
              ? {
                  ...client,
                  status: 'blacklisted',
                  blacklistReason: reason,
                  blacklistedAt: new Date(),
                  updatedAt: new Date()
                }
              : client
          )
        }));
      },

      reactivateClient: (clientId) => {
        set(state => ({
          clients: state.clients.map(client =>
            client.id === clientId
              ? {
                  ...client,
                  status: 'active',
                  blacklistReason: null,
                  blacklistedAt: null,
                  isUnwelcome: false,
                  unwelcomeReason: null,
                  unwelcomeDate: null,
                  updatedAt: new Date()
                }
              : client
          )
        }));
      },

      markAsUnwelcome: (clientId, reason) => {
        set(state => ({
          clients: state.clients.map(client =>
            client.id === clientId
              ? {
                  ...client,
                  isUnwelcome: true,
                  unwelcomeReason: reason,
                  unwelcomeDate: new Date(),
                  updatedAt: new Date()
                }
              : client
          )
        }));
      },

      removeUnwelcomeStatus: (clientId) => {
        set(state => ({
          clients: state.clients.map(client =>
            client.id === clientId
              ? {
                  ...client,
                  isUnwelcome: false,
                  unwelcomeReason: null,
                  unwelcomeDate: null,
                  updatedAt: new Date()
                }
              : client
          )
        }));
      },

      getUnwelcomeClients: () => {
        const { clients } = get();
        return clients.filter(client => client.isUnwelcome);
      },

      incrementFakeVouchers: (clientId) => {
        set(state => ({
          clients: state.clients.map(client =>
            client.id === clientId
              ? {
                  ...client,
                  fakeVouchers: (client.fakeVouchers || 0) + 1,
                  updatedAt: new Date()
                }
              : client
          )
        }));
      },

      getBlacklistedClients: () => {
        const { clients } = get();
        return clients.filter(client => client.status === 'blacklisted');
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

      getClientsBirthdays: (month) => {
        const { clients } = get();
        return clients.filter(client => {
          if (!client.birthDate) return false;
          const birthMonth = new Date(client.birthDate).getMonth();
          return birthMonth === month;
        });
      },

      updateClientPreferences: (clientId, preferences) => {
        set(state => ({
          clients: state.clients.map(client =>
            client.id === clientId
              ? {
                  ...client,
                  preferredBranch: preferences.branchId,
                  preferredBarber: preferences.barberId,
                  preferredServices: preferences.services,
                  updatedAt: new Date()
                }
              : client
          )
        }));
      },

      getTopClients: (limit = 10) => {
        const { clients } = get();
        return clients
          .filter(c => c.status === 'active')
          .sort((a, b) => b.totalSpent - a.totalSpent)
          .slice(0, limit);
      },

      loadMockClients: async () => {
        try {
          const clients = await getDataSection('clients');
          set({ clients: clients || [] });
          return { success: true };
        } catch (error) {
          console.error('Error cargando datos de clientes:', error);
          set({ clients: [] });
          return { success: false, error: error.message };
        }
      },

      getClientStats: () => {
        const { clients } = get();
        const activeClients = clients.filter(c => c.status === 'active');
        
        const totalClients = activeClients.length;
        const totalLoyaltyPoints = activeClients.reduce((sum, c) => sum + c.loyaltyPoints, 0);
        const totalSpending = activeClients.reduce((sum, c) => sum + c.totalSpent, 0);
        const avgSpendingPerClient = totalClients > 0 ? totalSpending / totalClients : 0;
        const totalVisits = activeClients.reduce((sum, c) => sum + c.totalVisits, 0);
        
        // Clientes que necesitan seguimiento
        const clientsNeedingReminders = get().getClientsNeedingReminders().length;
        
        // VIP y nuevos clientes
        const vipClients = activeClients.filter(c => c.totalSpent >= 1000);
        const newClientsThisMonth = activeClients.filter(c => {
          const createdDate = new Date(c.createdAt);
          const now = new Date();
          return createdDate.getMonth() === now.getMonth() && 
                 createdDate.getFullYear() === now.getFullYear();
        }).length;
        
        // Loyalty tiers
        const loyaltyTiers = {
          Platinum: activeClients.filter(c => c.totalSpent >= 2000).length,
          Gold: activeClients.filter(c => c.totalSpent >= 1000 && c.totalSpent < 2000).length,
          Silver: activeClients.filter(c => c.totalSpent >= 500 && c.totalSpent < 1000).length,
          Bronze: activeClients.filter(c => c.totalSpent < 500).length
        };
        
        // Retention rate
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

      markWarningAsSent: (clientId) => {
        set(state => ({
          clients: state.clients.map(client =>
            client.id === clientId
              ? {
                  ...client,
                  lastWarningDate: new Date(),
                  updatedAt: new Date()
                }
              : client
          )
        }));
      },

      updateClientWarningSettings: (clientId, settings) => {
        set(state => ({
          clients: state.clients.map(client =>
            client.id === clientId
              ? {
                  ...client,
                  cutoffWarningInterval: settings.interval,
                  warningEnabled: settings.enabled,
                  updatedAt: new Date()
                }
              : client
          )
        }));
      },

      sendCutoffWarning: async (clientId) => {
        const client = get().getClientById(clientId);
        if (!client) return { success: false, error: 'Cliente no encontrado' };
        
        get().markWarningAsSent(clientId);
        
        console.log(`Enviando advertencia a ${client.name} (${client.email})`);
        
        return { 
          success: true, 
          message: `Advertencia enviada a ${client.name}` 
        };
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

      calculateLoyaltyTier: (client) => {
        if (client.totalSpent >= 2000) return 'Platinum';
        if (client.totalSpent >= 1000) return 'Gold';
        if (client.totalSpent >= 500) return 'Silver';
        return 'Bronze';
      },

      getVIPClients: () => {
        const { clients } = get();
        return clients
          .filter(c => c.status === 'active' && c.totalSpent >= 1000)
          .sort((a, b) => b.totalSpent - a.totalSpent)
          .slice(0, 10);
      },

      getLoyaltyRecommendations: (clientId) => {
        const client = get().getClientById(clientId);
        if (!client) return [];

        const recommendations = [];
        const tier = get().calculateLoyaltyTier(client);

        // Recomendaciones basadas en el tier actual
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

        // Recomendaciones basadas en puntos de lealtad
        if (client.loyaltyPoints >= 100) {
          recommendations.push({
            type: 'redeem',
            message: `Tiene ${client.loyaltyPoints} puntos disponibles para canjear.`,
            action: 'Sugerir canjeo de recompensas'
          });
        }

        // Recomendaciones basadas en última visita
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

      getFlaggedClients: () => {
        const { clients } = get();
        const today = new Date();

        return clients.filter(client => {
          if (!client.lastVisit) return false;

          const daysSinceLastVisit = Math.floor(
            (today - new Date(client.lastVisit)) / (1000 * 60 * 60 * 24)
          );

          // Clientes que no han venido en más de 60 días
          return daysSinceLastVisit > 60;
        }).sort((a, b) => {
          const daysA = Math.floor((today - new Date(a.lastVisit)) / (1000 * 60 * 60 * 24));
          const daysB = Math.floor((today - new Date(b.lastVisit)) / (1000 * 60 * 60 * 24));
          return daysB - daysA;
        });
      },

      clearSecurityFlags: (clientId) => {
        set(state => ({
          clients: state.clients.map(client =>
            client.id === clientId
              ? {
                  ...client,
                  securityFlags: {
                    isFlagged: false,
                    blacklisted: false,
                    falseVouchersCount: 0,
                    lastFlagDate: null,
                    flagReason: null
                  },
                  updatedAt: new Date()
                }
              : client
          )
        }));
      }
    }),
    {
      name: 'client-storage',
      partialize: (state) => ({
        clients: state.clients
      })
    }
  )
);

export default useClientStore;