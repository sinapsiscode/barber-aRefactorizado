// ===================================================================
// 🏢 HOOK DE FORMULARIO DE SEDES - REFACTORIZADO
// ===================================================================
// Hook personalizado para manejar la lógica del formulario de sedes

import { useState } from 'react';
import Swal from 'sweetalert2';
import { useBranchStore } from '../stores';
import {
  BRANCH_MESSAGES,
  BRANCH_VALIDATION_RULES,
  DEFAULT_WORKING_HOURS,
  BRANCH_DEFAULT_COORDINATES
} from '../constants/branches';
import { SWEETALERT_CONFIG as AUTH_SWEETALERT } from '../constants/auth';

export const useBranchForm = (branch = null, onClose) => {
  const { addBranch, updateBranch, isLoading } = useBranchStore();

  const [formData, setFormData] = useState({
    name: branch?.name || '',
    city: branch?.city || '',
    country: branch?.country || 'PE',
    address: branch?.address || '',
    phone: branch?.phone || '',
    email: branch?.email || '',
    manager: branch?.manager || '',
    managerPhone: branch?.managerPhone || '',
    services: branch?.services?.join(', ') || '',
    amenities: branch?.amenities?.join(', ') || '',
    workingHours: branch?.workingHours || DEFAULT_WORKING_HOURS
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const rules = BRANCH_VALIDATION_RULES[name.toUpperCase()];
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

    if (rules.PATTERN && !rules.PATTERN.test(value)) {
      if (name === 'email') {
        return 'Formato de email inválido';
      }
      if (name === 'phone' || name === 'managerPhone') {
        return 'Formato de teléfono inválido';
      }
      return `Formato de ${name} inválido`;
    }

    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    const fieldsToValidate = ['name', 'city', 'address', 'phone', 'email', 'manager', 'managerPhone'];

    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
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
      ...AUTH_SWEETALERT.THEME
    };

    if (type === 'success') {
      config.timer = AUTH_SWEETALERT.SUCCESS.timer;
      config.showConfirmButton = AUTH_SWEETALERT.SUCCESS.showConfirmButton;
    }

    return await Swal.fire(config);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const processedData = {
      ...formData,
      services: formData.services.split(',').map(s => s.trim()).filter(s => s),
      amenities: formData.amenities.split(',').map(a => a.trim()).filter(a => a),
      coordinates: BRANCH_DEFAULT_COORDINATES
    };

    const result = branch
      ? await updateBranch(branch.id, processedData)
      : await addBranch(processedData);

    if (result.success) {
      const message = branch
        ? BRANCH_MESSAGES.SUCCESS.UPDATED
        : BRANCH_MESSAGES.SUCCESS.CREATED;

      await showAlert('success', BRANCH_MESSAGES.SUCCESS.TITLE, message);
      onClose();
    } else {
      await showAlert(
        'error',
        BRANCH_MESSAGES.ERROR.TITLE,
        result.error || BRANCH_MESSAGES.ERROR.GENERAL
      );
    }
  };

  const clearFieldError = (field) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return {
    formData,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
    clearFieldError,
    validateField
  };
};