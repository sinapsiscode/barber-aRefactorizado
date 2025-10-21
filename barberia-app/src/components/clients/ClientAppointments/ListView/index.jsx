import UpcomingSection from './UpcomingSection';
import HistorySection from './HistorySection';

/**
 * Vista completa de lista (próximas + historial)
 * Líneas 345-495 del original
 */
const ListView = ({
  upcomingAppointments,
  pastAppointments,
  onCancelAppointment,
  onOpenForm
}) => {
  return (
    <>
      <UpcomingSection
        appointments={upcomingAppointments}
        onCancel={onCancelAppointment}
        onOpenForm={onOpenForm}
      />

      <HistorySection
        appointments={pastAppointments}
      />
    </>
  );
};

export default ListView;
