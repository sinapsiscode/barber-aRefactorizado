import { FiPlus, FiCalendar } from 'react-icons/fi';
import { useAuthStore, useBranchStore } from '../stores';
import { DataTable } from '../components/common';
import BranchRestrictionNotice from '../components/common/BranchRestrictionNotice';
import StaffForm from '../components/staff/StaffForm';
import AttendanceTracker from '../components/staff/AttendanceTracker';
import BarberReviews from '../components/staff/BarberReviews';
import StaffStats from '../components/staff/StaffStats';
import CommissionPanel from '../components/staff/CommissionPanel';
import ServicesPanel from '../components/staff/ServicesPanel';
import PerformanceOverview from '../components/staff/PerformanceOverview';
import { getTableColumns } from '../components/staff/StaffTable/TableColumns';
import { useStaffManagement } from '../hooks/staff/useStaffManagement';
import useBranchFilter from '../hooks/useBranchFilter';

const Staff = () => {
  const { user } = useAuthStore();
  const { selectedBranch, branches } = useBranchStore();
  const {
    getBranchTitle,
    getBranchDescription
  } = useBranchFilter();

  const {
    // States
    filteredBarbers,
    staffSummary,
    commissionData,
    showForm,
    setShowForm,
    showAttendance,
    setShowAttendance,
    showReviews,
    setShowReviews,
    selectedBarber,
    setSelectedBarber,
    showCommissionDetails,
    setShowCommissionDetails,
    showServicesDetails,
    setShowServicesDetails,
    expandedServicesBarber,
    setExpandedServicesBarber,
    // Handlers
    handleCheckIn,
    handleCheckOut
  } = useStaffManagement();

  // Configurar columnas de la tabla
  const columns = getTableColumns({
    branches,
    expandedServicesBarber,
    setExpandedServicesBarber,
    setSelectedBarber,
    setShowReviews,
    handleCheckIn,
    handleCheckOut
  });

  return (
    <div className="space-y-6 max-w-none w-full">
      <BranchRestrictionNotice />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {getBranchTitle('Gestión de Personal')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {getBranchDescription('Administra barberos, asistencia y productividad')}
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowAttendance(true)}
            className="btn-secondary"
          >
            <FiCalendar className="h-4 w-4 mr-2" />
            Asistencia
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            <FiPlus className="h-4 w-4 mr-2" />
            Agregar Barbero
          </button>
        </div>
      </div>

      {/* Staff Metrics */}
      <StaffStats
        staffSummary={staffSummary}
        commissionData={commissionData}
        userRole={user?.role}
        showCommissionDetails={showCommissionDetails}
        setShowCommissionDetails={setShowCommissionDetails}
        showServicesDetails={showServicesDetails}
        setShowServicesDetails={setShowServicesDetails}
      />

      {/* Commission Panel - Solo para SuperAdmin */}
      <CommissionPanel
        show={showCommissionDetails}
        commissionData={commissionData}
        filteredBarbers={filteredBarbers}
        onClose={() => setShowCommissionDetails(false)}
      />

      {/* Services Panel */}
      <ServicesPanel
        show={showServicesDetails}
        staffSummary={staffSummary}
        filteredBarbers={filteredBarbers}
        selectedBranch={selectedBranch}
        onClose={() => setShowServicesDetails(false)}
      />

      {/* Performance Overview */}
      <PerformanceOverview barbers={filteredBarbers} />

      {/* Staff Table */}
      <DataTable
        data={filteredBarbers}
        columns={columns}
        searchable
        pagination={false}
        className="w-full"
        emptyMessage="No hay barberos registrados"
      />

      {/* Staff Form Modal */}
      {showForm && (
        <StaffForm
          barber={selectedBarber}
          onClose={() => {
            setShowForm(false);
            setSelectedBarber(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setSelectedBarber(null);
          }}
        />
      )}

      {/* Attendance Tracker Modal */}
      {showAttendance && (
        <AttendanceTracker
          onClose={() => setShowAttendance(false)}
        />
      )}

      {/* Barber Reviews Modal */}
      {showReviews && selectedBarber && (
        <BarberReviews
          barberId={selectedBarber.id}
          onClose={() => {
            setShowReviews(false);
            setSelectedBarber(null);
          }}
        />
      )}
    </div>
  );
};

export default Staff;
