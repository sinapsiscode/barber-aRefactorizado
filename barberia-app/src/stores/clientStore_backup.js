import { create } from 'zustand';
import { getDataSection } from '../utils/dataLoader.js';

const useClientStore = create((set, get) => ({
  clients: [],
  selectedClient: null,
  isLoading: false,
  searchTerm: '',

  setClients: (clients) => set({ clients }),

  setSelectedClient: (client) => set({ selectedClient: client }),

  setSearchTerm: (term) => set({ searchTerm: term }),

  addClient: async (clientData) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newClient = {
        id: Date.now(),
        ...clientData,
        loyaltyPoints: 0,
        totalVisits: 0,
        totalSpent: 0,
        preferredServices: [],
        status: 'active',
        cutoffWarningInterval: clientData.cutoffWarningInterval || 15,
        lastWarningDate: null,
        warningEnabled: clientData.warningEnabled !== false,
        // CAMPOS DE SEGURIDAD - Sistema de prevención de fraudes
        securityFlags: {
          falseVouchersCount: 0,      // Contador de vouchers falsos detectados
          rejectedPaymentsCount: 0,   // Total de pagos rechazados (incluye otras razones)
          lastRejectionDate: null,    // Fecha del último rechazo
          isFlagged: false,           // true si tiene 2+ vouchers falsos
          flagReason: null,           // Descripción de por qué fue marcado
          blacklisted: false          // true si tiene 3+ vouchers falsos (bloqueado)
        },
        paymentHistory: [],           // Historial detallado de todos los rechazos
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

  addLoyaltyPoints: (clientId, points) => {
    set(state => ({
      clients: state.clients.map(client => 
        client.id === clientId 
          ? { ...client, loyaltyPoints: client.loyaltyPoints + points }
          : client
      )
    }));
  },

  /**
   * FUNCIÓN PRINCIPAL DEL SISTEMA DE SEGURIDAD
   * Marca a un cliente cuando se detecta un voucher falso
   * 
   * REGLAS DE NEGOCIO:
   * - 1er voucher falso: Solo se registra
   * - 2do voucher falso: Cliente marcado con bandera (isFlagged = true)
   * - 3er voucher falso: Cliente bloqueado (blacklisted = true)
   * 
   * @param {number} clientId - ID del cliente a marcar
   * @param {string} rejectionReason - Razón del rechazo del voucher
   * @param {Object} voucherDetails - Detalles del voucher rechazado
   */
  flagClientForFalseVoucher: (clientId, rejectionReason, voucherDetails) => {
    set(state => {
      const updatedClients = state.clients.map(client => {
        if (client.id === clientId) {
          const falseVouchersCount = (client.securityFlags?.falseVouchersCount || 0) + 1;
          // LÓGICA DE ESCALAMIENTO DE SEGURIDAD
          const isFlagged = falseVouchersCount >= 2;    // Umbral para marcar
          const blacklisted = falseVouchersCount >= 3;  // Umbral para bloquear
          
          // Registro completo del incidente para historial
          const paymentRejection = {
            id: Date.now(),
            date: new Date().toISOString(),
            reason: rejectionReason,
            voucherNumber: voucherDetails.voucherNumber,
            amount: voucherDetails.amount,
            paymentMethod: voucherDetails.paymentMethod,
            verifiedBy: voucherDetails.verifiedBy
          };
          
          return {
            ...client,
            securityFlags: {
              ...client.securityFlags,
              falseVouchersCount,
              rejectedPaymentsCount: (client.securityFlags?.rejectedPaymentsCount || 0) + 1,
              lastRejectionDate: new Date().toISOString(),
              isFlagged,
              flagReason: isFlagged ? `Cliente con ${falseVouchersCount} vouchers falsos` : client.securityFlags?.flagReason,
              blacklisted
            },
            paymentHistory: [...(client.paymentHistory || []), paymentRejection],
            status: blacklisted ? 'blacklisted' : client.status
          };
        }
        return client;
      });
      
      return { clients: updatedClients };
    });
  },

  /**
   * Obtiene todos los clientes con problemas de seguridad
   * Usado para mostrar la pestaña "Clientes sospechosos"
   * 
   * @returns {Array} Lista de clientes que tienen:
   *                  - Banderas de seguridad activas
   *                  - Estado bloqueado
   *                  - Al menos 1 voucher falso registrado
   */
  getFlaggedClients: () => {
    const { clients } = get();
    return clients.filter(client => 
      client.securityFlags?.isFlagged || 
      client.securityFlags?.blacklisted ||
      (client.securityFlags?.falseVouchersCount || 0) > 0
    );
  },

  /**
   * Limpia todas las banderas de seguridad de un cliente
   * SOLO DISPONIBLE PARA SUPERADMIN
   * 
   * Úsese cuando se quiere dar una segunda oportunidad a un cliente
   * Resetea todos los contadores pero mantiene el historial
   * 
   * @param {number} clientId - ID del cliente a limpiar
   */
  clearSecurityFlags: (clientId) => {
    set(state => ({
      clients: state.clients.map(client => 
        client.id === clientId
          ? {
              ...client,
              securityFlags: {
                falseVouchersCount: 0,
                rejectedPaymentsCount: 0,
                lastRejectionDate: null,
                isFlagged: false,
                flagReason: null,
                blacklisted: false
              },
              status: 'active'
            }
          : client
      )
    }));
  },

  redeemLoyaltyPoints: (clientId, points) => {
    const { clients } = get();
    const client = clients.find(c => c.id === clientId);
    
    if (client && client.loyaltyPoints >= points) {
      set(state => ({
        clients: state.clients.map(c => 
          c.id === clientId 
            ? { ...c, loyaltyPoints: c.loyaltyPoints - points }
            : c
        )
      }));
      return { success: true };
    }
    return { success: false, error: 'Puntos insuficientes' };
  },

  updateClientStats: (clientId, visitCount, amountSpent, services) => {
    set(state => ({
      clients: state.clients.map(client => 
        client.id === clientId 
          ? { 
              ...client, 
              totalVisits: client.totalVisits + visitCount,
              totalSpent: client.totalSpent + amountSpent,
              preferredServices: [...new Set([...client.preferredServices, ...services])],
              lastVisit: new Date(),
              updatedAt: new Date()
            }
          : client
      )
    }));
  },

  searchClients: (term) => {
    const { clients } = get();
    if (!term) return clients;
    
    return clients.filter(client => 
      client.name.toLowerCase().includes(term.toLowerCase()) ||
      client.email.toLowerCase().includes(term.toLowerCase()) ||
      client.phone.includes(term)
    );
  },

  getClientsByBranch: (branchId) => {
    const { clients } = get();
    return clients.filter(client => 
      client.preferredBranch === branchId || client.branches?.includes(branchId)
    );
  },

  getVIPClients: () => {
    const { clients } = get();
    return clients
      .filter(client => client.totalSpent > 1000 || client.totalVisits > 20)
      .sort((a, b) => b.totalSpent - a.totalSpent);
  },

  getNewClients: (days = 30) => {
    const { clients } = get();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return clients.filter(client => new Date(client.createdAt) >= cutoffDate);
  },

  getClientHistory: (clientId) => {
    return {
      appointments: [],
      transactions: [],
      loyaltyHistory: []
    };
  },

  calculateLoyaltyTier: (client) => {
    if (client.totalSpent >= 2000) return 'Platinum';
    if (client.totalSpent >= 1000) return 'Gold';
    if (client.totalSpent >= 500) return 'Silver';
    return 'Bronze';
  },

  getClientRecommendations: (clientId) => {
    const { clients } = get();
    const client = clients.find(c => c.id === clientId);
    
    if (!client) return [];

    const recommendations = [];
    
    if (client.preferredServices.includes('Corte Clásico') && !client.preferredServices.includes('Barba')) {
      recommendations.push({
        type: 'service',
        title: 'Combo Corte + Barba',
        description: 'Basado en tu preferencia por cortes clásicos',
        discount: 15
      });
    }

    if (client.loyaltyPoints >= 100) {
      recommendations.push({
        type: 'loyalty',
        title: 'Canjea tus puntos',
        description: `Tienes ${client.loyaltyPoints} puntos disponibles`,
        value: client.loyaltyPoints
      });
    }

    if (client.totalVisits > 10 && !client.lastVisit || 
        (new Date() - new Date(client.lastVisit)) > 30 * 24 * 60 * 60 * 1000) {
      recommendations.push({
        type: 'retention',
        title: '¡Te extrañamos!',
        description: 'Vuelve y recibe un descuento especial',
        discount: 20
      });
    }

    return recommendations;
  },

  loadMockClients: async () => {
    try {
      // REFACTORED: Cargar clientes base desde JSON
      const baseClients = await getDataSection('clients');
      
      // Mantener lógica de generación de clientes adicionales
      const mockClients = [...baseClients];
      
      // Generar clientes adicionales (mantener lógica original)
      // Omitir clientes hardcodeados ya que están en JSON
      
      // Generar clientes adicionales usando la lógica original
      for (let i = baseClients.length + 1; i <= 100; i++) {
        const randomName = [
          'Alejandro', 'Camila', 'Santiago', 'Valentina', 'Sebastián', 'Isabella', 
          'Mateo', 'Sofía', 'Nicolás', 'Mariana', 'Daniel', 'Gabriela'
        ][Math.floor(Math.random() * 12)];
        
        const randomLastName = [
          'García', 'Rodríguez', 'López', 'Martínez', 'González', 'Pérez', 
          'Sánchez', 'Ramírez', 'Cruz', 'Flores', 'Gómez', 'Díaz'
        ][Math.floor(Math.random() * 12)];

        const totalVisits = Math.floor(Math.random() * 30) + 1;
        const avgSpending = 40 + Math.random() * 30;
        
        mockClients.push({
          id: i,
          name: `${randomName} ${randomLastName}`,
        email: 'juan.perez@email.com',
        phone: '+51 900 123 456',
        birthDate: '1985-03-15',
        address: 'Av. Pardo 123, Miraflores, Lima',
        preferredBranch: 1,
        preferredBarber: 1,
        loyaltyPoints: 150,
        totalVisits: 25,
        totalSpent: 1250,
        preferredServices: ['Corte Clásico', 'Barba'],
        notes: 'Prefiere citas por la mañana',
        status: 'active',
        cutoffWarningInterval: 15,
        lastWarningDate: null,
        warningEnabled: true,
        lastVisit: new Date('2023-11-01'),
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'María Fernanda López',
        email: 'maria.lopez@email.com',
        phone: '+51 901 234 567',
        birthDate: '1990-07-22',
        address: 'Av. Larco 456, San Isidro, Lima',
        preferredBranch: 2,
        preferredBarber: 2,
        loyaltyPoints: 75,
        totalVisits: 12,
        totalSpent: 480,
        preferredServices: ['Corte Moderno', 'Tinte'],
        notes: 'Alérgica a ciertos productos químicos',
        status: 'active',
        cutoffWarningInterval: 15,
        lastWarningDate: null,
        warningEnabled: true,
        lastVisit: new Date('2023-10-15'),
        createdAt: new Date('2023-06-20'),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'Carlos Andrés Martínez',
        email: 'carlos.martinez@email.com',
        phone: '+51 902 345 678',
        birthDate: '1982-11-08',
        address: 'Av. Brasil 789, Magdalena, Lima',
        preferredBranch: 3,
        preferredBarber: 3,
        loyaltyPoints: 300,
        totalVisits: 45,
        totalSpent: 2250,
        preferredServices: ['Fade', 'Diseño', 'Barba'],
        notes: 'Cliente VIP, siempre puntual',
        status: 'active',
        cutoffWarningInterval: 10,
        lastWarningDate: null,
        warningEnabled: true,
        lastVisit: new Date('2024-01-12'),
        createdAt: new Date('2022-03-10'),
        updatedAt: new Date()
      },
      {
        id: 4,
        name: 'Juan Cliente',
        email: 'cliente@barberia.com',
        phone: '+51 900 111 222',
        birthDate: '1992-05-18',
        address: 'Av. Principal 987, Lima',
        preferredBranch: 1,
        preferredBarber: 1,
        loyaltyPoints: 85,
        totalVisits: 8,
        totalSpent: 320,
        preferredServices: ['Corte Moderno', 'Barba'],
        notes: 'Cliente activo, prefiere citas vespertinas',
        status: 'active',
        cutoffWarningInterval: 15,
        lastWarningDate: null,
        warningEnabled: true,
        lastVisit: new Date('2024-01-05'),
        createdAt: new Date('2023-08-10'),
        updatedAt: new Date()
      },
      {
        id: 6,
        name: 'Ana Sofía Rodríguez',
        email: 'ana.rodriguez@email.com',
        phone: '+51 903 456 789',
        birthDate: '1995-09-14',
        address: 'Av. Salaverry 321, San Isidro, Lima',
        preferredBranch: 4,
        loyaltyPoints: 45,
        totalVisits: 8,
        totalSpent: 320,
        preferredServices: ['Corte Femenino', 'Tratamiento'],
        notes: 'Primera vez en barbería, prefiere ambiente relajado',
        status: 'active',
        lastVisit: new Date('2024-01-05'),
        createdAt: new Date('2023-11-15'),
        updatedAt: new Date()
      },
      {
        id: 5,
        name: 'Diego Fernando Castro',
        email: 'diego.castro@email.com',
        phone: '+51 904 567 890',
        birthDate: '1988-12-03',
        address: 'Av. Universitaria 654, Los Olivos, Lima',
        preferredBranch: 1,
        loyaltyPoints: 200,
        totalVisits: 35,
        totalSpent: 1750,
        preferredServices: ['Corte Clásico', 'Afeitado', 'Cejas'],
        notes: 'Empresario, valora la puntualidad',
        status: 'active',
        cutoffWarningInterval: 10,
        lastWarningDate: null,
        warningEnabled: true,
        lastVisit: new Date('2024-01-11'),
        createdAt: new Date('2022-08-05'),
        updatedAt: new Date()
      }
    ];

    for (let i = 7; i <= 100; i++) {
      const randomName = [
        'Alejandro', 'Camila', 'Santiago', 'Valentina', 'Sebastián', 'Isabella', 
        'Mateo', 'Sofía', 'Nicolás', 'Mariana', 'Daniel', 'Gabriela'
      ][Math.floor(Math.random() * 12)];
      
      const randomLastName = [
        'García', 'Rodríguez', 'López', 'Martínez', 'González', 'Pérez', 
        'Sánchez', 'Ramírez', 'Cruz', 'Flores', 'Gómez', 'Díaz'
      ][Math.floor(Math.random() * 12)];

      const totalVisits = Math.floor(Math.random() * 30) + 1;
      const avgSpending = 40 + Math.random() * 30;
      
      mockClients.push({
        id: i,
        name: `${randomName} ${randomLastName}`,
        email: `${randomName.toLowerCase()}.${randomLastName.toLowerCase()}@email.com`,
        phone: `+51 9${Math.floor(Math.random() * 9) + 1}${Math.floor(Math.random() * 9)} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100}`,
        birthDate: `19${80 + Math.floor(Math.random() * 25)}-${(Math.floor(Math.random() * 12) + 1).toString().padStart(2, '0')}-${(Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0')}`,
        preferredBranch: Math.floor(Math.random() * 5) + 1,
        loyaltyPoints: Math.floor(totalVisits * 5 + Math.random() * 50),
        totalVisits,
        totalSpent: Math.floor(totalVisits * avgSpending),
        preferredServices: ['Corte Clásico', 'Fade', 'Barba', 'Diseño'].slice(0, Math.floor(Math.random() * 3) + 1),
        status: 'active',
        cutoffWarningInterval: [10, 15, 20, 30][Math.floor(Math.random() * 4)],
        lastWarningDate: Math.random() > 0.7 ? new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000) : null,
        warningEnabled: Math.random() > 0.1,
        lastVisit: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      });
    }

      set({ clients: mockClients });
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
    
    const totalSpent = activeClients.reduce((sum, c) => sum + c.totalSpent, 0);
    const totalVisits = activeClients.reduce((sum, c) => sum + c.totalVisits, 0);
    const avgSpendingPerClient = activeClients.length > 0 ? totalSpent / activeClients.length : 0;
    
    const newThisMonth = get().getNewClients(30).length;
    const vipCount = get().getVIPClients().length;
    
    const loyaltyTiers = {
      Bronze: 0,
      Silver: 0,
      Gold: 0,
      Platinum: 0
    };
    
    activeClients.forEach(client => {
      const tier = get().calculateLoyaltyTier(client);
      loyaltyTiers[tier]++;
    });

    return {
      total: activeClients.length,
      newThisMonth,
      vipCount,
      totalSpent,
      totalVisits,
      avgSpendingPerClient: Math.round(avgSpendingPerClient),
      loyaltyTiers,
      retentionRate: activeClients.length > 0 ? 
        (activeClients.filter(c => c.lastVisit && 
          (new Date() - new Date(c.lastVisit)) < 60 * 24 * 60 * 60 * 1000
        ).length / activeClients.length) * 100 : 0
    };
  },

  updateClientWarningSettings: (clientId, warningInterval, warningEnabled = true) => {
    set(state => ({
      clients: state.clients.map(client => 
        client.id === clientId 
          ? { 
              ...client, 
              cutoffWarningInterval: warningInterval,
              warningEnabled,
              updatedAt: new Date()
            }
          : client
      )
    }));
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
          ? { ...client, lastWarningDate: new Date(), updatedAt: new Date() }
          : client
      )
    }));
  },

  sendCutoffWarning: async (clientId, message) => {
    try {
      const { clients } = get();
      const client = clients.find(c => c.id === clientId);
      
      if (!client) {
        return { success: false, error: 'Cliente no encontrado' };
      }

      console.log(`Enviando notificación a ${client.name} (${client.phone}): ${message}`);
      
      get().markWarningAsSent(clientId);
      
      return { 
        success: true, 
        message: `Notificación enviada a ${client.name}`,
        client: client.name,
        phone: client.phone
      };
    } catch (error) {
      return { success: false, error: 'Error al enviar la notificación' };
    }
  },

  getClientByEmail: (email) => {
    const { clients } = get();
    return clients.find(client => client.email === email);
  },

  getCurrentClientData: (user) => {
    if (user?.role === 'client') {
      return get().getClientByEmail(user.email);
    }
    return null;
  }
}));

export default useClientStore;