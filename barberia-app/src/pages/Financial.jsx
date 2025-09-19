import { useState, useEffect } from 'react';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiPlus, FiDownload, FiBarChart } from 'react-icons/fi';
import { useFinancialStore, useAuthStore, useBranchStore } from '../stores';
import { DataTable, MetricCard } from '../components/common';
import TransactionForm from '../components/financial/TransactionForm';
import FinancialCharts from '../components/financial/FinancialCharts';

const Financial = () => {
  const { 
    transactions, 
    metrics, 
    loadMockTransactions, 
    getFinancialSummary,
    getTransactionsByBranch,
    paymentMethods,
    categories 
  } = useFinancialStore();
  const { user } = useAuthStore();
  const { branches, selectedBranch, loadMockBranches } = useBranchStore();
  
  const [showForm, setShowForm] = useState(false);
  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => {
    if (transactions.length === 0) {
      loadMockTransactions();
    }
  }, []);

  useEffect(() => {
    if (!branches || branches.length === 0) {
      loadMockBranches();
    }
  }, [branches, loadMockBranches]);

  // Filtrar transacciones según el rol del usuario y sede seleccionada
  const filteredTransactions = (() => {
    // Para administradores de sede, solo mostrar su sede
    if (user?.role === 'branch_admin' && user?.branchId) {
      return getTransactionsByBranch(user.branchId);
    }
    
    // Para super admin, filtrar por sede seleccionada si hay una
    if (user?.role === 'super_admin' && selectedBranch) {
      return getTransactionsByBranch(selectedBranch.id);
    }
    
    // Si no hay sede seleccionada o es "Todas las sedes", mostrar todas
    return transactions;
  })();

  // Calcular resumen basado en transacciones filtradas
  const calculateLocalSummary = (transactionsList) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const thisMonthTransactions = transactionsList.filter(t => {
      const transDate = new Date(t.date);
      return transDate.getMonth() === currentMonth && 
             transDate.getFullYear() === currentYear;
    });
    
    const todayTransactions = transactionsList.filter(t => {
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
      
    const totalIncome = transactionsList
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

  const summary = calculateLocalSummary(filteredTransactions);
  
  // Obtener información de la sede actual
  const currentBranch = (() => {
    // Para administradores de sede, mostrar su sede
    if (user?.role === 'branch_admin' && user?.branchId) {
      return branches.find(b => b.id === user.branchId);
    }
    
    // Para super admin, mostrar la sede seleccionada
    if (user?.role === 'super_admin' && selectedBranch) {
      return selectedBranch;
    }
    
    return null;
  })();

  const columns = [
    {
      key: 'date',
      label: 'Fecha',
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === 'income' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {value === 'income' ? 'Ingreso' : 'Gasto'}
        </span>
      )
    },
    {
      key: 'category',
      label: 'Categoría',
      render: (value, item) => {
        const categoryList = item.type === 'income' ? categories.income : categories.expense;
        const category = categoryList.find(c => c.id === value);
        return category?.name || value;
      }
    },
    {
      key: 'description',
      label: 'Descripción'
    },
    {
      key: 'amount',
      label: 'Monto',
      render: (value, item) => (
        <span className={`font-semibold ${
          item.type === 'income' ? 'text-green-600' : 'text-red-600'
        }`}>
          {item.type === 'income' ? '+' : '-'}S/{value.toLocaleString()}
        </span>
      )
    },
    {
      key: 'paymentMethod',
      label: 'Método',
      render: (value) => {
        const method = paymentMethods.find(m => m.id === value);
        return method?.name || value;
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Control Financiero
            {currentBranch && (
              <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-2">
                - {currentBranch.name}
              </span>
            )}
            {user?.role === 'super_admin' && !selectedBranch && (
              <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-2">
                - Todas las Sedes
              </span>
            )}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {currentBranch 
              ? `Gestiona ingresos, gastos y reportes de ${currentBranch.city}`
              : user?.role === 'super_admin' && !selectedBranch
                ? 'Gestiona ingresos, gastos y reportes de todas las sedes'
                : 'Gestiona ingresos, gastos y reportes'
            }
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowCharts(!showCharts)}
            className="btn-secondary"
          >
            <FiBarChart className="h-4 w-4 mr-2" />
            {showCharts ? 'Ocultar' : 'Mostrar'} Gráficos
          </button>
          <button className="btn-secondary">
            <FiDownload className="h-4 w-4 mr-2" />
            Exportar PDF
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            <FiPlus className="h-4 w-4 mr-2" />
            Nueva Transacción
          </button>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Ingresos del Mes"
          value={`S/${((summary.monthlyIncome || 0) / 1000).toFixed(1)}K`}
          icon={FiTrendingUp}
          color="bg-green-500"
          change={summary.incomeGrowth || 0}
        />
        <MetricCard
          title="Gastos del Mes"
          value={`S/${((summary.monthlyExpenses || 0) / 1000).toFixed(1)}K`}
          icon={FiTrendingDown}
          color="bg-red-500"
        />
        <MetricCard
          title="Ganancia Neta"
          value={`S/${((summary.monthlyProfit || 0) / 1000).toFixed(1)}K`}
          icon={FiDollarSign}
          color="bg-blue-500"
        />
        <MetricCard
          title="Ingresos Hoy"
          value={`S/${((summary.dailyIncome || 0) / 1000).toFixed(0)}K`}
          icon={FiDollarSign}
          color="bg-purple-500"
        />
      </div>

      {/* Charts */}
      {showCharts && <FinancialCharts />}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Resumen Mensual
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Ingresos Totales</span>
              <span className="font-semibold text-green-600">
                S/{(summary.monthlyIncome || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Gastos Totales</span>
              <span className="font-semibold text-red-600">
                S/{(summary.monthlyExpenses || 0).toLocaleString()}
              </span>
            </div>
            <hr className="border-gray-200 dark:border-dark-600" />
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900 dark:text-white">Ganancia Neta</span>
              <span className="font-bold text-primary-600">
                S/{(summary.monthlyProfit || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Métodos de Pago
          </h3>
          <div className="space-y-3">
            {paymentMethods.map(method => {
              const methodTransactions = filteredTransactions.filter(t => t.paymentMethod === method.id);
              const total = methodTransactions.reduce((sum, t) => sum + t.amount, 0);
              const percentage = summary.totalIncome > 0 ? (total / summary.totalIncome * 100).toFixed(1) : 0;
              
              return (
                <div key={method.id} className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">{method.name}</span>
                  <div className="text-right">
                    <span className="font-semibold">S/{total.toLocaleString()}</span>
                    <div className="text-xs text-gray-500">{percentage}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Categorías de Gastos
          </h3>
          <div className="space-y-3">
            {categories.expense.slice(0, 5).map(category => {
              const categoryTransactions = filteredTransactions.filter(
                t => t.type === 'expense' && t.category === category.id
              );
              const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
              
              return (
                <div key={category.id} className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">{category.name}</span>
                  <span className="font-semibold text-red-600">
                    S/{total.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <DataTable
        data={filteredTransactions}
        columns={columns}
        searchable
        emptyMessage="No hay transacciones registradas"
      />

      {/* Transaction Form Modal */}
      {showForm && (
        <TransactionForm
          onClose={() => setShowForm(false)}
          onSuccess={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Financial;