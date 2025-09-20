import { FiPlus, FiSearch } from 'react-icons/fi';
import { CLIENT_MANAGEMENT_TEXTS } from '../../constants/clients';

const ClientsHeader = ({
  user,
  selectedBranch,
  searchTerm,
  onSearchChange,
  onNewClient
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {CLIENT_MANAGEMENT_TEXTS.TITLE}
          {user?.role === 'super_admin' && selectedBranch && (
            <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-2">
              - {selectedBranch.name}
            </span>
          )}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {user?.role === 'super_admin' && selectedBranch
            ? `${CLIENT_MANAGEMENT_TEXTS.SUBTITLE_WITH_BRANCH} ${selectedBranch.city}`
            : CLIENT_MANAGEMENT_TEXTS.SUBTITLE
          }
        </p>
      </div>
      <div className="flex space-x-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <FiSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={CLIENT_MANAGEMENT_TEXTS.SEARCH_PLACEHOLDER}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 w-80 input-field"
          />
        </div>
        <button
          onClick={onNewClient}
          className="btn-primary"
        >
          <FiPlus className="h-4 w-4 mr-2" />
          {CLIENT_MANAGEMENT_TEXTS.NEW_CLIENT}
        </button>
      </div>
    </div>
  );
};

export default ClientsHeader;