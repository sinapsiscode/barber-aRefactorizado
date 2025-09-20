import { useDashboardRouter } from '../hooks/useDashboard';
import { DASHBOARD_STATES } from '../constants/dashboard';

import DashboardRouter from '../components/dashboard/DashboardRouter';
import DashboardErrorState from '../components/dashboard/DashboardErrorState';

const Dashboard = () => {
  const {
    // Estado
    user,
    dashboardState,
    isLoading,
    isReady,
    hasError,
    isUnauthorized,
    hasValidRole
  } = useDashboardRouter();

  const renderDashboardContent = () => {
    if (isLoading) {
      return <DashboardErrorState type="loading" />;
    }

    if (isUnauthorized) {
      return <DashboardErrorState type="unauthorized" />;
    }

    if (hasError || !hasValidRole) {
      return <DashboardErrorState type="unrecognized" />;
    }

    if (isReady && user?.role) {
      return <DashboardRouter userRole={user.role} />;
    }

    return <DashboardErrorState type="unrecognized" />;
  };

  return (
    <div className="space-y-6">
      {renderDashboardContent()}
    </div>
  );
};

export default Dashboard;