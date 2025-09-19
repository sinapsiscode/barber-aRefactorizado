/**
 * GESTOR DE PRECIOS DE SERVICIOS POR SEDE
 * 
 * Permite a los administradores de sede configurar precios específicos
 * para su sucursal independientemente de otras sedes
 */

import { useState, useEffect } from 'react';
import { FiSave, FiRefreshCw, FiDollarSign, FiTrendingUp, FiAlertCircle, FiCheck } from 'react-icons/fi';
import { useAppointmentStore, useBranchStore, useAuthStore } from '../../stores';
import Swal from 'sweetalert2';

const ServicePricingManager = () => {
  const { user } = useAuthStore();
  const { selectedBranch } = useBranchStore();
  const { 
    getServicesWithBranchPricing, 
    updateBranchPricing, 
    getBranchPricingStats,
    isLoading 
  } = useAppointmentStore();

  const [localPrices, setLocalPrices] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [savingStatus, setSavingStatus] = useState('');

  // Determinar la sede actual
  const currentBranchId = selectedBranch?.id || user?.branchId || 1;
  const currentBranchName = selectedBranch?.name || `Sede ${currentBranchId}`;

  // Obtener servicios y estadísticas
  const services = getServicesWithBranchPricing(currentBranchId);
  const pricingStats = getBranchPricingStats(currentBranchId);

  // Inicializar precios locales
  useEffect(() => {
    const servicesData = getServicesWithBranchPricing(currentBranchId);
    const initialPrices = {};
    servicesData.forEach(service => {
      initialPrices[service.id] = service.price;
    });
    setLocalPrices(initialPrices);
    setHasChanges(false);
  }, [currentBranchId, getServicesWithBranchPricing]);

  /**
   * Manejar cambio de precio
   */
  const handlePriceChange = (serviceId, newPrice) => {
    const price = parseFloat(newPrice) || 0;
    setLocalPrices(prev => ({
      ...prev,
      [serviceId]: price
    }));
    setHasChanges(true);
  };

  /**
   * Guardar cambios de precios
   */
  const handleSaveChanges = async () => {
    try {
      setSavingStatus('saving');
      
      const result = await updateBranchPricing(currentBranchId, localPrices);
      
      if (result.success) {
        setSavingStatus('success');
        setHasChanges(false);
        
        await Swal.fire({
          title: '¡Precios Actualizados!',
          text: `Los precios de ${currentBranchName} han sido guardados exitosamente`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        
        // Limpiar estado después de un momento
        setTimeout(() => setSavingStatus(''), 2000);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setSavingStatus('error');
      await Swal.fire({
        title: 'Error al Guardar',
        text: 'No se pudieron actualizar los precios. Intenta nuevamente.',
        icon: 'error'
      });
      setTimeout(() => setSavingStatus(''), 3000);
    }
  };

  /**
   * Resetear precios a valores originales
   */
  const handleResetPrices = async () => {
    const confirmed = await Swal.fire({
      title: '¿Resetear Precios?',
      text: 'Esto restaurará los precios a sus valores base originales.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, resetear',
      cancelButtonText: 'Cancelar'
    });

    if (confirmed.isConfirmed) {
      const originalPrices = {};
      services.forEach(service => {
        originalPrices[service.id] = service.originalPrice;
      });
      setLocalPrices(originalPrices);
      setHasChanges(true);
    }
  };

  /**
   * Aplicar aumento porcentual a todos los servicios
   */
  const handleBulkPriceUpdate = async () => {
    const { value: percentage } = await Swal.fire({
      title: 'Ajuste Masivo de Precios',
      text: 'Ingresa el porcentaje de cambio (positivo para aumentar, negativo para reducir):',
      input: 'number',
      inputPlaceholder: 'Ej: 10 para +10%, -5 para -5%',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value || isNaN(value)) {
          return 'Ingresa un porcentaje válido';
        }
        if (value < -50 || value > 100) {
          return 'El porcentaje debe estar entre -50% y +100%';
        }
      }
    });

    if (percentage) {
      const multiplier = 1 + (parseFloat(percentage) / 100);
      const updatedPrices = {};
      
      services.forEach(service => {
        const currentPrice = localPrices[service.id] || service.price;
        updatedPrices[service.id] = Math.round(currentPrice * multiplier * 100) / 100; // Redondear a 2 decimales
      });
      
      setLocalPrices(updatedPrices);
      setHasChanges(true);

      await Swal.fire({
        title: 'Precios Actualizados',
        text: `Se aplicó un ${percentage > 0 ? 'aumento' : 'descuento'} del ${Math.abs(percentage)}% a todos los servicios`,
        icon: 'info',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header y Estadísticas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Configuración de Precios
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {currentBranchName} - Personaliza los precios para tu sede
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {hasChanges && (
              <span className="flex items-center text-amber-600 dark:text-amber-400 text-sm font-medium">
                <FiAlertCircle className="h-4 w-4 mr-1" />
                Cambios sin guardar
              </span>
            )}
          </div>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center">
              <FiDollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">Precio Promedio</p>
                <p className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                  S/{pricingStats.averagePrice?.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center">
              <FiTrendingUp className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">Precio Máximo</p>
                <p className="text-lg font-semibold text-green-700 dark:text-green-300">
                  S/{pricingStats.maxPrice}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center">
              <FiDollarSign className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Precio Mínimo</p>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  S/{pricingStats.minPrice}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-center">
              <FiCheck className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">Servicios Activos</p>
                <p className="text-lg font-semibold text-yellow-700 dark:text-yellow-300">
                  {pricingStats.totalServices}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleSaveChanges}
          disabled={!hasChanges || isLoading}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
            hasChanges && !isLoading
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          <FiSave className="h-4 w-4 mr-2" />
          {savingStatus === 'saving' ? 'Guardando...' : 'Guardar Cambios'}
        </button>

        <button
          onClick={handleResetPrices}
          className="flex items-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
        >
          <FiRefreshCw className="h-4 w-4 mr-2" />
          Resetear a Valores Base
        </button>

        <button
          onClick={handleBulkPriceUpdate}
          className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
        >
          <FiTrendingUp className="h-4 w-4 mr-2" />
          Ajuste Masivo
        </button>
      </div>

      {/* Tabla de Servicios y Precios */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Precios por Servicio
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Servicio</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Categoría</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Precio Base</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Precio Actual</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Duración</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => {
                  const currentPrice = localPrices[service.id] || service.price;
                  const hasChanged = currentPrice !== service.price;
                  const isIncreased = currentPrice > service.originalPrice;
                  const isDecreased = currentPrice < service.originalPrice;
                  
                  return (
                    <tr key={service.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <img
                            src={service.image}
                            alt={service.name}
                            className="h-10 w-10 rounded-lg object-cover mr-3"
                            onError={(e) => {
                              e.target.src = `data:image/svg+xml;base64,${btoa(`<svg width=\"40\" height=\"40\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"100%\" height=\"100%\" fill=\"#f3f4f6\"/><g transform=\"translate(20,20)\"><circle cx=\"0\" cy=\"-5\" r=\"4\" fill=\"#d1d5db\"/><rect x=\"-3\" y=\"-2\" width=\"6\" height=\"8\" rx=\"1\" fill=\"#d1d5db\"/></g></svg>`)}`;
                            }}
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{service.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {service.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                          {service.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-gray-500 dark:text-gray-400">
                          S/{service.originalPrice}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-sm">S/</span>
                          <input
                            type="number"
                            value={currentPrice}
                            onChange={(e) => handlePriceChange(service.id, e.target.value)}
                            className={`w-20 px-2 py-1 text-center border rounded text-sm ${
                              hasChanged
                                ? isIncreased
                                  ? 'border-green-300 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                  : isDecreased
                                  ? 'border-red-300 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                                  : 'border-gray-300 dark:border-gray-600'
                                : 'border-gray-300 dark:border-gray-600'
                            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                            step="0.5"
                            min="0"
                          />
                          {hasChanged && (
                            <div className="flex items-center text-xs">
                              {isIncreased ? (
                                <span className="text-green-600 dark:text-green-400">↗</span>
                              ) : isDecreased ? (
                                <span className="text-red-600 dark:text-red-400">↘</span>
                              ) : null}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center text-gray-500 dark:text-gray-400">
                        {service.duration} min
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ServicePricingTable
        services={services}
        getServicePriceData={getServicePriceData}
        getFallbackImage={getFallbackImage}
        onPriceChange={handlePriceChange}
      />

      <PricingInfoBox branchName={branchData.name} />
    </div>
  );
};

export default ServicePricingManager;