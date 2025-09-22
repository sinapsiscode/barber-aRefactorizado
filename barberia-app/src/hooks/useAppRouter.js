import { useState } from 'react';
import { APP_PAGES, USER_ROLES } from '../constants/appConfig';
import { getDefaultPageByRole, validateUserSession } from '../utils/appHelpers';

export const useAppRouter = (user, isAuthenticated) => {
  // TODO REFACTOR: Reemplazar con React Router
  const [currentPage, setCurrentPage] = useState(
    getDefaultPageByRole(user?.role) || APP_PAGES.DASHBOARD
  );

  const handlePageChange = (page) => {
    // Validación básica de página
    if (Object.values(APP_PAGES).includes(page)) {
      setCurrentPage(page);
    }
  };

  const isValidSession = validateUserSession(user, isAuthenticated);

  return {
    currentPage,
    handlePageChange,
    isValidSession
  };
};