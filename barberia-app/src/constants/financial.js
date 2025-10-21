/**
 * Constantes para Financial
 */

/**
 * Textos de la página financiera
 */
export const FINANCIAL_TEXTS = {
  // Header
  pageTitle: 'Control Financiero',
  pageSubtitle: 'Gestiona ingresos, gastos y reportes',
  showChartsButton: 'Mostrar Gráficos',
  hideChartsButton: 'Ocultar Gráficos',
  exportButton: 'Exportar PDF',
  newTransactionButton: 'Nueva Transacción',

  // Métricas
  monthlyIncomeTitle: 'Ingresos del Mes',
  monthlyExpensesTitle: 'Gastos del Mes',
  netProfitTitle: 'Ganancia Neta',
  todayIncomeTitle: 'Ingresos Hoy',

  // Cards de resumen
  monthlySummaryTitle: 'Resumen Mensual',
  totalIncomeLabel: 'Ingresos Totales',
  totalExpensesLabel: 'Gastos Totales',
  netProfitLabel: 'Ganancia Neta',

  paymentMethodsTitle: 'Métodos de Pago',
  topExpensesTitle: 'Top Categorías de Gastos',

  // Tabla
  dateLabel: 'Fecha',
  typeLabel: 'Tipo',
  categoryLabel: 'Categoría',
  descriptionLabel: 'Descripción',
  amountLabel: 'Monto',
  methodLabel: 'Método',
  voucherLabel: 'Voucher',
  incomeLabel: 'Ingreso',
  expenseLabel: 'Gasto',
  noVoucherText: 'Sin voucher',
  viewVoucherButton: 'Ver',
  emptyTableMessage: 'No hay transacciones registradas',

  // Modal de voucher
  voucherModalTitle: 'Voucher de Transacción',
  typeModalLabel: 'Tipo:',
  amountModalLabel: 'Monto:',
  dateModalLabel: 'Fecha:',
  methodModalLabel: 'Método:',
  descriptionModalLabel: 'Descripción:',
  closeButton: 'Cerrar'
};

/**
 * Colores para tipos de transacción
 */
export const TRANSACTION_COLORS = {
  income: {
    badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    text: 'text-green-600'
  },
  expense: {
    badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    text: 'text-red-600'
  }
};
