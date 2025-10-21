import { FORM_STEPS } from '../../../constants/appointmentForm';

/**
 * Indicador de progreso del formulario de citas
 */
const StepIndicator = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {FORM_STEPS.map((s, index) => (
        <div key={s.num} className="flex items-center">
          <div className={`flex flex-col items-center ${index > 0 ? 'ml-2' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
              currentStep >= s.num
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}>
              <s.icon className="w-5 h-5" />
            </div>
            <span className={`text-xs mt-1 ${
              currentStep >= s.num ? 'text-primary-600 font-medium' : 'text-gray-500'
            }`}>
              {s.label}
            </span>
          </div>
          {index < FORM_STEPS.length - 1 && (
            <div className={`h-0.5 w-8 mx-1 ${
              currentStep > s.num ? 'bg-primary-600' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
