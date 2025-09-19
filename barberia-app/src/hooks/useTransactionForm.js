// ===================================================================
// 💰 HOOK PERSONALIZADO PARA FORMULARIO DE TRANSACCIONES - REFACTORIZADO
// ===================================================================
// Lógica centralizada para el formulario de transacciones
import { useState, useMemo } from 'react';
import { useFinancialStore, useAuthStore } from '../stores';
import { TRANSACTION_TYPES, TRANSACTION_LABELS } from '../constants/financial';

export const useTransactionForm = (transaction, onSuccess) => {
  const { addTransaction, updateTransaction, categories, paymentMethods } = useFinancialStore();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    type: transaction?.type || TRANSACTION_TYPES.INCOME,
    amount: transaction?.amount || '',
    category: transaction?.category || '',
    description: transaction?.description || '',
    paymentMethod: transaction?.paymentMethod || 'cash',
    date: transaction?.date || new Date().toISOString().split('T')[0]
  });

  const [loading, setLoading] = useState(false);

  // Configuración del formulario
  const formConfig = {
    title: transaction
      ? TRANSACTION_LABELS.FORM.EDIT_TITLE
      : TRANSACTION_LABELS.FORM.NEW_TITLE,
    submitText: loading
      ? TRANSACTION_LABELS.FORM.SAVING_TEXT
      : transaction
        ? TRANSACTION_LABELS.FORM.UPDATE_BUTTON
        : TRANSACTION_LABELS.FORM.SAVE_BUTTON
  };

  // Categorías filtradas por tipo
  const currentCategories = useMemo(() => {
    return formData.type === TRANSACTION_TYPES.INCOME
      ? categories.income
      : categories.expense;
  }, [formData.type, categories]);

  // Handlers
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Reset category when type changes
      ...(field === 'type' && { category: '' })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        branchId: user?.role === 'branch_admin' && user?.branchId
          ? user.branchId
          : 1
      };

      if (transaction) {
        await updateTransaction(transaction.id, transactionData);
      } else {
        await addTransaction(transactionData);
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error saving transaction:', error);
      // TODO: Mostrar notificación de error
    } finally {
      setLoading(false);
    }
  };

  // Utilidades
  const getPreviewAmount = () => {
    const amount = parseFloat(formData.amount || 0);
    const prefix = formData.type === TRANSACTION_TYPES.INCOME ? '+' : '-';
    return `${prefix}S/${amount.toLocaleString()}`;
  };

  const getPreviewDate = () => {
    return new Date(formData.date).toLocaleDateString();
  };

  const getTransactionTypeLabel = () => {
    return formData.type === TRANSACTION_TYPES.INCOME
      ? TRANSACTION_LABELS.FORM.INCOME_TYPE
      : TRANSACTION_LABELS.FORM.EXPENSE_TYPE;
  };

  const isFormValid = () => {
    return formData.amount &&
           formData.category &&
           formData.paymentMethod &&
           formData.description &&
           formData.date;
  };

  return {
    // Estado del formulario
    formData,
    loading,

    // Configuración
    formConfig,
    currentCategories,
    paymentMethods,

    // Handlers
    handleInputChange,
    handleSubmit,

    // Utilidades
    getPreviewAmount,
    getPreviewDate,
    getTransactionTypeLabel,
    isFormValid
  };
};