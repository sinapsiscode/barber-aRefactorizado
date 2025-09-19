// ===================================================================
// 📋 TABLA DE PRECIOS DE SERVICIOS - COMPONENTE ESPECIALIZADO
// ===================================================================
// Tabla editable de precios de servicios por sucursal
import React from 'react';
import { SERVICE_LABELS, SERVICE_STYLES, SERVICE_CONFIG } from '../../../constants/services';

const ServicePricingTable = ({
  services = [],
  getServicePriceData,
  getFallbackImage,
  onPriceChange
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {SERVICE_LABELS.PRICING_MANAGER.SERVICES_TABLE_TITLE}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  {SERVICE_LABELS.TABLE_HEADERS.SERVICE}
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  {SERVICE_LABELS.TABLE_HEADERS.CATEGORY}
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  {SERVICE_LABELS.TABLE_HEADERS.BASE_PRICE}
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  {SERVICE_LABELS.TABLE_HEADERS.CURRENT_PRICE}
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  {SERVICE_LABELS.TABLE_HEADERS.DURATION}
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => {
                const { currentPrice, hasChanged, isIncreased, isDecreased } = getServicePriceData(service);

                return (
                  <tr
                    key={service.id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    {/* Service Info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="h-10 w-10 rounded-lg object-cover mr-3"
                          onError={(e) => {
                            e.target.src = getFallbackImage();
                          }}
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {service.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                        {service.category}
                      </span>
                    </td>

                    {/* Base Price */}
                    <td className="py-4 px-4 text-center">
                      <span className="text-gray-500 dark:text-gray-400">
                        S/{service.originalPrice}
                      </span>
                    </td>

                    {/* Current Price (Editable) */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-sm">S/</span>
                        <input
                          type="number"
                          value={currentPrice}
                          onChange={(e) => onPriceChange(service.id, e.target.value)}
                          className={`w-20 px-2 py-1 text-center border rounded text-sm ${
                            hasChanged
                              ? isIncreased
                                ? SERVICE_STYLES.PRICE_INPUT.INCREASED
                                : isDecreased
                                ? SERVICE_STYLES.PRICE_INPUT.DECREASED
                                : SERVICE_STYLES.PRICE_INPUT.UNCHANGED
                              : SERVICE_STYLES.PRICE_INPUT.UNCHANGED
                          }`}
                          step={SERVICE_CONFIG.VALIDATION.PRICE_STEP}
                          min={SERVICE_CONFIG.VALIDATION.MIN_PRICE}
                        />
                        {hasChanged && (
                          <div className="flex items-center text-xs">
                            {isIncreased ? (
                              <span className={SERVICE_STYLES.CHANGE_INDICATORS.INCREASED}>↗</span>
                            ) : isDecreased ? (
                              <span className={SERVICE_STYLES.CHANGE_INDICATORS.DECREASED}>↘</span>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="py-4 px-4 text-center text-gray-500 dark:text-gray-400">
                      {service.duration} min
                    </td>
                  </tr>
                );
              })}

              {services.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    No hay servicios disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ServicePricingTable;