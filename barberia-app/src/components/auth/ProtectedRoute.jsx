import { useAuthStore } from '../../stores';
import LoginForm from './LoginForm';
import LandingPage from '../../pages/LandingPage';

const ProtectedRoute = ({ children, requiredRole = null, requiredPermission = null, showLandingFirst = true, onNavigateToLogin, onNavigateToBooking }) => {
  const { isAuthenticated, user, hasPermission } = useAuthStore();

  if (!isAuthenticated) {
    // Si queremos mostrar landing page primero y no se ha solicitado ir directo al login
    if (showLandingFirst && onNavigateToLogin) {
      return <LandingPage onNavigateToLogin={onNavigateToLogin} onNavigateToBooking={onNavigateToBooking} />;
    }
    return <LoginForm />;
  }

  if (requiredRole && user.role !== requiredRole && user.role !== 'super_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-dark-900">
        <div className="max-w-md w-full bg-white dark:bg-dark-800 rounded-lg shadow-lg p-8 text-center">
          <div className="mb-4">
            <div className="mx-auto h-16 w-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Acceso Denegado
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No tienes permisos para acceder a esta sección.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Rol requerido: <span className="font-medium">{requiredRole}</span>
          </p>
        </div>
      </div>
    );
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-dark-900">
        <div className="max-w-md w-full bg-white dark:bg-dark-800 rounded-lg shadow-lg p-8 text-center">
          <div className="mb-4">
            <div className="mx-auto h-16 w-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
              <svg className="h-8 w-8 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Permiso Requerido
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No tienes el permiso necesario para realizar esta acción.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Permiso requerido: <span className="font-medium">{requiredPermission}</span>
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;