import { useEffect, useState } from 'react';
import { FiPlus, FiEdit, FiTrash, FiMapPin, FiMail, FiPhone } from 'react-icons/fi';
import { useBranchStore } from '../stores';
import { BranchForm } from '../components/branches';
import { MetricCard, CountryFlag } from '../components/common';
import Swal from 'sweetalert2';

/**
 * Página dedicada para gestión de Sedes/Sucursales
 */
const Branches = () => {
  const { branches, loadBranches, deleteBranch } = useBranchStore();
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  useEffect(() => {
    if (branches.length === 0) {
      loadBranches();
    }
  }, [branches.length, loadBranches]);

  const handleAddBranch = () => {
    setEditingBranch(null);
    setShowBranchForm(true);
  };

  const handleEditBranch = (branch) => {
    setEditingBranch(branch);
    setShowBranchForm(true);
  };

  const handleCloseBranchForm = async () => {
    setShowBranchForm(false);
    setEditingBranch(null);
    await loadBranches();
  };

  const handleDeleteBranch = async (branchId, branchName) => {
    const result = await Swal.fire({
      title: '¿Eliminar Sede?',
      text: `¿Estás seguro de eliminar la sede "${branchName}"? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await deleteBranch(branchId);
        Swal.fire({
          title: '¡Eliminada!',
          text: 'La sede ha sido eliminada exitosamente',
          icon: 'success',
          confirmButtonColor: '#ffc000'
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar la sede',
          icon: 'error',
          confirmButtonColor: '#ffc000'
        });
      }
    }
  };

  const activeBranches = branches.filter(b => b.isActive || b.activa);
  const inactiveBranches = branches.filter(b => !b.isActive && !b.activa);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Sedes
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Administra las sucursales y sus configuraciones
          </p>
        </div>
        <button
          onClick={handleAddBranch}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="h-5 w-5" />
          <span>Nueva Sede</span>
        </button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <MetricCard
          title="Total de Sedes"
          value={branches.length}
          icon={FiMapPin}
          color="blue"
        />
        <MetricCard
          title="Sedes Activas"
          value={activeBranches.length}
          icon={FiMapPin}
          color="green"
        />
        <MetricCard
          title="Sedes Inactivas"
          value={inactiveBranches.length}
          icon={FiMapPin}
          color="gray"
        />
      </div>

      {/* Lista de Sedes */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-[#D4AF37]/20">
        <div className="p-6 border-b border-gray-200 dark:border-[#D4AF37]/20">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Sedes Registradas
          </h2>
        </div>

        <div className="p-6">
          {branches.length === 0 ? (
            <div className="text-center py-12">
              <FiMapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No hay sedes registradas
              </p>
              <button
                onClick={handleAddBranch}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Crear primera sede
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branches.map((branch) => (
                <div
                  key={branch.id}
                  className="border border-gray-200 dark:border-[#D4AF37]/20 rounded-lg p-5 hover:shadow-lg transition-shadow"
                >
                  {/* Header de la tarjeta */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <FiMapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {branch.name || branch.nombre}
                        </h3>
                        <div className="flex items-center space-x-1 mt-1">
                          <CountryFlag countryCode={branch.country || branch.pais} size={16} />
                          <span className="text-xs text-gray-500">
                            {branch.city || branch.ciudad}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        branch.isActive || branch.activa
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      {branch.isActive || branch.activa ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>

                  {/* Información de contacto */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <FiMapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{branch.address || branch.direccion}</span>
                    </div>
                    {(branch.phone || branch.telefono) && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <FiPhone className="h-4 w-4 flex-shrink-0" />
                        <span>{branch.phone || branch.telefono}</span>
                      </div>
                    )}
                    {(branch.email) && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <FiMail className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{branch.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Horario */}
                  {(branch.horaApertura || branch.workingHours?.monday?.open) && (
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Horario</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {branch.horaApertura || branch.workingHours?.monday?.open} - {branch.horaCierre || branch.workingHours?.monday?.close}
                      </p>
                    </div>
                  )}

                  {/* Acciones */}
                  <div className="flex items-center space-x-2 pt-4 border-t border-gray-200 dark:border-[#D4AF37]/20">
                    <button
                      onClick={() => handleEditBranch(branch)}
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <FiEdit className="h-4 w-4" />
                      <span className="text-sm font-medium">Editar</span>
                    </button>
                    <button
                      onClick={() => handleDeleteBranch(branch.id, branch.name || branch.nombre)}
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <FiTrash className="h-4 w-4" />
                      <span className="text-sm font-medium">Eliminar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal del formulario */}
      {showBranchForm && (
        <BranchForm
          branch={editingBranch}
          onClose={handleCloseBranchForm}
        />
      )}
    </div>
  );
};

export default Branches;
