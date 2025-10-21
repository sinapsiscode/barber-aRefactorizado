/**
 * Hook para calcular métricas y resúmenes financieros
 */
export const useFinancialMetrics = (filteredTransactions) => {
  const calculateSummary = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const thisMonthTransactions = filteredTransactions.filter(t => {
      const transDate = new Date(t.date);
      return transDate.getMonth() === currentMonth &&
             transDate.getFullYear() === currentYear;
    });

    const todayTransactions = filteredTransactions.filter(t => {
      const transDate = new Date(t.date);
      return transDate.toDateString() === today.toDateString();
    });

    const thisMonthIncome = thisMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const thisMonthExpenses = thisMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const dailyIncome = todayTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
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

  return {
    summary: calculateSummary()
  };
};
