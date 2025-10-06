import { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiUser, FiCheck, FiCamera, FiX, FiStar, FiList, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useAppointmentStore, useAuthStore } from '../stores';
import { MetricCard } from '../components/common';
import Swal from 'sweetalert2';

const BarberAppointments = () => {
  const { appointments, updateAppointment, getAppointmentsByBarber } = useAppointmentStore();
  const { user } = useAuthStore();
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'monthly', 'weekly'
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Obtener citas del barbero actual
  const barberAppointments = getAppointmentsByBarber(user?.id);
  
  // Filtrar citas por fecha seleccionada
  const todayAppointments = barberAppointments.filter(apt => apt.date === selectedDate);
  
  // Estadísticas
  const stats = {
    today: todayAppointments.length,
    pending: todayAppointments.filter(apt => apt.status === 'pending').length,
    confirmed: todayAppointments.filter(apt => apt.status === 'confirmed').length,
    completed: todayAppointments.filter(apt => apt.status === 'completed').length
  };

  const handleMarkAttendance = async (appointmentId, attended) => {
    const newStatus = attended ? 'confirmed' : 'cancelled';
    await updateAppointment(appointmentId, { 
      status: newStatus,
      attendanceMarked: true,
      attendanceTime: new Date().toISOString()
    });
    
    Swal.fire({
      icon: attended ? 'success' : 'info',
      title: attended ? 'Cliente Confirmado' : 'Cliente No Asistió',
      text: attended ? 'El cliente ha sido marcado como presente' : 'Se ha registrado la inasistencia del cliente',
      confirmButtonColor: '#ffc000'
    });
  };

  const handleStartService = async (appointmentId) => {
    await updateAppointment(appointmentId, { 
      status: 'in_progress',
      serviceStartTime: new Date().toISOString()
    });
    
    Swal.fire({
      icon: 'success',
      title: 'Servicio Iniciado',
      text: 'El servicio ha comenzado',
      confirmButtonColor: '#ffc000'
    });
  };

  const handleCompleteService = async (appointmentId) => {
    const result = await Swal.fire({
      title: '¿Completar Servicio?',
      text: '¿Deseas tomar fotos del antes y después?',
      icon: 'question',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Sí, tomar fotos',
      denyButtonText: 'Completar sin fotos',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#10b981',
      denyButtonColor: '#6b7280',
      cancelButtonColor: '#ef4444'
    });

    if (result.isConfirmed) {
      setSelectedAppointment(appointmentId);
      setShowPhotoModal(true);
    } else if (result.isDenied) {
      await updateAppointment(appointmentId, { 
        status: 'completed',
        serviceEndTime: new Date().toISOString()
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Servicio Completado',
        text: 'El servicio se ha marcado como completado',
        confirmButtonColor: '#ffc000'
      });
    }
  };

  const handleTakePhotos = async () => {
    // Simular captura de fotos
    await updateAppointment(selectedAppointment, { 
      status: 'completed',
      serviceEndTime: new Date().toISOString(),
      hasPhotos: true,
      beforePhoto: '/photos/before_' + selectedAppointment + '.jpg',
      afterPhoto: '/photos/after_' + selectedAppointment + '.jpg'
    });
    
    setShowPhotoModal(false);
    setSelectedAppointment(null);
    
    Swal.fire({
      icon: 'success',
      title: 'Fotos Guardadas',
      text: 'Las fotos del antes y después han sido guardadas exitosamente',
      confirmButtonColor: '#ffc000'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      in_progress: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      completed: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[status] || colors.pending;
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pendiente',
      confirmed: 'Cliente Presente',
      in_progress: 'En Proceso',
      completed: 'Completada',
      cancelled: 'No Asistió'
    };
    return texts[status] || status;
  };

  const getTimeSlot = (time) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour < 12) return 'Mañana';
    if (hour < 17) return 'Tarde';
    return 'Noche';
  };

  // Funciones para calendario mensual
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getAppointmentsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return barberAppointments.filter(apt => apt.date === dateStr);
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentCalendarDate);
    const firstDay = getFirstDayOfMonth(currentCalendarDate);
    const days = [];

    // Días vacíos del mes anterior
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), day);
      const appointments = getAppointmentsForDate(date);
      days.push({ date, appointments });
    }

    return days;
  };

  // Funciones para calendario semanal
  const getWeekDays = () => {
    const startOfWeek = new Date(currentCalendarDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const appointments = getAppointmentsForDate(date);
      weekDays.push({ date, appointments });
    }

    return weekDays;
  };

  const navigateCalendar = (direction) => {
    const newDate = new Date(currentCalendarDate);
    if (viewMode === 'monthly') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (viewMode === 'weekly') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    }
    setCurrentCalendarDate(newDate);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mis Citas</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestiona tu agenda y marca la asistencia de clientes</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Toggle de vista */}
          <div className="flex items-center bg-gray-100 dark:bg-dark-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-dark-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <FiList className="h-4 w-4 mr-1" />
              Lista
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'weekly'
                  ? 'bg-white dark:bg-dark-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <FiCalendar className="h-4 w-4 mr-1" />
              Semanal
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'monthly'
                  ? 'bg-white dark:bg-dark-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <FiCalendar className="h-4 w-4 mr-1" />
              Mensual
            </button>
          </div>
          
          {viewMode === 'list' && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            />
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Citas Hoy"
          value={stats.today}
          icon={FiCalendar}
          color="bg-blue-500"
        />
        <MetricCard
          title="Pendientes"
          value={stats.pending}
          icon={FiClock}
          color="bg-yellow-500"
        />
        <MetricCard
          title="Confirmadas"
          value={stats.confirmed}
          icon={FiCheck}
          color="bg-green-500"
        />
        <MetricCard
          title="Completadas"
          value={stats.completed}
          icon={FiStar}
          color="bg-purple-500"
        />
      </div>

      {/* Vista Calendario Mensual */}
      {viewMode === 'monthly' && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Calendario Mensual
            </h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateCalendar(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-600 dark:text-gray-400"
              >
                <FiChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-lg font-medium text-gray-900 dark:text-white min-w-[200px] text-center">
                {currentCalendarDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={() => navigateCalendar(1)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-600 dark:text-gray-400"
              >
                <FiChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                {day}
              </div>
            ))}
            
            {generateCalendarDays().map((dayData, index) => (
              <div
                key={index}
                className={`min-h-[100px] p-2 border border-gray-200 dark:border-dark-600 ${
                  dayData ? 'bg-white dark:bg-dark-800' : 'bg-gray-50 dark:bg-dark-700'
                }`}
              >
                {dayData && (
                  <>
                    <div className={`text-sm font-medium mb-1 ${
                      dayData.date.toDateString() === new Date().toDateString()
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {dayData.date.getDate()}
                    </div>
                    
                    <div className="space-y-1">
                      {dayData.appointments.slice(0, 2).map((appointment) => (
                        <div
                          key={appointment.id}
                          className={`text-xs p-1 rounded text-white truncate ${
                            appointment.status === 'confirmed' ? 'bg-blue-500' :
                            appointment.status === 'pending' ? 'bg-yellow-500' :
                            appointment.status === 'in_progress' ? 'bg-green-500' :
                            appointment.status === 'completed' ? 'bg-purple-500' :
                            'bg-red-500'
                          }`}
                          title={`${appointment.time} - ${appointment.clientName}`}
                        >
                          {appointment.time}
                        </div>
                      ))}
                      {dayData.appointments.length > 2 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          +{dayData.appointments.length - 2}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vista Calendario Semanal */}
      {viewMode === 'weekly' && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Calendario Semanal
            </h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateCalendar(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-600 dark:text-gray-400"
              >
                <FiChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-lg font-medium text-gray-900 dark:text-white">
                Semana del {getWeekDays()[0]?.date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - {getWeekDays()[6]?.date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <button
                onClick={() => navigateCalendar(1)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-600 dark:text-gray-400"
              >
                <FiChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {getWeekDays().map((dayData, index) => (
              <div key={index} className="border border-gray-200 dark:border-dark-600 rounded-lg overflow-hidden">
                <div className={`p-3 text-center border-b border-gray-200 dark:border-dark-600 ${
                  dayData.date.toDateString() === new Date().toDateString()
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'bg-gray-50 dark:bg-dark-700'
                }`}>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {dayData.date.toLocaleDateString('es-ES', { weekday: 'short' })}
                  </div>
                  <div className="text-lg font-bold">
                    {dayData.date.getDate()}
                  </div>
                </div>
                
                <div className="p-2 min-h-[200px] space-y-1">
                  {dayData.appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className={`text-xs p-2 rounded text-white cursor-pointer ${
                        appointment.status === 'confirmed' ? 'bg-blue-500' :
                        appointment.status === 'pending' ? 'bg-yellow-500' :
                        appointment.status === 'in_progress' ? 'bg-green-500' :
                        appointment.status === 'completed' ? 'bg-purple-500' :
                        'bg-red-500'
                      }`}
                      title={`${appointment.clientName} - ${appointment.time}`}
                    >
                      <div className="font-medium">{appointment.time}</div>
                      <div className="truncate">{appointment.clientName}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vista Lista */}
      {viewMode === 'list' && (
        <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Citas para {new Date(selectedDate).toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {todayAppointments.length} citas programadas
          </span>
        </div>

        {todayAppointments.length > 0 ? (
          <div className="space-y-4">
            {todayAppointments
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((appointment) => (
                <div key={appointment.id} className="border border-gray-200 dark:border-dark-600 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                        <FiUser className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {appointment.clientName}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                            {getStatusText(appointment.status)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <FiClock className="h-4 w-4" />
                            <span>{appointment.time} • {getTimeSlot(appointment.time)}</span>
                          </div>
                          <span>•</span>
                          <span>{appointment.duration || 30} min</span>
                          <span>•</span>
                          <span>S/{appointment.totalPrice?.toLocaleString()}</span>
                        </div>
                        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Servicios: {appointment.services?.map(s => `Servicio ${s}`).join(', ') || 'Corte'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Acciones según el estado */}
                    <div className="flex flex-col space-y-2">
                      {appointment.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleMarkAttendance(appointment.id, true)}
                            className="flex items-center px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                          >
                            <FiCheck className="h-4 w-4 mr-1" />
                            Presente
                          </button>
                          <button
                            onClick={() => handleMarkAttendance(appointment.id, false)}
                            className="flex items-center px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <FiX className="h-4 w-4 mr-1" />
                            No Asistió
                          </button>
                        </div>
                      )}
                      
                      {appointment.status === 'confirmed' && (
                        <button
                          onClick={() => handleStartService(appointment.id)}
                          className="flex items-center px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <FiClock className="h-4 w-4 mr-1" />
                          Iniciar Servicio
                        </button>
                      )}
                      
                      {appointment.status === 'in_progress' && (
                        <button
                          onClick={() => handleCompleteService(appointment.id)}
                          className="flex items-center px-3 py-1 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors"
                        >
                          <FiCamera className="h-4 w-4 mr-1" />
                          Completar
                        </button>
                      )}
                      
                      {appointment.status === 'completed' && appointment.hasPhotos && (
                        <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                          <FiCamera className="h-4 w-4 mr-1" />
                          Con fotos
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {appointment.notes && (
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Notas:</strong> {appointment.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FiCalendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hay citas para esta fecha
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Selecciona otra fecha para ver las citas programadas
            </p>
          </div>
        )}
        </div>
      )}

      {/* Modal para tomar fotos */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Capturar Fotos
              </h3>
              <button
                onClick={() => setShowPhotoModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Toma fotos del antes y después para el portafolio
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg p-8 text-center">
                  <FiCamera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Foto Antes</span>
                  <button className="mt-2 w-full btn-secondary text-xs">
                    Capturar
                  </button>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg p-8 text-center">
                  <FiCamera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Foto Después</span>
                  <button className="mt-2 w-full btn-secondary text-xs">
                    Capturar
                  </button>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleTakePhotos}
                  className="flex-1 btn-primary"
                >
                  Guardar y Completar
                </button>
                <button
                  onClick={() => setShowPhotoModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para tomar fotos */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Capturar Fotos
              </h3>
              <button
                onClick={() => setShowPhotoModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Toma fotos del antes y después para el portafolio
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg p-8 text-center">
                  <FiCamera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Foto Antes</span>
                  <button className="mt-2 w-full btn-secondary text-xs">
                    Capturar
                  </button>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg p-8 text-center">
                  <FiCamera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Foto Después</span>
                  <button className="mt-2 w-full btn-secondary text-xs">
                    Capturar
                  </button>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleTakePhotos}
                  className="flex-1 btn-primary"
                >
                  Guardar y Completar
                </button>
                <button
                  onClick={() => setShowPhotoModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarberAppointments;