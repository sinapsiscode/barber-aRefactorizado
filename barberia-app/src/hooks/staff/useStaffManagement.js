import { useState, useEffect, useMemo } from 'react';
import { useStaffStore, useAuthStore, useBranchStore, useAppointmentStore } from '../../stores';
import useBranchFilter from '../useBranchFilter';
import { calculateCommissions } from '../../utils/staff/commissionCalculations';
import { getServicesPerformedByBarber } from '../../utils/staff/servicesAnalytics';

/**
 * Custom hook para gestionar toda la lógica de Staff
 * Extrae toda la lógica de negocio de Staff.jsx
 */
export const useStaffManagement = () => {
  // ===== STORES (líneas 13-22 del original) =====
  const {
    barbers,
    loadStaff,
    getStaffSummary,
    checkIn,
    checkOut
  } = useStaffStore();
  const { user } = useAuthStore();
  const { selectedBranch, branches } = useBranchStore();
  const { appointments, services } = useAppointmentStore();

  // ===== BRANCH FILTER HOOK (líneas 23-30 del original) =====
  const {
    filterStaffData,
    filterAppointmentData,
    getBranchTitle,
    getBranchDescription,
    shouldShowBranchSelector,
    isBranchAdmin
  } = useBranchFilter();

  // ===== ESTADOS (líneas 32-38 del original) =====
  const [showForm, setShowForm] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [showCommissionDetails, setShowCommissionDetails] = useState(false);
  const [showServicesDetails, setShowServicesDetails] = useState(false);
  const [expandedServicesBarber, setExpandedServicesBarber] = useState(null);

  // ===== EFECTO: CARGAR STAFF (líneas 40-44 del original) =====
  useEffect(() => {
    if (barbers.length === 0) {
      loadStaff();
    }
  }, [barbers.length, loadStaff]);

  // ===== EFECTO: CERRAR DROPDOWN AL CLICK FUERA (líneas 47-56 del original) =====
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (expandedServicesBarber && !event.target.closest('.relative')) {
        setExpandedServicesBarber(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expandedServicesBarber]);

  // ===== DATOS FILTRADOS (líneas 59-60 del original) =====
  const filteredBarbers = useMemo(() => filterStaffData(barbers), [barbers, filterStaffData]);
  const filteredAppointments = useMemo(() => filterAppointmentData(appointments), [appointments, filterAppointmentData]);

  // ===== STAFF SUMMARY (línea 62 del original) =====
  const staffSummary = useMemo(() => getStaffSummary(), [getStaffSummary]);

  // ===== COMMISSION DATA (líneas 65-135 del original) =====
  const commissionData = useMemo(() => {
    return calculateCommissions(barbers, selectedBranch, user?.role);
  }, [barbers, selectedBranch, user?.role]);

  // ===== FUNCIÓN: OBTENER SERVICIOS POR BARBERO (líneas 172-205 del original) =====
  const getServicesForBarber = (barberId) => {
    return getServicesPerformedByBarber(barberId, filteredAppointments, services);
  };

  // ===== HANDLERS DE ASISTENCIA (líneas 163-169 del original) =====
  const handleCheckIn = async (barberId) => {
    await checkIn(barberId);
  };

  const handleCheckOut = async (barberId) => {
    await checkOut(barberId);
  };

  // ===== HANDLERS DE MODALES =====
  const handleOpenForm = (barber = null) => {
    setSelectedBarber(barber);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedBarber(null);
  };

  const handleOpenReviews = (barber) => {
    setSelectedBarber(barber);
    setShowReviews(true);
  };

  const handleCloseReviews = () => {
    setShowReviews(false);
    setSelectedBarber(null);
  };

  const handleOpenAttendance = () => {
    setShowAttendance(true);
  };

  const handleCloseAttendance = () => {
    setShowAttendance(false);
  };

  const handleToggleCommissionDetails = () => {
    setShowCommissionDetails(!showCommissionDetails);
  };

  const handleToggleServicesDetails = () => {
    setShowServicesDetails(!showServicesDetails);
  };

  const handleToggleServiceDropdown = (barberId) => {
    setExpandedServicesBarber(expandedServicesBarber === barberId ? null : barberId);
  };

  // ===== RETURN =====
  return {
    // Data
    barbers,
    filteredBarbers,
    filteredAppointments,
    staffSummary,
    commissionData,
    branches,
    services,
    selectedBranch,
    user,

    // UI States
    showForm,
    showAttendance,
    showReviews,
    selectedBarber,
    showCommissionDetails,
    showServicesDetails,
    expandedServicesBarber,

    // Branch Filter
    getBranchTitle,
    getBranchDescription,
    shouldShowBranchSelector,
    isBranchAdmin,

    // Functions
    getServicesForBarber,
    handleCheckIn,
    handleCheckOut,

    // Handlers
    handleOpenForm,
    handleCloseForm,
    handleOpenReviews,
    handleCloseReviews,
    handleOpenAttendance,
    handleCloseAttendance,
    handleToggleCommissionDetails,
    handleToggleServicesDetails,
    handleToggleServiceDropdown
  };
};
