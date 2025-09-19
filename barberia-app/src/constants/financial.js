// ===================================================================
// 💰 CONSTANTES FINANCIERAS - REFACTORIZADO
// ===================================================================
// Constantes específicas para módulo financiero
export const TRANSACTION_LABELS = {
  FORM: {
    NEW_TITLE: 'Nueva Transacción',
    EDIT_TITLE: 'Editar Transacción',
    TYPE_LABEL: 'Tipo de Transacción',
    AMOUNT_LABEL: 'Monto',
    DATE_LABEL: 'Fecha',
    CATEGORY_LABEL: 'Categoría',
    PAYMENT_METHOD_LABEL: 'Método de Pago',
    DESCRIPTION_LABEL: 'Descripción',
    INCOME_TYPE: 'Ingreso',
    EXPENSE_TYPE: 'Gasto',
    CANCEL_BUTTON: 'Cancelar',
    SAVE_BUTTON: 'Crear Transacción',
    UPDATE_BUTTON: 'Actualizar',
    SAVING_TEXT: 'Guardando...'
  },
  PLACEHOLDERS: {
    AMOUNT: '0.00',
    DESCRIPTION: 'Describe la transacción...',
    SELECT_CATEGORY: 'Seleccionar categoría'
  },
  PREVIEW: {
    INCOME_PREFIX: '+',
    EXPENSE_PREFIX: '-'
  }
};

export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

export const TRANSACTION_STYLES = {
  INCOME: {
    border: 'border-green-500',
    bg: 'bg-green-50 dark:bg-green-900',
    text: 'text-green-700 dark:text-green-300',
    preview: {
      border: 'border-green-300',
      bg: 'bg-green-50 dark:bg-green-900',
      text: 'text-green-600'
    }
  },
  EXPENSE: {
    border: 'border-red-500',
    bg: 'bg-red-50 dark:bg-red-900',
    text: 'text-red-700 dark:text-red-300',
    preview: {
      border: 'border-red-300',
      bg: 'bg-red-50 dark:bg-red-900',
      text: 'text-red-600'
    }
  },
  NEUTRAL: {
    border: 'border-gray-300 dark:border-gray-600',
    bg: 'hover:bg-gray-50 dark:hover:bg-gray-700'
  }
};

export const FORM_VALIDATION = {
  AMOUNT: {
    MIN: 0,
    STEP: 0.01,
    REQUIRED: true
  },
  REQUIRED_FIELDS: ['amount', 'category', 'paymentMethod', 'description', 'date']
};

export const CHART_LABELS = {
  INCOME_VS_EXPENSES: {
    TITLE: 'Ingresos vs Gastos (Últimos 30 días)',
    INCOME_LABEL: 'Ingresos',
    EXPENSES_LABEL: 'Gastos'
  },
  PROFIT_TREND: {
    TITLE: 'Tendencia de Ganancias',
    PROFIT_LABEL: 'Ganancia',
    LOSS_LABEL: 'Pérdida',
    TOTAL_MONTH: 'Ganancia Total del Mes'
  }
};

export const CHART_STYLES = {
  INCOME: {
    color: 'bg-green-500',
    textColor: 'text-green-600'
  },
  EXPENSES: {
    color: 'bg-red-500',
    textColor: 'text-red-600'
  },
  PROFIT: {
    color: 'bg-green-500',
    textColor: 'text-green-600'
  },
  LOSS: {
    color: 'bg-red-500',
    textColor: 'text-red-600'
  },
  NEUTRAL: {
    bg: 'bg-gray-200 dark:bg-gray-700'
  }
};

export const CHART_CONFIG = {
  DEFAULT_DAYS: 10,
  BAR_HEIGHT: 'h-2',
  DATE_FORMAT_OPTIONS: {
    month: 'short',
    day: 'numeric'
  }
};

export default {
  TRANSACTION_LABELS,
  TRANSACTION_TYPES,
  TRANSACTION_STYLES,
  FORM_VALIDATION,
  CHART_LABELS,
  CHART_STYLES,
  CHART_CONFIG
};