import React, { useState, useEffect } from 'react';
import { FaStar, FaGift, FaPercentage, FaCut, FaCoins, FaShoppingCart } from 'react-icons/fa';
import { useLoyaltyStore } from '../../stores';
import Swal from 'sweetalert2';

const RewardsStore = ({ clientId, onRewardRedeemed }) => {
  const {
    getAvailableRewards,
    getRewardsByCategory,
    getClientPoints,
    canRedeemReward,
    redeemReward
  } = useLoyaltyStore();

  const [clientPoints, setClientPoints] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setClientPoints(getClientPoints(clientId));
    loadRewards();
  }, [clientId, selectedCategory]);

  const loadRewards = () => {
    if (selectedCategory === 'all') {
      setRewards(getAvailableRewards());
    } else {
      setRewards(getRewardsByCategory(selectedCategory));
    }
  };

  const categories = [
    { id: 'all', name: 'Todas', icon: FaGift },
    { id: 'discount', name: 'Descuentos', icon: FaPercentage },
    { id: 'service', name: 'Servicios', icon: FaCut },
    { id: 'combo', name: 'Combos', icon: FaShoppingCart },
    { id: 'vip', name: 'VIP', icon: FaStar }
  ];

  const getRewardIcon = (reward) => {
    switch (reward.category) {
      case 'discount': return FaPercentage;
      case 'service': return FaCut;
      case 'combo': return FaShoppingCart;
      case 'vip': return FaStar;
      default: return FaGift;
    }
  };

  const handleRedeemReward = async (rewardId) => {
    if (!canRedeemReward(clientId, rewardId)) {
      Swal.fire({
        title: 'Puntos Insuficientes',
        text: 'No tienes suficientes puntos para esta recompensa',
        icon: 'warning',
        confirmButtonColor: '#ffc000'
      });
      return;
    }

    const reward = rewards.find(r => r.id === rewardId);

    const result = await Swal.fire({
      title: '¿Confirmar Canje?',
      html: `
        <div class="text-left">
          <p><strong>Recompensa:</strong> ${reward.name}</p>
          <p><strong>Costo:</strong> ${reward.pointsCost} puntos</p>
          <p><strong>Puntos actuales:</strong> ${clientPoints}</p>
          <p><strong>Puntos restantes:</strong> ${clientPoints - reward.pointsCost}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ffc000',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Canjear',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const clientReward = await redeemReward(clientId, rewardId, 1); // Asuming branchId 1

        Swal.fire({
          title: '¡Canje Exitoso!',
          html: `
            <div class="text-left">
              <p>Tu recompensa ha sido canjeada exitosamente</p>
              <p><strong>Código:</strong> ${clientReward.discountCode}</p>
              <p><strong>Válido hasta:</strong> ${new Date(clientReward.expiryDate).toLocaleDateString()}</p>
            </div>
          `,
          icon: 'success',
          confirmButtonColor: '#ffc000'
        });

        setClientPoints(getClientPoints(clientId));
        onRewardRedeemed && onRewardRedeemed(clientReward);
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: error.message,
          icon: 'error',
          confirmButtonColor: '#ffc000'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con puntos */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Tienda de Recompensas</h2>
            <p className="text-yellow-100">Canjea tus puntos por increíbles beneficios</p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end space-x-2">
              <FaCoins className="text-3xl" />
              <span className="text-3xl font-bold">{clientPoints}</span>
            </div>
            <p className="text-yellow-100">Puntos disponibles</p>
          </div>
        </div>
      </div>

      {/* Filtros por categoría */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <IconComponent className="text-sm" />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Grid de recompensas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => {
          const IconComponent = getRewardIcon(reward);
          const canRedeem = canRedeemReward(clientId, reward.id);

          return (
            <div
              key={reward.id}
              className={`border rounded-lg p-6 transition-all ${
                canRedeem
                  ? 'border-gray-200 hover:border-yellow-400 hover:shadow-lg'
                  : 'border-gray-100 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${
                  canRedeem ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <IconComponent className="text-xl" />
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  reward.category === 'vip' ? 'bg-purple-100 text-purple-600' :
                  reward.category === 'combo' ? 'bg-blue-100 text-blue-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {reward.category.toUpperCase()}
                </span>
              </div>

              <h3 className="font-semibold text-lg mb-2">{reward.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{reward.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  <FaCoins className="text-yellow-500" />
                  <span className="font-bold text-lg">{reward.pointsCost}</span>
                  <span className="text-gray-500 text-sm">puntos</span>
                </div>
                <span className="text-sm text-gray-500">
                  Válido por {reward.validityDays} días
                </span>
              </div>

              {reward.discountType === 'percentage' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-green-800 font-medium text-center">
                    {reward.discountValue}% de descuento
                  </p>
                </div>
              )}

              {reward.discountType === 'fixed' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-blue-800 font-medium text-center">
                    Descuento de S/{reward.discountValue}
                  </p>
                </div>
              )}

              <button
                onClick={() => handleRedeemReward(reward.id)}
                disabled={!canRedeem || loading}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  canRedeem && !loading
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? 'Canjeando...' : canRedeem ? 'Canjear' : 'Puntos Insuficientes'}
              </button>
            </div>
          );
        })}
      </div>

      {rewards.length === 0 && (
        <div className="text-center py-12">
          <FaGift className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No hay recompensas disponibles
          </h3>
          <p className="text-gray-500">
            {selectedCategory === 'all'
              ? 'No hay recompensas activas en este momento'
              : 'No hay recompensas en esta categoría'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default RewardsStore;