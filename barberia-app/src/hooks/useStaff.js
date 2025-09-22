import { useState, useEffect } from 'react';
import { useStaffStore, useAuthStore, useBranchStore, useAppointmentStore } from '../stores';
import {
  calculateCommissions,
  filterBarbersByBranch,
  getServicesPerformedByBarber,
  getTopPerformersByEarnings,
  getTopPerformersByServices,
  calculateServicePercentage,
  generateIndividualChange,
  calculateEfficiency,
  getPresentBarbers,
  calculateAttendanceRate
} from '../utils/staffHelpers';

export const useStaff = () => {
  const {
    barbers,
    loadMockStaff,
    getStaffSummary,
    checkIn,
    checkOut
  } = useStaffStore();
  const { user } = useAuthStore();
  const { selectedBranch } = useBranchStore();
  const { appointments, services } = useAppointmentStore();

  // Estados del componente
  const [showForm, setShowForm] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [showCommissionDetails, setShowCommissionDetails] = useState(false);
  const [showServicesDetails, setShowServicesDetails] = useState(false);
  const [expandedServicesBarber, setExpandedServicesBarber] = useState(null);

  // Efectos
  useEffect(() => {
    if (barbers.length === 0) {
      loadMockStaff();
    }
  }, [barbers.length, loadMockStaff]);

  // Efecto para cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (expandedServicesBarber && !event.target.closest('.relative')) {
        setExpandedServicesBarber(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expandedServicesBarber]);

  // Datos computados
  const filteredBarbers = filterBarbersByBranch(barbers, user, selectedBranch);
  const staffSummary = getStaffSummary();
  const commissionData = calculateCommissions(barbers, user, selectedBranch);
  const topPerformersByEarnings = getTopPerformersByEarnings(filteredBarbers);
  const topPerformersByServices = getTopPerformersByServices(filteredBarbers);

  // Handlers para asistencia
  const handleCheckIn = async (barberId) => {
    await checkIn(barberId);
  };

  const handleCheckOut = async (barberId) => {
    await checkOut(barberId);
  };

  // Handlers para modales
  const handleShowForm = () => setShowForm(true);
  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedBarber(null);
  };

  const handleShowAttendance = () => setShowAttendance(true);
  const handleCloseAttendance = () => setShowAttendance(false);

  // Handlers para secciones expandibles
  const handleToggleCommissionDetails = () => {
    setShowCommissionDetails(!showCommissionDetails);
  };

  const handleToggleServicesDetails = () => {
    setShowServicesDetails(!showServicesDetails);
  };

  const handleExpandServices = (barberId) => {
    setExpandedServicesBarber(expandedServicesBarber === barberId ? null : barberId);
  };

  // Función para obtener servicios realizados por un barbero
  const getBarberServices = (barberId) => {
    return getServicesPerformedByBarber(barberId, appointments, services);
  };

  // Función para calcular porcentaje de servicios
  const getServicePercentage = (barberServices) => {
    return calculateServicePercentage(barberServices, staffSummary.totalServices);
  };

  // Función para generar cambio individual
  const getIndividualChange = () => {
    return generateIndividualChange();
  };

  // Función para calcular eficiencia
  const getEfficiency = () => {
    return calculateEfficiency(staffSummary.totalServices, filteredBarbers.length);
  };

  // Función para obtener barberos presentes
  const getPresentBarbersCount = () => {
    return getPresentBarbers(filteredBarbers).length;
  };

  // Función para calcular tasa de asistencia
  const getAttendanceRate = () => {
    const presentCount = getPresentBarbersCount();
    return calculateAttendanceRate(presentCount, filteredBarbers.length);
  };

  return {
    // Estado
    showForm,
    showAttendance,
    selectedBarber,
    showCommissionDetails,
    showServicesDetails,
    expandedServicesBarber,

    // Datos
    user,
    selectedBranch,
    barbers,
    filteredBarbers,
    staffSummary,
    commissionData,
    topPerformersByEarnings,
    topPerformersByServices,
    appointments,
    services,

    // Handlers de modales
    handleShowForm,
    handleCloseForm,
    handleShowAttendance,
    handleCloseAttendance,

    // Handlers de asistencia
    handleCheckIn,
    handleCheckOut,

    // Handlers de secciones expandibles
    handleToggleCommissionDetails,
    handleToggleServicesDetails,
    handleExpandServices,

    // Funciones utilitarias
    getBarberServices,
    getServicePercentage,
    getIndividualChange,
    getEfficiency,
    getPresentBarbersCount,
    getAttendanceRate
  };
};