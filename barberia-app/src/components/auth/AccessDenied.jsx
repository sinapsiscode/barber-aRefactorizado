import React from 'react';
import { PROTECTED_ROUTE_MESSAGES } from '../../constants/auth';
import { Card } from '../common';

const AccessDenied = ({
  type = 'role',
  requiredRole = null,
  requiredPermission = null
}) => {
  const isRoleError = type === 'role';

  const config = isRoleError
    ? PROTECTED_ROUTE_MESSAGES.ACCESS_DENIED
    : PROTECTED_ROUTE_MESSAGES.PERMISSION_REQUIRED;

  const requirement = isRoleError ? requiredRole : requiredPermission;
  const requirementLabel = isRoleError
    ? config.ROLE_REQUIRED
    : config.PERMISSION_REQUIRED;

  const iconColor = isRoleError ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400';
  const bgColor = isRoleError ? 'bg-red-100 dark:bg-red-900' : 'bg-yellow-100 dark:bg-yellow-900';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card
        variant="elevated"
        padding="lg"
        className="max-w-md w-full text-center"
      >
        <div className="mb-4">
          <div className={`mx-auto h-16 w-16 ${bgColor} rounded-full flex items-center justify-center`}>
            {isRoleError ? (
              <svg
                className={`h-8 w-8 ${iconColor}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            ) : (
              <svg
                className={`h-8 w-8 ${iconColor}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            )}
          </div>
        </div>

        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {config.TITLE}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {config.DESCRIPTION}
        </p>

        {requirement && (
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {requirementLabel} <span className="font-medium">{requirement}</span>
          </p>
        )}
      </Card>
    </div>
  );
};

export default AccessDenied;