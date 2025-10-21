import PropTypes from 'prop-types';
import { FiCheckCircle } from 'react-icons/fi';

/**
 * Estado vacío cuando no hay citas pendientes
 */
const EmptyAppointmentsState = ({ title, message }) => {
  return (
    <div className="text-center py-12">
      <FiCheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        {message}
      </p>
    </div>
  );
};

EmptyAppointmentsState.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string
};

EmptyAppointmentsState.defaultProps = {
  title: '¡Todo al día!',
  message: 'No hay reservas pendientes de aprobación en este momento.'
};

export default EmptyAppointmentsState;
