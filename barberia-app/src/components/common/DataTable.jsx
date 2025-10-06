import { useState } from 'react';
import { FiChevronUp, FiChevronDown, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';

const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  searchable = false,
  sortable = true,
  pagination = true,
  itemsPerPage = 10,
  emptyMessage = 'No hay datos para mostrar',
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search term
  const filteredData = searchable
    ? data.filter(item =>
        columns.some(column =>
          String(item[column.key] || '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      )
    : data;

  // Sort data
  const sortedData = sortable && sortConfig.key
    ? [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      })
    : filteredData;

  // Paginate data
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = pagination
    ? sortedData.slice(startIndex, startIndex + itemsPerPage)
    : sortedData;

  const handleSort = (key) => {
    if (!sortable) return;
    
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />;
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-black rounded-lg p-6 elevation-1 ${className}`}>
        <LoadingSpinner className="py-12" />
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-black rounded-lg overflow-hidden elevation-1 ${className}`}>
      {searchable && (
        <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <FiSearch className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar en la tabla..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
            />
          </div>
        </div>
      )}

      {paginatedData.length === 0 ? (
        <div className="p-12">
          <EmptyState title={emptyMessage} />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      onClick={() => handleSort(column.key)}
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300 ${
                        sortable ? 'cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 group' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{column.label}</span>
                        {sortable && (
                          <div className="opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                            {getSortIcon(column.key) || <FiChevronDown className="text-gray-400" />}
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-800">
                {paginatedData.map((item, index) => (
                  <tr
                    key={item.id || index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors duration-150"
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                      >
                        {column.render
                          ? column.render(item[column.key], item)
                          : item[column.key]
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && totalPages > 1 && (
            <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Mostrando <span className="font-medium text-gray-900 dark:text-gray-100">{startIndex + 1}</span> a{' '}
                  <span className="font-medium text-gray-900 dark:text-gray-100">{Math.min(startIndex + itemsPerPage, totalItems)}</span> de{' '}
                  <span className="font-medium text-gray-900 dark:text-gray-100">{totalItems}</span> resultados
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* First Page */}
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 ripple"
                    title="Primera página"
                  >
                    <FiChevronLeft className="h-4 w-4" />
                    <FiChevronLeft className="h-4 w-4 -ml-2" />
                  </button>

                  {/* Previous Page */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 ripple"
                  >
                    <FiChevronLeft className="h-4 w-4" />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = idx + 1;
                      } else if (currentPage <= 3) {
                        pageNum = idx + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + idx;
                      } else {
                        pageNum = currentPage - 2 + idx;
                      }

                      if (pageNum > totalPages) return null;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded font-medium transition-all duration-200 ripple ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white elevation-1'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Page */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 ripple"
                  >
                    <FiChevronRight className="h-4 w-4" />
                  </button>

                  {/* Last Page */}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 ripple"
                    title="Última página"
                  >
                    <FiChevronRight className="h-4 w-4" />
                    <FiChevronRight className="h-4 w-4 -ml-2" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DataTable;