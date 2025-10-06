import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import mockData from '../data/data.json';

const useLoyaltyStore = create(
  persist(
    (set, get) => ({
      // Estado inicial
      rewards: mockData.loyaltyRewards || [],
      pointsTransactions: mockData.pointsTransactions || [],
      clientRewards: mockData.clientRewards || [],
      loyaltyLevels: mockData.loyaltyLevels || [
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
      settings: mockData.pointsSettings || {
        pointsPerSol: 1,
        enabled: true,
        minimumPointsToRedeem: 50,
        pointsExpiryDays: 365,
        welcomeBonusPoints: 50,
        birthdayBonusPoints: 100,
        referralBonusPoints: 150
      },

      // Obtener recompensas disponibles
      getAvailableRewards: () => {
        const { rewards } = get();
        return rewards.filter(reward => reward.isActive);
      },

      // Obtener recompensas por categoría
      getRewardsByCategory: (category) => {
        const { rewards } = get();
        return rewards.filter(reward => reward.category === category && reward.isActive);
      },

      // Obtener puntos de un cliente
      getClientPoints: (clientId) => {
        const { pointsTransactions } = get();
        return pointsTransactions
          .filter(transaction => transaction.clientId === clientId)
          .reduce((total, transaction) => total + transaction.points, 0);
      },

      // Obtener historial de transacciones de un cliente
      getClientTransactions: (clientId) => {
        const { pointsTransactions } = get();
        return pointsTransactions
          .filter(transaction => transaction.clientId === clientId)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
      },

      // Obtener recompensas activas de un cliente
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

      // Verificar si un cliente puede canjear una recompensa
      canRedeemReward: (clientId, rewardId) => {
        const { rewards, getClientPoints } = get();
        const reward = rewards.find(r => r.id === rewardId);
        const clientPoints = getClientPoints(clientId);

        return reward &&
               reward.isActive &&
               clientPoints >= reward.pointsCost;
      },

      // Agregar puntos por servicio
      addPointsForService: (clientId, servicePrice, branchId, reference = null, referenceId = null) => {
        const { settings, pointsTransactions } = get();

        if (!settings.enabled) return;

        const pointsEarned = Math.floor(servicePrice * settings.pointsPerSol);

        const newTransaction = {
          id: Date.now(),
          clientId,
          type: 'earned',
          points: pointsEarned,
          description: `Puntos por servicio - S/${servicePrice}`,
          reference: reference || 'service',
          referenceId: referenceId || null,
          date: new Date().toISOString(),
          branchId
        };

        set(state => ({
          pointsTransactions: [...state.pointsTransactions, newTransaction]
        }));

        return pointsEarned;
      },

      // Canjear recompensa
      redeemReward: async (clientId, rewardId, branchId) => {
        const { rewards, clientRewards, pointsTransactions, canRedeemReward } = get();

        if (!canRedeemReward(clientId, rewardId)) {
          throw new Error('No tienes suficientes puntos para esta recompensa');
        }

        const reward = rewards.find(r => r.id === rewardId);
        const redemptionDate = new Date();
        const expiryDate = new Date(redemptionDate.getTime() + (reward.validityDays * 24 * 60 * 60 * 1000));

        // Generar código único
        const discountCode = `${reward.name.replace(/\s+/g, '').toUpperCase()}-${clientId}-${Date.now().toString().slice(-3)}`;

        // Crear registro de recompensa del cliente
        const newClientReward = {
          id: Date.now(),
          clientId,
          rewardId,
          redeemDate: redemptionDate.toISOString(),
          expiryDate: expiryDate.toISOString(),
          status: 'active',
          usedDate: null,
          branchId,
          discountCode
        };

        // Crear transacción de puntos negativos
        const pointsTransaction = {
          id: Date.now() + 1,
          clientId,
          type: 'redeemed',
          points: -reward.pointsCost,
          description: `Canje: ${reward.name}`,
          reference: 'reward_redemption',
          referenceId: rewardId,
          date: redemptionDate.toISOString(),
          branchId,
          rewardId
        };

        set(state => ({
          clientRewards: [...state.clientRewards, newClientReward],
          pointsTransactions: [...state.pointsTransactions, pointsTransaction]
        }));

        return newClientReward;
      },

      // Usar recompensa
      useReward: (clientRewardId) => {
        set(state => ({
          clientRewards: state.clientRewards.map(cr =>
            cr.id === clientRewardId
              ? { ...cr, status: 'used', usedDate: new Date().toISOString() }
              : cr
          )
        }));
      },

      // Agregar recompensa (admin)
      addReward: (rewardData) => {
        const newReward = {
          id: Date.now(),
          ...rewardData,
          isActive: true
        };

        set(state => ({
          rewards: [...state.rewards, newReward]
        }));

        return newReward;
      },

      // Actualizar recompensa (admin)
      updateReward: (rewardId, updates) => {
        set(state => ({
          rewards: state.rewards.map(reward =>
            reward.id === rewardId ? { ...reward, ...updates } : reward
          )
        }));
      },

      // Eliminar recompensa (admin)
      deleteReward: (rewardId) => {
        set(state => ({
          rewards: state.rewards.map(reward =>
            reward.id === rewardId ? { ...reward, isActive: false } : reward
          )
        }));
      },

      // Actualizar configuraciones
      updateSettings: (newSettings) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings }
        }));
      },

      // Obtener estadísticas de puntos
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

      // Obtener top clientes por puntos
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

      // Agregar puntos de bienvenida
      addWelcomeBonus: (clientId, branchId) => {
        const { settings, pointsTransactions } = get();

        if (!settings.enabled || settings.welcomeBonusPoints <= 0) return;

        const newTransaction = {
          id: Date.now(),
          clientId,
          type: 'earned',
          points: settings.welcomeBonusPoints,
          description: 'Bono de bienvenida',
          reference: 'welcome_bonus',
          referenceId: null,
          date: new Date().toISOString(),
          branchId
        };

        set(state => ({
          pointsTransactions: [...state.pointsTransactions, newTransaction]
        }));

        return settings.welcomeBonusPoints;
      },

      // Limpiar datos (para desarrollo)
      clearData: () => {
        set({
          pointsTransactions: [],
          clientRewards: []
        });
      },

      // Funciones para gestión de niveles
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

      // Obtener clientes por nivel
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

      // Inicializar datos mock si están vacíos
      initializeMockData: () => {
        const { pointsTransactions, clientRewards } = get();

        if (pointsTransactions.length === 0 && clientRewards.length === 0) {
          set({
            pointsTransactions: mockData.pointsTransactions || [],
            clientRewards: mockData.clientRewards || []
          });
        }
      }
    }),
    {
      name: 'loyalty-store',
      partialize: (state) => ({
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