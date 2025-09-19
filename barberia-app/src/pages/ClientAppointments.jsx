import { useState, useEffect } from 'react';
import { FiCalendar, FiPlus, FiClock, FiUser, FiMapPin, FiStar, FiList, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import { useAppointmentStore, useAuthStore, useClientStore } from '../stores';
import { MetricCard, EmptyState } from '../components/common';
import ClientAppointmentForm from '../components/clients/ClientAppointmentForm';
import Swal from 'sweetalert2';

const ClientAppointments = () => {
  const { appointments, getAppointmentsByClient, updateAppointment } = useAppointmentStore();
  const { user } = useAuthStore();
  const { clients } = useClientStore();
  
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedDateForBooking, setSelectedDateForBooking] = useState(null);

  // Encontrar el cliente actual
  const currentClient = clients.find(c => c.email === user.email) || {
    id: user.id,
    name: user.name,
    email: user.email,
    preferredBranch: 1
  };

  const clientAppointments = getAppointmentsByClient(currentClient.id);
  
  const upcomingAppointments = clientAppointments.filter(apt => 
    new Date(apt.date) >= new Date() && apt.status !== 'cancelled'
  ).sort((a, b) => new Date(a.date) - new Date(b.date));

  const pastAppointments = clientAppointments.filter(apt => 
    new Date(apt.date) < new Date() || apt.status === 'completed'
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleCancelAppointment = async (appointmentId) => {
    const result = await Swal.fire({
      title: '¿Cancelar Cita?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener'
    });

    if (result.isConfirmed) {
      await updateAppointment(appointmentId, { status: 'cancelled' });
      Swal.fire({
        icon: 'success',
        title: 'Cita Cancelada',
        text: 'Tu cita ha sido cancelada exitosamente',
        confirmButtonColor: '#ffc000'
      });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      pending_payment: 'bg-orange-100 text-orange-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.pending;
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pendiente',
      pending_payment: 'Pago por verificar',
      confirmed: 'Confirmada',
      completed: 'Completada',
      cancelled: 'Cancelada'
    };
    return texts[status] || status;
  };

  // Funciones del calendario
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getAppointmentsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return clientAppointments.filter(apt => apt.date === dateStr);
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

  const handleDayClick = (dayData) => {
    if (dayData) {
      if (dayData.appointments.length > 0) {
        if (dayData.appointments.length === 1) {
          // Solo una cita, mostrar directamente
          setSelectedAppointment(dayData.appointments[0]);
          setShowAppointmentModal(true);
        } else {
          // Multiple citas, cambiar a vista lista filtrada por ese día
          setViewMode('list');
        }
      } else {
        // No hay citas en este día, permitir crear nueva cita
        const clickedDate = dayData.date.toISOString().split('T')[0];
        const today = new Date().toISOString().split('T')[0];
        
        if (clickedDate >= today) {
          setSelectedDateForBooking(clickedDate);
          setShowForm(true);
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Fecha no válida',
            text: 'No puedes agendar citas en fechas pasadas',
            confirmButtonColor: '#ffc000'
          });
        }
      }
    }
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mis Citas</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestiona tus reservas y historial</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Toggle Vista */}
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
              onClick={() => setViewMode('calendar')}
              className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white dark:bg-dark-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <FiCalendar className="h-4 w-4 mr-1" />
              Calendario
            </button>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            <FiPlus className="h-4 w-4 mr-2" />
            Nueva Reserva
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Próximas Citas"
          value={upcomingAppointments.length}
          icon={FiCalendar}
          color="bg-blue-500"
        />
        <MetricCard
          title="Citas Completadas"
          value={pastAppointments.filter(a => a.status === 'completed').length}
          icon={FiUser}
          color="bg-green-500"
        />
        <MetricCard
          title="Total de Citas"
          value={clientAppointments.length}
          icon={FiClock}
          color="bg-purple-500"
        />
      </div>

      {/* Vista Calendario */}
      {viewMode === 'calendar' && (
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

          {/* Calendario Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Headers de días de la semana */}
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                {day}
              </div>
            ))}
            
            {/* Días del calendario */}
            {generateCalendarDays().map((dayData, index) => (
              <div
                key={index}
                onClick={() => handleDayClick(dayData)}
                className={`min-h-[100px] p-2 border border-gray-200 dark:border-dark-600 transition-colors ${
                  dayData ? 'bg-white dark:bg-dark-800 hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer' : 'bg-gray-50 dark:bg-dark-700'
                } ${
                  dayData && dayData.appointments.length === 0 && dayData.date >= new Date(new Date().toISOString().split('T')[0]) 
                    ? 'hover:ring-2 hover:ring-primary-300 dark:hover:ring-primary-600' : ''
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
                    
                    {/* Citas del día */}
                    <div className="space-y-1">
                      {dayData.appointments.slice(0, 2).map((appointment) => (
                        <div
                          key={appointment.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAppointmentClick(appointment);
                          }}
                          className={`text-xs p-1 rounded text-white truncate cursor-pointer hover:opacity-80 transition-opacity ${
                            appointment.status === 'confirmed' ? 'bg-blue-500' :
                            appointment.status === 'pending' ? 'bg-yellow-500' :
                            appointment.status === 'completed' ? 'bg-green-500' :
                            'bg-red-500'
                          }`}
                          title={`${appointment.time} - ${appointment.barberName} - Click para ver detalles`}
                        >
                          {appointment.time}
                        </div>
                      ))}
                      {dayData.appointments.length > 2 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          +{dayData.appointments.length - 2} más
                        </div>
                      )}
                      
                      {/* Indicador para días sin citas */}
                      {dayData.appointments.length === 0 && dayData.date >= new Date(new Date().toISOString().split('T')[0]) && (
                        <div className="text-xs text-center text-gray-400 dark:text-gray-500 py-2 mt-4">
                          + Agregar cita
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
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Confirmada</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Pendiente</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Completada</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Cancelada</span>
            </div>
          </div>
        </div>
      )}

      {/* Vista Lista */}
      {viewMode === 'list' && (
        <>
          {/* Upcoming Appointments */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Próximas Citas
          </h2>
          <FiCalendar className="h-5 w-5 text-gray-400" />
        </div>

        {upcomingAppointments.length > 0 ? (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="border border-gray-200 dark:border-dark-600 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
                      <FiCalendar className="h-8 w-8 text-primary-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {new Date(appointment.date).toLocaleDateString('es-ES', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </h3>
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
                          <FiMapPin className="h-4 w-4" />
                          <span>Sede Principal</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Servicios: {appointment.services?.map(s => `Servicio ${s}`).join(', ') || 'Corte'}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">
                          • {appointment.duration || 30} min • S/{appointment.totalPrice?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    {appointment.status === 'pending' && (
                      <button
                        onClick={() => handleCancelAppointment(appointment.id)}
                        className="text-sm text-red-600 hover:text-red-800 font-medium"
                      >
                        Cancelar
                      </button>
                    )}
                    {appointment.status === 'confirmed' && (
                      <div className="text-sm text-green-600 font-medium">
                        ✓ Confirmada
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
          <EmptyState
            icon={FiCalendar}
            title="No tienes citas programadas"
            description="Reserva tu próxima cita para mantener tu estilo impecable"
            action={
              <button onClick={() => setShowForm(true)} className="btn-primary">
                Reservar Ahora
              </button>
            }
          />
        )}
      </div>

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Historial de Citas
            </h2>
            <span className="text-sm text-gray-500">
              {pastAppointments.length} citas completadas
            </span>
          </div>

          <div className="space-y-3">
            {pastAppointments.slice(0, 5).map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-gray-200 dark:bg-dark-600 rounded-full flex items-center justify-center">
                    <FiCalendar className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {new Date(appointment.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {appointment.barberName} • {appointment.time}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      S/{appointment.totalPrice?.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      +{Math.floor((appointment.totalPrice || 0) / 25)} pts
                    </div>
                  </div>
                  {appointment.status === 'completed' && (
                    <div className="flex items-center space-x-1">
                      <FiStar className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">5.0</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
        </>
      )}

      {/* Appointment Form Modal */}
      {showForm && (
        <ClientAppointmentForm
          client={currentClient}
          selectedDate={selectedDateForBooking}
          onClose={() => {
            setShowForm(false);
            setSelectedDateForBooking(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setSelectedDateForBooking(null);
          }}
        />
      )}

      {/* Appointment Details Modal */}
      {showAppointmentModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 max-w-lg w-full mx-4">
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
              {/* Fecha y Hora */}
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <FiCalendar className="h-5 w-5 text-primary-600 dark:text-primary-400" />
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

              {/* Estado */}
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <FiClock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <span className={`px-2 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedAppointment.status)}`}>
                    {getStatusText(selectedAppointment.status)}
                  </span>
                </div>
              </div>

              {/* Servicios */}
              <div className="flex items-start space-x-3">
                <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <FiStar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white mb-1">
                    Servicios
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedAppointment.services?.map(s => `Servicio ${s}`).join(', ') || 'Corte'}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Duración: {selectedAppointment.duration || 30} min • Precio: S/{selectedAppointment.totalPrice?.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Sede */}
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <FiMapPin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Sede Principal
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Ubicación
                  </div>
                </div>
              </div>

              {/* Notas */}
              {selectedAppointment.notes && (
                <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
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
            <div className="mt-6 flex space-x-3">
              {selectedAppointment.status === 'pending' && new Date(selectedAppointment.date) > new Date() && (
                <button
                  onClick={() => {
                    handleCancelAppointment(selectedAppointment.id);
                    setShowAppointmentModal(false);
                    setSelectedAppointment(null);
                  }}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Cancelar Cita
                </button>
              )}
              <button
                onClick={() => {
                  setShowAppointmentModal(false);
                  setSelectedAppointment(null);
                }}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientAppointments;