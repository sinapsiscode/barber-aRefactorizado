import { useReceptionCalendar } from '../hooks/useReceptionCalendar';
import CalendarHeader from '../components/calendar/CalendarHeader';
import CalendarFilters from '../components/calendar/CalendarFilters';
import CalendarGrid from '../components/calendar/CalendarGrid';

const ReceptionCalendar = () => {
  const {
    // Estado
    currentDate,
    selectedFilters,
    showFilters,
    searchTerm,

    // Datos
    availableBarbers,
    services,
    calendarDays,
    activeFiltersCount,

    // Handlers
    handleNavigateMonth,
    handleFilterChange,
    handleSearchChange,
    handleClearSearch,
    handleToggleFilters,
    handleClearFilters,
    handleStatusUpdate,
    handleMarkAttendance
  } = useReceptionCalendar();

  return (
    <div className="space-y-6">
      <CalendarHeader
        showFilters={showFilters}
        activeFiltersCount={activeFiltersCount}
        onToggleFilters={handleToggleFilters}
      />

      <CalendarFilters
        showFilters={showFilters}
        selectedFilters={selectedFilters}
        searchTerm={searchTerm}
        availableBarbers={availableBarbers}
        services={services}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
        onClearFilters={handleClearFilters}
      />

      <CalendarGrid
        currentDate={currentDate}
        calendarDays={calendarDays}
        onNavigateMonth={handleNavigateMonth}
        onStatusUpdate={handleStatusUpdate}
        onMarkAttendance={handleMarkAttendance}
      />
    </div>
  );
};

export default ReceptionCalendar;