import { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiClock, FiUser, FiCheckCircle, FiX, FiEdit, FiTrash2, FiEye, FiFilter, FiMapPin, FiScissors, FiCalendar, FiList } from 'react-icons/fi';
import { useAppointmentStore, useAuthStore, useBranchStore, useStaffStore } from '../../stores';
import Swal from 'sweetalert2';

const AppointmentCalendar = () => {
  const { appointments, getAppointmentsByDate, updateAppointment, deleteAppointment, services } = useAppointmentStore();
  const { user } = useAuthStore();
  const { branches, selectedBranch } = useBranchStore();
  const { barbers } = useStaffStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showDayView, setShowDayView] = useState(false);
  const [filters, setFilters] = useState({
    branchId: selectedBranch?.id || '',
    barberId: '',
    serviceType: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getAppointmentsForDay = (date) => {
    if (!date) return [];
    let dayAppointments = getAppointmentsByDate(date);
    
    // Aplicar filtros
    if (filters.branchId) {
      dayAppointments = dayAppointments.filter(apt => apt.branchId === parseInt(filters.branchId));
    }
    
    if (filters.barberId) {
      dayAppointments = dayAppointments.filter(apt => apt.barberId === parseInt(filters.barberId));
    }
    
    if (filters.serviceType) {
      dayAppointments = dayAppointments.filter(apt => 
        apt.services?.includes(parseInt(filters.serviceType))
      );
    }
    
    return dayAppointments;
  };

  const handleDayClick = (date) => {
    if (!date) return;
    setSelectedDay(date);
    setShowDayView(true);
  };

  const getFilteredBranches = () => {
    return branches || [];
  };

  const getFilteredBarbers = () => {
    if (!barbers) return [];
    
    // Si hay una sede específica seleccionada en el filtro, mostrar solo barberos de esa sede
    if (filters.branchId) {
      return barbers.filter(barber => barber.branchId === parseInt(filters.branchId));
    }
    
    // Si no hay sede seleccionada en el filtro, mostrar todos los barberos de la empresa
    return barbers;
  };

  const clearFilters = () => {
    setFilters({
      branchId: selectedBranch?.id || '',
      barberId: '',
      serviceType: ''
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.branchId && filters.branchId !== selectedBranch?.id) count++;
    if (filters.barberId) count++;
    if (filters.serviceType) count++;
    return count;
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    await updateAppointment(appointmentId, { status: newStatus });
    
    const statusText = {
      confirmed: 'confirmada',
      cancelled: 'cancelada',
      completed: 'completada'
    };
    
    Swal.fire({
      icon: 'success',
      title: 'Estado Actualizado',
      text: `La cita ha sido ${statusText[newStatus]} exitosamente`,
      confirmButtonColor: '#ffc000'
    });
  };

  const handleDeleteAppointment = async (appointmentId) => {
    const result = await Swal.fire({
      title: '¿Eliminar Cita?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      await deleteAppointment(appointmentId);
      Swal.fire({
        icon: 'success',
        title: 'Cita Eliminada',
        text: 'La cita ha sido eliminada exitosamente',
        confirmButtonColor: '#ffc000'
      });
    }
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentModal(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      confirmed: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
      in_progress: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[status] || colors.pending;
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      in_progress: 'En Proceso',
      completed: 'Completada',
      cancelled: 'Cancelada'
    };
    return texts[status] || status;
  };

  const days = getDaysInMonth(currentDate);

  return (
    <>
      {/* Filtros */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filtros</h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Limpiar filtros
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-3 py-1 rounded-lg font-medium transition-colors relative ${
                showFilters 
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              <FiFilter className="h-4 w-4 mr-1" />
              {showFilters ? 'Ocultar' : 'Mostrar'}
              {getActiveFiltersCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro por sede */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sede
              </label>
              <select
                value={filters.branchId}
                onChange={(e) => setFilters({...filters, branchId: e.target.value, barberId: ''})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
              >
                <option value="">Todas las sedes</option>
                {getFilteredBranches().map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por barbero */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Barbero
                {filters.branchId && (
                  <span className="text-xs text-gray-500 ml-1">
                    (Sede: {getFilteredBranches().find(b => b.id === parseInt(filters.branchId))?.name})
                  </span>
                )}
              </label>
              <select
                value={filters.barberId}
                onChange={(e) => setFilters({...filters, barberId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
              >
                <option value="">
                  {filters.branchId 
                    ? `Todos los barberos de ${getFilteredBranches().find(b => b.id === parseInt(filters.branchId))?.name || 'esta sede'}`
                    : 'Todos los barberos de la empresa'
                  }
                </option>
                {getFilteredBarbers().map(barber => {
                  const branch = getFilteredBranches().find(b => b.id === barber.branchId);
                  return (
                    <option key={barber.id} value={barber.id}>
                      {barber.name}
                      {!filters.branchId && branch ? ` (${branch.name})` : ''}
                    </option>
                  );
                })}
              </select>
              {getFilteredBarbers().length === 0 && filters.branchId && (
                <p className="text-xs text-gray-500 mt-1">
                  No hay barberos disponibles en esta sede
                </p>
              )}
            </div>

            {/* Filtro por tipo de servicio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Servicio
              </label>
              <select
                value={filters.serviceType}
                onChange={(e) => setFilters({...filters, serviceType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
              >
                <option value="">Todos los servicios</option>
                {services?.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg"
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg"
            >
              <FiChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 mb-2 bg-gradient-to-r from-primary-500/10 to-primary-400/10 dark:from-primary-500/20 dark:to-primary-400/20 rounded-lg p-2">
        {daysOfWeek.map(day => (
          <div key={day} className="p-3 text-center text-sm font-semibold uppercase tracking-wider text-primary-500 dark:text-primary-400">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const dayAppointments = getAppointmentsForDay(date);
          const isCurrentDay = isToday(date);
          
          return (
            <div
              key={index}
              onClick={() => date && handleDayClick(date)}
              className={`min-h-24 p-2 border border-[#FFB800]/10 cursor-pointer transition-all ${
                date ? 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary-500/30 hover:shadow-md' : 'bg-gray-50 dark:bg-black'
              } ${isCurrentDay ? 'ring-2 ring-primary-500 shadow-md' : ''}`}
            >
              {date && (
                <>
                  <div className={`text-sm font-bold mb-1 ${
                    isCurrentDay ? 'text-primary-500' : 'text-gray-800 dark:text-gray-100'
                  }`}>
                    {date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayAppointments.slice(0, 2).map(appointment => (
                      <div
                        key={appointment.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAppointmentClick(appointment);
                        }}
                        className={`text-xs p-1 rounded truncate relative group cursor-pointer transition-all hover:shadow-sm ${
                          appointment.status === 'confirmed' 
                            ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
                            : appointment.status === 'completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : appointment.status === 'in_progress'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        }`}
                        title={`${appointment.time} - ${appointment.clientName} - Click para ver detalles`}
                      >
                        <div className="flex items-center space-x-1">
                          <FiClock className="h-3 w-3" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FiUser className="h-3 w-3" />
                          <span className="truncate">{appointment.clientName}</span>
                        </div>
                        
                        {/* Quick Actions para admin */}
                        {(user?.role === 'super_admin' || user?.role === 'branch_admin') && (
                          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-80 rounded hidden group-hover:flex items-center justify-center space-x-1 z-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAppointmentClick(appointment);
                              }}
                              className="p-1 bg-primary-500 text-white rounded hover:bg-primary-600"
                              title="Ver detalles"
                            >
                              <FiEye className="h-3 w-3" />
                            </button>
                            {appointment.status === 'pending' && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusUpdate(appointment.id, 'confirmed');
                                  }}
                                  className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                                  title="Confirmar"
                                >
                                  <FiCheckCircle className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusUpdate(appointment.id, 'cancelled');
                                  }}
                                  className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                                  title="Cancelar"
                                >
                                  <FiX className="h-3 w-3" />
                                </button>
                              </>
                            )}
                            {appointment.status === 'confirmed' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusUpdate(appointment.id, 'completed');
                                }}
                                className="p-1 bg-purple-500 text-white rounded hover:bg-purple-600"
                                title="Completar"
                              >
                                <FiCheckCircle className="h-3 w-3" />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAppointment(appointment.id);
                              }}
                              className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                              title="Eliminar"
                            >
                              <FiTrash2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    {dayAppointments.length > 2 && (
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDayClick(date);
                        }}
                        className="text-xs text-center text-primary-600 dark:text-primary-400 cursor-pointer hover:underline py-1"
                      >
                        Ver todas ({dayAppointments.length})
                      </div>
                    )}
                    {dayAppointments.length === 0 && (
                      <div className="text-xs text-center text-gray-500 dark:text-gray-600 py-2">
                        Sin citas
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-200 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Pendiente</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-200 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Confirmada</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-200 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">En Proceso</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-200 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Completada</span>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {showAppointmentModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center" style={{zIndex: 9999}}>
          <div className="bg-white dark:bg-gray-950 rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Detalles de la Cita
              </h3>
              <button
                onClick={() => {
                  setShowAppointmentModal(false);
                  setSelectedAppointment(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Cliente */}
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                  <FiUser className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {selectedAppointment.clientName}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Cliente
                  </div>
                </div>
              </div>

              {/* Barbero */}
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <FiUser className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {selectedAppointment.barberName}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Barbero
                  </div>
                </div>
              </div>

              {/* Fecha y Hora */}
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <FiClock className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {new Date(selectedAppointment.date).toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedAppointment.time}
                  </div>
                </div>
              </div>

              {/* Estado */}
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <span className={`px-2 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedAppointment.status)}`}>
                    {getStatusText(selectedAppointment.status)}
                  </span>
                </div>
              </div>

              {/* Servicios y Precio */}
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="font-medium text-gray-900 dark:text-white mb-2">
                  Servicios
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedAppointment.services?.map(s => `Servicio ${s}`).join(', ') || 'Corte'}
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium">Total:</span>
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    S/{selectedAppointment.totalPrice?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Notas */}
              {selectedAppointment.notes && (
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="font-medium text-gray-900 dark:text-white mb-1">
                    Notas
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedAppointment.notes}
                  </div>
                </div>
              )}
            </div>

            {/* Acciones */}
            {(user?.role === 'super_admin' || user?.role === 'branch_admin') && (
              <div className="mt-6 flex space-x-3">
                {selectedAppointment.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedAppointment.id, 'confirmed');
                        setShowAppointmentModal(false);
                        setSelectedAppointment(null);
                      }}
                      className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedAppointment.id, 'cancelled');
                        setShowAppointmentModal(false);
                        setSelectedAppointment(null);
                      }}
                      className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Cancelar
                    </button>
                  </>
                )}
                {selectedAppointment.status === 'confirmed' && (
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedAppointment.id, 'completed');
                      setShowAppointmentModal(false);
                      setSelectedAppointment(null);
                    }}
                    className="flex-1 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Marcar Completada
                  </button>
                )}
                <button
                  onClick={() => {
                    handleDeleteAppointment(selectedAppointment.id);
                    setShowAppointmentModal(false);
                    setSelectedAppointment(null);
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => {
                    setShowAppointmentModal(false);
                    setSelectedAppointment(null);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      </div>

      {/* Day View Modal */}
      {showDayView && selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{zIndex: 1000}}>
          <div className="bg-white dark:bg-gray-950 rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Programación del {selectedDay.toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {getAppointmentsForDay(selectedDay).length} citas programadas
                </p>
              </div>
              <button
                onClick={() => {
                  setShowDayView(false);
                  setSelectedDay(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
              {getAppointmentsForDay(selectedDay).length > 0 ? (
                <div className="space-y-4">
                  {getAppointmentsForDay(selectedDay)
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleAppointmentClick(appointment)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                            <FiUser className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {appointment.clientName}
                              </h4>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                                {getStatusText(appointment.status)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center space-x-1">
                                <FiClock className="h-4 w-4" />
                                <span>{appointment.time}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <FiUser className="h-4 w-4" />
                                <span>{appointment.barberName}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <FiScissors className="h-4 w-4" />
                                <span>{appointment.services?.map(s => `Servicio ${s}`).join(', ') || 'Corte'}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className="font-medium">S/{appointment.totalPrice?.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Quick Actions */}
                        {(user?.role === 'super_admin' || user?.role === 'branch_admin') && (
                          <div className="flex space-x-2">
                            {appointment.status === 'pending' && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusUpdate(appointment.id, 'confirmed');
                                  }}
                                  className="text-xs px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                >
                                  Confirmar
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusUpdate(appointment.id, 'cancelled');
                                  }}
                                  className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                >
                                  Cancelar
                                </button>
                              </>
                            )}
                            {appointment.status === 'confirmed' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusUpdate(appointment.id, 'completed');
                                }}
                                className="text-xs px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                              >
                                Completar
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {appointment.notes && (
                        <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-900 rounded text-sm text-gray-600 dark:text-gray-400">
                          <strong>Notas:</strong> {appointment.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FiCalendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No hay citas programadas
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    No se encontraron citas para este día con los filtros aplicados
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentCalendar;