import { useBarberAppointments } from '../hooks/useBarberAppointments';
import { VIEW_MODES } from '../constants/barberAppointments';

import AppointmentHeader from '../components/appointments/AppointmentHeader';
import AppointmentMetrics from '../components/appointments/AppointmentMetrics';
import ListView from '../components/appointments/views/ListView';
import WeeklyView from '../components/appointments/views/WeeklyView';
import MonthlyView from '../components/appointments/views/MonthlyView';
import PhotoCaptureModal from '../components/appointments/PhotoCaptureModal';

const BarberAppointments = () => {
  const {
    // Estado
    currentDate,
    viewMode,
    showPhotoModal,
    todayAppointments,
    appointments,
    metrics,
    // Acciones
    setCurrentDate,
    setViewMode,
    navigateDate,
    handleMarkAttendance,
    handleStartService,
    handleCompleteService,
    handleSavePhotos,
    handleClosePhotoModal
  } = useBarberAppointments();

  const renderCurrentView = () => {
    const viewProps = {
      currentDate,
      appointments,
      onDateSelect: setCurrentDate
    };

    const listViewProps = {
      currentDate,
      appointments: todayAppointments,
      onMarkAttendance: handleMarkAttendance,
      onStartService: handleStartService,
      onCompleteService: handleCompleteService
    };

    switch (viewMode) {
      case VIEW_MODES.WEEKLY:
        return <WeeklyView {...viewProps} />;
      case VIEW_MODES.MONTHLY:
        return <MonthlyView {...viewProps} />;
      case VIEW_MODES.LIST:
      default:
        return <ListView {...listViewProps} />;
    }
  };

  return (
    <div className="space-y-6">
      <AppointmentHeader
        currentDate={currentDate}
        viewMode={viewMode}
        onNavigate={navigateDate}
        onViewModeChange={setViewMode}
        onDateChange={setCurrentDate}
      />

      <AppointmentMetrics metrics={metrics} />

      {renderCurrentView()}

      {showPhotoModal && (
        <PhotoCaptureModal
          onSave={handleSavePhotos}
          onClose={handleClosePhotoModal}
        />
      )}
    </div>
  );
};

export default BarberAppointments;