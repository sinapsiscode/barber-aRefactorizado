import { FiUpload, FiX } from 'react-icons/fi';
import { FormInput } from '../../../../components/common';
import { getPaymentMethods } from '../../../../utils/paymentUtils';

/**
 * Paso 6: Método de Pago
 */
const PaymentMethod = ({
  selectedMethod,
  voucherNumber,
  voucherImage,
  previewImage,
  country,
  onMethodChange,
  onVoucherNumberChange,
  onFileChange,
  onClearFile
}) => {
  const paymentMethods = getPaymentMethods(country);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-xl font-semibold text-gray-900">
          Método de pago
        </h3>
        <div className="space-y-4">
          {paymentMethods.map(method => (
            <label
              key={method.id}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedMethod === method.id
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={(e) => onMethodChange(e.target.value)}
                className="w-4 h-4 text-primary-600 flex-shrink-0"
              />
              <span className="ml-3 font-medium">{method.name}</span>
            </label>
          ))}
        </div>

        {selectedMethod !== 'efectivo' && (
          <div className="p-4 mt-6 space-y-4 rounded-lg bg-gray-50">
            <h4 className="font-medium text-gray-900">Información del pago</h4>
            <FormInput
              label="Número de operación"
              type="text"
              value={voucherNumber}
              onChange={(e) => {
                // Solo permitir números
                const value = e.target.value.replace(/\D/g, '');
                onVoucherNumberChange(value);
              }}
              placeholder="Ej: 123456789"
              pattern="[0-9]*"
              inputMode="numeric"
              required
            />
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Subir voucher de pago
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg cursor-pointer bg-primary-600 hover:bg-primary-700">
                  <FiUpload className="w-4 h-4 mr-2" />
                  Seleccionar imagen
                  <input
                    type="file"
                    onChange={onFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
                {previewImage && (
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Voucher"
                      className="object-cover w-20 h-20 rounded-lg"
                    />
                    <button
                      onClick={onClearFile}
                      className="absolute -top-2 -right-2 p-1 text-white bg-red-500 rounded-full"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethod;
