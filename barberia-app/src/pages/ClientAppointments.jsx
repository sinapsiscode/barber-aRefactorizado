import { FiPlus } from 'react-icons/fi';
import { useClientAppointments } from '../hooks/clients/useClientAppointments';
import ClientAppointmentForm from '../components/clients/ClientAppointmentForm';
import { filterCompletedAppointments } from '../utils/clients/appointmentFilters';
import {
  AppointmentStats,
  ViewToggle,
  CalendarView,
  ListView,
  AppointmentDetailsModal
} from '../components/clients/ClientAppointments';

/**
 * Página principal de citas del cliente
 * REFACTORIZADA - Archivo original: 657 líneas → Nuevo: ~95 líneas
 * Toda la lógica movida a useClientAppointments hook
 */
const ClientAppointments = () => {
  const {
    // Data
    currentClient,
    clientAppointments,
    upcomingAppointments,
    pastAppointments,

    // UI States
    showForm,
    viewMode,
    setViewMode,
    currentDate,
    selectedAppointment,
    showAppointmentModal,
    selectedDateForBooking,

    // Calendar
    calendarDays,

    // Handlers
    handleCancelAppointment,
    handleDayClick,
    handleAppointmentClick,
    handleNavigateMonth,
    handleCloseForm,
    handleFormSuccess,
    handleCloseAppointmentModal,
    setShowForm
  } = useClientAppointments();

  const completedCount = filterCompletedAppointments(pastAppointments).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mis Citas</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestiona tus reservas y historial</p>
        </div>
        <div className="flex items-center space-x-3">
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <FiPlus className="h-4 w-4 mr-2" />
            Nueva Reserva
          </button>
        </div>
      </div>

      {/* Stats */}
      <AppointmentStats
        upcoming={upcomingAppointments.length}
        completed={completedCount}
        total={clientAppointments.length}
      />

      {/* Views */}
      {viewMode === 'calendar' ? (
        <CalendarView
          currentDate={currentDate}
          calendarDays={calendarDays}
          onNavigateMonth={handleNavigateMonth}
          onDayClick={handleDayClick}
          onAppointmentClick={handleAppointmentClick}
        />
      ) : (
        <ListView
          upcomingAppointments={upcomingAppointments}
          pastAppointments={pastAppointments}
          onCancelAppointment={handleCancelAppointment}
          onOpenForm={() => setShowForm(true)}
        />
      )}

      {/* Modals */}
      {showForm && (
        <ClientAppointmentForm
          client={currentClient}
          selectedDate={selectedDateForBooking}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}

      {showAppointmentModal && selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={handleCloseAppointmentModal}
          onCancel={handleCancelAppointment}
        />
      )}
    </div>
  );
};

export default ClientAppointments;
