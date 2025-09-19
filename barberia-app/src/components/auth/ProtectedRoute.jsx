import React from 'react';
import { useAuthStore } from '../../stores';
import LoginForm from './LoginForm';
import AccessDenied from './AccessDenied';

const ProtectedRoute = ({ children, requiredRole = null, requiredPermission = null }) => {
  const { isAuthenticated, user, hasPermission } = useAuthStore();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  if (requiredRole && user.role !== requiredRole && user.role !== 'super_admin') {
    return (
      <AccessDenied
        type="role"
        requiredRole={requiredRole}
      />
    );
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <AccessDenied
        type="permission"
        requiredPermission={requiredPermission}
      />
    );
  }

  return children;
};

export default ProtectedRoute;