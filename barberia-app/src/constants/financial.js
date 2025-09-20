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

// ===================================================================
// 💰 CONSTANTES PARA MÓDULO FINANCIERO PRINCIPAL - REFACTORIZADO
// ===================================================================

// Textos de la interfaz principal
export const FINANCIAL_TEXTS = {
  TITLE: 'Control Financiero',
  SUBTITLE: 'Gestiona ingresos, gastos y reportes',
  SUBTITLE_WITH_BRANCH: 'Gestiona ingresos, gastos y reportes de',
  SUBTITLE_ALL_BRANCHES: 'Gestiona ingresos, gastos y reportes de todas las sedes',
  ALL_BRANCHES: 'Todas las Sedes',
  NEW_TRANSACTION: 'Nueva Transacción',
  EXPORT_PDF: 'Exportar PDF',
  SHOW_CHARTS: 'Mostrar Gráficos',
  HIDE_CHARTS: 'Ocultar Gráficos',
  EMPTY_MESSAGE: 'No hay transacciones registradas'
};

// Textos de métricas
export const FINANCIAL_METRICS_TEXTS = {
  MONTHLY_INCOME: 'Ingresos del Mes',
  MONTHLY_EXPENSES: 'Gastos del Mes',
  NET_PROFIT: 'Ganancia Neta',
  TODAY_INCOME: 'Ingresos Hoy'
};

// Textos de secciones
export const FINANCIAL_SECTIONS_TEXTS = {
  MONTHLY_SUMMARY: 'Resumen Mensual',
  PAYMENT_METHODS: 'Métodos de Pago',
  TOP_EXPENSE_CATEGORIES: 'Top Categorías de Gastos',
  TOTAL_INCOME: 'Ingresos Totales',
  TOTAL_EXPENSES: 'Gastos Totales',
  NET_PROFIT: 'Ganancia Neta'
};

// Labels para tabla de transacciones
export const TRANSACTION_TABLE_LABELS = {
  DATE: 'Fecha',
  TYPE: 'Tipo',
  CATEGORY: 'Categoría',
  DESCRIPTION: 'Descripción',
  AMOUNT: 'Monto',
  PAYMENT_METHOD: 'Método'
};

// Textos de tipos de transacción
export const TRANSACTION_TYPE_TEXTS = {
  [TRANSACTION_TYPES.INCOME]: 'Ingreso',
  [TRANSACTION_TYPES.EXPENSE]: 'Gasto'
};

// Colores para tipos de transacción en tabla
export const TRANSACTION_TYPE_COLORS = {
  [TRANSACTION_TYPES.INCOME]: {
    badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    text: 'text-green-600',
    sign: '+'
  },
  [TRANSACTION_TYPES.EXPENSE]: {
    badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    text: 'text-red-600',
    sign: '-'
  }
};

// Configuración de métricas
export const FINANCIAL_METRICS_CONFIG = {
  MONTHLY_INCOME: {
    key: 'monthlyIncome',
    title: FINANCIAL_METRICS_TEXTS.MONTHLY_INCOME,
    icon: 'TrendingUp',
    color: 'bg-green-500',
    formatter: (value) => `S/${((value || 0) / 1000).toFixed(1)}K`
  },
  MONTHLY_EXPENSES: {
    key: 'monthlyExpenses',
    title: FINANCIAL_METRICS_TEXTS.MONTHLY_EXPENSES,
    icon: 'TrendingDown',
    color: 'bg-red-500',
    formatter: (value) => `S/${((value || 0) / 1000).toFixed(1)}K`
  },
  NET_PROFIT: {
    key: 'monthlyProfit',
    title: FINANCIAL_METRICS_TEXTS.NET_PROFIT,
    icon: 'DollarSign',
    color: 'bg-blue-500',
    formatter: (value) => `S/${((value || 0) / 1000).toFixed(1)}K`
  },
  TODAY_INCOME: {
    key: 'dailyIncome',
    title: FINANCIAL_METRICS_TEXTS.TODAY_INCOME,
    icon: 'DollarSign',
    color: 'bg-purple-500',
    formatter: (value) => `S/${((value || 0) / 1000).toFixed(0)}K`
  }
};

// Configuración de tabla
export const FINANCIAL_TABLE_CONFIG = {
  MAX_EXPENSE_CATEGORIES: 5,
  COLUMNS: {
    DATE: 'date',
    TYPE: 'type',
    CATEGORY: 'category',
    DESCRIPTION: 'description',
    AMOUNT: 'amount',
    PAYMENT_METHOD: 'paymentMethod'
  }
};

// Configuración de formateo
export const FINANCIAL_FORMATTERS = {
  CURRENCY: (amount) => `S/${amount?.toLocaleString() || '0'}`,
  CURRENCY_K: (amount) => `S/${((amount || 0) / 1000).toFixed(1)}K`,
  PERCENTAGE: (value) => `${value}%`,
  DATE: (date) => new Date(date).toLocaleDateString()
};

export default {
  TRANSACTION_LABELS,
  TRANSACTION_TYPES,
  TRANSACTION_STYLES,
  FORM_VALIDATION,
  CHART_LABELS,
  CHART_STYLES,
  CHART_CONFIG,
  FINANCIAL_TEXTS,
  FINANCIAL_METRICS_TEXTS,
  FINANCIAL_SECTIONS_TEXTS,
  TRANSACTION_TABLE_LABELS,
  TRANSACTION_TYPE_TEXTS,
  TRANSACTION_TYPE_COLORS,
  FINANCIAL_METRICS_CONFIG,
  FINANCIAL_TABLE_CONFIG,
  FINANCIAL_FORMATTERS
};