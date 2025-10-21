import { useState, useEffect } from 'react';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiPlus, FiDownload, FiBarChart, FiImage, FiX } from 'react-icons/fi';
import { useFinancialStore, useAuthStore, useBranchStore } from '../stores';
import { DataTable, MetricCard } from '../components/common';
import BranchRestrictionNotice from '../components/common/BranchRestrictionNotice';
import TransactionForm from '../components/financial/TransactionForm';
import FinancialCharts from '../components/financial/FinancialCharts';
import useBranchFilter from '../hooks/useBranchFilter';

const Financial = () => {
  const {
    transactions,
    metrics,
    loadTransactions,
    getFinancialSummary,
    getTransactionsByBranch,
    paymentMethods,
    categories
  } = useFinancialStore();
  const { user } = useAuthStore();
  const { branches, selectedBranch, loadBranches } = useBranchStore();
  const {
    filterFinancialData,
    getBranchTitle,
    getBranchDescription,
    shouldShowBranchSelector,
    isBranchAdmin
  } = useBranchFilter();

  const [showForm, setShowForm] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  useEffect(() => {
    if (transactions.length === 0) {
      loadTransactions();
    }
  }, []);

  useEffect(() => {
    if (!branches || branches.length === 0) {
      loadBranches();
    }
  }, [branches, loadBranches]);

  // Filtrar transacciones según el rol del usuario y sede
  const filteredTransactions = filterFinancialData(transactions);

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
    },
    {
      key: 'voucherUrl',
      label: 'Voucher',
      render: (value, item) => {
        if (!value) {
          return (
            <span className="text-xs text-gray-400 italic">Sin voucher</span>
          );
        }
        return (
          <button
            onClick={() => {
              setSelectedVoucher({ url: value, transaction: item });
              setShowVoucherModal(true);
            }}
            className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-sm"
          >
            <FiImage className="h-4 w-4" />
            <span>Ver</span>
          </button>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <BranchRestrictionNotice />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {getBranchTitle('Control Financiero')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {getBranchDescription('Gestiona ingresos, gastos y reportes')}
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

      {/* Voucher Modal */}
      {showVoucherModal && selectedVoucher && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowVoucherModal(false)}></div>
            </div>

            <div className="inline-block align-bottom bg-white dark:bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white dark:bg-dark-800 px-6 py-4 border-b border-gray-200 dark:border-dark-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
                    <FiImage className="h-5 w-5 text-blue-500 mr-2" />
                    Voucher de Transacción
                  </h3>
                  <button
                    onClick={() => setShowVoucherModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Información de la transacción */}
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Tipo:</span>
                      <span className={`ml-2 font-medium ${
                        selectedVoucher.transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selectedVoucher.transaction.type === 'income' ? 'Ingreso' : 'Gasto'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Monto:</span>
                      <span className="ml-2 font-semibold">S/{selectedVoucher.transaction.amount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Fecha:</span>
                      <span className="ml-2 font-medium">{new Date(selectedVoucher.transaction.date).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Método:</span>
                      <span className="ml-2 font-medium">
                        {paymentMethods.find(m => m.id === selectedVoucher.transaction.paymentMethod)?.name}
                      </span>
                    </div>
                  </div>
                  {selectedVoucher.transaction.description && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">Descripción:</span>
                      <p className="text-sm mt-1 text-gray-900 dark:text-white">{selectedVoucher.transaction.description}</p>
                    </div>
                  )}
                </div>

                {/* Imagen del voucher */}
                <div className="bg-gray-100 dark:bg-dark-700 rounded-lg p-4">
                  <img
                    src={selectedVoucher.url}
                    alt="Voucher"
                    className="w-full h-auto max-h-96 object-contain rounded"
                  />
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-dark-700 px-6 py-3 flex justify-end">
                <button
                  onClick={() => setShowVoucherModal(false)}
                  className="btn-secondary"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Financial;