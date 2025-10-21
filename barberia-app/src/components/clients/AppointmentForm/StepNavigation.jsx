import { FiChevronLeft, FiChevronRight, FiCheck } from 'react-icons/fi';
import { TOTAL_STEPS } from '../../../constants/appointmentForm';

/**
 * Botones de navegación del formulario
 */
const StepNavigation = ({
  step,
  canProceed,
  loading,
  onPrevious,
  onNext,
  onSubmit
}) => {
  return (
    <div className="sticky bottom-0 flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
      <button
        onClick={onPrevious}
        disabled={step === 1}
        className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
          step === 1
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
        }`}
      >
        <FiChevronLeft className="w-4 h-4 mr-2" />
        Anterior
      </button>

      <div className="text-sm text-gray-600">
        Paso {step} de {TOTAL_STEPS}
      </div>

      {step < TOTAL_STEPS ? (
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            canProceed
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Siguiente
          <FiChevronRight className="w-4 h-4 ml-2" />
        </button>
      ) : (
        <button
          onClick={onSubmit}
          disabled={loading}
          className="flex items-center px-6 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-white rounded-full animate-spin border-t-transparent" />
              Procesando...
            </>
          ) : (
            <>
              <FiCheck className="w-4 h-4 mr-2" />
              Confirmar Reserva
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default StepNavigation;
