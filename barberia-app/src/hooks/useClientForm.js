// ===================================================================
// 👥 HOOK DE FORMULARIO DE CLIENTES - REFACTORIZADO
// ===================================================================
// Hook personalizado para manejar la lógica del formulario de clientes

import { useState } from 'react';
import Swal from 'sweetalert2';
import { useClientStore } from '../stores';
import {
  CLIENT_VALIDATION_RULES,
  CLIENT_DEFAULT_VALUES,
  CLIENT_MESSAGES
} from '../constants/clients';
import { SWEETALERT_CONFIG } from '../constants/auth';

export const useClientForm = (client = null, onSuccess) => {
  const { addClient, updateClient } = useClientStore();

  const [formData, setFormData] = useState({
    name: client?.name || CLIENT_DEFAULT_VALUES.FORM_DATA.name,
    email: client?.email || CLIENT_DEFAULT_VALUES.FORM_DATA.email,
    phone: client?.phone || CLIENT_DEFAULT_VALUES.FORM_DATA.phone,
    birthDate: client?.birthDate || CLIENT_DEFAULT_VALUES.FORM_DATA.birthDate,
    address: client?.address || CLIENT_DEFAULT_VALUES.FORM_DATA.address,
    preferredBranch: client?.preferredBranch || CLIENT_DEFAULT_VALUES.PREFERRED_BRANCH,
    notes: client?.notes || CLIENT_DEFAULT_VALUES.FORM_DATA.notes
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const rules = CLIENT_VALIDATION_RULES[name.toUpperCase()];
    if (!rules) return '';

    if (rules.REQUIRED && !value.trim()) {
      return `${name} es requerido`;
    }

    if (rules.MIN_LENGTH && value.length < rules.MIN_LENGTH) {
      return `${name} debe tener al menos ${rules.MIN_LENGTH} caracteres`;
    }

    if (rules.MAX_LENGTH && value.length > rules.MAX_LENGTH) {
      return `${name} no puede exceder ${rules.MAX_LENGTH} caracteres`;
    }

    if (rules.PATTERN && value.trim() && !rules.PATTERN.test(value)) {
      if (name === 'email') {
        return 'Formato de email inválido';
      }
      if (name === 'phone') {
        return 'Formato de teléfono inválido';
      }
      if (name === 'name') {
        return 'El nombre solo puede contener letras y espacios';
      }
      return `Formato de ${name} inválido`;
    }

    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    const fieldsToValidate = ['name', 'email', 'phone'];

    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    // Validar campos opcionales si tienen contenido
    ['address', 'notes'].forEach(field => {
      if (formData[field]) {
        const error = validateField(field, formData[field]);
        if (error) {
          newErrors[field] = error;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const showAlert = async (type, title, text) => {
    const config = {
      title,
      text,
      icon: type,
      ...SWEETALERT_CONFIG.THEME
    };

    if (type === 'success') {
      config.timer = SWEETALERT_CONFIG.SUCCESS.timer;
      config.showConfirmButton = SWEETALERT_CONFIG.SUCCESS.showConfirmButton;
    }

    return await Swal.fire(config);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (client) {
        await updateClient(client.id, formData);
        await showAlert('success', CLIENT_MESSAGES.SUCCESS.TITLE, CLIENT_MESSAGES.SUCCESS.UPDATED);
      } else {
        await addClient(formData);
        await showAlert('success', CLIENT_MESSAGES.SUCCESS.TITLE, CLIENT_MESSAGES.SUCCESS.CREATED);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving client:', error);
      await showAlert('error', CLIENT_MESSAGES.ERROR.TITLE, CLIENT_MESSAGES.ERROR.SAVE_FAILED);
    } finally {
      setLoading(false);
    }
  };

  const clearFieldError = (field) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return {
    formData,
    loading,
    errors,
    handleChange,
    handleSubmit,
    clearFieldError,
    validateField
  };
};