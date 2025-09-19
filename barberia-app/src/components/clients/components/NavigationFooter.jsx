// ===================================================================
// 🧭 FOOTER DE NAVEGACIÓN - COMPONENTE REUTILIZABLE
// ===================================================================
// Footer con botones de navegación entre pasos

import React from 'react';
import { FiChevronLeft, FiChevronRight, FiCheck } from 'react-icons/fi';
import { CLIENT_APPOINTMENT_LABELS, CLIENT_APPOINTMENT_STYLES } from '../../../constants';

const NavigationFooter = ({
  currentStep,
  totalSteps,
  canProceed,
  onPrevious,
  onNext,
  onSubmit,
  loading
}) => {
  const isLastStep = currentStep >= totalSteps;

  return (
    <div className="sticky bottom-0 flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
      <button
        onClick={onPrevious}
        disabled={currentStep === 1}
        className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
          currentStep === 1
            ? CLIENT_APPOINTMENT_STYLES.BUTTONS.DISABLED
            : CLIENT_APPOINTMENT_STYLES.BUTTONS.SECONDARY
        }`}
      >
        <FiChevronLeft className="w-4 h-4 mr-2" />
        {CLIENT_APPOINTMENT_LABELS.FORM.NAVIGATION.PREVIOUS}
      </button>

      <div className="text-sm text-gray-600">
        {CLIENT_APPOINTMENT_LABELS.FORM.NAVIGATION.STEP_COUNTER
          .replace('{current}', currentStep)
          .replace('{total}', totalSteps)}
      </div>

      {!isLastStep ? (
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            canProceed
              ? CLIENT_APPOINTMENT_STYLES.BUTTONS.PRIMARY
              : CLIENT_APPOINTMENT_STYLES.BUTTONS.DISABLED
          }`}
        >
          {CLIENT_APPOINTMENT_LABELS.FORM.NAVIGATION.NEXT}
          <FiChevronRight className="w-4 h-4 ml-2" />
        </button>
      ) : (
        <button
          onClick={onSubmit}
          disabled={loading}
          className={`flex items-center px-6 py-2 text-sm font-medium text-white transition-colors rounded-lg ${
            loading ? 'bg-gray-400' : 'bg-primary-600 hover:bg-primary-700'
          }`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-white rounded-full animate-spin border-t-transparent" />
              {CLIENT_APPOINTMENT_LABELS.FORM.NAVIGATION.PROCESSING}
            </>
          ) : (
            <>
              <FiCheck className="w-4 h-4 mr-2" />
              {CLIENT_APPOINTMENT_LABELS.FORM.NAVIGATION.CONFIRM_RESERVATION}
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default NavigationFooter;