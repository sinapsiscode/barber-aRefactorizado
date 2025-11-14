import { useEffect, useState } from 'react';
import { FiUsers, FiDollarSign, FiCalendar, FiMapPin, FiTrendingUp, FiScissors, FiPlus, FiEdit, FiGift, FiSettings } from 'react-icons/fi';
import { useBranchStore, useFinancialStore, useAppointmentStore, useStaffStore, useClientStore, useLoyaltyStore } from '../../stores';
import { BranchForm } from '../branches';
import { MetricCard, CountryFlag } from '../common';
import RewardsManagement from '../loyalty/RewardsManagement';

const SuperAdminDashboard = ({ onPageChange }) => {
  const { branches, selectedBranch, loadBranches, getTotalStats, getCountryByCode } = useBranchStore();
  const { loadTransactions, getFinancialSummary } = useFinancialStore();
  const { loadMockData, getAppointmentStats } = useAppointmentStore();
  const { loadStaff, getStaffSummary } = useStaffStore();
  const { loadClients, getClientStats } = useClientStore();
  const { getPointsStats } = useLoyaltyStore();

  const [showBranchForm, setShowBranchForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'rewards'

  useEffect(() => {
    // Cargar datos al montar el componente
    loadBranches();
    loadTransactions();
    loadMockData();
    loadStaff();
    loadClients();
  }, []); // Se ejecuta solo al montar

  // Filtrar datos según la sede seleccionada
  const branchStats = selectedBranch ? {
    totalBranches: 1,
    totalRevenue: selectedBranch.stats?.monthlyRevenue || 0,
    totalAppointments: selectedBranch.stats?.totalAppointments || 0,
    totalStaff: selectedBranch.stats?.staffCount || 0,
    totalClients: selectedBranch.stats?.clientCount || 0
  } : getTotalStats();
  
  // Obtener datos financieros filtrados por sede si aplica
  const financialSummary = selectedBranch ? {
    monthlyIncome: selectedBranch.stats?.monthlyRevenue || 0,
    monthlyExpenses: (selectedBranch.stats?.monthlyRevenue || 0) * 0.3 || 0, // Estimación 30% gastos
    monthlyProfit: (selectedBranch.stats?.monthlyRevenue || 0) * 0.7 || 0,
    incomeGrowth: 0,
    dailyIncome: (selectedBranch.stats?.monthlyRevenue || 0) / 30 || 0
  } : getFinancialSummary();
  
  const appointmentStats = getAppointmentStats();
  const staffSummary = getStaffSummary();
  const clientStats = getClientStats();
  const loyaltyStats = getPointsStats();

  // Renderizado condicional para la vista de recompensas
  if (currentView === 'rewards') {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="text-gray-600 hover:text-gray-900 flex items-center space-x-2"
          >
            <span>← Volver al Dashboard</span>
          </button>
        </div>
        <RewardsManagement />
      </div>
    );
  }

  const handleAddBranch = () => {
    setEditingBranch(null);
    setShowBranchForm(true);
  };

  const handleEditBranch = (branch) => {
    setEditingBranch(branch);
    setShowBranchForm(true);
  };

  const handleCloseBranchForm = async () => {
    setShowBranchForm(false);
    setEditingBranch(null);
    // Recargar la lista de sucursales después de cerrar el formulario
    await loadBranches();
  };

  const MetricCard = ({ title, value, icon: Icon, color, change, description }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change && (
            <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change}% vs mes anterior
            </p>
          )}
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Dashboard Principal
          {selectedBranch && (
            <span className="text-xl font-normal ml-2">- {selectedBranch.name}</span>
          )}
        </h1>
        <p className="text-primary-100">
          {selectedBranch 
            ? `Vista detallada de ${selectedBranch.city}`
            : 'Vista general de todas las sedes y operaciones'
          }
        </p>
      </div>

      {/* Quick Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setCurrentView('rewards')}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white p-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <FiGift className="h-6 w-6" />
            <div className="text-left">
              <h3 className="font-semibold">Gestión de Recompensas</h3>
              <p className="text-yellow-100 text-sm">Administrar sistema de puntos</p>
            </div>
          </div>
          <div className="text-yellow-100">
            {loyaltyStats.totalActive > 0 && (
              <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
                {loyaltyStats.totalActive} pts activos
              </span>
            )}
          </div>
        </button>

        <button
          onClick={() => handleAddBranch()}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <FiPlus className="h-6 w-6" />
            <div className="text-left">
              <h3 className="font-semibold">Nueva Sede</h3>
              <p className="text-blue-100 text-sm">Expandir operaciones</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            console.log('🔧 Botón Configuración clicked, onPageChange:', onPageChange);
            onPageChange?.('settings');
          }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <FiSettings className="h-6 w-6" />
            <div className="text-left">
              <h3 className="font-semibold">Configuración</h3>
              <p className="text-purple-100 text-sm">Ajustes generales</p>
            </div>
          </div>
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <MetricCard
          title={selectedBranch ? "Sede Seleccionada" : "Sedes Activas"}
          value={selectedBranch ? selectedBranch.name : branchStats.totalBranches}
          icon={FiMapPin}
          color="bg-blue-500"
          description={selectedBranch ? selectedBranch.city : "Ubicaciones operativas"}
        />
        <MetricCard
          title="Ingresos Mensuales"
          value={financialSummary.monthlyIncome >= 1000000 
            ? `S/${(financialSummary.monthlyIncome / 1000000).toFixed(1)}M`
            : financialSummary.monthlyIncome >= 1000
            ? `S/${(financialSummary.monthlyIncome / 1000).toFixed(1)}K`
            : `S/${financialSummary.monthlyIncome.toLocaleString()}`
          }
          icon={FiDollarSign}
          color="bg-green-500"
          change={financialSummary.incomeGrowth}
        />
        <MetricCard
          title="Citas Hoy"
          value={appointmentStats.today}
          icon={FiCalendar}
          color="bg-purple-500"
          description={`${appointmentStats.confirmed} confirmadas`}
        />
        <MetricCard
          title="Personal Activo"
          value={staffSummary.totalStaff}
          icon={FiUsers}
          color="bg-orange-500"
          description={`${staffSummary.presentToday} presentes hoy`}
        />
        <MetricCard
          title="Clientes Totales"
          value={clientStats.total}
          icon={FiScissors}
          color="bg-indigo-500"
          description={`${clientStats.newThisMonth} nuevos este mes`}
        />
        <MetricCard
          title="Ganancia Neta"
          value={`S/${(financialSummary.monthlyProfit / 1000).toFixed(1)}K`}
          icon={FiTrendingUp}
          color="bg-emerald-500"
          change={12.5}
        />
      </div>

      {/* Branch Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Rendimiento por Sede
          </h3>
          <div className="space-y-4">
            {branches.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No hay sedes registradas
              </div>
            ) : (
              (selectedBranch ? [selectedBranch] : branches.slice(0, 5)).map((branch) => (
                <div key={branch.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {branch.name || branch.nombre}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {branch.city || branch.ciudad}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      S/{((branch.stats?.monthlyRevenue || 0) / 1000).toFixed(1)}K
                    </p>
                    <p className="text-xs text-gray-500">{branch.stats?.totalAppointments || 0} citas</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Resumen Financiero
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Ingresos del Mes</span>
              <span className="font-semibold text-green-600">
                S/{(financialSummary.monthlyIncome / 1000).toFixed(2)}K
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Gastos del Mes</span>
              <span className="font-semibold text-red-600">
                S/{(financialSummary.monthlyExpenses / 1000).toFixed(2)}K
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Ganancia Neta</span>
              <span className="font-semibold text-blue-600">
                S/{(financialSummary.monthlyProfit / 1000).toFixed(2)}K
              </span>
            </div>
            <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Margen de Ganancia</span>
                <span className="font-semibold text-primary-600">
                  {financialSummary.monthlyIncome > 0 
                    ? ((financialSummary.monthlyProfit / financialSummary.monthlyIncome) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Citas de Hoy
          </h3>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {appointmentStats.today}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {appointmentStats.confirmed} confirmadas
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Personal Presente
          </h3>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {staffSummary.presentToday}/{staffSummary.totalStaff}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {staffSummary.attendanceRate.toFixed(0)}% asistencia
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Clientes VIP
          </h3>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {clientStats.vipCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Clientes premium
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gestión de Sucursales */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Gestión de Sucursales
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {branches.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
              No hay sucursales registradas
            </div>
          ) : (
            (selectedBranch ? [selectedBranch] : branches.slice(0, 6)).map((branch) => (
              <div key={branch.id} className="border border-gray-200 dark:border-[#D4AF37]/20 rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <CountryFlag countryCode={branch.country || branch.pais} size={20} />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {branch.name || branch.nombre}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {branch.city || branch.ciudad}, {getCountryByCode(branch.country || branch.pais)?.name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditBranch(branch)}
                    className="text-gray-400 hover:text-[#D4AF37] transition-colors"
                  >
                    <FiEdit className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Ingresos:</span>
                    <span className="font-medium text-green-600">
                      S/${((branch.stats?.monthlyRevenue || 0) / 1000).toFixed(1)}K
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Personal:</span>
                    <span className="font-medium">{branch.stats?.staffCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Citas:</span>
                    <span className="font-medium">{branch.stats?.totalAppointments || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Clientes:</span>
                    <span className="font-medium">{branch.stats?.clientCount || 0}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#D4AF37]/10">
                  <div className="flex items-center space-x-2">
                    <FiMapPin className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500 truncate">{branch.address || branch.direccion}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal del formulario */}
      {showBranchForm && (
        <BranchForm
          branch={editingBranch}
          onClose={handleCloseBranchForm}
        />
      )}
    </div>
  );
};

export default SuperAdminDashboard;