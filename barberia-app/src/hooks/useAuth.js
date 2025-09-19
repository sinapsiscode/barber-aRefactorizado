import { useState, useCallback } from 'react';
import { useAuthStore } from '../stores';
import { AUTH_MESSAGES, AUTH_VALIDATION_RULES, SWEETALERT_CONFIG } from '../constants/auth';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

/**
 * Hook personalizado para manejo de autenticación
 * Centraliza la lógica de login, registro y validaciones
 */
export const useAuth = () => {
  const { login: storeLogin, register: storeRegister, isLoading } = useAuthStore();
  const [errors, setErrors] = useState({});

  // Mostrar alerta con configuración centralizada
  const showAlert = useCallback((type, title, text, options = {}) => {
    const config = {
      ...SWEETALERT_CONFIG.THEME,
      ...SWEETALERT_CONFIG[type.toUpperCase()],
      icon: type,
      title,
      text,
      ...options
    };

    return MySwal.fire(config);
  }, []);

  // Validar email
  const validateEmail = useCallback((email) => {
    const rules = AUTH_VALIDATION_RULES.EMAIL;

    if (rules.REQUIRED && !email) {
      return AUTH_MESSAGES.VALIDATION.EMAIL_REQUIRED;
    }

    if (email && !rules.PATTERN.test(email)) {
      return AUTH_MESSAGES.VALIDATION.EMAIL_INVALID;
    }

    if (email && email.length < rules.MIN_LENGTH) {
      return `El email debe tener al menos ${rules.MIN_LENGTH} caracteres`;
    }

    if (email && email.length > rules.MAX_LENGTH) {
      return `El email no puede tener más de ${rules.MAX_LENGTH} caracteres`;
    }

    return null;
  }, []);

  // Validar contraseña
  const validatePassword = useCallback((password) => {
    const rules = AUTH_VALIDATION_RULES.PASSWORD;

    if (rules.REQUIRED && !password) {
      return AUTH_MESSAGES.VALIDATION.PASSWORD_REQUIRED;
    }

    if (password && password.length < rules.MIN_LENGTH) {
      return AUTH_MESSAGES.VALIDATION.PASSWORD_MIN;
    }

    if (password && password.length > rules.MAX_LENGTH) {
      return `La contraseña no puede tener más de ${rules.MAX_LENGTH} caracteres`;
    }

    return null;
  }, []);

  // Validar nombre
  const validateName = useCallback((name) => {
    const rules = AUTH_VALIDATION_RULES.NAME;

    if (rules.REQUIRED && !name) {
      return 'El nombre es requerido';
    }

    if (name && name.length < rules.MIN_LENGTH) {
      return `El nombre debe tener al menos ${rules.MIN_LENGTH} caracteres`;
    }

    if (name && name.length > rules.MAX_LENGTH) {
      return `El nombre no puede tener más de ${rules.MAX_LENGTH} caracteres`;
    }

    if (name && !rules.PATTERN.test(name)) {
      return 'El nombre solo puede contener letras y espacios';
    }

    return null;
  }, []);

  // Validar teléfono
  const validatePhone = useCallback((phone) => {
    const rules = AUTH_VALIDATION_RULES.PHONE;

    if (rules.REQUIRED && !phone) {
      return 'El teléfono es requerido';
    }

    if (phone && phone.length < rules.MIN_LENGTH) {
      return `El teléfono debe tener al menos ${rules.MIN_LENGTH} dígitos`;
    }

    if (phone && phone.length > rules.MAX_LENGTH) {
      return `El teléfono no puede tener más de ${rules.MAX_LENGTH} dígitos`;
    }

    if (phone && !rules.PATTERN.test(phone)) {
      return 'Formato de teléfono inválido';
    }

    return null;
  }, []);

  // Validar formulario de login
  const validateLoginForm = useCallback((credentials) => {
    const newErrors = {};

    const emailError = validateEmail(credentials.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(credentials.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validateEmail, validatePassword]);

  // Validar formulario de registro
  const validateRegisterForm = useCallback((data) => {
    const newErrors = {};

    const nameError = validateName(data.name);
    if (nameError) newErrors.name = nameError;

    const emailError = validateEmail(data.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(data.password);
    if (passwordError) newErrors.password = passwordError;

    if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = AUTH_MESSAGES.VALIDATION.PASSWORDS_MATCH;
    }

    const phoneError = validatePhone(data.phone);
    if (phoneError) newErrors.phone = phoneError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validateName, validateEmail, validatePassword, validatePhone]);

  // Manejar login
  const handleLogin = useCallback(async (credentials) => {
    // Validar campos básicos
    if (!credentials.email || !credentials.password) {
      await showAlert(
        'warning',
        AUTH_MESSAGES.LOGIN.REQUIRED_FIELDS,
        AUTH_MESSAGES.LOGIN.REQUIRED_TEXT
      );
      return { success: false };
    }

    // Validar formato
    if (!validateLoginForm(credentials)) {
      return { success: false, errors };
    }

    try {
      const result = await storeLogin(credentials);

      if (result.success) {
        await showAlert(
          'success',
          AUTH_MESSAGES.LOGIN.WELCOME,
          AUTH_MESSAGES.LOGIN.HELLO.replace('{name}', result.user.name)
        );
        return { success: true, user: result.user };
      } else {
        await showAlert(
          'error',
          AUTH_MESSAGES.LOGIN.AUTH_ERROR,
          result.error || AUTH_MESSAGES.LOGIN.INVALID_CREDENTIALS
        );
        return { success: false, error: result.error };
      }
    } catch (error) {
      await showAlert(
        'error',
        AUTH_MESSAGES.LOGIN.AUTH_ERROR,
        error.message || 'Error inesperado'
      );
      return { success: false, error: error.message };
    }
  }, [validateLoginForm, storeLogin, showAlert, errors]);

  // Manejar registro
  const handleRegister = useCallback(async (data) => {
    // Validar formulario
    if (!validateRegisterForm(data)) {
      return { success: false, errors };
    }

    try {
      const result = await storeRegister(data);

      if (result.success) {
        await showAlert(
          'success',
          AUTH_MESSAGES.REGISTER.SUCCESS,
          AUTH_MESSAGES.REGISTER.WELCOME_NEW.replace('{name}', result.user.name)
        );
        return { success: true, user: result.user };
      } else {
        await showAlert(
          'error',
          AUTH_MESSAGES.REGISTER.ERROR,
          result.error || 'Error en el registro'
        );
        return { success: false, error: result.error };
      }
    } catch (error) {
      await showAlert(
        'error',
        AUTH_MESSAGES.REGISTER.ERROR,
        error.message || 'Error inesperado'
      );
      return { success: false, error: error.message };
    }
  }, [validateRegisterForm, storeRegister, showAlert, errors]);

  // Limpiar errores
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Limpiar error específico
  const clearFieldError = useCallback((fieldName) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  return {
    // Estado
    isLoading,
    errors,

    // Funciones de autenticación
    handleLogin,
    handleRegister,

    // Funciones de validación
    validateEmail,
    validatePassword,
    validateName,
    validatePhone,
    validateLoginForm,
    validateRegisterForm,

    // Funciones de utilidad
    showAlert,
    clearErrors,
    clearFieldError
  };
};