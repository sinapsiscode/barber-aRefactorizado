/**
 * LOYALTY STORE - REFACTORIZADO CON JSON SERVER
 *
 * Cambios:
 * ✅ Migrado a API real (recompensasApi, transaccionesPuntosApi, recompensasClienteApi)
 * ✅ Eliminado hardcode de mockData
 * ✅ CRUD completo para recompensas, transacciones de puntos y recompensas de cliente
 * ✅ Lógica de negocio (cálculos, niveles) mantenida localmente
 * ✅ Persist middleware ya existente
 * ✅ Integración con otros stores mantenida
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { recompensasApi, transaccionesPuntosApi, recompensasClienteApi, nivelesLealtadApi, puntosSettingsApi } from '../services/api';

const useLoyaltyStore = create(
  persist(
    (set, get) => ({
      // Estado inicial
      rewards: [],
      pointsTransactions: [],
      clientRewards: [],
      loyaltyLevels: [
        {
          id: 1,
          name: 'Bronce',
          color: '#CD7F32',
          image: null,
          minPoints: 0,
          maxPoints: 499,
          benefits: {
            pointsMultiplier: 1.0,
            discountPercentage: 0,
            freeServicesPerMonth: 0,
            priorityBooking: false,
            birthdayBonus: 50
          }
        },
        {
          id: 2,
          name: 'Plata',
          color: '#C0C0C0',
          image: null,
          minPoints: 500,
          maxPoints: 1499,
          benefits: {
            pointsMultiplier: 1.2,
            discountPercentage: 5,
            freeServicesPerMonth: 0,
            priorityBooking: false,
            birthdayBonus: 100
          }
        },
        {
          id: 3,
          name: 'Oro',
          color: '#FFD700',
          image: null,
          minPoints: 1500,
          maxPoints: 2999,
          benefits: {
            pointsMultiplier: 1.5,
            discountPercentage: 10,
            freeServicesPerMonth: 1,
            priorityBooking: true,
            birthdayBonus: 200
          }
        },
        {
          id: 4,
          name: 'Platino',
          color: '#E5E4E2',
          image: null,
          minPoints: 3000,
          maxPoints: null,
          benefits: {
            pointsMultiplier: 2.0,
            discountPercentage: 15,
            freeServicesPerMonth: 2,
            priorityBooking: true,
            birthdayBonus: 500
          }
        }
      ],
      settings: {
        pointsPerSol: 1,
        enabled: true,
        minimumPointsToRedeem: 50,
        pointsExpiryDays: 365,
        welcomeBonusPoints: 50,
        birthdayBonusPoints: 100,
        referralBonusPoints: 150
      },
      isLoading: false,
      error: null,

      /**
       * CARGAR RECOMPENSAS - Fetch desde API
       */
      loadRewards: async () => {
        set({ isLoading: true, error: null });
        try {
          const recompensasData = await recompensasApi.getAll();

          // Mapear estructura backend (español) a frontend (inglés)
          const rewards = recompensasData.map(r => ({
            id: r.id,
            name: r.nombre,
            description: r.descripcion,
            pointsCost: r.costoEnPuntos,
            discountType: r.tipoDescuento,
            discountValue: r.valorDescuento,
            validityDays: r.diasValidez,
            category: r.categoria,
            isActive: r.activo,
            maxUses: r.usosMaximos,
            applicableServices: r.serviciosAplicables || [],
            icon: r.icono,
            image: r.imagen
          }));

          set({ rewards, isLoading: false });
          return { success: true };
        } catch (error) {
          console.error('Error cargando recompensas:', error);
          set({ rewards: [], isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * CARGAR TRANSACCIONES DE PUNTOS - Fetch desde API
       */
      loadPointsTransactions: async () => {
        set({ isLoading: true, error: null });
        try {
          const transaccionesData = await transaccionesPuntosApi.getAll();

          // Mapear estructura backend (español) a frontend (inglés)
          const pointsTransactions = transaccionesData.map(t => ({
            id: t.id,
            clientId: t.clienteId,
            type: t.tipo,
            points: t.puntos,
            description: t.descripcion,
            reference: t.referencia,
            referenceId: t.referenciaId,
            date: t.fecha,
            branchId: t.sucursalId,
            rewardId: t.recompensaId
          }));

          set({ pointsTransactions, isLoading: false });
          return { success: true };
        } catch (error) {
          console.error('Error cargando transacciones de puntos:', error);
          set({ pointsTransactions: [], isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * CARGAR RECOMPENSAS DE CLIENTES - Fetch desde API
       */
      loadClientRewards: async () => {
        set({ isLoading: true, error: null });
        try {
          const recompensasClienteData = await recompensasClienteApi.getAll();

          // Mapear estructura backend (español) a frontend (inglés)
          const clientRewards = recompensasClienteData.map(cr => ({
            id: cr.id,
            clientId: cr.clienteId,
            rewardId: cr.recompensaId,
            redeemDate: cr.fechaCanje,
            expiryDate: cr.fechaExpiracion,
            status: cr.estado,
            usedDate: cr.fechaUso,
            branchId: cr.sucursalId,
            discountCode: cr.codigoDescuento
          }));

          set({ clientRewards, isLoading: false });
          return { success: true };
        } catch (error) {
          console.error('Error cargando recompensas de clientes:', error);
          set({ clientRewards: [], isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * AGREGAR RECOMPENSA - POST a API
       */
      addReward: async (rewardData) => {
        set({ isLoading: true, error: null });
        try {
          // Mapear a estructura backend
          const recompensaData = {
            nombre: rewardData.name,
            descripcion: rewardData.description,
            costoEnPuntos: rewardData.pointsCost,
            tipoDescuento: rewardData.discountType,
            valorDescuento: rewardData.discountValue,
            diasValidez: rewardData.validityDays,
            categoria: rewardData.category,
            activo: true,
            usosMaximos: rewardData.maxUses,
            serviciosAplicables: rewardData.applicableServices || [],
            icono: rewardData.icon,
            imagen: rewardData.image
          };

          const createdRecompensa = await recompensasApi.create(recompensaData);

          // Mapear de vuelta
          const newReward = {
            id: createdRecompensa.id,
            name: createdRecompensa.nombre,
            description: createdRecompensa.descripcion,
            pointsCost: createdRecompensa.costoEnPuntos,
            discountType: createdRecompensa.tipoDescuento,
            discountValue: createdRecompensa.valorDescuento,
            validityDays: createdRecompensa.diasValidez,
            category: createdRecompensa.categoria,
            isActive: createdRecompensa.activo,
            maxUses: createdRecompensa.usosMaximos,
            applicableServices: createdRecompensa.serviciosAplicables,
            icon: createdRecompensa.icono,
            image: createdRecompensa.imagen
          };

          set(state => ({
            rewards: [...state.rewards, newReward],
            isLoading: false
          }));

          return { success: true, reward: newReward };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * ACTUALIZAR RECOMPENSA - PATCH a API
       */
      updateReward: async (rewardId, updates) => {
        set({ isLoading: true, error: null });
        try {
          // Mapear updates a estructura backend
          const recompensaUpdates = {};
          if (updates.name) recompensaUpdates.nombre = updates.name;
          if (updates.description) recompensaUpdates.descripcion = updates.description;
          if (updates.pointsCost !== undefined) recompensaUpdates.costoEnPuntos = updates.pointsCost;
          if (updates.discountType) recompensaUpdates.tipoDescuento = updates.discountType;
          if (updates.discountValue !== undefined) recompensaUpdates.valorDescuento = updates.discountValue;
          if (updates.validityDays !== undefined) recompensaUpdates.diasValidez = updates.validityDays;
          if (updates.category) recompensaUpdates.categoria = updates.category;
          if (updates.isActive !== undefined) recompensaUpdates.activo = updates.isActive;
          if (updates.maxUses !== undefined) recompensaUpdates.usosMaximos = updates.maxUses;
          if (updates.applicableServices) recompensaUpdates.serviciosAplicables = updates.applicableServices;
          if (updates.icon) recompensaUpdates.icono = updates.icon;
          if (updates.image) recompensaUpdates.imagen = updates.image;

          const updatedRecompensa = await recompensasApi.patch(rewardId, recompensaUpdates);

          // Mapear de vuelta
          const updatedReward = {
            id: updatedRecompensa.id,
            name: updatedRecompensa.nombre,
            description: updatedRecompensa.descripcion,
            pointsCost: updatedRecompensa.costoEnPuntos,
            discountType: updatedRecompensa.tipoDescuento,
            discountValue: updatedRecompensa.valorDescuento,
            validityDays: updatedRecompensa.diasValidez,
            category: updatedRecompensa.categoria,
            isActive: updatedRecompensa.activo,
            maxUses: updatedRecompensa.usosMaximos,
            applicableServices: updatedRecompensa.serviciosAplicables,
            icon: updatedRecompensa.icono,
            image: updatedRecompensa.imagen
          };

          set(state => ({
            rewards: state.rewards.map(reward =>
              reward.id === rewardId ? updatedReward : reward
            ),
            isLoading: false
          }));

          return { success: true, reward: updatedReward };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * ELIMINAR RECOMPENSA (soft delete) - PATCH a API
       */
      deleteReward: async (rewardId) => {
        return await get().updateReward(rewardId, { isActive: false });
      },

      /**
       * AGREGAR PUNTOS POR SERVICIO - POST transacción de puntos
       */
      addPointsForService: async (clientId, servicePrice, branchId, reference = null, referenceId = null) => {
        const { settings } = get();

        if (!settings.enabled) return;

        const pointsEarned = Math.floor(servicePrice * settings.pointsPerSol);

        try {
          // Crear transacción en API
          const transaccionData = {
            clienteId: clientId,
            tipo: 'earned',
            puntos: pointsEarned,
            descripcion: `Puntos por servicio - S/${servicePrice}`,
            referencia: reference || 'service',
            referenciaId: referenceId || null,
            fecha: new Date().toISOString(),
            sucursalId: branchId,
            recompensaId: null
          };

          const createdTransaccion = await transaccionesPuntosApi.create(transaccionData);

          // Mapear de vuelta
          const newTransaction = {
            id: createdTransaccion.id,
            clientId: createdTransaccion.clienteId,
            type: createdTransaccion.tipo,
            points: createdTransaccion.puntos,
            description: createdTransaccion.descripcion,
            reference: createdTransaccion.referencia,
            referenceId: createdTransaccion.referenciaId,
            date: createdTransaccion.fecha,
            branchId: createdTransaccion.sucursalId,
            rewardId: createdTransaccion.recompensaId
          };

          set(state => ({
            pointsTransactions: [...state.pointsTransactions, newTransaction]
          }));

          return pointsEarned;
        } catch (error) {
          console.error('Error agregando puntos:', error);
          return 0;
        }
      },

      /**
       * CANJEAR RECOMPENSA - POST recompensa de cliente + transacción de puntos
       */
      redeemReward: async (clientId, rewardId, branchId) => {
        const { rewards, canRedeemReward } = get();

        if (!canRedeemReward(clientId, rewardId)) {
          throw new Error('No tienes suficientes puntos para esta recompensa');
        }

        try {
          const reward = rewards.find(r => r.id === rewardId);
          const redemptionDate = new Date();
          const expiryDate = new Date(redemptionDate.getTime() + (reward.validityDays * 24 * 60 * 60 * 1000));

          // Generar código único
          const discountCode = `${reward.name.replace(/\s+/g, '').toUpperCase()}-${clientId}-${Date.now().toString().slice(-3)}`;

          // Crear registro de recompensa del cliente en API
          const recompensaClienteData = {
            clienteId: clientId,
            recompensaId: rewardId,
            fechaCanje: redemptionDate.toISOString(),
            fechaExpiracion: expiryDate.toISOString(),
            estado: 'active',
            fechaUso: null,
            sucursalId: branchId,
            codigoDescuento: discountCode
          };

          const createdRecompensaCliente = await recompensasClienteApi.create(recompensaClienteData);

          // Mapear
          const newClientReward = {
            id: createdRecompensaCliente.id,
            clientId: createdRecompensaCliente.clienteId,
            rewardId: createdRecompensaCliente.recompensaId,
            redeemDate: createdRecompensaCliente.fechaCanje,
            expiryDate: createdRecompensaCliente.fechaExpiracion,
            status: createdRecompensaCliente.estado,
            usedDate: createdRecompensaCliente.fechaUso,
            branchId: createdRecompensaCliente.sucursalId,
            discountCode: createdRecompensaCliente.codigoDescuento
          };

          // Crear transacción de puntos negativos en API
          const transaccionData = {
            clienteId: clientId,
            tipo: 'redeemed',
            puntos: -reward.pointsCost,
            descripcion: `Canje: ${reward.name}`,
            referencia: 'reward_redemption',
            referenciaId: rewardId,
            fecha: redemptionDate.toISOString(),
            sucursalId: branchId,
            recompensaId: rewardId
          };

          const createdTransaccion = await transaccionesPuntosApi.create(transaccionData);

          // Mapear transacción
          const pointsTransaction = {
            id: createdTransaccion.id,
            clientId: createdTransaccion.clienteId,
            type: createdTransaccion.tipo,
            points: createdTransaccion.puntos,
            description: createdTransaccion.descripcion,
            reference: createdTransaccion.referencia,
            referenceId: createdTransaccion.referenciaId,
            date: createdTransaccion.fecha,
            branchId: createdTransaccion.sucursalId,
            rewardId: createdTransaccion.recompensaId
          };

          // Actualizar estado local
          set(state => ({
            clientRewards: [...state.clientRewards, newClientReward],
            pointsTransactions: [...state.pointsTransactions, pointsTransaction]
          }));

          return newClientReward;
        } catch (error) {
          console.error('Error canjeando recompensa:', error);
          throw error;
        }
      },

      /**
       * USAR RECOMPENSA - PATCH recompensa de cliente
       */
      useReward: async (clientRewardId) => {
        try {
          const updatedRecompensaCliente = await recompensasClienteApi.patch(clientRewardId, {
            estado: 'used',
            fechaUso: new Date().toISOString()
          });

          set(state => ({
            clientRewards: state.clientRewards.map(cr =>
              cr.id === clientRewardId
                ? {
                    ...cr,
                    status: updatedRecompensaCliente.estado,
                    usedDate: updatedRecompensaCliente.fechaUso
                  }
                : cr
            )
          }));

          return { success: true };
        } catch (error) {
          console.error('Error usando recompensa:', error);
          return { success: false, error: error.message };
        }
      },

      /**
       * AGREGAR BONO DE BIENVENIDA - POST transacción de puntos
       */
      addWelcomeBonus: async (clientId, branchId) => {
        const { settings } = get();

        if (!settings.enabled || settings.welcomeBonusPoints <= 0) return;

        try {
          const transaccionData = {
            clienteId: clientId,
            tipo: 'earned',
            puntos: settings.welcomeBonusPoints,
            descripcion: 'Bono de bienvenida',
            referencia: 'welcome_bonus',
            referenciaId: null,
            fecha: new Date().toISOString(),
            sucursalId: branchId,
            recompensaId: null
          };

          const createdTransaccion = await transaccionesPuntosApi.create(transaccionData);

          const newTransaction = {
            id: createdTransaccion.id,
            clientId: createdTransaccion.clienteId,
            type: createdTransaccion.tipo,
            points: createdTransaccion.puntos,
            description: createdTransaccion.descripcion,
            reference: createdTransaccion.referencia,
            referenceId: createdTransaccion.referenciaId,
            date: createdTransaccion.fecha,
            branchId: createdTransaccion.sucursalId,
            rewardId: createdTransaccion.recompensaId
          };

          set(state => ({
            pointsTransactions: [...state.pointsTransactions, newTransaction]
          }));

          return settings.welcomeBonusPoints;
        } catch (error) {
          console.error('Error agregando bono de bienvenida:', error);
          return 0;
        }
      },

      /**
       * MÉTODOS DE CONSULTA LOCAL (No requieren API)
       */
      getAvailableRewards: () => {
        const { rewards } = get();
        return rewards.filter(reward => reward.isActive);
      },

      getRewardsByCategory: (category) => {
        const { rewards } = get();
        return rewards.filter(reward => reward.category === category && reward.isActive);
      },

      getClientPoints: (clientId) => {
        const { pointsTransactions } = get();
        return pointsTransactions
          .filter(transaction => transaction.clientId === clientId)
          .reduce((total, transaction) => total + transaction.points, 0);
      },

      getClientTransactions: (clientId) => {
        const { pointsTransactions } = get();
        return pointsTransactions
          .filter(transaction => transaction.clientId === clientId)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
      },

      getClientActiveRewards: (clientId) => {
        const { clientRewards, rewards } = get();
        const now = new Date();

        return clientRewards
          .filter(cr =>
            cr.clientId === clientId &&
            cr.status === 'active' &&
            new Date(cr.expiryDate) > now
          )
          .map(cr => ({
            ...cr,
            reward: rewards.find(r => r.id === cr.rewardId)
          }));
      },

      canRedeemReward: (clientId, rewardId) => {
        const { rewards, getClientPoints } = get();
        const reward = rewards.find(r => r.id === rewardId);
        const clientPoints = getClientPoints(clientId);

        return reward &&
               reward.isActive &&
               clientPoints >= reward.pointsCost;
      },

      getClientLevel: (clientId) => {
        const { loyaltyLevels, getClientPoints } = get();
        const clientPoints = getClientPoints(clientId);

        // Encontrar el nivel apropiado basado en puntos
        const level = loyaltyLevels
          .sort((a, b) => a.minPoints - b.minPoints)
          .reverse()
          .find(level => clientPoints >= level.minPoints);

        return level || loyaltyLevels[0];
      },

      getPointsStats: () => {
        const { pointsTransactions } = get();

        const totalEarned = pointsTransactions
          .filter(t => t.type === 'earned')
          .reduce((sum, t) => sum + t.points, 0);

        const totalRedeemed = pointsTransactions
          .filter(t => t.type === 'redeemed')
          .reduce((sum, t) => sum + Math.abs(t.points), 0);

        return {
          totalEarned,
          totalRedeemed,
          totalActive: totalEarned - totalRedeemed
        };
      },

      getTopClientsByPoints: (limit = 10) => {
        const { pointsTransactions } = get();

        const clientPointsMap = {};

        pointsTransactions.forEach(transaction => {
          if (!clientPointsMap[transaction.clientId]) {
            clientPointsMap[transaction.clientId] = 0;
          }
          clientPointsMap[transaction.clientId] += transaction.points;
        });

        return Object.entries(clientPointsMap)
          .map(([clientId, points]) => ({ clientId: parseInt(clientId), points }))
          .sort((a, b) => b.points - a.points)
          .slice(0, limit);
      },

      getClientsByLevel: () => {
        const { loyaltyLevels, pointsTransactions } = get();

        // Agrupar transacciones por cliente
        const clientPointsMap = {};
        pointsTransactions.forEach(transaction => {
          if (!clientPointsMap[transaction.clientId]) {
            clientPointsMap[transaction.clientId] = 0;
          }
          clientPointsMap[transaction.clientId] += transaction.points;
        });

        // Agrupar clientes por nivel
        const clientsByLevel = {};
        loyaltyLevels.forEach(level => {
          clientsByLevel[level.id] = [];
        });

        Object.entries(clientPointsMap).forEach(([clientId, points]) => {
          const level = loyaltyLevels
            .sort((a, b) => a.minPoints - b.minPoints)
            .reverse()
            .find(level => points >= level.minPoints);

          if (level) {
            clientsByLevel[level.id].push({
              clientId: parseInt(clientId),
              points
            });
          }
        });

        return clientsByLevel;
      },

      /**
       * CARGAR NIVELES DE LEALTAD - Fetch desde API
       */
      loadLoyaltyLevels: async () => {
        set({ isLoading: true, error: null });
        try {
          const nivelesData = await nivelesLealtadApi.getAll();

          // Mapear estructura backend (español) a frontend (inglés)
          const loyaltyLevels = nivelesData.map(nivel => ({
            id: nivel.id,
            name: nivel.nombre,
            color: nivel.color,
            image: nivel.image || null,
            minPoints: nivel.minPoints,
            maxPoints: nivel.maxPoints,
            benefits: {
              pointsMultiplier: nivel.beneficios.pointsMultiplier,
              discountPercentage: nivel.beneficios.discountPercentage,
              freeServicesPerMonth: nivel.beneficios.freeServicesPerMonth,
              priorityBooking: nivel.beneficios.priorityBooking,
              birthdayBonus: nivel.beneficios.birthdayBonus
            }
          }));

          set({ loyaltyLevels, isLoading: false });
          return { success: true };
        } catch (error) {
          console.error('Error cargando niveles de lealtad:', error);
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * CARGAR CONFIGURACIÓN DE PUNTOS - Fetch desde API
       */
      loadLoyaltySettings: async () => {
        set({ isLoading: true, error: null });
        try {
          const settingsData = await puntosSettingsApi.get();

          // Mapear estructura (ya viene en formato correcto)
          const settings = {
            pointsPerSol: settingsData.puntosPerSol,
            enabled: settingsData.enabled,
            minimumPointsToRedeem: settingsData.minimumPointsToRedeem,
            pointsExpiryDays: settingsData.pointsExpiryDays,
            welcomeBonusPoints: settingsData.welcomeBonusPoints,
            birthdayBonusPoints: settingsData.birthdayBonusPoints,
            referralBonusPoints: settingsData.referralBonusPoints
          };

          set({ settings, isLoading: false });
          return { success: true };
        } catch (error) {
          console.error('Error cargando configuración de puntos:', error);
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * GESTIÓN DE NIVELES DE LEALTAD (solo local - API no soporta PATCH en subarrays)
       * NOTA: Para actualizar en backend, necesitaríamos endpoint personalizado
       */
      updateLoyaltyLevel: (levelId, levelData) => {
        set(state => ({
          loyaltyLevels: state.loyaltyLevels.map(level =>
            level.id === levelId ? { ...level, ...levelData } : level
          )
        }));
      },

      addLoyaltyLevel: (levelData) => {
        const { loyaltyLevels } = get();
        const newLevel = {
          id: Date.now(),
          ...levelData
        };

        set(state => ({
          loyaltyLevels: [...state.loyaltyLevels, newLevel].sort((a, b) => a.minPoints - b.minPoints)
        }));

        return newLevel;
      },

      deleteLoyaltyLevel: (levelId) => {
        set(state => ({
          loyaltyLevels: state.loyaltyLevels.filter(level => level.id !== levelId)
        }));
      },

      /**
       * ACTUALIZAR CONFIGURACIONES (solo local - API no soporta PATCH en subobjetos)
       * NOTA: Para actualizar en backend, necesitaríamos endpoint personalizado
       */
      updateSettings: (newSettings) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings }
        }));
      },

      /**
       * LIMPIAR DATOS (para desarrollo)
       */
      clearData: () => {
        set({
          pointsTransactions: [],
          clientRewards: []
        });
      }
    }),
    {
      name: 'loyalty-store',
      partialize: (state) => ({
        // Persistir como cache
        rewards: state.rewards,
        pointsTransactions: state.pointsTransactions,
        clientRewards: state.clientRewards,
        loyaltyLevels: state.loyaltyLevels,
        settings: state.settings
      })
    }
  )
);

export default useLoyaltyStore;
