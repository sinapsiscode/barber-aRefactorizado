import { FiUser, FiClock, FiCheckCircle } from 'react-icons/fi';
import { useAuthStore } from '../../stores';
import {
  APPOINTMENT_STATUS_COLORS,
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_CALENDAR_LABELS,
  APPOINTMENT_ACTIONS
} from '../../constants/appointments';
import { useCurrency } from '../../hooks/useCurrency';
import { Modal, Button, Avatar, Card } from '../common';

const AppointmentDetailsModal = ({
  isOpen,
  onClose,
  appointment,
  onStatusUpdate,
  onDelete
}) => {
  const { user } = useAuthStore();
  const { formatCurrency } = useCurrency();
  const isAdmin = user?.role === 'super_admin' || user?.role === 'branch_admin';

  if (!appointment) return null;

  const getStatusColor = (status) => {
    return APPOINTMENT_STATUS_COLORS[status] || APPOINTMENT_STATUS_COLORS.pending;
  };

  const getStatusText = (status) => {
    return APPOINTMENT_STATUS_LABELS[status] || status;
  };

  const handleStatusUpdate = async (newStatus) => {
    await onStatusUpdate(appointment.id, newStatus);
    onClose();
  };

  const handleDelete = async () => {
    await onDelete(appointment.id);
    onClose();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={APPOINTMENT_CALENDAR_LABELS.APPOINTMENT_DETAILS}
      size="md"
    >
      <div className="p-6 space-y-4">
        {/* Cliente */}
        <div className="flex items-center space-x-3">
          <Avatar
            name={appointment.clientName}
            size="md"
            className="bg-primary-100 dark:bg-primary-900/30"
          />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {appointment.clientName}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Cliente
            </div>
          </div>
        </div>

        {/* Barbero */}
        <div className="flex items-center space-x-3">
          <Avatar
            name={appointment.barberName}
            size="md"
            className="bg-gray-100 dark:bg-gray-700"
          />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {appointment.barberName}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Barbero
            </div>
          </div>
        </div>

        {/* Fecha y Hora */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <FiClock className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {formatDate(appointment.date)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {appointment.time}
            </div>
          </div>
        </div>

        {/* Estado */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <FiCheckCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <span className={`px-2 py-1 text-sm font-medium rounded-full ${getStatusColor(appointment.status)}`}>
              {getStatusText(appointment.status)}
            </span>
          </div>
        </div>

        {/* Servicios y Precio */}
        <Card variant="flat" padding="md" className="bg-gray-50 dark:bg-gray-900">
          <div className="font-medium text-gray-900 dark:text-white mb-2">
            Servicios
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {appointment.services?.map(s => `Servicio ${s}`).join(', ') || 'Corte'}
          </div>
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium">Total:</span>
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
              {formatCurrency(appointment.totalPrice || 0)}
            </span>
          </div>
        </Card>

        {/* Notas */}
        {appointment.notes && (
          <Card variant="flat" padding="md" className="bg-gray-50 dark:bg-gray-900">
            <div className="font-medium text-gray-900 dark:text-white mb-1">
              Notas
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {appointment.notes}
            </div>
          </Card>
        )}

        {/* Acciones */}
        {isAdmin && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            {appointment.status === 'pending' && (
              <>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleStatusUpdate('confirmed')}
                >
                  {APPOINTMENT_ACTIONS.CONFIRM}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleStatusUpdate('cancelled')}
                >
                  {APPOINTMENT_ACTIONS.CANCEL}
                </Button>
              </>
            )}
            {appointment.status === 'confirmed' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleStatusUpdate('completed')}
              >
                {APPOINTMENT_ACTIONS.MARK_COMPLETED}
              </Button>
            )}
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
            >
              {APPOINTMENT_ACTIONS.DELETE}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              {APPOINTMENT_ACTIONS.CLOSE}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AppointmentDetailsModal;