// ===================================================================
// 📈 GRÁFICOS FINANCIEROS - REFACTORIZADO
// ===================================================================
// Dashboard de gráficos financieros
import React from 'react';
import { useFinancialCharts } from '../../hooks/useFinancialCharts';
import {
  IncomeVsExpensesChart,
  ProfitTrendChart
} from './components';

const FinancialCharts = () => {
  const {
    recentData,
    maxValue,
    totalProfit,
    formatDate,
    formatCurrency,
    calculateBarWidth,
    isProfitable,
    getProfitPrefix
  } = useFinancialCharts();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <IncomeVsExpensesChart
        data={recentData}
        maxValue={maxValue}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
        calculateBarWidth={calculateBarWidth}
      />

      <ProfitTrendChart
        data={recentData}
        maxValue={maxValue}
        totalProfit={totalProfit}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
        calculateBarWidth={calculateBarWidth}
        isProfitable={isProfitable}
        getProfitPrefix={getProfitPrefix}
      />
    </div>
  );
};

export default FinancialCharts;