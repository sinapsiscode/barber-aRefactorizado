import {
  TRANSACTION_TYPES,
  FINANCIAL_FORMATTERS
} from '../constants/financial';

export const filterTransactionsByBranch = (transactions, userRole, userBranchId, selectedBranch, getTransactionsByBranch) => {
  // Para administradores de sede, solo mostrar su sede
  if (userRole === 'branch_admin' && userBranchId) {
    return getTransactionsByBranch(userBranchId);
  }

  // Para super admin, filtrar por sede seleccionada si hay una
  if (userRole === 'super_admin' && selectedBranch) {
    return getTransactionsByBranch(selectedBranch.id);
  }

  // Si no hay sede seleccionada o es "Todas las sedes", mostrar todas
  return transactions;
};

export const calculateFinancialSummary = (transactions) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const thisMonthTransactions = transactions.filter(t => {
    const transDate = new Date(t.date);
    return transDate.getMonth() === currentMonth &&
           transDate.getFullYear() === currentYear;
  });

  const todayTransactions = transactions.filter(t => {
    const transDate = new Date(t.date);
    return transDate.toDateString() === today.toDateString();
  });

  const thisMonthIncome = thisMonthTransactions
    .filter(t => t.type === TRANSACTION_TYPES.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const thisMonthExpenses = thisMonthTransactions
    .filter(t => t.type === TRANSACTION_TYPES.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const dailyIncome = todayTransactions
    .filter(t => t.type === TRANSACTION_TYPES.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter(t => t.type === TRANSACTION_TYPES.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    monthlyIncome: thisMonthIncome,
    monthlyExpenses: thisMonthExpenses,
    monthlyProfit: thisMonthIncome - thisMonthExpenses,
    dailyIncome: dailyIncome,
    totalIncome: totalIncome,
    incomeGrowth: 0 // Simplificado por ahora
  };
};

export const getCurrentBranch = (userRole, userBranchId, branches, selectedBranch) => {
  // Para administradores de sede, mostrar su sede
  if (userRole === 'branch_admin' && userBranchId) {
    return branches.find(b => b.id === userBranchId);
  }

  // Para super admin, mostrar la sede seleccionada
  if (userRole === 'super_admin' && selectedBranch) {
    return selectedBranch;
  }

  return null;
};

export const getTransactionTypeDisplay = (type) => {
  return type === TRANSACTION_TYPES.INCOME ? 'Ingreso' : 'Gasto';
};

export const getTransactionTypeColor = (type) => {
  return type === TRANSACTION_TYPES.INCOME
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
};

export const getAmountColor = (type) => {
  return type === TRANSACTION_TYPES.INCOME ? 'text-green-600' : 'text-red-600';
};

export const getAmountSign = (type) => {
  return type === TRANSACTION_TYPES.INCOME ? '+' : '-';
};

export const formatTransactionAmount = (amount, type) => {
  const sign = getAmountSign(type);
  return `${sign}${FINANCIAL_FORMATTERS.CURRENCY(amount)}`;
};

export const calculatePaymentMethodStats = (transactions, paymentMethods, totalIncome) => {
  return paymentMethods.map(method => {
    const methodTransactions = transactions.filter(t => t.paymentMethod === method.id);
    const total = methodTransactions.reduce((sum, t) => sum + t.amount, 0);
    const percentage = totalIncome > 0 ? (total / totalIncome * 100).toFixed(1) : 0;

    return {
      ...method,
      total,
      percentage
    };
  });
};

export const calculateCategoryStats = (transactions, categories, maxCategories = 5) => {
  return categories.expense.slice(0, maxCategories).map(category => {
    const categoryTransactions = transactions.filter(
      t => t.type === TRANSACTION_TYPES.EXPENSE && t.category === category.id
    );
    const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);

    return {
      ...category,
      total
    };
  });
};

export const getCategoryName = (categoryId, categories, transactionType) => {
  const categoryList = transactionType === TRANSACTION_TYPES.INCOME ? categories.income : categories.expense;
  const category = categoryList.find(c => c.id === categoryId);
  return category?.name || categoryId;
};

export const getPaymentMethodName = (methodId, paymentMethods) => {
  const method = paymentMethods.find(m => m.id === methodId);
  return method?.name || methodId;
};

export const shouldShowAllBranchesLabel = (userRole, selectedBranch) => {
  return userRole === 'super_admin' && !selectedBranch;
};

export const getFinancialSubtitle = (currentBranch, userRole, selectedBranch) => {
  if (currentBranch) {
    return `Gestiona ingresos, gastos y reportes de ${currentBranch.city}`;
  }

  if (shouldShowAllBranchesLabel(userRole, selectedBranch)) {
    return 'Gestiona ingresos, gastos y reportes de todas las sedes';
  }

  return 'Gestiona ingresos, gastos y reportes';
};