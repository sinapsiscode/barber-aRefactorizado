import { useState, useEffect, useMemo } from 'react';
import { useFinancialStore, useAuthStore, useBranchStore } from '../stores';
import {
  filterTransactionsByBranch,
  calculateFinancialSummary,
  getCurrentBranch,
  calculatePaymentMethodStats,
  calculateCategoryStats
} from '../utils/financialHelpers';
import { FINANCIAL_TABLE_CONFIG } from '../constants/financial';

export const useFinancial = () => {
  const [showForm, setShowForm] = useState(false);
  const [showCharts, setShowCharts] = useState(false);

  const {
    transactions,
    loadMockTransactions,
    getTransactionsByBranch,
    paymentMethods,
    categories
  } = useFinancialStore();

  const { user } = useAuthStore();
  const { branches, selectedBranch, loadMockBranches } = useBranchStore();

  // Efectos de carga inicial
  useEffect(() => {
    if (transactions.length === 0) {
      loadMockTransactions();
    }
  }, [transactions.length, loadMockTransactions]);

  useEffect(() => {
    if (!branches || branches.length === 0) {
      loadMockBranches();
    }
  }, [branches, loadMockBranches]);

  // Datos computados
  const filteredTransactions = useMemo(() => {
    return filterTransactionsByBranch(
      transactions,
      user?.role,
      user?.branchId,
      selectedBranch,
      getTransactionsByBranch
    );
  }, [transactions, user?.role, user?.branchId, selectedBranch, getTransactionsByBranch]);

  const financialSummary = useMemo(() => {
    return calculateFinancialSummary(filteredTransactions);
  }, [filteredTransactions]);

  const currentBranch = useMemo(() => {
    return getCurrentBranch(user?.role, user?.branchId, branches, selectedBranch);
  }, [user?.role, user?.branchId, branches, selectedBranch]);

  const paymentMethodStats = useMemo(() => {
    return calculatePaymentMethodStats(
      filteredTransactions,
      paymentMethods,
      financialSummary.totalIncome
    );
  }, [filteredTransactions, paymentMethods, financialSummary.totalIncome]);

  const categoryStats = useMemo(() => {
    return calculateCategoryStats(
      filteredTransactions,
      categories,
      FINANCIAL_TABLE_CONFIG.MAX_EXPENSE_CATEGORIES
    );
  }, [filteredTransactions, categories]);

  // Handlers
  const handleShowForm = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);
  const handleToggleCharts = () => setShowCharts(!showCharts);

  return {
    // Estado
    showForm,
    showCharts,
    user,
    currentBranch,
    selectedBranch,

    // Datos
    transactions: filteredTransactions,
    financialSummary,
    paymentMethods,
    paymentMethodStats,
    categories,
    categoryStats,

    // Acciones
    handleShowForm,
    handleCloseForm,
    handleToggleCharts
  };
};