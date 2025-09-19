import { useCallback } from 'react';
import { FINANCIAL } from '../constants';

/**
 * Hook personalizado para formateo de moneda
 * Centraliza el formato de precios y cálculos financieros
 */
export const useCurrency = () => {
  const formatCurrency = useCallback((amount, options = {}) => {
    const {
      symbol = FINANCIAL.CURRENCY.SYMBOL,
      decimals = FINANCIAL.CURRENCY.DECIMAL_PLACES,
      showSymbol = true
    } = options;

    if (typeof amount !== 'number' || isNaN(amount)) {
      return showSymbol ? `${symbol} 0.00` : '0.00';
    }

    const formatted = amount.toFixed(decimals);
    return showSymbol ? `${symbol} ${formatted}` : formatted;
  }, []);

  const parseCurrency = useCallback((value) => {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string') return 0;

    // Remover símbolo de moneda y espacios
    const cleaned = value.replace(FINANCIAL.CURRENCY.SYMBOL, '').trim();
    const parsed = parseFloat(cleaned);

    return isNaN(parsed) ? 0 : parsed;
  }, []);

  const calculateTax = useCallback((amount, taxRate = FINANCIAL.TAX_RATE) => {
    return amount * taxRate;
  }, []);

  const calculateTotal = useCallback((subtotal, taxRate = FINANCIAL.TAX_RATE) => {
    const tax = calculateTax(subtotal, taxRate);
    return subtotal + tax;
  }, [calculateTax]);

  const calculateDiscount = useCallback((amount, discountPercent) => {
    return amount * (discountPercent / 100);
  }, []);

  const calculateWithDiscount = useCallback((amount, discountPercent) => {
    const discount = calculateDiscount(amount, discountPercent);
    return amount - discount;
  }, [calculateDiscount]);

  return {
    formatCurrency,
    parseCurrency,
    calculateTax,
    calculateTotal,
    calculateDiscount,
    calculateWithDiscount,
    currencySymbol: FINANCIAL.CURRENCY.SYMBOL,
    taxRate: FINANCIAL.TAX_RATE
  };
};