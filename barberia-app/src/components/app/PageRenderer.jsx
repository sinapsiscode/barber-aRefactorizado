import Dashboard from '../../pages/Dashboard';
import Appointments from '../../pages/Appointments';
import ClientAppointments from '../../pages/ClientAppointments';
import BarberAppointments from '../../pages/BarberAppointments';
import ReceptionCalendar from '../../pages/ReceptionCalendar';
import Portfolio from '../../pages/Portfolio';
import Financial from '../../pages/Financial';
import Staff from '../../pages/Staff';
import Clients from '../../pages/Clients';
import Services from '../../pages/Services';
import Settings from '../../pages/Settings';

import { APP_PAGES } from '../../constants/appConfig';
import { getAppointmentsPageByRole } from '../../utils/appHelpers';

const PageRenderer = ({ currentPage, userRole }) => {
  const renderPage = () => {
    switch (currentPage) {
      case APP_PAGES.DASHBOARD:
        return <Dashboard />;

      case APP_PAGES.APPOINTMENTS:
        return renderAppointmentsPage(userRole);

      case APP_PAGES.FINANCIAL:
        return <Financial />;

      case APP_PAGES.STAFF:
        return <Staff />;

      case APP_PAGES.CLIENTS:
        return <Clients />;

      case APP_PAGES.SERVICES:
        return <Services />;

      case APP_PAGES.PORTFOLIO:
        return <Portfolio />;

      case APP_PAGES.SETTINGS:
        return <Settings />;

      default:
        return <Dashboard />;
    }
  };

  const renderAppointmentsPage = (role) => {
    const appointmentsPageType = getAppointmentsPageByRole(role);

    switch (appointmentsPageType) {
      case 'ClientAppointments':
        return <ClientAppointments />;
      case 'BarberAppointments':
        return <BarberAppointments />;
      case 'ReceptionCalendar':
        return <ReceptionCalendar />;
      default:
        return <Appointments />;
    }
  };

  return renderPage();
};

export default PageRenderer;