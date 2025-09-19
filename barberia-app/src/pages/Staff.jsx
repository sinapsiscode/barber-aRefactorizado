import { useState, useEffect } from 'react';
import { FiUsers, FiUserCheck, FiStar, FiClock, FiPlus, FiCalendar, FiDollarSign, FiChevronDown, FiChevronUp, FiTrendingUp, FiAward } from 'react-icons/fi';
import { useStaffStore, useAuthStore, useBranchStore, useAppointmentStore } from '../stores';
import { DataTable, MetricCard } from '../components/common';
import CountryFlag from '../components/common/CountryFlag';
import StaffForm from '../components/staff/StaffForm';
import AttendanceTracker from '../components/staff/AttendanceTracker';

const Staff = () => {
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
  
  const [showForm, setShowForm] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [showCommissionDetails, setShowCommissionDetails] = useState(false);
  const [showServicesDetails, setShowServicesDetails] = useState(false);
  const [expandedServicesBarber, setExpandedServicesBarber] = useState(null);

  useEffect(() => {
    if (barbers.length === 0) {
      loadMockStaff();
    }
  }, []);

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

  // Filtrar barberos según la sede seleccionada (solo para super admin)
  const filteredBarbers = user?.role === 'super_admin' && selectedBranch 
    ? barbers.filter(barber => barber.branchId === selectedBranch.id)
    : barbers;

  const staffSummary = getStaffSummary();
  
  // Calcular comisiones para SuperAdmin (70% de totalEarnings) con comparativas
  const calculateCommissions = () => {
    if (user?.role !== 'super_admin') return null;
    
    const targetBarbers = user?.role === 'super_admin' && selectedBranch 
      ? barbers.filter(barber => barber.branchId === selectedBranch.id)
      : barbers;
    
    // Datos del mes actual
    const currentMonth = {
      totalEarnings: targetBarbers.reduce((sum, barber) => sum + (barber.totalEarnings || 0), 0),
      activeBarbers: targetBarbers.filter(b => b.status === 'active').length,
      totalServices: targetBarbers.reduce((sum, barber) => sum + (barber.totalServices || 0), 0)
    };
    
    // Simular datos del mes anterior (85% del actual para demo)
    const previousMonth = {
      totalEarnings: Math.round(currentMonth.totalEarnings * 0.85),
      activeBarbers: currentMonth.activeBarbers,
      totalServices: Math.round(currentMonth.totalServices * 0.88)
    };
    
    // Cálculos de comisiones
    const currentCommissions = currentMonth.totalEarnings * 0.7;
    const previousCommissions = previousMonth.totalEarnings * 0.7;
    
    // Cálculos comparativos
    const commissionsChange = previousCommissions > 0 
      ? ((currentCommissions - previousCommissions) / previousCommissions) * 100 
      : 0;
    
    const earningsChange = previousMonth.totalEarnings > 0 
      ? ((currentMonth.totalEarnings - previousMonth.totalEarnings) / previousMonth.totalEarnings) * 100 
      : 0;
    
    const servicesChange = previousMonth.totalServices > 0 
      ? ((currentMonth.totalServices - previousMonth.totalServices) / previousMonth.totalServices) * 100 
      : 0;
    
    const avgCommissionPerBarber = currentMonth.activeBarbers > 0 ? currentCommissions / currentMonth.activeBarbers : 0;
    const prevAvgCommissionPerBarber = previousMonth.activeBarbers > 0 ? previousCommissions / previousMonth.activeBarbers : 0;
    const avgCommissionChange = prevAvgCommissionPerBarber > 0 
      ? ((avgCommissionPerBarber - prevAvgCommissionPerBarber) / prevAvgCommissionPerBarber) * 100 
      : 0;
    
    return {
      // Datos actuales
      totalCommissions: currentCommissions,
      totalEarnings: currentMonth.totalEarnings,
      avgCommissionPerBarber,
      activeBarbers: currentMonth.activeBarbers,
      totalServices: currentMonth.totalServices,
      
      // Datos del mes anterior
      previousMonth: {
        totalCommissions: previousCommissions,
        totalEarnings: previousMonth.totalEarnings,
        avgCommissionPerBarber: prevAvgCommissionPerBarber,
        totalServices: previousMonth.totalServices
      },
      
      // Comparativas (% de cambio)
      changes: {
        commissions: commissionsChange,
        earnings: earningsChange,
        avgCommission: avgCommissionChange,
        services: servicesChange
      }
    };
  };
  
  const commissionData = calculateCommissions();

  // Helper para mostrar cambio porcentual con colores e íconos
  const ChangeIndicator = ({ change, prefix = "" }) => {
    const isPositive = change > 0;
    const isNeutral = change === 0;
    const absChange = Math.abs(change);
    
    if (isNeutral) {
      return (
        <span className="text-white dark:text-gray-100 text-sm font-medium">
          = 0%
        </span>
      );
    }
    
    return (
      <span className={`text-sm font-medium flex items-center ${
        isPositive ? 'text-green-400' : 'text-orange-400'
      }`}>
        {isPositive ? '↗️' : '↘️'}
        <span className="ml-1">
          {prefix}{isPositive ? '+' : ''}{Math.round(absChange)}%
        </span>
      </span>
    );
  };

  const handleCheckIn = async (barberId) => {
    await checkIn(barberId);
  };

  const handleCheckOut = async (barberId) => {
    await checkOut(barberId);
  };

  // Función para obtener servicios realizados por un barbero
  const getServicesPerformedByBarber = (barberId) => {
    const barberAppointments = appointments.filter(apt => 
      apt.barberId === barberId && apt.status === 'completed'
    );
    
    const servicesMap = {};
    let totalRevenue = 0;
    
    barberAppointments.forEach(apt => {
      apt.services.forEach(serviceId => {
        const service = services.find(s => s.id === serviceId);
        if (service) {
          if (servicesMap[serviceId]) {
            servicesMap[serviceId].count += 1;
            servicesMap[serviceId].revenue += apt.totalPrice / apt.services.length; // Dividir precio entre servicios
          } else {
            servicesMap[serviceId] = {
              id: serviceId,
              name: service.name,
              count: 1,
              revenue: apt.totalPrice / apt.services.length
            };
          }
          totalRevenue += apt.totalPrice / apt.services.length;
        }
      });
    });
    
    return {
      services: Object.values(servicesMap).sort((a, b) => b.count - a.count),
      totalServices: barberAppointments.length,
      totalRevenue: totalRevenue
    };
  };

  const columns = [
    {
      key: 'name',
      label: 'Barbero',
      render: (value, barber) => (
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {value.charAt(0)}
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900 dark:text-white">{value}</span>
              <CountryFlag countryCode={barber.country || 'PE'} size={16} />
            </div>
            <div className="text-sm text-gray-500">{barber.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'specialties',
      label: 'Especialidades',
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((specialty, index) => (
            <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              {specialty}
            </span>
          ))}
          {value.length > 2 && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
              +{value.length - 2}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'rating',
      label: 'Calificación',
      render: (value) => (
        <div className="flex items-center space-x-1">
          <FiStar className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'totalServices',
      label: 'Servicios',
      render: (value) => value.toLocaleString()
    },
    {
      key: 'servicesPerformed',
      label: 'Servicios Realizados',
      render: (value, barber) => {
        const servicesData = getServicesPerformedByBarber(barber.id);
        const isExpanded = expandedServicesBarber === barber.id;
        
        if (servicesData.services.length === 0) {
          return (
            <span className="text-gray-500 text-sm">Sin servicios</span>
          );
        }
        
        return (
          <div className="relative">
            <button
              onClick={() => setExpandedServicesBarber(isExpanded ? null : barber.id)}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-sm transition-colors min-w-[120px]"
            >
              <span className="text-gray-900 dark:text-white font-medium">
                {servicesData.services.length} servicios
              </span>
              {isExpanded ? (
                <FiChevronUp className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              ) : (
                <FiChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              )}
            </button>
            
            {isExpanded && (
              <div className="absolute top-full left-0 mt-1 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    {barber.name} - Servicios Realizados
                  </h4>
                </div>
                
                <div className="max-h-64 overflow-y-auto">
                  {servicesData.services.map((service, index) => (
                    <div key={service.id} className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${index !== servicesData.services.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white text-sm">
                            {service.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {service.count} realizados
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                            S/{service.revenue.toFixed(0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-3 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-600 rounded-b-lg">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Total: {servicesData.totalServices} servicios
                    </span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      S/{servicesData.totalRevenue.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }
    },
    {
      key: 'totalEarnings',
      label: 'Ingresos',
      render: (value) => `S/${(value / 1000).toFixed(1)}K`
    },
    {
      key: 'isPresent',
      label: 'Estado',
      render: (value, barber) => (
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            value 
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {value ? 'Presente' : 'Ausente'}
          </span>
          <button
            onClick={() => value ? handleCheckOut(barber.id) : handleCheckIn(barber.id)}
            className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
          >
            {value ? 'Salida' : 'Entrada'}
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 max-w-none w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Personal
            {user?.role === 'super_admin' && selectedBranch && (
              <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-2">
                - {selectedBranch.name}
              </span>
            )}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {user?.role === 'super_admin' && selectedBranch 
              ? `Administra barberos, asistencia y productividad de ${selectedBranch.city}`
              : 'Administra barberos, asistencia y productividad'
            }
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowAttendance(true)}
            className="btn-secondary"
          >
            <FiCalendar className="h-4 w-4 mr-2" />
            Asistencia
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            <FiPlus className="h-4 w-4 mr-2" />
            Agregar Barbero
          </button>
        </div>
      </div>

      {/* Staff Metrics */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${user?.role === 'super_admin' ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-6`}>
        <MetricCard
          title="Personal Total"
          value={staffSummary.totalStaff}
          icon={FiUsers}
          color="bg-blue-500"
        />
        <MetricCard
          title="Presentes Hoy"
          value={`${staffSummary.presentToday}/${staffSummary.totalStaff}`}
          icon={FiUserCheck}
          color="bg-green-500"
          description={`${staffSummary.attendanceRate.toFixed(0)}% asistencia`}
        />
        <MetricCard
          title="Calificación Promedio"
          value={staffSummary.avgRating}
          icon={FiStar}
          color="bg-yellow-500"
        />
        <MetricCard
          onClick={() => setShowServicesDetails(!showServicesDetails)}
          title={
            <div className="flex items-center justify-between">
              <span>Servicios Total</span>
              {showServicesDetails ? 
                <FiChevronUp className="h-4 w-4 text-purple-500" /> : 
                <FiChevronDown className="h-4 w-4 text-purple-500" />
              }
            </div>
          }
          value={staffSummary.totalServices.toLocaleString()}
          icon={FiClock}
          color="bg-purple-500"
          className="transition-transform hover:scale-105"
        />
        {/* Métrica de Comisiones - Solo para Super Admin */}
        {user?.role === 'super_admin' && commissionData && (
          <MetricCard
            onClick={() => setShowCommissionDetails(!showCommissionDetails)}
            title={
              <div className="flex items-center justify-between">
                <span>Comisiones (70%)</span>
                {showCommissionDetails ? 
                  <FiChevronUp className="h-4 w-4 text-[#D4AF37]" /> : 
                  <FiChevronDown className="h-4 w-4 text-[#D4AF37]" />
                }
              </div>
            }
            value={`S/${commissionData.totalCommissions.toLocaleString()}`}
            icon={FiDollarSign}
            color="bg-[#D4AF37]"
            description={
              <div className="flex flex-col space-y-1">
                <span className="text-white dark:text-gray-100">S/${Math.round(commissionData.avgCommissionPerBarber).toLocaleString()} promedio</span>
                <ChangeIndicator change={commissionData.changes.commissions} />
              </div>
            }
            className="transition-transform hover:scale-105"
          />
        )}
      </div>

      {/* Commission Details - Sección Expandible */}
      {user?.role === 'super_admin' && commissionData && (
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
          showCommissionDetails ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="space-y-6">
            {/* Header de la sección */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-[#D4AF37]/20 rounded-lg flex items-center justify-center">
                  <FiDollarSign className="h-5 w-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Análisis Detallado de Comisiones
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sistema de comisiones del 70% para barberos
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCommissionDetails(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <FiChevronUp className="h-5 w-5" />
              </button>
            </div>

            {/* Métricas detalladas con comparativas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-green-100 dark:bg-green-800/50 rounded-lg flex items-center justify-center">
                      <FiTrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">Ingresos Brutos</p>
                      <p className="text-xl font-bold text-green-900 dark:text-green-100">
                        S/{commissionData.totalEarnings.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <ChangeIndicator change={commissionData.changes.earnings} />
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">vs mes ant.</p>
                  </div>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/20 border-[#D4AF37]/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-[#D4AF37]/20 rounded-lg flex items-center justify-center">
                      <FiDollarSign className="h-5 w-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#D4AF37]">Comisiones Pagadas</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        S/{commissionData.totalCommissions.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <ChangeIndicator change={commissionData.changes.commissions} />
                    <p className="text-xs text-[#D4AF37] mt-1">vs mes ant.</p>
                  </div>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-blue-100 dark:bg-blue-800/50 rounded-lg flex items-center justify-center">
                      <FiClock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Servicios Totales</p>
                      <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                        {commissionData.totalServices.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <ChangeIndicator change={commissionData.changes.services} />
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">vs mes ant.</p>
                  </div>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-purple-100 dark:bg-purple-800/50 rounded-lg flex items-center justify-center">
                      <FiAward className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-purple-800 dark:text-purple-200">Promedio/Barbero</p>
                      <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                        S/{Math.round(commissionData.avgCommissionPerBarber).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <ChangeIndicator change={commissionData.changes.avgCommission} />
                    <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">vs mes ant.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Performers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FiAward className="h-5 w-5 text-[#D4AF37] mr-2" />
                    Top Performers - Comisiones
                  </h4>
                </div>
                <div className="space-y-3">
                  {filteredBarbers
                    .sort((a, b) => (b.totalEarnings || 0) - (a.totalEarnings || 0))
                    .slice(0, 5)
                    .map((barber, index) => {
                      const commission = (barber.totalEarnings || 0) * 0.7;
                      // Simular cambio individual (variación entre -10% y +25%)
                      const individualChange = -10 + (Math.random() * 35);
                      const previousCommission = commission / (1 + (individualChange / 100));
                      
                      return (
                        <div key={barber.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === 0 ? 'bg-yellow-100 text-yellow-800' :
                              index === 1 ? 'bg-gray-100 text-gray-800' :
                              index === 2 ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {barber.name}
                              </p>
                              <div className="flex items-center space-x-2">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {barber.totalServices} servicios
                                </p>
                                <ChangeIndicator change={individualChange} />
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#D4AF37]">
                              S/{commission.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              vs S/{Math.round(previousCommission).toLocaleString()} mes ant.
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Información del sistema */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FiDollarSign className="h-5 w-5 text-[#D4AF37] mr-2" />
                    Desglose Financiero
                  </h4>
                </div>
                <div className="space-y-4">
                  {/* Comparación Mensual */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                      <FiTrendingUp className="h-4 w-4 mr-2" />
                      Comparación Mensual
                    </h5>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-blue-700 dark:text-blue-300">Mes Actual</p>
                        <p className="font-bold text-blue-900 dark:text-blue-100">S/{commissionData.totalCommissions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-blue-700 dark:text-blue-300">Mes Anterior</p>
                        <p className="font-bold text-blue-900 dark:text-blue-100">S/{commissionData.previousMonth.totalCommissions.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-center">
                      <ChangeIndicator change={commissionData.changes.commissions} prefix="Diferencia: " />
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Ingresos Totales</span>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        S/{commissionData.totalEarnings.toLocaleString()}
                      </span>
                      <div className="text-right">
                        <ChangeIndicator change={commissionData.changes.earnings} />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Comisiones (70%)</span>
                    <div className="text-right">
                      <span className="font-semibold text-[#D4AF37]">
                        -S/{commissionData.totalCommissions.toLocaleString()}
                      </span>
                      <div className="text-right">
                        <ChangeIndicator change={commissionData.changes.commissions} />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Retención (30%)</span>
                    <span className="font-semibold text-green-600">
                      S/{(commissionData.totalEarnings - commissionData.totalCommissions).toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900 dark:text-white">Margen Neto</span>
                      <span className="text-lg font-bold text-green-600">
                        {((commissionData.totalEarnings - commissionData.totalCommissions) / commissionData.totalEarnings * 100).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Después del pago de comisiones
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services Details - Sección Expandible */}
      {showServicesDetails && (
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
          showServicesDetails ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="space-y-6">
            {/* Header de la sección */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <FiClock className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Análisis Detallado de Servicios
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Cantidad de citas atendidas por barbero
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowServicesDetails(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <FiChevronUp className="h-5 w-5" />
              </button>
            </div>

            {/* Métricas de servicios */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-purple-100 dark:bg-purple-800/50 rounded-lg flex items-center justify-center">
                      <FiClock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-purple-800 dark:text-purple-200">Total Servicios</p>
                      <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                        {staffSummary.totalServices.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-blue-100 dark:bg-blue-800/50 rounded-lg flex items-center justify-center">
                      <FiUsers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Promedio/Barbero</p>
                      <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                        {Math.round(staffSummary.totalServices / (filteredBarbers.length || 1)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-green-100 dark:bg-green-800/50 rounded-lg flex items-center justify-center">
                      <FiCalendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">Servicios/Día</p>
                      <p className="text-xl font-bold text-green-900 dark:text-green-100">
                        {Math.round(staffSummary.totalServices / 30).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-yellow-100 dark:bg-yellow-800/50 rounded-lg flex items-center justify-center">
                      <FiAward className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Mejor Barbero</p>
                      <p className="text-xl font-bold text-yellow-900 dark:text-yellow-100">
                        {filteredBarbers.sort((a, b) => b.totalServices - a.totalServices)[0]?.totalServices || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top 5 Barberos por Servicios */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FiAward className="h-5 w-5 text-purple-500 mr-2" />
                  Top 5 Barberos por Servicios
                </h4>
                <div className="space-y-3">
                  {filteredBarbers
                    .sort((a, b) => b.totalServices - a.totalServices)
                    .slice(0, 5)
                    .map((barber, index) => {
                      const percentage = (barber.totalServices / staffSummary.totalServices) * 100;
                      
                      return (
                        <div key={barber.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                index === 0 ? 'bg-yellow-500' : 
                                index === 1 ? 'bg-gray-400' : 
                                index === 2 ? 'bg-yellow-700' : 'bg-purple-500'
                              }`}>
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {barber.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {percentage.toFixed(1)}% del total
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-purple-600">
                                {barber.totalServices.toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                servicios
                              </p>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Distribución de Servicios */}
              <div className="card">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Distribución por Sucursal
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Sucursal Actual</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedBranch?.name || 'Todas'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Barberos Activos</span>
                    <span className="font-semibold text-purple-600">
                      {filteredBarbers.filter(b => b.status === 'active').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Promedio Calificación</span>
                    <span className="font-semibold text-yellow-600">
                      {staffSummary.avgRating}/5.0
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 dark:text-gray-400">Eficiencia</span>
                    <span className="font-semibold text-green-600">
                      {Math.round((staffSummary.totalServices / filteredBarbers.length) / 30)}
                      <span className="text-xs text-gray-500"> servicios/día/barbero</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Performers
          </h3>
          <div className="space-y-4">
            {filteredBarbers
              .sort((a, b) => b.totalEarnings - a.totalEarnings)
              .slice(0, 5)
              .map((barber, index) => (
                <div key={barber.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-yellow-600' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {barber.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {barber.totalServices} servicios
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      S/${(barber.totalEarnings / 1000).toFixed(1)}K
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiStar className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-500">{barber.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Estado Actual
          </h3>
          <div className="space-y-4">
            {filteredBarbers.slice(0, 5).map(barber => (
              <div key={barber.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {barber.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {barber.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {barber.specialties[0]}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    barber.isPresent 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {barber.isPresent ? 'Activo' : 'Inactivo'}
                  </span>
                  {barber.isPresent && (
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <DataTable
        data={filteredBarbers}
        columns={columns}
        searchable
        pagination={false}
        className="w-full"
        emptyMessage="No hay barberos registrados"
      />

      {/* Staff Form Modal */}
      {showForm && (
        <StaffForm
          barber={selectedBarber}
          onClose={() => {
            setShowForm(false);
            setSelectedBarber(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setSelectedBarber(null);
          }}
        />
      )}

      {/* Attendance Tracker Modal */}
      {showAttendance && (
        <AttendanceTracker
          onClose={() => setShowAttendance(false)}
        />
      )}
    </div>
  );
};

export default Staff;