import { useState, useEffect } from 'react';
import { FiCalendar, FiPlus, FiClock, FiUser, FiFilter, FiChevronLeft, FiChevronRight, FiSearch, FiX, FiCheckCircle } from 'react-icons/fi';
import { useAppointmentStore, useStaffStore, useFinancialStore } from '../stores';
import Swal from 'sweetalert2';

const ReceptionCalendar = () => {
  const { appointments, updateAppointment, loadMockAppointments } = useAppointmentStore();
  const { barbers, loadMockStaff } = useStaffStore();
  const { addTransaction } = useFinancialStore();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedFilters, setSelectedFilters] = useState({
    barber: '',
    service: '',
    status: '',
    time: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar datos mock si no hay barberos o citas
  useEffect(() => {
    if (!barbers || barbers.length === 0) {
      loadMockStaff();
    }
    if (!appointments || appointments.length === 0) {
      loadMockAppointments();
    }
  }, [barbers, appointments, loadMockStaff, loadMockAppointments]);

  // Servicios disponibles
  const services = [
    { id: 1, name: 'Corte Clásico', duration: 30, price: 25 },
    { id: 2, name: 'Corte + Barba', duration: 45, price: 35 },
    { id: 3, name: 'Barba', duration: 20, price: 15 },
    { id: 4, name: 'Corte Premium', duration: 60, price: 50 },
    { id: 5, name: 'Diseño de Barba', duration: 40, price: 40 }
  ];

  // Los barberos están directamente disponibles desde el store
  const availableBarbers = barbers || [];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getAppointmentsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    let filteredAppointments = appointments.filter(apt => apt.date === dateStr);

    // Aplicar filtros
    if (selectedFilters.barber) {
      filteredAppointments = filteredAppointments.filter(apt => 
        apt.barberId?.toString() === selectedFilters.barber
      );
    }

    if (selectedFilters.service) {
      filteredAppointments = filteredAppointments.filter(apt =>
        apt.services?.includes(parseInt(selectedFilters.service))
      );
    }

    if (selectedFilters.status) {
      filteredAppointments = filteredAppointments.filter(apt => 
        apt.status === selectedFilters.status
      );
    }

    if (selectedFilters.time) {
      const timeSlot = selectedFilters.time;
      filteredAppointments = filteredAppointments.filter(apt => {
        const hour = parseInt(apt.time.split(':')[0]);
        if (timeSlot === 'morning') return hour >= 9 && hour < 12;
        if (timeSlot === 'afternoon') return hour >= 12 && hour < 17;
        if (timeSlot === 'evening') return hour >= 17 && hour < 20;
        return true;
      });
    }

    // Búsqueda por nombre del cliente
    if (searchTerm) {
      filteredAppointments = filteredAppointments.filter(apt =>
        apt.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredAppointments;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Días vacíos del mes anterior
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const appointments = getAppointmentsForDate(date);
      days.push({ date, appointments });
    }

    return days;
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    await updateAppointment(appointmentId, { status: newStatus });
    Swal.fire({
      icon: 'success',
      title: 'Estado Actualizado',
      text: `La cita ha sido ${newStatus === 'confirmed' ? 'confirmada' : 'actualizada'} exitosamente`,
      confirmButtonColor: '#ffc000'
    });
  };

  const handleMarkAttendance = async (appointment) => {
    try {
      // Cambiar estado de la cita a "En proceso"
      await updateAppointment(appointment.id, { status: 'in_progress' });

      // Calcular precio total de los servicios
      const totalPrice = appointment.services?.reduce((total, serviceId) => {
        const service = services.find(s => s.id === serviceId);
        return total + (service?.price || 0);
      }, 0) || appointment.totalPrice || 0;

      // Registrar pago automáticamente en finanzas
      const transactionData = {
        type: 'income',
        amount: totalPrice,
        category: 'services',
        description: `Pago por servicios - ${appointment.clientName}`,
        paymentMethod: 'cash', // Método por defecto, se puede cambiar después
        date: new Date().toISOString().split('T')[0],
        branchId: appointment.branchId || 1,
        barberId: appointment.barberId,
        clientId: appointment.clientId,
        appointmentId: appointment.id
      };

      await addTransaction(transactionData);

      Swal.fire({
        icon: 'success',
        title: 'Asistencia Registrada',
        text: `El cliente ${appointment.clientName} ha sido marcado como "En proceso" y el pago ha sido registrado automáticamente.`,
        confirmButtonColor: '#ffc000'
      });

    } catch (error) {
      console.error('Error al marcar asistencia:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al registrar la asistencia. Por favor intenta nuevamente.',
        confirmButtonColor: '#ffc000'
      });
    }
  };

  const clearFilters = () => {
    setSelectedFilters({
      barber: '',
      service: '',
      status: '',
      time: ''
    });
    setSearchTerm('');
  };

  const getActiveFiltersCount = () => {
    return Object.values(selectedFilters).filter(value => value !== '').length + (searchTerm ? 1 : 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Calendario - Recepción</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestiona las citas y horarios de todos los barberos</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors relative ${
              showFilters 
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-dark-700 dark:text-gray-300 dark:hover:bg-dark-600'
            }`}
          >
            <FiFilter className="h-4 w-4 mr-2" />
            Filtros
            {getActiveFiltersCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getActiveFiltersCount()}
              </span>
            )}
          </button>
          <button className="btn-primary">
            <FiPlus className="h-4 w-4 mr-2" />
            Nueva Cita
          </button>
        </div>
      </div>

      {/* Panel de Filtros */}
      {showFilters && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filtros</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Limpiar filtros
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Búsqueda por cliente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Buscar Cliente
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nombre del cliente..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Filtro por barbero */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Barbero
              </label>
              <select
                value={selectedFilters.barber}
                onChange={(e) => setSelectedFilters({...selectedFilters, barber: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              >
                <option value="">Todos los barberos</option>
                {availableBarbers.map(barber => (
                  <option key={barber.id} value={barber.id}>
                    {barber.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por servicio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Servicio
              </label>
              <select
                value={selectedFilters.service}
                onChange={(e) => setSelectedFilters({...selectedFilters, service: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              >
                <option value="">Todos los servicios</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estado
              </label>
              <select
                value={selectedFilters.status}
                onChange={(e) => setSelectedFilters({...selectedFilters, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              >
                <option value="">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="confirmed">Confirmada</option>
                <option value="in_progress">En Proceso</option>
                <option value="completed">Completada</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>

            {/* Filtro por horario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Horario
              </label>
              <select
                value={selectedFilters.time}
                onChange={(e) => setSelectedFilters({...selectedFilters, time: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              >
                <option value="">Todo el día</option>
                <option value="morning">Mañana (9:00 - 12:00)</option>
                <option value="afternoon">Tarde (12:00 - 17:00)</option>
                <option value="evening">Noche (17:00 - 20:00)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Calendario */}
      <div className="card">
        {/* Header del Calendario */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Calendario de Citas
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-600 dark:text-gray-400"
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-lg font-medium text-gray-900 dark:text-white min-w-[200px] text-center">
              {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-600 dark:text-gray-400"
            >
              <FiChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Grid del Calendario */}
        <div className="grid grid-cols-7 gap-1">
          {/* Headers de días */}
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}
          
          {/* Días del calendario */}
          {generateCalendarDays().map((dayData, index) => (
            <div
              key={index}
              className={`min-h-[120px] p-2 border border-gray-200 dark:border-dark-600 ${
                dayData ? 'bg-white dark:bg-dark-800' : 'bg-gray-50 dark:bg-dark-700'
              }`}
            >
              {dayData && (
                <>
                  <div className={`text-sm font-medium mb-2 ${
                    dayData.date.toDateString() === new Date().toDateString()
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {dayData.date.getDate()}
                  </div>
                  
                  {/* Citas del día */}
                  <div className="space-y-1">
                    {dayData.appointments.slice(0, 3).map((appointment) => (
                      <div
                        key={appointment.id}
                        className={`text-xs p-1 rounded cursor-pointer group relative ${
                          appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          appointment.status === 'in_progress' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          appointment.status === 'completed' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                        title={`${appointment.time} - ${appointment.clientName} - ${appointment.barberName}`}
                      >
                        <div className="truncate">
                          {appointment.time} - {appointment.clientName}
                        </div>
                        
                        {/* Quick Actions */}
                        {appointment.status === 'pending' && (
                          <div className="absolute top-0 right-0 hidden group-hover:flex bg-white dark:bg-dark-800 border rounded shadow-lg p-1 space-x-1 z-10">
                            <button
                              onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                              className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              Confirmar
                            </button>
                          </div>
                        )}
                        {appointment.status === 'confirmed' && (
                          <div className="absolute top-0 right-0 hidden group-hover:flex bg-white dark:bg-dark-800 border rounded shadow-lg p-1 space-x-1 z-10">
                            <button
                              onClick={() => handleMarkAttendance(appointment)}
                              className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center space-x-1"
                              title="Marcar asistencia y registrar pago"
                            >
                              <FiCheckCircle className="h-3 w-3" />
                              <span>Presente</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    {dayData.appointments.length > 3 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        +{dayData.appointments.length - 3} más
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Leyenda */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Pendiente</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Confirmada</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">En Proceso</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Completada</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Cancelada</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionCalendar;