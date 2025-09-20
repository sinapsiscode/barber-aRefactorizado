import { DASHBOARD_TEXTS } from '../../constants/dashboard';

const DashboardErrorState = ({ type = 'unrecognized' }) => {
  const getErrorContent = () => {
    switch (type) {
      case 'unauthorized':
        return {
          title: 'Acceso no autorizado',
          description: DASHBOARD_TEXTS.UNAUTHORIZED
        };
      case 'loading':
        return {
          title: 'Cargando...',
          description: DASHBOARD_TEXTS.LOADING
        };
      case 'unrecognized':
      default:
        return {
          title: DASHBOARD_TEXTS.UNRECOGNIZED_ROLE.TITLE,
          description: DASHBOARD_TEXTS.UNRECOGNIZED_ROLE.DESCRIPTION
        };
    }
  };

  const { title, description } = getErrorContent();

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
};

export default DashboardErrorState;