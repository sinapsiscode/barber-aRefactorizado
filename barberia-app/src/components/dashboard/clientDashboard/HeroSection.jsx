import { FiClock, FiMapPin, FiPlus } from 'react-icons/fi';
import BranchStatus from '../../common/BranchStatus';
import { DASHBOARD_TEXTS } from '../../../constants/clientDashboard';

/**
 * Hero Section con información de horarios y CTA principal
 */
const HeroSection = ({ preferredBranch, nextAppointment, onBookAppointment }) => {
  return (
    <div className="bg-gradient-to-r from-primary-100 via-primary-50 to-primary-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-xl p-6 relative overflow-hidden shadow-lg border border-primary-300 dark:border-gray-600">
      {/* Golden overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-400/5 to-transparent" />

      <div className="relative flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
        {/* Información de Horarios */}
        <div className="flex items-center space-x-6">
          <div className="p-4 bg-primary-200 dark:bg-primary-900/30 backdrop-blur-sm rounded-full">
            <FiClock className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {preferredBranch?.name || 'Tu Barbería'}
            </h2>
            <div className="flex items-center space-x-3">
              <BranchStatus branchId={preferredBranch?.id || 1} showText={true} />
            </div>
            {preferredBranch && (
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 flex items-center">
                <FiMapPin className="h-4 w-4 mr-1" />
                {preferredBranch.address}
              </p>
            )}
          </div>
        </div>

        {/* CTA Principal */}
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {nextAppointment && (
            <div className="text-center sm:text-right">
              <p className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                {DASHBOARD_TEXTS.nextAppointment}
              </p>
              <p className="text-gray-700 dark:text-white text-sm">
                {new Date(nextAppointment.date).toLocaleDateString()} • {nextAppointment.time}
              </p>
            </div>
          )}
          <button
            onClick={onBookAppointment}
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
          >
            <FiPlus className="h-5 w-5" />
            <span>{nextAppointment ? DASHBOARD_TEXTS.newAppointment : DASHBOARD_TEXTS.bookNow}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
