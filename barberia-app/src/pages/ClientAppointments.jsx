import { useClientAppointments } from '../hooks/useClientAppointments';
import { CLIENT_VIEW_MODES } from '../constants/clientAppointments';

import ClientAppointmentHeader from '../components/clients/ClientAppointmentHeader';
import ClientAppointmentMetrics from '../components/clients/ClientAppointmentMetrics';
import ClientCalendarView from '../components/clients/ClientCalendarView';
import UpcomingAppointments from '../components/clients/UpcomingAppointments';
import AppointmentHistory from '../components/clients/AppointmentHistory';
import AppointmentDetailsModal from '../components/clients/AppointmentDetailsModal';
import ClientAppointmentForm from '../components/clients/ClientAppointmentForm';

const ClientAppointments = () => {
  const {
    // Estado
    showForm,
    viewMode,
    currentDate,
    selectedAppointment,
    showAppointmentModal,
    selectedDateForBooking,
    currentClient,
    upcomingAppointments,
    pastAppointments,
    metrics,
    calendarDays,

    // Acciones
    setViewMode,
    navigateMonth,
    handleCancelAppointment,
    handleDayClick,
    handleAppointmentClick,
    handleFormSuccess,
    handleFormClose,
    handleModalClose,
    openNewAppointmentForm
  } = useClientAppointments();

  const renderCurrentView = () => {
    switch (viewMode) {
      case CLIENT_VIEW_MODES.CALENDAR:
        return (
          <ClientCalendarView
            currentDate={currentDate}
            calendarDays={calendarDays}
            onNavigateMonth={navigateMonth}
            onDayClick={handleDayClick}
            onAppointmentClick={handleAppointmentClick}
          />
        );
      case CLIENT_VIEW_MODES.LIST:
      default:
        return (
          <>
            <UpcomingAppointments
              appointments={upcomingAppointments}
              onCancelAppointment={handleCancelAppointment}
              onNewAppointment={openNewAppointmentForm}
            />
            <AppointmentHistory appointments={pastAppointments} />
          </>
        );
    }
  };

  return (
    <div className="space-y-6">
      <ClientAppointmentHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNewAppointment={openNewAppointmentForm}
      />

      <ClientAppointmentMetrics metrics={metrics} />

      {renderCurrentView()}

      {/* Modales */}
      {showForm && (
        <ClientAppointmentForm
          client={currentClient}
          selectedDate={selectedDateForBooking}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {showAppointmentModal && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={handleModalClose}
          onCancelAppointment={handleCancelAppointment}
        />
      )}
    </div>
  );
};

export default ClientAppointments;