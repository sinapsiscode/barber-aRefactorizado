// ===================================================================
// 📊 GRÁFICO TENDENCIA DE GANANCIAS - COMPONENTE ESPECIALIZADO
// ===================================================================
// Gráfico de tendencias de ganancias/pérdidas
import React from 'react';
import { CHART_LABELS, CHART_STYLES, CHART_CONFIG } from '../../../constants/financial';

const ProfitTrendChart = ({
  data = [],
  maxValue = 0,
  totalProfit = 0,
  formatDate,
  formatCurrency,
  calculateBarWidth,
  isProfitable,
  getProfitPrefix
}) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        {CHART_LABELS.PROFIT_TREND.TITLE}
      </h3>

      <div className="space-y-3">
        {data.map((day, index) => {
          const isPositive = isProfitable?.(day.profit);
          const style = isPositive ? CHART_STYLES.PROFIT : CHART_STYLES.LOSS;

          return (
            <div key={day.date} className="flex items-center space-x-4">
              <div className="w-16 text-xs text-gray-500">
                {formatDate?.(day.date)}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs ${style.textColor}`}>
                    {isPositive
                      ? CHART_LABELS.PROFIT_TREND.PROFIT_LABEL
                      : CHART_LABELS.PROFIT_TREND.LOSS_LABEL
                    }
                  </span>
                  <span className={`text-xs font-medium ${style.textColor}`}>
                    {getProfitPrefix?.(day.profit)}{formatCurrency?.(day.profit)}
                  </span>
                </div>

                <div className={`w-full ${CHART_STYLES.NEUTRAL.bg} rounded-full ${CHART_CONFIG.BAR_HEIGHT}`}>
                  <div
                    className={`${style.color} ${CHART_CONFIG.BAR_HEIGHT} rounded-full`}
                    style={{ width: `${calculateBarWidth?.(day.profit, maxValue)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No hay datos de ganancias disponibles</p>
          </div>
        )}
      </div>

      {/* Resumen total */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {CHART_LABELS.PROFIT_TREND.TOTAL_MONTH}
          </span>
          <span className={`font-semibold ${isProfitable?.(totalProfit) ? CHART_STYLES.PROFIT.textColor : CHART_STYLES.LOSS.textColor}`}>
            {formatCurrency?.(totalProfit)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfitTrendChart;