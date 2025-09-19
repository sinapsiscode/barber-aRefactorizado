import { useEffect, useState } from 'react';
import { FiUsers, FiDollarSign, FiCalendar, FiMapPin, FiTrendingUp, FiScissors, FiPlus, FiEdit } from 'react-icons/fi';
import { useBranchStore, useFinancialStore, useAppointmentStore, useStaffStore, useClientStore } from '../../stores';
import { BranchForm } from '../branches';
import { MetricCard, CountryFlag } from '../common';

const SuperAdminDashboard = () => {
  const { branches, selectedBranch, loadMockBranches, getTotalStats, getCountryByCode } = useBranchStore();
  const { loadMockTransactions, getFinancialSummary } = useFinancialStore();
  const { loadMockAppointments, getAppointmentStats } = useAppointmentStore();
  const { loadMockStaff, getStaffSummary } = useStaffStore();
  const { loadMockClients, getClientStats } = useClientStore();
  
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  useEffect(() => {
    if (branches.length === 0) {
      loadMockBranches();
      loadMockTransactions();
      loadMockAppointments();
      loadMockStaff();
      loadMockClients();
    }
  }, []);

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

  const handleAddBranch = () => {
    setEditingBranch(null);
    setShowBranchForm(true);
  };

  const handleEditBranch = (branch) => {
    setEditingBranch(branch);
    setShowBranchForm(true);
  };

  const handleCloseBranchForm = () => {
    setShowBranchForm(false);
    setEditingBranch(null);
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
            {(selectedBranch ? [selectedBranch] : branches.slice(0, 5)).map((branch) => (
              <div key={branch.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{branch.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{branch.city}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    S/{((branch.stats?.monthlyRevenue || 0) / 1000).toFixed(1)}K
                  </p>
                  <p className="text-xs text-gray-500">{branch.stats?.totalAppointments || 0} citas</p>
                </div>
              </div>
            ))}
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
      <BranchManagement
        branches={displayBranches}
        getCountryByCode={getCountryByCode}
        onAddBranch={handleAddBranch}
        onEditBranch={handleEditBranch}
      />

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