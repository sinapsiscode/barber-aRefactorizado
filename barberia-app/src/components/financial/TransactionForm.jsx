import { useState } from 'react';
import { FiX, FiDollarSign, FiTag, FiFileText, FiUpload, FiTrash2, FiImage } from 'react-icons/fi';
import { useFinancialStore, useAuthStore } from '../../stores';
import { FormInput } from '../common';
import Swal from 'sweetalert2';

const TransactionForm = ({ transaction = null, onClose, onSuccess }) => {
  const { addTransaction, updateTransaction, categories, paymentMethods } = useFinancialStore();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    type: transaction?.type || 'income',
    amount: transaction?.amount || '',
    category: transaction?.category || '',
    description: transaction?.description || '',
    paymentMethod: transaction?.paymentMethod || 'cash',
    date: transaction?.date || new Date().toISOString().split('T')[0],
    voucherUrl: transaction?.voucherUrl || null
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleVoucherUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor selecciona un archivo de imagen válido',
        icon: 'error',
        confirmButtonColor: '#ffc000'
      });
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: 'Error',
        text: 'La imagen no debe superar los 5MB',
        icon: 'error',
        confirmButtonColor: '#ffc000'
      });
      return;
    }

    // Convertir a base64
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData({ ...formData, voucherUrl: event.target.result });
      setErrors({ ...errors, voucherUrl: null });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveVoucher = () => {
    setFormData({ ...formData, voucherUrl: null });
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar que recepción siempre adjunte voucher
    if (user?.role === 'reception' && !formData.voucherUrl) {
      newErrors.voucherUrl = 'El voucher es obligatorio para recepción';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario
    if (!validateForm()) {
      Swal.fire({
        title: 'Error de Validación',
        text: 'Por favor adjunta el voucher para registrar esta transacción',
        icon: 'error',
        confirmButtonColor: '#ffc000'
      });
      return;
    }

    setLoading(true);

    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        // Asignar branchId automáticamente para administradores de sede
        branchId: user?.role === 'branch_admin' && user?.branchId ? user.branchId : 1
      };

      if (transaction) {
        await updateTransaction(transaction.id, transactionData);
      } else {
        await addTransaction(transactionData);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentCategories = formData.type === 'income' ? categories.income : categories.expense;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white dark:bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-dark-800 px-6 py-4 border-b border-gray-200 dark:border-dark-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                {transaction ? 'Editar Transacción' : 'Nueva Transacción'}
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
            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Transacción
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.type === 'income'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300'
                    : 'border-gray-300 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-700'
                }`}>
                  <input
                    type="radio"
                    name="type"
                    value="income"
                    checked={formData.type === 'income'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value, category: '' })}
                    className="sr-only"
                  />
                  <span className="font-medium">Ingreso</span>
                </label>
                
                <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.type === 'expense'
                    ? 'border-red-500 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300'
                    : 'border-gray-300 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-700'
                }`}>
                  <input
                    type="radio"
                    name="type"
                    value="expense"
                    checked={formData.type === 'expense'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value, category: '' })}
                    className="sr-only"
                  />
                  <span className="font-medium">Gasto</span>
                </label>
              </div>
            </div>

            {/* Amount and Date */}
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Monto"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                icon={FiDollarSign}
                required
                placeholder="0.00"
              />
              
              <FormInput
                label="Fecha"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoría
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Seleccionar categoría</option>
                {currentCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Método de Pago
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="input-field"
                required
              >
                {paymentMethods.map(method => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <FormInput
              label="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              icon={FiFileText}
              placeholder="Describe la transacción..."
              required
            />

            {/* Voucher Upload - Obligatorio para recepción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiImage className="h-4 w-4 mr-2" />
                    <span>Comprobante/Voucher</span>
                    {user?.role === 'reception' && (
                      <span className="ml-2 text-red-500">*</span>
                    )}
                  </div>
                  {user?.role === 'reception' && (
                    <span className="text-xs text-red-600">Obligatorio</span>
                  )}
                </div>
              </label>

              {!formData.voucherUrl ? (
                <label className={`flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  errors.voucherUrl
                    ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500 bg-gray-50 dark:bg-dark-700'
                }`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleVoucherUpload}
                    className="hidden"
                  />
                  <div className="text-center">
                    <FiUpload className={`h-10 w-10 mx-auto mb-2 ${
                      errors.voucherUrl ? 'text-red-400' : 'text-gray-400'
                    }`} />
                    <p className={`text-sm mb-1 ${
                      errors.voucherUrl ? 'text-red-600 font-medium' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {errors.voucherUrl ? 'Voucher obligatorio para recepción' : 'Clic para subir voucher'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      PNG, JPG hasta 5MB
                    </p>
                  </div>
                </label>
              ) : (
                <div className="relative h-40 border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <img
                    src={formData.voucherUrl}
                    alt="Voucher"
                    className="w-full h-full object-contain bg-gray-100 dark:bg-dark-700"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveVoucher}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors shadow-lg"
                    title="Eliminar voucher"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 text-center">
                    Voucher adjuntado ✓
                  </div>
                </div>
              )}
              {errors.voucherUrl && (
                <p className="text-sm text-red-600 mt-1">{errors.voucherUrl}</p>
              )}
            </div>

            {/* Preview */}
            {formData.amount && (
              <div className={`p-4 rounded-lg border-2 border-dashed ${
                formData.type === 'income' 
                  ? 'border-green-300 bg-green-50 dark:bg-green-900' 
                  : 'border-red-300 bg-red-50 dark:bg-red-900'
              }`}>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    formData.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formData.type === 'income' ? '+' : '-'}S/{parseFloat(formData.amount || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {formData.type === 'income' ? 'Ingreso' : 'Gasto'} - {new Date(formData.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
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
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? 'Guardando...' : transaction ? 'Actualizar' : 'Crear Transacción'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;