import { FiFilter } from 'react-icons/fi';
import { useBranchStore, useStaffStore } from '../../stores';
import { useAppointmentStore } from '../../stores';
import { APPOINTMENT_CALENDAR_LABELS } from '../../constants/appointments';
import { Card, Button, Select, Badge } from '../common';

const AppointmentFilters = ({
  filters,
  onUpdateFilter,
  onClearFilters,
  showFilters,
  onToggleFilters,
  activeFiltersCount
}) => {
  const { branches, selectedBranch } = useBranchStore();
  const { barbers } = useStaffStore();
  const { services } = useAppointmentStore();

  // Filtrar barberos por sede si hay una seleccionada
  const getFilteredBarbers = () => {
    if (!barbers) return [];

    if (filters.branchId) {
      return barbers.filter(barber => barber.branchId === parseInt(filters.branchId));
    }

    return barbers;
  };

  const getFilteredBranches = () => {
    return branches || [];
  };

  const handleBranchChange = (branchId) => {
    onUpdateFilter('branchId', branchId);
    // Limpiar barbero cuando cambie la sede
    if (branchId !== filters.branchId) {
      onUpdateFilter('barberId', '');
    }
  };

  return (
    <Card padding="md" className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {APPOINTMENT_CALENDAR_LABELS.FILTERS}
        </h3>
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            disabled={activeFiltersCount === 0}
          >
            {APPOINTMENT_CALENDAR_LABELS.CLEAR_FILTERS}
          </Button>
          <Button
            variant={showFilters ? 'primary' : 'secondary'}
            size="sm"
            onClick={onToggleFilters}
            leftIcon={FiFilter}
            className="relative"
          >
            {showFilters
              ? APPOINTMENT_CALENDAR_LABELS.HIDE_FILTERS
              : APPOINTMENT_CALENDAR_LABELS.SHOW_FILTERS
            }
            {activeFiltersCount > 0 && (
              <Badge
                variant="error"
                size="sm"
                className="absolute -top-2 -right-2 min-w-[1.25rem] h-5"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtro por sede */}
          <Select
            label={APPOINTMENT_CALENDAR_LABELS.BRANCH}
            name="branchId"
            value={filters.branchId}
            onChange={(e) => handleBranchChange(e.target.value)}
            options={getFilteredBranches()}
            placeholder={APPOINTMENT_CALENDAR_LABELS.ALL_BRANCHES}
            renderOption={(branch) => ({
              value: branch.id,
              label: branch.name
            })}
          />

          {/* Filtro por barbero */}
          <div>
            <Select
              label={`${APPOINTMENT_CALENDAR_LABELS.BARBER}${
                filters.branchId
                  ? ` (Sede: ${getFilteredBranches().find(b => b.id === parseInt(filters.branchId))?.name || 'Desconocida'})`
                  : ''
              }`}
              name="barberId"
              value={filters.barberId}
              onChange={(e) => onUpdateFilter('barberId', e.target.value)}
              options={getFilteredBarbers()}
              placeholder={
                filters.branchId
                  ? `${APPOINTMENT_CALENDAR_LABELS.ALL_BARBERS} de ${getFilteredBranches().find(b => b.id === parseInt(filters.branchId))?.name || 'esta sede'}`
                  : `${APPOINTMENT_CALENDAR_LABELS.ALL_BARBERS} de la empresa`
              }
              renderOption={(barber) => {
                const branch = getFilteredBranches().find(b => b.id === barber.branchId);
                return {
                  value: barber.id,
                  label: `${barber.name}${!filters.branchId && branch ? ` (${branch.name})` : ''}`
                };
              }}
            />
            {getFilteredBarbers().length === 0 && filters.branchId && (
              <p className="text-xs text-gray-500 mt-1">
                No hay barberos disponibles en esta sede
              </p>
            )}
          </div>

          {/* Filtro por tipo de servicio */}
          <Select
            label={APPOINTMENT_CALENDAR_LABELS.SERVICE_TYPE}
            name="serviceType"
            value={filters.serviceType}
            onChange={(e) => onUpdateFilter('serviceType', e.target.value)}
            options={services || []}
            placeholder={APPOINTMENT_CALENDAR_LABELS.ALL_SERVICES}
            renderOption={(service) => ({
              value: service.id,
              label: service.name
            })}
          />
        </div>
      )}
    </Card>
  );
};

export default AppointmentFilters;