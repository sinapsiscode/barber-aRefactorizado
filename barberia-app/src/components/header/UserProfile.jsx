/**
 * Perfil de usuario con avatar
 */
const UserProfile = ({ user }) => {
  if (!user) return null;

  return (
    <div className="flex items-center space-x-3 pl-3 border-l border-gray-200 dark:border-gray-700">
      <div className="hidden md:block text-right">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {user.name}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
          {user.role?.replace('_', ' ')}
        </p>
      </div>
      <div className="h-10 w-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
        {user.name?.charAt(0).toUpperCase()}
      </div>
    </div>
  );
};

export default UserProfile;
