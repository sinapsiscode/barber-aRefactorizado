import { useFinancialStore } from '../../stores';

const FinancialCharts = () => {
  const { getChartData } = useFinancialStore();
  const chartData = getChartData('month');

  const maxValue = Math.max(...chartData.map(d => Math.max(d.income, d.expenses)));
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Income vs Expenses Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Ingresos vs Gastos (Últimos 30 días)
        </h3>
        <div className="space-y-3">
          {chartData.slice(-10).map((day, index) => (
            <div key={day.date} className="flex items-center space-x-4">
              <div className="w-16 text-xs text-gray-500">
                {new Date(day.date).toLocaleDateString('es-ES', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div className="flex-1 flex space-x-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-green-600">Ingresos</span>
                    <span className="text-xs font-medium">S/{day.income.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${maxValue > 0 ? (day.income / maxValue) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-red-600">Gastos</span>
                    <span className="text-xs font-medium">S/{day.expenses.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${maxValue > 0 ? (day.expenses / maxValue) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profit Trend */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Tendencia de Ganancias
        </h3>
        <div className="space-y-3">
          {chartData.slice(-10).map((day, index) => {
            const isPositive = day.profit >= 0;
            return (
              <div key={day.date} className="flex items-center space-x-4">
                <div className="w-16 text-xs text-gray-500">
                  {new Date(day.date).toLocaleDateString('es-ES', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? 'Ganancia' : 'Pérdida'}
                    </span>
                    <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? '+' : ''}S/{day.profit.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ 
                        width: `${maxValue > 0 ? (Math.abs(day.profit) / maxValue) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-dark-600">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Ganancia Total del Mes</span>
            <span className="font-semibold text-green-600">
              S/{chartData.reduce((sum, day) => sum + day.profit, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialCharts;