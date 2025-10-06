import { FiInfo, FiMapPin } from 'react-icons/fi';
import { useAuthStore, useBranchStore } from '../../stores';

const BranchRestrictionNotice = () => {
  const { user } = useAuthStore();
  const { branches } = useBranchStore();

  // Solo mostrar para administradores de sede
  if (user?.role !== 'branch_admin' || !user?.branchId) {
    return null;
  }

  const userBranch = branches.find(b => b.id === user.branchId);

  if (!userBranch) {
    return null;
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <FiInfo className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Vista Restringida por Sede
          </h4>
          <div className="mt-1 text-sm text-blue-800 dark:text-blue-200">
            <div className="flex items-center space-x-2">
              <FiMapPin className="h-4 w-4" />
              <span>
                Solo puedes visualizar información de la sede: <strong>{userBranch.name}</strong>
              </span>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              Como administrador de sede, tu acceso está limitado a los datos de {userBranch.city}, {userBranch.country}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchRestrictionNotice;