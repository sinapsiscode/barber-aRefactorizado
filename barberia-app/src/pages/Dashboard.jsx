import { useAuthStore } from '../stores';
import SuperAdminDashboard from '../components/dashboard/SuperAdminDashboard';
import BranchAdminDashboard from '../components/dashboard/BranchAdminDashboard';
import BarberDashboard from '../components/dashboard/BarberDashboard';
import ReceptionDashboard from '../components/dashboard/ReceptionDashboard';
import ClientDashboard from '../components/dashboard/ClientDashboard';

const Dashboard = ({ onPageChange }) => {
  const { user } = useAuthStore();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'super_admin':
        return <SuperAdminDashboard onPageChange={onPageChange} />;
      case 'branch_admin':
        return <BranchAdminDashboard />;
      case 'barber':
        return <BarberDashboard />;
      case 'reception':
        return <ReceptionDashboard />;
      case 'client':
        return <ClientDashboard />;
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Rol no reconocido
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No se pudo determinar tu rol en el sistema.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;