// ===================================================================
// 💰 FORMULARIO DE TRANSACCIONES - REFACTORIZADO
// ===================================================================
// Formulario para crear y editar transacciones financieras
import React from 'react';
import { FiX, FiDollarSign, FiFileText } from 'react-icons/fi';
import { FormInput, Modal } from '../common';
import { useTransactionForm } from '../../hooks/useTransactionForm';
import { TRANSACTION_LABELS } from '../../constants/financial';
import {
  TransactionTypeSelector,
  TransactionPreview
} from './components';

const TransactionForm = ({ transaction = null, onClose, onSuccess }) => {
  const {
    formData,
    loading,
    formConfig,
    currentCategories,
    paymentMethods,
    handleInputChange,
    handleSubmit,
    getPreviewAmount,
    getPreviewDate,
    getTransactionTypeLabel,
    isFormValid
  } = useTransactionForm(transaction, onSuccess);

  return (
    <Modal isOpen={true} onClose={onClose} title={formConfig.title}>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Transaction Type */}
        <TransactionTypeSelector
          selectedType={formData.type}
          onChange={(value) => handleInputChange('type', value)}
        />

        {/* Amount and Date */}
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label={TRANSACTION_LABELS.FORM.AMOUNT_LABEL}
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            icon={FiDollarSign}
            required
            placeholder={TRANSACTION_LABELS.PLACEHOLDERS.AMOUNT}
          />

          <FormInput
            label={TRANSACTION_LABELS.FORM.DATE_LABEL}
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {TRANSACTION_LABELS.FORM.CATEGORY_LABEL}
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="input-field"
            required
          >
            <option value="">{TRANSACTION_LABELS.PLACEHOLDERS.SELECT_CATEGORY}</option>
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
            {TRANSACTION_LABELS.FORM.PAYMENT_METHOD_LABEL}
          </label>
          <select
            value={formData.paymentMethod}
            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
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
          label={TRANSACTION_LABELS.FORM.DESCRIPTION_LABEL}
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          icon={FiFileText}
          placeholder={TRANSACTION_LABELS.PLACEHOLDERS.DESCRIPTION}
          required
        />

        {/* Preview */}
        <TransactionPreview
          amount={formData.amount}
          type={formData.type}
          date={formData.date}
          getPreviewAmount={getPreviewAmount}
          getPreviewDate={getPreviewDate}
          getTransactionTypeLabel={getTransactionTypeLabel}
        />

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            {TRANSACTION_LABELS.FORM.CANCEL_BUTTON}
          </button>
          <button
            type="submit"
            disabled={loading || !isFormValid()}
            className="btn-primary disabled:opacity-50"
          >
            {formConfig.submitText}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionForm;