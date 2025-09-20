import { FiUser, FiClock } from 'react-icons/fi';
import Card from '../common/Card';
import Badge from '../common/Badge';
import AppointmentActions from './AppointmentActions';
import { getStatusColor, getStatusText, getTimeSlot } from '../../utils/appointmentHelpers';
import { DEFAULT_CONFIG } from '../../constants/barberAppointments';

const AppointmentCard = ({
  appointment,
  onMarkAttendance,
  onStartService,
  onCompleteService
}) => {
  const {
    clientName,
    time,
    duration = DEFAULT_CONFIG.APPOINTMENT_DURATION,
    totalPrice,
    services,
    notes,
    status
  } = appointment;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <ClientAvatar />
          <AppointmentInfo
            clientName={clientName}
            status={status}
            time={time}
            duration={duration}
            totalPrice={totalPrice}
            services={services}
          />
        </div>

        <AppointmentActions
          appointment={appointment}
          onMarkAttendance={onMarkAttendance}
          onStartService={onStartService}
          onCompleteService={onCompleteService}
        />
      </div>

      {notes && <AppointmentNotes notes={notes} />}
    </Card>
  );
};

const ClientAvatar = () => (
  <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
    <FiUser className="h-6 w-6 text-primary-600 dark:text-primary-400" />
  </div>
);

const AppointmentInfo = ({
  clientName,
  status,
  time,
  duration,
  totalPrice,
  services
}) => (
  <div>
    <div className="flex items-center space-x-2 mb-1">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {clientName}
      </h3>
      <Badge className={getStatusColor(status)}>
        {getStatusText(status)}
      </Badge>
    </div>

    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
      <div className="flex items-center space-x-1">
        <FiClock className="h-4 w-4" />
        <span>{time} • {getTimeSlot(time)}</span>
      </div>
      <span>•</span>
      <span>{duration} min</span>
      <span>•</span>
      <span>S/{totalPrice?.toLocaleString()}</span>
    </div>

    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
      Servicios: {services?.map(s => `Servicio ${s}`).join(', ') || DEFAULT_CONFIG.DEFAULT_SERVICE}
    </div>
  </div>
);

const AppointmentNotes = ({ notes }) => (
  <div className="mt-4 p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
    <p className="text-sm text-gray-600 dark:text-gray-400">
      <strong>Notas:</strong> {notes}
    </p>
  </div>
);

export default AppointmentCard;