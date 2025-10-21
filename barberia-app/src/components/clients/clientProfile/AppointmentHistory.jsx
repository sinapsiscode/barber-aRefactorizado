import { FiStar } from 'react-icons/fi';
import { CLIENT_PROFILE_TEXTS } from '../../../constants/clientProfile';

/**
 * Card de historial de citas del cliente
 *
 * NOTA: Actualmente usa mock data
 * TODO: Conectar con appointmentStore cuando esté disponible
 */
const AppointmentHistory = () => {
  // Mock data - TODO: Reemplazar con datos reales del appointmentStore
  const mockAppointmentHistory = [
    {
      id: 1,
      date: '2024-01-15',
      service: 'Corte + Barba',
      barber: 'Miguel Rodríguez',
      price: 40,
      rating: 5
    },
    {
      id: 2,
      date: '2023-12-20',
      service: 'Fade Moderno',
      barber: 'Luis Martínez',
      price: 35,
      rating: 4
    },
    {
      id: 3,
      date: '2023-11-28',
      service: 'Corte Clásico',
      barber: 'Miguel Rodríguez',
      price: 25,
      rating: 5
    }
  ];

  return (
    <div className="card">
      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
        {CLIENT_PROFILE_TEXTS.appointmentHistoryTitle}
      </h4>
      <div className="space-y-4">
        {mockAppointmentHistory.map((appointment) => (
          <div
            key={appointment.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg"
          >
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {appointment.service}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {appointment.barber} • {new Date(appointment.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="font-semibold text-green-600">
                  S/{appointment.price.toLocaleString()}
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`h-3 w-3 ${
                        i < appointment.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentHistory;
