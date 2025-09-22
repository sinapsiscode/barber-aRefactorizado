import { FiPlus, FiCalendar } from 'react-icons/fi';
import { useStaff } from '../hooks/useStaff';
import StaffMetrics from '../components/staff/StaffMetrics';
import CommissionDetails from '../components/staff/CommissionDetails';
import ServicesDetails from '../components/staff/ServicesDetails';
import PerformanceOverview from '../components/staff/PerformanceOverview';
import StaffTable from '../components/staff/StaffTable';
import StaffForm from '../components/staff/StaffForm';
import AttendanceTracker from '../components/staff/AttendanceTracker';
import { STAFF_TEXTS } from '../constants/staffPage';

const Staff = () => {
  const {
    // Estado
    showForm,
    showAttendance,
    selectedBarber,
    showCommissionDetails,
    showServicesDetails,
    expandedServicesBarber,

    // Datos
    user,
    selectedBranch,
    filteredBarbers,
    staffSummary,
    commissionData,

    // Handlers
    handleShowForm,
    handleCloseForm,
    handleShowAttendance,
    handleCloseAttendance,
    handleCheckIn,
    handleCheckOut,
    handleToggleCommissionDetails,
    handleToggleServicesDetails,
    handleExpandServices,

    // Funciones utilitarias
    getBarberServices,
    getServicePercentage,
    getIndividualChange
  } = useStaff();


  return (
    <div className="space-y-6 max-w-none w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {STAFF_TEXTS.MAIN_TITLE}
            {user?.role === 'super_admin' && selectedBranch && (
              <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-2">
                - {selectedBranch.name}
              </span>
            )}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {user?.role === 'super_admin' && selectedBranch
              ? `${STAFF_TEXTS.BRANCH_SUBTITLE} ${selectedBranch.city}`
              : STAFF_TEXTS.MAIN_SUBTITLE
            }
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleShowAttendance}
            className="btn-secondary"
          >
            <FiCalendar className="h-4 w-4 mr-2" />
            {STAFF_TEXTS.ATTENDANCE}
          </button>
          <button
            onClick={handleShowForm}
            className="btn-primary"
          >
            <FiPlus className="h-4 w-4 mr-2" />
            {STAFF_TEXTS.ADD_BARBER}
          </button>
        </div>
      </div>

      {/* Staff Metrics */}
      <StaffMetrics
        staffSummary={staffSummary}
        commissionData={commissionData}
        user={user}
        onToggleCommissions={handleToggleCommissionDetails}
        onToggleServices={handleToggleServicesDetails}
        showCommissionDetails={showCommissionDetails}
        showServicesDetails={showServicesDetails}
      />

      {/* Commission Details */}
      <CommissionDetails
        commissionData={commissionData}
        filteredBarbers={filteredBarbers}
        showCommissionDetails={showCommissionDetails}
        onClose={() => handleToggleCommissionDetails()}
        getIndividualChange={getIndividualChange}
      />

      {/* Services Details */}
      <ServicesDetails
        staffSummary={staffSummary}
        filteredBarbers={filteredBarbers}
        selectedBranch={selectedBranch}
        showServicesDetails={showServicesDetails}
        onClose={() => handleToggleServicesDetails()}
        getServicePercentage={getServicePercentage}
      />

      {/* Performance Overview */}
      <PerformanceOverview filteredBarbers={filteredBarbers} />

      {/* Staff Table */}
      <StaffTable
        filteredBarbers={filteredBarbers}
        expandedServicesBarber={expandedServicesBarber}
        onExpandServices={handleExpandServices}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        getBarberServices={getBarberServices}
      />

      {/* Staff Form Modal */}
      {showForm && (
        <StaffForm
          barber={selectedBarber}
          onClose={handleCloseForm}
          onSuccess={handleCloseForm}
        />
      )}

      {/* Attendance Tracker Modal */}
      {showAttendance && (
        <AttendanceTracker
          onClose={handleCloseAttendance}
        />
      )}
    </div>
  );
};

export default Staff;