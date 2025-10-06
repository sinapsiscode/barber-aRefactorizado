import React, { useState, useEffect } from 'react';
import { FaGift, FaClock, FaCheckCircle, FaCopy, FaEye } from 'react-icons/fa';
import { useLoyaltyStore } from '../../stores';
import Swal from 'sweetalert2';

const ActiveRewards = ({ clientId }) => {
  const { getClientActiveRewards, useReward } = useLoyaltyStore();
  const [activeRewards, setActiveRewards] = useState([]);

  useEffect(() => {
    loadActiveRewards();
  }, [clientId]);

  const loadActiveRewards = () => {
    const rewards = getClientActiveRewards(clientId);
    setActiveRewards(rewards);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      Swal.fire({
        title: 'Copiado',
        text: 'Código copiado al portapapeles',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    });
  };

  const showRewardDetails = (reward) => {
    const daysLeft = getDaysUntilExpiry(reward.expiryDate);

    Swal.fire({
      title: reward.reward.name,
      html: `
        <div class="text-left space-y-3">
          <div>
            <strong>Descripción:</strong><br>
            ${reward.reward.description}
          </div>

          <div>
            <strong>Código de descuento:</strong><br>
            <code class="bg-gray-100 px-2 py-1 rounded">${reward.discountCode}</code>
          </div>

          <div>
            <strong>Descuento:</strong><br>
            ${reward.reward.discountType === 'percentage'
              ? `${reward.reward.discountValue}% de descuento`
              : `S/${reward.reward.discountValue} de descuento`
            }
          </div>

          <div>
            <strong>Válido hasta:</strong><br>
            ${formatDate(reward.expiryDate)} (${daysLeft} días restantes)
          </div>

          <div>
            <strong>Canjeado el:</strong><br>
            ${formatDate(reward.redeemDate)}
          </div>

          ${reward.reward.applicableServices && reward.reward.applicableServices.length > 0
            ? `<div>
                <strong>Aplicable a:</strong><br>
                Servicios específicos
              </div>`
            : '<div><strong>Aplicable a:</strong><br>Todos los servicios</div>'
          }
        </div>
      `,
      icon: 'info',
      confirmButtonColor: '#ffc000',
      confirmButtonText: 'Cerrar'
    });
  };

  const getExpiryColor = (expiryDate) => {
    const daysLeft = getDaysUntilExpiry(expiryDate);
    if (daysLeft <= 3) return 'text-red-600 bg-red-50 border-red-200';
    if (daysLeft <= 7) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mis Recompensas Activas</h2>
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
          {activeRewards.length} activas
        </span>
      </div>

      {activeRewards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeRewards.map((reward) => {
            const daysLeft = getDaysUntilExpiry(reward.expiryDate);
            const isExpiringSoon = daysLeft <= 7;

            return (
              <div
                key={reward.id}
                className={`border rounded-lg p-6 transition-all hover:shadow-lg ${
                  isExpiringSoon ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
                }`}
              >
                {/* Header con icono y estado */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
                      <FaGift className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{reward.reward.name}</h3>
                      <p className="text-gray-600 text-sm">{reward.reward.description}</p>
                    </div>
                  </div>
                  {isExpiringSoon && (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                      Expira pronto
                    </span>
                  )}
                </div>

                {/* Detalles del descuento */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="text-center">
                    {reward.reward.discountType === 'percentage' ? (
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {reward.reward.discountValue}%
                      </div>
                    ) : (
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        S/{reward.reward.discountValue}
                      </div>
                    )}
                    <p className="text-gray-600 text-sm">de descuento</p>
                  </div>
                </div>

                {/* Código de descuento */}
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Código de descuento:</p>
                      <p className="font-mono font-bold text-lg">{reward.discountCode}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(reward.discountCode)}
                      className="p-2 text-gray-500 hover:text-yellow-600 transition-colors"
                      title="Copiar código"
                    >
                      <FaCopy />
                    </button>
                  </div>
                </div>

                {/* Información de expiración */}
                <div className={`border rounded-lg p-3 mb-4 ${getExpiryColor(reward.expiryDate)}`}>
                  <div className="flex items-center space-x-2">
                    <FaClock />
                    <span className="font-medium">
                      Expira el {formatDate(reward.expiryDate)}
                    </span>
                  </div>
                  <p className="text-sm mt-1">
                    {daysLeft > 0 ? `${daysLeft} días restantes` : 'Expira hoy'}
                  </p>
                </div>

                {/* Acciones */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => showRewardDetails(reward)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    <FaEye />
                    <span>Ver Detalles</span>
                  </button>
                  <button
                    onClick={() => copyToClipboard(reward.discountCode)}
                    className="flex items-center justify-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
                  >
                    <FaCopy />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <FaGift className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No tienes recompensas activas
          </h3>
          <p className="text-gray-500 mb-6">
            Visita nuestra tienda de recompensas para canjear tus puntos
          </p>
        </div>
      )}

      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <FaCheckCircle />
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">¿Cómo usar tus recompensas?</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Presenta el código de descuento al momento de pagar</li>
              <li>• Asegúrate de usar la recompensa antes de su fecha de vencimiento</li>
              <li>• Algunas recompensas solo aplican a servicios específicos</li>
              <li>• No se pueden combinar múltiples descuentos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveRewards;