import { useAppointmentStore, useAuthStore, useBranchStore } from '../../stores';
import { useCalendarNavigation } from '../../hooks/calendar/useCalendarNavigation';
import { useCalendarFilters } from '../../hooks/calendar/useCalendarFilters';
import { useAppointmentActions } from '../../hooks/calendar/useAppointmentActions';
import { useDayView } from '../../hooks/calendar/useDayView';
import {
  CalendarHeader,
  CalendarGrid,
  CalendarLegend,
  CalendarFilters,
  AppointmentDetailModal,
  DayViewModal
} from './Calendar';

/**
 * Calendario de citas refactorizado
 * Reducido de 811 líneas a ~100 líneas
 */
const AppointmentCalendar = () => {
  const { getAppointmentsByDate, services } = useAppointmentStore();
  const { user } = useAuthStore();
  const { branches } = useBranchStore();

  // Hooks custom
  const { currentDate, days, navigateMonth } = useCalendarNavigation();

  const {
    filters,
    showFilters,
    activeFiltersCount,
    filteredBarbers,
    updateFilter,
    clearFilters,
    toggleFilters,
    applyFilters
  } = useCalendarFilters();

  const {
    selectedAppointment,
    showAppointmentModal,
    handleAppointmentClick,
    closeAppointmentModal,
    handleStatusUpdate,
    handleDeleteAppointment
  } = useAppointmentActions();

  const {
    selectedDay,
    showDayView,
    handleDayClick,
    closeDayView
  } = useDayView();

  // Obtener citas del día con filtros aplicados
  const getAppointmentsForDay = (date) => {
    if (!date) return [];
    const dayAppointments = getAppointmentsByDate(date);
    return applyFilters(dayAppointments);
  };

  return (
    <>
      {/* Filtros */}
      <CalendarFilters
        filters={filters}
        showFilters={showFilters}
        activeFiltersCount={activeFiltersCount}
        branches={branches || []}
        filteredBarbers={filteredBarbers}
        services={services}
        onToggleFilters={toggleFilters}
        onClearFilters={clearFilters}
        onUpdateFilter={updateFilter}
      />

      {/* Calendario */}
      <div className="card">
        <CalendarHeader
          currentDate={currentDate}
          onNavigateMonth={navigateMonth}
        />

        <CalendarGrid
          days={days}
          getAppointmentsForDay={getAppointmentsForDay}
          userRole={user?.role}
          onDayClick={handleDayClick}
          onAppointmentClick={handleAppointmentClick}
          onStatusUpdate={handleStatusUpdate}
          onDeleteAppointment={handleDeleteAppointment}
        />

        <CalendarLegend />
      </div>

      {/* Modal de detalles de cita */}
      {showAppointmentModal && selectedAppointment && (
        <AppointmentDetailModal
          appointment={selectedAppointment}
          userRole={user?.role}
          onClose={closeAppointmentModal}
          onStatusUpdate={handleStatusUpdate}
          onDeleteAppointment={handleDeleteAppointment}
        />
      )}

      {/* Modal de vista de día */}
      {showDayView && selectedDay && (
        <DayViewModal
          selectedDay={selectedDay}
          appointments={getAppointmentsForDay(selectedDay)}
          userRole={user?.role}
          onClose={closeDayView}
          onAppointmentClick={handleAppointmentClick}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </>
  );
};

export default AppointmentCalendar;
