import { useState, useEffect } from 'react';
import { FiUsers, FiPlus, FiEdit, FiTrash, FiMapPin, FiMail, FiShield } from 'react-icons/fi';
import { useAuthStore, useBranchStore } from '../../stores';
import { DataTable, MetricCard } from '../common';
import BranchAdminForm from '../admins/BranchAdminForm';
import Swal from 'sweetalert2';

const BranchAdminsSettings = () => {
  const { user, users, addUser, updateUser, deleteUser, loadUsers } = useAuthStore();
  const { branches } = useBranchStore();

  const [showForm, setShowForm] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cargar usuarios al montar
  useEffect(() => {
    if (!users || users.length === 0) {
      loadUsers();
    }
  }, [users, loadUsers]);

  // Filtrar solo administradores de sede
  const branchAdmins = users ? users.filter(u => u.role === 'branch_admin') : [];

  // Obtener estadísticas
  const stats = {
    totalAdmins: branchAdmins.length,
    activeAdmins: branchAdmins.filter(admin => admin.status !== 'inactive').length,
    assignedBranches: branchAdmins.filter(admin => admin.branchId).length,
    unassignedAdmins: branchAdmins.filter(admin => !admin.branchId).length
  };

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setShowForm(true);
  };

  const handleDelete = async (adminId) => {
    const result = await Swal.fire({
      title: '¿Eliminar Administrador?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await deleteUser(adminId);

        Swal.fire({
          title: '¡Eliminado!',
          text: 'El administrador ha sido eliminado',
          icon: 'success',
          confirmButtonColor: '#ffc000'
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el administrador',
          icon: 'error',
          confirmButtonColor: '#ffc000'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Administrador',
      render: (value, admin) => (
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {value.charAt(0)}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white text-sm">{value}</div>
            <div className="text-xs text-gray-500">{admin.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'branchId',
      label: 'Sede Asignada',
      render: (value, admin) => {
        const branch = branches.find(b => b.id === value);
        return (
          <div className="flex items-center space-x-2">
            {branch ? (
              <>
                <FiMapPin className="h-3 w-3 text-blue-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {branch.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {branch.city}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-orange-400 rounded-full"></div>
                <span className="text-orange-600 text-sm font-medium">Sin asignar</span>
              </div>
            )}
          </div>
        );
      }
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-600'
        }`}>
          {value === 'active' ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (value, admin) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEdit(admin)}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="Editar"
          >
            <FiEdit className="h-3 w-3" />
          </button>
          <button
            onClick={() => handleDelete(admin.id)}
            className="text-red-600 hover:text-red-800 p-1"
            title="Eliminar"
            disabled={loading}
          >
            <FiTrash className="h-3 w-3" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <FiShield className="h-5 w-5 text-blue-500 mr-2" />
            Administradores de Sede
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Gestiona los administradores de cada sucursal
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedAdmin(null);
            setShowForm(true);
          }}
          className="btn-primary flex items-center text-sm px-3 py-2"
        >
          <FiPlus className="h-4 w-4 mr-1" />
          Nuevo Administrador
        </button>
      </div>

      {/* Métricas compactas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-dark-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
              <FiUsers className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.totalAdmins}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
              <FiShield className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Activos</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.activeAdmins}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
              <FiMapPin className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Asignadas</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.assignedBranches}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
              <FiMail className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Sin Asignar</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.unassignedAdmins}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de administradores */}
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white">Lista de Administradores</h4>
        </div>
        <div className="p-4">
          <DataTable
            data={branchAdmins}
            columns={columns}
            searchable
            pagination={false}
            className="w-full"
            emptyMessage="No hay administradores de sede registrados"
          />
        </div>
      </div>

      {/* Modal del formulario */}
      {showForm && (
        <BranchAdminForm
          admin={selectedAdmin}
          onClose={() => {
            setShowForm(false);
            setSelectedAdmin(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setSelectedAdmin(null);
          }}
        />
      )}
    </div>
  );
};

export default BranchAdminsSettings;