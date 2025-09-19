// ===================================================================
// 📈 GRÁFICO INGRESOS VS GASTOS - COMPONENTE ESPECIALIZADO
// ===================================================================
// Gráfico de barras comparativo de ingresos y gastos
import React from 'react';
import { CHART_LABELS, CHART_STYLES, CHART_CONFIG } from '../../../constants/financial';

const IncomeVsExpensesChart = ({
  data = [],
  maxValue = 0,
  formatDate,
  formatCurrency,
  calculateBarWidth
}) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        {CHART_LABELS.INCOME_VS_EXPENSES.TITLE}
      </h3>

      <div className="space-y-3">
        {data.map((day, index) => (
          <div key={day.date} className="flex items-center space-x-4">
            <div className="w-16 text-xs text-gray-500">
              {formatDate?.(day.date)}
            </div>

            <div className="flex-1 flex space-x-2">
              {/* Ingresos */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs ${CHART_STYLES.INCOME.textColor}`}>
                    {CHART_LABELS.INCOME_VS_EXPENSES.INCOME_LABEL}
                  </span>
                  <span className="text-xs font-medium">
                    {formatCurrency?.(day.income)}
                  </span>
                </div>
                <div className={`w-full ${CHART_STYLES.NEUTRAL.bg} rounded-full ${CHART_CONFIG.BAR_HEIGHT}`}>
                  <div
                    className={`${CHART_STYLES.INCOME.color} ${CHART_CONFIG.BAR_HEIGHT} rounded-full`}
                    style={{ width: `${calculateBarWidth?.(day.income, maxValue)}%` }}
                  />
                </div>
              </div>

              {/* Gastos */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs ${CHART_STYLES.EXPENSES.textColor}`}>
                    {CHART_LABELS.INCOME_VS_EXPENSES.EXPENSES_LABEL}
                  </span>
                  <span className="text-xs font-medium">
                    {formatCurrency?.(day.expenses)}
                  </span>
                </div>
                <div className={`w-full ${CHART_STYLES.NEUTRAL.bg} rounded-full ${CHART_CONFIG.BAR_HEIGHT}`}>
                  <div
                    className={`${CHART_STYLES.EXPENSES.color} ${CHART_CONFIG.BAR_HEIGHT} rounded-full`}
                    style={{ width: `${calculateBarWidth?.(day.expenses, maxValue)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No hay datos disponibles para mostrar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomeVsExpensesChart;