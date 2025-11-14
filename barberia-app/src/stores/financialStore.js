/**
 * FINANCIAL STORE - REFACTORIZADO CON JSON SERVER
 *
 * Cambios:
 * ✅ Migrado a API real (transaccionesApi)
 * ✅ Eliminado hardcode/mocks
 * ✅ CRUD completo para transacciones
 * ✅ Lógica de negocio (métricas, cálculos) mantenida localmente
 * ✅ Persist middleware agregado
 * ✅ Integración con loyaltyStore mantenida
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { transaccionesApi, metodosPagoApi, categoriasIngresosApi, categoriasGastosApi } from '../services/api';
import useLoyaltyStore from './loyaltyStore.js';

const useFinancialStore = create(
  persist(
    (set, get) => ({
      transactions: [],
      metrics: {
        totalIncome: 0,
        totalExpenses: 0,
        netProfit: 0,
        dailyIncome: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        monthlyProfit: 0
      },
      isLoading: false,
      error: null,
      selectedPeriod: 'month',
      // REFACTORED: Datos cargados desde JSON
      paymentMethods: [],
      categories: {},

      setTransactions: (transactions) => set({ transactions }),
      setSelectedPeriod: (period) => set({ selectedPeriod: period }),

      /**
       * CARGAR TRANSACCIONES - Fetch desde API
       */
      loadTransactions: async () => {
        set({ isLoading: true, error: null });
        try {
          const transaccionesData = await transaccionesApi.getAll();

          // Mapear estructura backend (español) a frontend (inglés)
          const transactions = transaccionesData.map(t => ({
            id: t.id,
            type: t.tipo,
            category: t.categoria,
            amount: t.monto,
            paymentMethod: t.metodoPago,
            description: t.descripcion,
            branchId: t.sucursalId,
            clientId: t.clienteId,
            barberId: t.barberoId,
            appointmentId: t.citaId,
            date: t.fecha,
            createdAt: t.createdAt,
            updatedAt: t.updatedAt
          }));

          set({ transactions, isLoading: false });
          get().calculateMetrics();
          return { success: true };
        } catch (error) {
          console.error('Error cargando transacciones:', error);
          set({ transactions: [], isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * CARGAR MÉTODOS DE PAGO - Fetch desde API
       */
      loadPaymentMethods: async () => {
        try {
          const metodosData = await metodosPagoApi.getAll();

          // Mapear estructura backend a frontend
          const paymentMethods = metodosData.map(m => ({
            id: m.id,
            name: m.nombre,
            active: m.activo,
            icon: m.icono,
            description: m.descripcion
          }));

          set({ paymentMethods });
          return { success: true };
        } catch (error) {
          console.error('Error cargando métodos de pago:', error);
          return { success: false, error: error.message };
        }
      },

      /**
       * CARGAR CATEGORÍAS - Fetch desde API
       */
      loadCategories: async () => {
        try {
          const [categoriasIngresosData, categoriasGastosData] = await Promise.all([
            categoriasIngresosApi.getAll(),
            categoriasGastosApi.getAll()
          ]);

          // Mapear estructura backend a frontend
          const categories = {
            income: categoriasIngresosData.map(c => ({
              id: c.id,
              name: c.nombre,
              icon: c.icono,
              color: c.color,
              description: c.descripcion
            })),
            expense: categoriasGastosData.map(c => ({
              id: c.id,
              name: c.nombre,
              icon: c.icono,
              color: c.color,
              description: c.descripcion
            }))
          };

          set({ categories });
          return { success: true };
        } catch (error) {
          console.error('Error cargando categorías:', error);
          return { success: false, error: error.message };
        }
      },

      /**
       * AGREGAR TRANSACCIÓN - POST a API
       */
      addTransaction: async (transactionData) => {
        set({ isLoading: true, error: null });
        try {
          // Mapear a estructura backend
          const transaccionData = {
            tipo: transactionData.type,
            categoria: transactionData.category,
            monto: transactionData.amount,
            metodoPago: transactionData.paymentMethod,
            descripcion: transactionData.description,
            sucursalId: transactionData.branchId,
            clienteId: transactionData.clientId || null,
            barberoId: transactionData.barberId || null,
            citaId: transactionData.appointmentId || null,
            fecha: transactionData.date || new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          const createdTransaccion = await transaccionesApi.create(transaccionData);

          // Mapear de vuelta
          const newTransaction = {
            id: createdTransaccion.id,
            type: createdTransaccion.tipo,
            category: createdTransaccion.categoria,
            amount: createdTransaccion.monto,
            paymentMethod: createdTransaccion.metodoPago,
            description: createdTransaccion.descripcion,
            branchId: createdTransaccion.sucursalId,
            clientId: createdTransaccion.clienteId,
            barberId: createdTransaccion.barberoId,
            appointmentId: createdTransaccion.citaId,
            date: createdTransaccion.fecha,
            createdAt: createdTransaccion.createdAt,
            updatedAt: createdTransaccion.updatedAt
          };

          set(state => ({
            transactions: [newTransaction, ...state.transactions],
            isLoading: false
          }));

          // Agregar puntos automáticamente si es un ingreso por servicios y hay clientId
          if (newTransaction.type === 'income' &&
              newTransaction.category === 'services' &&
              newTransaction.clientId) {
            try {
              const loyaltyStore = useLoyaltyStore.getState();
              loyaltyStore.addPointsForService(
                newTransaction.clientId,
                newTransaction.amount,
                newTransaction.branchId,
                'service_payment',
                newTransaction.id
              );
            } catch (loyaltyError) {
              console.warn('Error al agregar puntos de lealtad:', loyaltyError);
            }
          }

          get().calculateMetrics();
          return { success: true, transaction: newTransaction };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * ACTUALIZAR TRANSACCIÓN - PATCH a API
       */
      updateTransaction: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          // Mapear updates a estructura backend
          const transaccionUpdates = {};
          if (updates.type) transaccionUpdates.tipo = updates.type;
          if (updates.category) transaccionUpdates.categoria = updates.category;
          if (updates.amount !== undefined) transaccionUpdates.monto = updates.amount;
          if (updates.paymentMethod) transaccionUpdates.metodoPago = updates.paymentMethod;
          if (updates.description) transaccionUpdates.descripcion = updates.description;
          if (updates.branchId !== undefined) transaccionUpdates.sucursalId = updates.branchId;
          if (updates.clientId !== undefined) transaccionUpdates.clienteId = updates.clientId;
          if (updates.barberId !== undefined) transaccionUpdates.barberoId = updates.barberId;
          if (updates.appointmentId !== undefined) transaccionUpdates.citaId = updates.appointmentId;
          if (updates.date) transaccionUpdates.fecha = updates.date;

          transaccionUpdates.updatedAt = new Date().toISOString();

          const updatedTransaccion = await transaccionesApi.patch(id, transaccionUpdates);

          // Mapear de vuelta
          const updatedTransaction = {
            id: updatedTransaccion.id,
            type: updatedTransaccion.tipo,
            category: updatedTransaccion.categoria,
            amount: updatedTransaccion.monto,
            paymentMethod: updatedTransaccion.metodoPago,
            description: updatedTransaccion.descripcion,
            branchId: updatedTransaccion.sucursalId,
            clientId: updatedTransaccion.clienteId,
            barberId: updatedTransaccion.barberoId,
            appointmentId: updatedTransaccion.citaId,
            date: updatedTransaccion.fecha,
            createdAt: updatedTransaccion.createdAt,
            updatedAt: updatedTransaccion.updatedAt
          };

          set(state => ({
            transactions: state.transactions.map(trans =>
              trans.id === id ? updatedTransaction : trans
            ),
            isLoading: false
          }));

          get().calculateMetrics();
          return { success: true, transaction: updatedTransaction };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * ELIMINAR TRANSACCIÓN - DELETE a API
       */
      deleteTransaction: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await transaccionesApi.delete(id);

          set(state => ({
            transactions: state.transactions.filter(trans => trans.id !== id),
            isLoading: false
          }));

          get().calculateMetrics();
          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      /**
       * CALCULAR MÉTRICAS - Lógica local
       */
      calculateMetrics: () => {
        const { transactions } = get();
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        const income = transactions.filter(t => t.type === 'income');
        const expenses = transactions.filter(t => t.type === 'expense');

        const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

        const dailyIncome = income
          .filter(t => {
            const transDate = new Date(t.date);
            return transDate.toDateString() === today.toDateString();
          })
          .reduce((sum, t) => sum + t.amount, 0);

        const monthlyIncome = income
          .filter(t => {
            const transDate = new Date(t.date);
            return transDate.getMonth() === currentMonth &&
                   transDate.getFullYear() === currentYear;
          })
          .reduce((sum, t) => sum + t.amount, 0);

        const monthlyExpenses = expenses
          .filter(t => {
            const transDate = new Date(t.date);
            return transDate.getMonth() === currentMonth &&
                   transDate.getFullYear() === currentYear;
          })
          .reduce((sum, t) => sum + t.amount, 0);

        set({
          metrics: {
            totalIncome,
            totalExpenses,
            netProfit: totalIncome - totalExpenses,
            dailyIncome,
            monthlyIncome,
            monthlyExpenses,
            monthlyProfit: monthlyIncome - monthlyExpenses
          }
        });
      },

      /**
       * MÉTODOS DE CONSULTA LOCAL (No requieren API)
       */
      getTransactionsByPeriod: (startDate, endDate) => {
        const { transactions } = get();
        const start = new Date(startDate);
        const end = new Date(endDate);

        return transactions.filter(t => {
          const transDate = new Date(t.date);
          return transDate >= start && transDate <= end;
        });
      },

      getTransactionsByBranch: (branchId) => {
        const { transactions } = get();
        return transactions.filter(t => t.branchId === branchId);
      },

      getTransactionsByCategory: (category) => {
        const { transactions } = get();
        return transactions.filter(t => t.category === category);
      },

      getChartData: (period = 'month') => {
        const { transactions } = get();
        const now = new Date();
        let days = 30;

        if (period === 'week') days = 7;
        if (period === 'year') days = 365;

        const chartData = [];

        for (let i = days - 1; i >= 0; i--) {
          const date = new Date();
          date.setDate(now.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];

          const dayTransactions = transactions.filter(t => t.date === dateStr);
          const income = dayTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
          const expenses = dayTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

          chartData.push({
            date: dateStr,
            income,
            expenses,
            profit: income - expenses
          });
        }

        return chartData;
      },

      /**
       * CARGAR DATOS MAESTROS (categorías, métodos de pago) - DESDE JSON SERVER
       */
      loadMockData: async () => {
        set({ isLoading: true, error: null });
        try {
          // ✅ Cargar desde JSON Server API en paralelo
          const [metodosPagoData, categoriasIngresosData, categoriasGastosData] = await Promise.all([
            metodosPagoApi.getAll(),
            categoriasIngresosApi.getAll(),
            categoriasGastosApi.getAll()
          ]);

          // Mapear métodos de pago (español → inglés)
          const paymentMethods = metodosPagoData.map(metodo => ({
            id: metodo.id,
            name: metodo.nombre,
            active: metodo.activo,
            icon: metodo.icono,
            description: metodo.descripcion
          }));

          // Mapear categorías de ingresos (español → inglés)
          const incomeCategories = categoriasIngresosData.map(cat => ({
            id: cat.id,
            name: cat.nombre,
            icon: cat.icono,
            color: cat.color,
            description: cat.descripcion
          }));

          // Mapear categorías de gastos (español → inglés)
          const expenseCategories = categoriasGastosData.map(cat => ({
            id: cat.id,
            name: cat.nombre,
            icon: cat.icono,
            color: cat.color,
            description: cat.descripcion
          }));

          set({
            paymentMethods,
            categories: {
              income: incomeCategories,
              expense: expenseCategories
            },
            isLoading: false
          });

          return { success: true };
        } catch (error) {
          console.error('Error cargando datos financieros desde API:', error);
          set({
            paymentMethods: [],
            categories: { income: [], expense: [] },
            isLoading: false,
            error: error.message
          });
          return { success: false, error: error.message };
        }
      },

      /**
       * RESUMEN FINANCIERO - Lógica local
       */
      getFinancialSummary: () => {
        const { metrics, transactions } = get();
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        const thisMonthTransactions = transactions.filter(t => {
          const transDate = new Date(t.date);
          return transDate.getMonth() === currentMonth &&
                 transDate.getFullYear() === currentYear;
        });

        const lastMonthTransactions = transactions.filter(t => {
          const transDate = new Date(t.date);
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
          return transDate.getMonth() === lastMonth &&
                 transDate.getFullYear() === lastMonthYear;
        });

        const thisMonthIncome = thisMonthTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);

        const lastMonthIncome = lastMonthTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);

        const incomeGrowth = lastMonthIncome > 0
          ? Math.round(((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100)
          : 0;

        // Valores por defecto para asegurar que todas las propiedades existan
        const defaultMetrics = {
          totalIncome: 0,
          totalExpenses: 0,
          netProfit: 0,
          dailyIncome: 0,
          monthlyIncome: 0,
          monthlyExpenses: 0,
          monthlyProfit: 0
        };

        return {
          ...defaultMetrics,
          ...metrics,
          incomeGrowth,
          transactionCount: transactions.length,
          averageTransactionValue: transactions.length > 0
            ? (metrics?.totalIncome || 0) / transactions.filter(t => t.type === 'income').length
            : 0
        };
      }
    }),
    {
      name: 'financial-storage',
      partialize: (state) => ({
        // Solo persistir como cache
        transactions: state.transactions,
        paymentMethods: state.paymentMethods,
        categories: state.categories,
        selectedPeriod: state.selectedPeriod
      })
    }
  )
);

export default useFinancialStore;
