import { useState, useCallback } from 'react';
import { VALIDATION } from '../constants';

/**
 * Hook personalizado para validaciones de formularios
 * Centraliza todas las reglas de validación del proyecto
 */
export const useValidation = () => {
  const [errors, setErrors] = useState({});

  const validateEmail = useCallback((email) => {
    if (!email) return 'El email es requerido';
    if (!VALIDATION.EMAIL.PATTERN.test(email)) {
      return 'Formato de email inválido';
    }
    return null;
  }, []);

  const validatePhone = useCallback((phone) => {
    if (!phone) return 'El teléfono es requerido';
    if (phone.length < VALIDATION.PHONE.MIN_LENGTH) {
      return `El teléfono debe tener al menos ${VALIDATION.PHONE.MIN_LENGTH} dígitos`;
    }
    if (phone.length > VALIDATION.PHONE.MAX_LENGTH) {
      return `El teléfono no puede tener más de ${VALIDATION.PHONE.MAX_LENGTH} dígitos`;
    }
    if (!VALIDATION.PHONE.PATTERN.test(phone)) {
      return 'Formato de teléfono inválido';
    }
    return null;
  }, []);

  const validatePassword = useCallback((password) => {
    if (!password) return 'La contraseña es requerida';
    if (password.length < VALIDATION.PASSWORD.MIN_LENGTH) {
      return `La contraseña debe tener al menos ${VALIDATION.PASSWORD.MIN_LENGTH} caracteres`;
    }

    const errors = [];
    if (VALIDATION.PASSWORD.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
      errors.push('una mayúscula');
    }
    if (VALIDATION.PASSWORD.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
      errors.push('una minúscula');
    }
    if (VALIDATION.PASSWORD.REQUIRE_NUMBERS && !/\d/.test(password)) {
      errors.push('un número');
    }
    if (VALIDATION.PASSWORD.REQUIRE_SPECIAL && !/[!@#$%^&*]/.test(password)) {
      errors.push('un carácter especial');
    }

    if (errors.length > 0) {
      return `La contraseña debe contener: ${errors.join(', ')}`;
    }
    return null;
  }, []);

  const validateName = useCallback((name) => {
    if (!name) return 'El nombre es requerido';
    if (name.length < VALIDATION.NAME.MIN_LENGTH) {
      return `El nombre debe tener al menos ${VALIDATION.NAME.MIN_LENGTH} caracteres`;
    }
    if (name.length > VALIDATION.NAME.MAX_LENGTH) {
      return `El nombre no puede tener más de ${VALIDATION.NAME.MAX_LENGTH} caracteres`;
    }
    if (!VALIDATION.NAME.PATTERN.test(name)) {
      return 'El nombre solo puede contener letras y espacios';
    }
    return null;
  }, []);

  const validateRequired = useCallback((value, fieldName = 'Campo') => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `${fieldName} es requerido`;
    }
    return null;
  }, []);

  const validateField = useCallback((fieldName, value, validationType) => {
    let error = null;

    switch (validationType) {
      case 'email':
        error = validateEmail(value);
        break;
      case 'phone':
        error = validatePhone(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      case 'name':
        error = validateName(value);
        break;
      case 'required':
        error = validateRequired(value, fieldName);
        break;
      default:
        error = null;
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));

    return error === null;
  }, [validateEmail, validatePhone, validatePassword, validateName, validateRequired]);

  const validateForm = useCallback((data, rules) => {
    const newErrors = {};
    let isValid = true;

    Object.keys(rules).forEach(fieldName => {
      const value = data[fieldName];
      const validationRules = Array.isArray(rules[fieldName]) ? rules[fieldName] : [rules[fieldName]];

      for (const rule of validationRules) {
        let error = null;

        if (typeof rule === 'string') {
          switch (rule) {
            case 'email':
              error = validateEmail(value);
              break;
            case 'phone':
              error = validatePhone(value);
              break;
            case 'password':
              error = validatePassword(value);
              break;
            case 'name':
              error = validateName(value);
              break;
            case 'required':
              error = validateRequired(value, fieldName);
              break;
          }
        } else if (typeof rule === 'function') {
          error = rule(value);
        }

        if (error) {
          newErrors[fieldName] = error;
          isValid = false;
          break; // Detener en el primer error
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validateEmail, validatePhone, validatePassword, validateName, validateRequired]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((fieldName) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  return {
    errors,
    validateEmail,
    validatePhone,
    validatePassword,
    validateName,
    validateRequired,
    validateField,
    validateForm,
    clearErrors,
    clearFieldError
  };
};