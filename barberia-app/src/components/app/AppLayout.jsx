import ProtectedRoute from '../auth/ProtectedRoute';
import Layout from '../common/Layout';
import PageRenderer from './PageRenderer';

const AppLayout = ({
  isAuthenticated,
  user,
  currentPage,
  onPageChange
}) => {
  return (
    <ProtectedRoute>
      {isAuthenticated ? (
        <Layout currentPage={currentPage} onPageChange={onPageChange}>
          <PageRenderer
            currentPage={currentPage}
            userRole={user?.role}
          />
        </Layout>
      ) : null}
    </ProtectedRoute>
  );
};

export default AppLayout;