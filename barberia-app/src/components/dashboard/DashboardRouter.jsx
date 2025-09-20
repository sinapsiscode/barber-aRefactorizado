import { USER_ROLES } from '../../constants/dashboard';
import SuperAdminDashboard from './SuperAdminDashboard';
import BranchAdminDashboard from './BranchAdminDashboard';
import BarberDashboard from './BarberDashboard';
import ReceptionDashboard from './ReceptionDashboard';
import ClientDashboard from './ClientDashboard';

const DashboardRouter = ({ userRole }) => {
  const dashboardComponents = {
    [USER_ROLES.SUPER_ADMIN]: SuperAdminDashboard,
    [USER_ROLES.BRANCH_ADMIN]: BranchAdminDashboard,
    [USER_ROLES.BARBER]: BarberDashboard,
    [USER_ROLES.RECEPTION]: ReceptionDashboard,
    [USER_ROLES.CLIENT]: ClientDashboard
  };

  const DashboardComponent = dashboardComponents[userRole];

  if (!DashboardComponent) {
    return null;
  }

  return <DashboardComponent />;
};

export default DashboardRouter;