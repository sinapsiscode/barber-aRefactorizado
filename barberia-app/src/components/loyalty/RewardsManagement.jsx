import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSave, FaTimes, FaGift, FaPercentage, FaCut, FaStar } from 'react-icons/fa';
import { useLoyaltyStore } from '../../stores';
import Swal from 'sweetalert2';

const RewardsManagement = () => {
  const {
    rewards,
    getAvailableRewards,
    addReward,
    updateReward,
    deleteReward,
    getPointsStats
  } = useLoyaltyStore();

  const [showForm, setShowForm] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pointsCost: '',
    discountType: 'percentage',
    discountValue: '',
    validityDays: 30,
    category: 'discount',
    maxUses: 1,
    applicableServices: [],
    icon: 'percentage'
  });

  const [stats, setStats] = useState({});

  useEffect(() => {
    setStats(getPointsStats());
  }, []);

  const categories = [
    { id: 'discount', name: 'Descuento', icon: FaPercentage },
    { id: 'service', name: 'Servicio', icon: FaCut },
    { id: 'combo', name: 'Combo', icon: FaGift },
    { id: 'vip', name: 'VIP', icon: FaStar }
  ];

  const icons = [
    { id: 'percentage', name: 'Porcentaje', icon: FaPercentage },
    { id: 'scissors', name: 'Tijeras', icon: FaCut },
    { id: 'gift', name: 'Regalo', icon: FaGift },
    { id: 'star', name: 'Estrella', icon: FaStar }
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      pointsCost: '',
      discountType: 'percentage',
      discountValue: '',
      validityDays: 30,
      category: 'discount',
      maxUses: 1,
      applicableServices: [],
      icon: 'percentage'
    });
    setEditingReward(null);
    setShowForm(false);
  };

  const handleEdit = (reward) => {
    setFormData({
      name: reward.name,
      description: reward.description,
      pointsCost: reward.pointsCost.toString(),
      discountType: reward.discountType,
      discountValue: reward.discountValue.toString(),
      validityDays: reward.validityDays,
      category: reward.category,
      maxUses: reward.maxUses,
      applicableServices: reward.applicableServices || [],
      icon: reward.icon
    });
    setEditingReward(reward);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.pointsCost || !formData.discountValue) {
      Swal.fire({
        title: 'Campos Requeridos',
        text: 'Por favor completa todos los campos obligatorios',
        icon: 'warning',
        confirmButtonColor: '#ffc000'
      });
      return;
    }

    const rewardData = {
      ...formData,
      pointsCost: parseInt(formData.pointsCost),
      discountValue: parseFloat(formData.discountValue),
      validityDays: parseInt(formData.validityDays),
      maxUses: parseInt(formData.maxUses)
    };

    try {
      if (editingReward) {
        await updateReward(editingReward.id, rewardData);
        Swal.fire({
          title: 'Recompensa Actualizada',
          text: 'La recompensa ha sido actualizada exitosamente',
          icon: 'success',
          confirmButtonColor: '#ffc000'
        });
      } else {
        await addReward(rewardData);
        Swal.fire({
          title: 'Recompensa Creada',
          text: 'La nueva recompensa ha sido creada exitosamente',
          icon: 'success',
          confirmButtonColor: '#ffc000'
        });
      }
      resetForm();
      setStats(getPointsStats());
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Hubo un error al guardar la recompensa',
        icon: 'error',
        confirmButtonColor: '#ffc000'
      });
    }
  };

  const handleDelete = async (rewardId) => {
    const result = await Swal.fire({
      title: '¿Eliminar Recompensa?',
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
        await deleteReward(rewardId);
        Swal.fire({
          title: 'Eliminada',
          text: 'La recompensa ha sido eliminada',
          icon: 'success',
          confirmButtonColor: '#ffc000'
        });
        setStats(getPointsStats());
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al eliminar la recompensa',
          icon: 'error',
          confirmButtonColor: '#ffc000'
        });
      }
    }
  };

  const getRewardIcon = (iconName) => {
    const iconObj = icons.find(i => i.id === iconName);
    return iconObj ? iconObj.icon : FaGift;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Recompensas</h2>
          <p className="text-gray-600">Administra las recompensas disponibles para los clientes</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <FaPlus />
          <span>Nueva Recompensa</span>
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Puntos Ganados</p>
              <p className="text-3xl font-bold">{stats.totalEarned?.toLocaleString() || 0}</p>
            </div>
            <FaGift className="text-4xl text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Puntos Canjeados</p>
              <p className="text-3xl font-bold">{stats.totalRedeemed?.toLocaleString() || 0}</p>
            </div>
            <FaCut className="text-4xl text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Recompensas Activas</p>
              <p className="text-3xl font-bold">{rewards.filter(r => r.isActive).length}</p>
            </div>
            <FaStar className="text-4xl text-purple-200" />
          </div>
        </div>
      </div>

      {/* Lista de recompensas */}
      <div className="bg-white rounded-lg border">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Recompensas ({rewards.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recompensa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Costo (Puntos)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descuento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Validez (Días)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rewards.map((reward) => {
                const IconComponent = getRewardIcon(reward.icon);
                return (
                  <tr key={reward.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <IconComponent className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {reward.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {reward.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        reward.category === 'vip' ? 'bg-purple-100 text-purple-600' :
                        reward.category === 'combo' ? 'bg-blue-100 text-blue-600' :
                        reward.category === 'service' ? 'bg-green-100 text-green-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {reward.category.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reward.pointsCost}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reward.discountType === 'percentage'
                        ? `${reward.discountValue}%`
                        : `S/${reward.discountValue}`
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reward.validityDays}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        reward.isActive
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {reward.isActive ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(reward)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(reward.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {rewards.length === 0 && (
          <div className="text-center py-12">
            <FaGift className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay recompensas
            </h3>
            <p className="text-gray-500 mb-6">
              Crea la primera recompensa para tus clientes
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
            >
              Crear Recompensa
            </button>
          </div>
        )}
      </div>

      {/* Modal de formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">
                  {editingReward ? 'Editar Recompensa' : 'Nueva Recompensa'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Ej: 10% de Descuento"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    rows="3"
                    placeholder="Describe la recompensa..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Costo en Puntos *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.pointsCost}
                      onChange={(e) => setFormData({ ...formData, pointsCost: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Validez (Días)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.validityDays}
                      onChange={(e) => setFormData({ ...formData, validityDays: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Descuento
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="percentage">Porcentaje</option>
                    <option value="fixed">Monto Fijo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor del Descuento *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder={formData.discountType === 'percentage' ? '10' : '25.00'}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.discountType === 'percentage'
                      ? 'Porcentaje de descuento (sin el %)'
                      : 'Monto en soles'
                    }
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icono
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    {icons.map(icon => (
                      <option key={icon.id} value={icon.id}>
                        {icon.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2"
                  >
                    <FaSave />
                    <span>{editingReward ? 'Actualizar' : 'Crear'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg flex items-center justify-center space-x-2"
                  >
                    <FaTimes />
                    <span>Cancelar</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsManagement;