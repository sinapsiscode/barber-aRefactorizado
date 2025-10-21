import { FiSearch } from 'react-icons/fi';

/**
 * Componente de búsqueda del header
 */
const HeaderSearch = ({ searchTerm, onSearchChange, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
        <FiSearch className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
      />
    </div>
  );
};

export default HeaderSearch;
