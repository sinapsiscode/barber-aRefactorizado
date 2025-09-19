// ===================================================================
// 📊 INDICADOR DE PASOS - COMPONENTE REUTILIZABLE
// ===================================================================
// Indicador visual del progreso en el formulario de citas

import React from 'react';
import {
  FiMapPin, FiScissors, FiCamera, FiUser,
  FiClock, FiDollarSign, FiCheckCircle
} from 'react-icons/fi';
import {
  CLIENT_APPOINTMENT_LABELS,
  CLIENT_APPOINTMENT_STYLES
} from '../../../constants';

const STEP_ICONS = {
  MapPin: FiMapPin,
  Scissors: FiScissors,
  Camera: FiCamera,
  User: FiUser,
  Clock: FiClock,
  DollarSign: FiDollarSign,
  CheckCircle: FiCheckCircle
};

const StepIndicator = ({ currentStep, totalSteps = 7 }) => {
  const steps = [
    { num: 1, label: CLIENT_APPOINTMENT_LABELS.FORM.STEPS.BRANCH, icon: 'MapPin' },
    { num: 2, label: CLIENT_APPOINTMENT_LABELS.FORM.STEPS.SERVICES, icon: 'Scissors' },
    { num: 3, label: CLIENT_APPOINTMENT_LABELS.FORM.STEPS.PORTFOLIO, icon: 'Camera' },
    { num: 4, label: CLIENT_APPOINTMENT_LABELS.FORM.STEPS.BARBER, icon: 'User' },
    { num: 5, label: CLIENT_APPOINTMENT_LABELS.FORM.STEPS.SCHEDULE, icon: 'Clock' },
    { num: 6, label: CLIENT_APPOINTMENT_LABELS.FORM.STEPS.PAYMENT, icon: 'DollarSign' },
    { num: 7, label: CLIENT_APPOINTMENT_LABELS.FORM.STEPS.CONFIRM, icon: 'CheckCircle' }
  ];

  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((s, index) => {
        const IconComponent = STEP_ICONS[s.icon];
        const isActive = currentStep >= s.num;
        const isConnector = index < totalSteps - 1;

        return (
          <div key={s.num} className="flex items-center">
            <div className={`flex flex-col items-center ${index > 0 ? 'ml-2' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                isActive
                  ? CLIENT_APPOINTMENT_STYLES.STEP_INDICATOR.ACTIVE
                  : CLIENT_APPOINTMENT_STYLES.STEP_INDICATOR.INACTIVE
              }`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <span className={`text-xs mt-1 ${
                isActive
                  ? CLIENT_APPOINTMENT_STYLES.STEP_INDICATOR.ACTIVE_TEXT
                  : CLIENT_APPOINTMENT_STYLES.STEP_INDICATOR.INACTIVE_TEXT
              }`}>
                {s.label}
              </span>
            </div>
            {isConnector && (
              <div className={`h-0.5 w-8 mx-1 ${
                currentStep > s.num
                  ? CLIENT_APPOINTMENT_STYLES.STEP_INDICATOR.CONNECTOR_ACTIVE
                  : CLIENT_APPOINTMENT_STYLES.STEP_INDICATOR.CONNECTOR_INACTIVE
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;