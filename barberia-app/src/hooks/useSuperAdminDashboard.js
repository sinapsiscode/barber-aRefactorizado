// ===================================================================
// 👑 HOOK PERSONALIZADO PARA DASHBOARD SUPER ADMIN - REFACTORIZADO
// ===================================================================
// Lógica centralizada para el dashboard del super administrador
import { useState, useEffect, useMemo } from 'react';
import { FiUsers, FiDollarSign, FiCalendar, FiMapPin, FiTrendingUp, FiScissors } from 'react-icons/fi';
import { useBranchStore, useFinancialStore, useAppointmentStore, useStaffStore, useClientStore } from '../stores';
import { DASHBOARD_LABELS, METRIC_COLORS } from '../constants';

export const useSuperAdminDashboard = () => {
  const { branches, selectedBranch, loadMockBranches, getTotalStats, getCountryByCode } = useBranchStore();
  const { loadMockTransactions, getFinancialSummary } = useFinancialStore();
  const { loadMockAppointments, getAppointmentStats } = useAppointmentStore();
  const { loadMockStaff, getStaffSummary } = useStaffStore();
  const { loadMockClients, getClientStats } = useClientStore();

  const [showBranchForm, setShowBranchForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  // Cargar datos mock al inicializar
  useEffect(() => {
    if (branches.length === 0) {
      loadMockBranches();
      loadMockTransactions();
      loadMockAppointments();
      loadMockStaff();
      loadMockClients();
    }
  }, [loadMockBranches, loadMockTransactions, loadMockAppointments, loadMockStaff, loadMockClients, branches.length]);

  // Configuración del dashboard
  const dashboardConfig = {
    title: selectedBranch
      ? `Dashboard Principal - ${selectedBranch.name}`
      : DASHBOARD_LABELS.SUPER_ADMIN.TITLE,
    subtitle: selectedBranch
      ? `Vista detallada de ${selectedBranch.city}`
      : DASHBOARD_LABELS.SUPER_ADMIN.SUBTITLE,
    gradient: DASHBOARD_LABELS.SUPER_ADMIN.GRADIENT
  };

  // Estadísticas procesadas
  const processedStats = useMemo(() => {
    const branchStats = selectedBranch ? {
      totalBranches: 1,
      totalRevenue: selectedBranch.stats?.monthlyRevenue || 0,
      totalAppointments: selectedBranch.stats?.totalAppointments || 0,
      totalStaff: selectedBranch.stats?.staffCount || 0,
      totalClients: selectedBranch.stats?.clientCount || 0
    } : getTotalStats();

    const financialSummary = selectedBranch ? {
      monthlyIncome: selectedBranch.stats?.monthlyRevenue || 0,
      monthlyExpenses: (selectedBranch.stats?.monthlyRevenue || 0) * 0.3 || 0,
      monthlyProfit: (selectedBranch.stats?.monthlyRevenue || 0) * 0.7 || 0,
      incomeGrowth: 0,
      dailyIncome: (selectedBranch.stats?.monthlyRevenue || 0) / 30 || 0
    } : getFinancialSummary();

    const appointmentStats = getAppointmentStats();
    const staffSummary = getStaffSummary();
    const clientStats = getClientStats();

    return {
      branchStats,
      financialSummary,
      appointmentStats,
      staffSummary,
      clientStats
    };
  }, [selectedBranch, getTotalStats, getFinancialSummary, getAppointmentStats, getStaffSummary, getClientStats]);

  // Métricas principales
  const metrics = useMemo(() => {
    const { branchStats, financialSummary, appointmentStats, staffSummary, clientStats } = processedStats;

    return [
      {
        title: selectedBranch ? "Sede Seleccionada" : "Sedes Activas",
        value: selectedBranch ? selectedBranch.name : branchStats.totalBranches,
        icon: FiMapPin,
        color: METRIC_COLORS.ALERT.icon,
        description: selectedBranch ? selectedBranch.city : "Ubicaciones operativas"
      },
      {
        title: "Ingresos Mensuales",
        value: formatCurrency(financialSummary.monthlyIncome),
        icon: FiDollarSign,
        color: METRIC_COLORS.PAYMENTS.icon,
        change: financialSummary.incomeGrowth
      },
      {
        title: "Citas Hoy",
        value: appointmentStats.today,
        icon: FiCalendar,
        color: METRIC_COLORS.APPOINTMENTS.icon,
        description: `${appointmentStats.confirmed} confirmadas`
      },
      {
        title: "Personal Activo",
        value: staffSummary.totalStaff,
        icon: FiUsers,
        color: METRIC_COLORS.STAFF.icon,
        description: `${staffSummary.presentToday} presentes hoy`
      },
      {
        title: "Clientes Totales",
        value: clientStats.total,
        icon: FiScissors,
        color: METRIC_COLORS.CLIENTS.icon,
        description: `${clientStats.newThisMonth} nuevos este mes`
      },
      {
        title: "Ganancia Neta",
        value: `S/${(financialSummary.monthlyProfit / 1000).toFixed(1)}K`,
        icon: FiTrendingUp,
        color: METRIC_COLORS.REVENUE.icon,
        change: 12.5
      }
    ];
  }, [processedStats, selectedBranch]);

  // Sucursales para mostrar
  const displayBranches = useMemo(() => {
    return selectedBranch ? [selectedBranch] : branches.slice(0, 6);
  }, [selectedBranch, branches]);

  // Utilidades de formato
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `S/${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `S/${(amount / 1000).toFixed(1)}K`;
    }
    return `S/${amount.toLocaleString()}`;
  };

  const calculateProfitMargin = () => {
    const { financialSummary } = processedStats;
    return financialSummary.monthlyIncome > 0
      ? ((financialSummary.monthlyProfit / financialSummary.monthlyIncome) * 100).toFixed(1)
      : 0;
  };

  // Handlers
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

  return {
    // Configuración
    dashboardConfig,

    // Estados
    showBranchForm,
    editingBranch,

    // Datos procesados
    ...processedStats,
    metrics,
    displayBranches,

    // Utilidades
    getCountryByCode,
    formatCurrency,
    calculateProfitMargin,

    // Handlers
    handleAddBranch,
    handleEditBranch,
    handleCloseBranchForm
  };
};