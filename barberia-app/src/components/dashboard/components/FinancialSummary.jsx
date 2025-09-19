// ===================================================================
// 💰 RESUMEN FINANCIERO - COMPONENTE ESPECIALIZADO
// ===================================================================
// Panel de resumen financiero para super admin
import React from 'react';

const FinancialSummary = ({
  financialSummary = {},
  calculateProfitMargin,
  title = "Resumen Financiero"
}) => {
  const {
    monthlyIncome = 0,
    monthlyExpenses = 0,
    monthlyProfit = 0
  } = financialSummary;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Ingresos del Mes</span>
          <span className="font-semibold text-green-600 dark:text-green-400">
            S/{(monthlyIncome / 1000).toFixed(2)}K
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Gastos del Mes</span>
          <span className="font-semibold text-red-600 dark:text-red-400">
            S/{(monthlyExpenses / 1000).toFixed(2)}K
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Ganancia Neta</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            S/{(monthlyProfit / 1000).toFixed(2)}K
          </span>
        </div>

        <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Margen de Ganancia</span>
            <span className="font-semibold text-primary-600 dark:text-primary-400">
              {calculateProfitMargin?.() || 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;