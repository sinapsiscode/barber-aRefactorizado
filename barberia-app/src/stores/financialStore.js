import { create } from 'zustand';
import { getDataSections } from '../utils/dataLoader.js';
import useLoyaltyStore from './loyaltyStore.js';

const useFinancialStore = create((set, get) => ({
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
  selectedPeriod: 'month',
  // REFACTORED: Datos cargados desde JSON
  paymentMethods: [],
  categories: {},

  setTransactions: (transactions) => set({ transactions }),

  setSelectedPeriod: (period) => set({ selectedPeriod: period }),

  addTransaction: async (transactionData) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const newTransaction = {
        id: Date.now(),
        ...transactionData,
        createdAt: new Date(),
        updatedAt: new Date()
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
      set({ isLoading: false });
      return { success: false, error: 'Error al registrar la transacción' };
    }
  },

  updateTransaction: async (id, updates) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        transactions: state.transactions.map(trans => 
          trans.id === id 
            ? { ...trans, ...updates, updatedAt: new Date() }
            : trans
        ),
        isLoading: false
      }));

      get().calculateMetrics();
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: 'Error al actualizar la transacción' };
    }
  },

  deleteTransaction: async (id) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        transactions: state.transactions.filter(trans => trans.id !== id),
        isLoading: false
      }));

      get().calculateMetrics();
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: 'Error al eliminar la transacción' };
    }
  },

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

  loadMockData: async () => {
    try {
      // REFACTORED: Cargar datos desde JSON
      const { paymentMethods, categories } = await getDataSections(['paymentMethods', 'categories']);
      
      set({ 
        paymentMethods: paymentMethods || [],
        categories: categories || { income: [], expense: [] }
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error cargando datos financieros:', error);
      set({ 
        paymentMethods: [],
        categories: { income: [], expense: [] }
      });
      return { success: false, error: error.message };
    }
  },

  loadMockTransactions: () => {
    const mockTransactions = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      // Generar transacciones para diferentes sedes
      const branches = [1, 2, 3, 4, 5];
      const selectedBranch = branches[Math.floor(Math.random() * branches.length)];
      
      const incomeTransactions = Math.floor(Math.random() * 5) + 1;
      for (let j = 0; j < incomeTransactions; j++) {
        mockTransactions.push({
          id: Date.now() + Math.random(),
          type: 'income',
          amount: Math.floor(Math.random() * 100) + 20,
          category: 'services',
          description: `Servicio de barbería ${j + 1}`,
          paymentMethod: ['cash', 'card', 'transfer'][Math.floor(Math.random() * 3)],
          date: date.toISOString().split('T')[0],
          branchId: selectedBranch,
          barberId: Math.floor(Math.random() * 3) + 1,
          clientId: Math.floor(Math.random() * 10) + 1,
          createdAt: date,
          updatedAt: date
        });
      }

      if (Math.random() > 0.7) {
        const expenseAmount = Math.floor(Math.random() * 200) + 50;
        mockTransactions.push({
          id: Date.now() + Math.random(),
          type: 'expense',
          amount: expenseAmount,
          category: ['rent', 'supplies', 'utilities'][Math.floor(Math.random() * 3)],
          description: 'Gasto operativo',
          paymentMethod: 'transfer',
          date: date.toISOString().split('T')[0],
          branchId: selectedBranch,
          createdAt: date,
          updatedAt: date
        });
      }
    }

    set({ transactions: mockTransactions });
    get().calculateMetrics();
  },

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
}));

export default useFinancialStore;