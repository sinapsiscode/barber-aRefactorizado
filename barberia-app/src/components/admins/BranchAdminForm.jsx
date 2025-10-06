import { useState } from 'react';
import { FiX, FiUser, FiMail, FiLock, FiMapPin, FiShield } from 'react-icons/fi';
import { useAuthStore, useBranchStore } from '../../stores';
import { FormInput } from '../common';
import Swal from 'sweetalert2';

const BranchAdminForm = ({ admin = null, onClose, onSuccess }) => {
  const { addUser, updateUser } = useAuthStore();
  const { branches } = useBranchStore();

  const [formData, setFormData] = useState({
    name: admin?.name || '',
    email: admin?.email || '',
    password: admin ? '' : '', // Solo requerido para nuevos usuarios
    branchId: admin?.branchId || '',
    phone: admin?.phone || '',
    status: admin?.status || 'active'
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Obtener sucursales no asignadas (excepto la del admin actual si estamos editando)
  const availableBranches = branches.filter(branch => {
    // Si estamos editando y esta es la sucursal actual del admin, incluirla
    if (admin && branch.id === admin.branchId) {
      return true;
    }
    // Solo incluir sucursales que no tienen administrador asignado
    return !branch.adminId || branch.adminId === null;
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!admin && !formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!admin && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.branchId) {
      newErrors.branchId = 'Debe seleccionar una sede';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        ...formData,
        role: 'branch_admin',
        permissions: ['read', 'write', 'delete_own_branch'],
        branchId: parseInt(formData.branchId)
      };

      // Si estamos editando y no se proporcionó nueva contraseña, no incluirla
      if (admin && !formData.password.trim()) {
        delete userData.password;
      }

      if (admin) {
        await updateUser(admin.id, userData);
        Swal.fire({
          title: '¡Actualizado!',
          text: 'El administrador ha sido actualizado exitosamente',
          icon: 'success',
          confirmButtonColor: '#ffc000'
        });
      } else {
        await addUser(userData);
        Swal.fire({
          title: '¡Creado!',
          text: 'El administrador de sede ha sido creado exitosamente',
          icon: 'success',
          confirmButtonColor: '#ffc000'
        });
      }

      onSuccess();
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudo guardar el administrador',
        icon: 'error',
        confirmButtonColor: '#ffc000'
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedBranch = branches.find(b => b.id === parseInt(formData.branchId));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white dark:bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white dark:bg-dark-800 px-6 py-4 border-b border-gray-200 dark:border-dark-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white flex items-center">
                <FiShield className="h-5 w-5 text-blue-500 mr-2" />
                {admin ? 'Editar Administrador de Sede' : 'Nuevo Administrador de Sede'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Información Personal */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Información Personal</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormInput
                    label="Nombre Completo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    icon={FiUser}
                    required
                    placeholder="Juan Pérez"
                    error={errors.name}
                  />
                </div>

                <div>
                  <FormInput
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    icon={FiMail}
                    required
                    placeholder="juan@barberia.com"
                    error={errors.email}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormInput
                    label={admin ? "Nueva Contraseña (opcional)" : "Contraseña"}
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    icon={FiLock}
                    required={!admin}
                    placeholder="Mínimo 6 caracteres"
                    error={errors.password}
                  />
                  {admin && (
                    <p className="text-xs text-gray-500 mt-1">
                      Deja en blanco para mantener la contraseña actual
                    </p>
                  )}
                </div>

                <div>
                  <FormInput
                    label="Teléfono"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    icon={FiUser}
                    placeholder="+57 300 123 4567"
                  />
                </div>
              </div>
            </div>

            {/* Asignación de Sede */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Asignación de Sede</h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sede a Administrar *
                </label>
                <select
                  value={formData.branchId}
                  onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                  className={`input-field ${errors.branchId ? 'border-red-500' : ''}`}
                  required
                >
                  <option value="">Seleccionar sede...</option>
                  {availableBranches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name} - {branch.city}, {branch.country}
                    </option>
                  ))}
                </select>
                {errors.branchId && (
                  <p className="text-red-500 text-xs mt-1">{errors.branchId}</p>
                )}

                {availableBranches.length === 0 && !admin && (
                  <p className="text-orange-600 text-sm mt-1">
                    No hay sucursales disponibles. Todas ya tienen administrador asignado.
                  </p>
                )}
              </div>

              {/* Preview de la sede seleccionada */}
              {selectedBranch && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <FiMapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-blue-900 dark:text-blue-100">
                        {selectedBranch.name}
                      </h5>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {selectedBranch.address}
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {selectedBranch.city}, {selectedBranch.country}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        Teléfono: {selectedBranch.phone}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estado
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="input-field"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>

            {/* Permisos Info */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                Permisos Asignados
              </h5>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Gestión completa de la sede asignada</li>
                <li>• Administración de personal de la sede</li>
                <li>• Gestión de citas y servicios</li>
                <li>• Acceso a reportes financieros de la sede</li>
                <li>• Configuración de horarios y servicios</li>
              </ul>
            </div>

            {/* Acciones */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || (availableBranches.length === 0 && !admin)}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? 'Guardando...' : admin ? 'Actualizar' : 'Crear Administrador'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BranchAdminForm;