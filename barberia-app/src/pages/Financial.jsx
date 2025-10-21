import { useState, useEffect } from 'react';
import { useFinancialStore, useBranchStore } from '../stores';
import BranchRestrictionNotice from '../components/common/BranchRestrictionNotice';
import TransactionForm from '../components/financial/TransactionForm';
import FinancialCharts from '../components/financial/FinancialCharts';
import useBranchFilter from '../hooks/useBranchFilter';
import { useFinancialMetrics } from '../hooks/financial/useFinancialMetrics';
import { useVoucherModal } from '../hooks/financial/useVoucherModal';
import { FINANCIAL_TEXTS } from '../constants/financial';

// Componentes modulares
import FinancialHeader from '../components/financial/FinancialHeader';
import FinancialMetrics from '../components/financial/FinancialMetrics';
import MonthlySummaryCard from '../components/financial/MonthlySummaryCard';
import PaymentMethodsCard from '../components/financial/PaymentMethodsCard';
import TopExpensesCard from '../components/financial/TopExpensesCard';
import TransactionsTable from '../components/financial/TransactionsTable';
import VoucherModal from '../components/financial/VoucherModal';

/**
 * Financial Refactorizado
 * Reducido de 429 líneas a ~100 líneas
 *
 * Funcionalidades:
 * - Vista de métricas financieras principales
 * - Gestión de transacciones (ingresos/gastos)
 * - Gráficos financieros (toggle)
 * - Resúmenes por métodos de pago y categorías
 * - Tabla de transacciones con vouchers
 * - Modal de visualización de vouchers
 */
const Financial = () => {
  const {
    transactions,
    loadTransactions,
    paymentMethods,
    categories
  } = useFinancialStore();
  const { branches, loadBranches } = useBranchStore();
  const {
    filterFinancialData,
    getBranchTitle,
    getBranchDescription
  } = useBranchFilter();

  const [showForm, setShowForm] = useState(false);
  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => {
    if (transactions.length === 0) {
      loadTransactions();
    }
  }, []);

  useEffect(() => {
    if (!branches || branches.length === 0) {
      loadBranches();
    }
  }, [branches, loadBranches]);

  // Filtrar transacciones según rol y sucursal
  const filteredTransactions = filterFinancialData(transactions);

  // Hooks personalizados
  const { summary } = useFinancialMetrics(filteredTransactions);
  const {
    showVoucherModal,
    selectedVoucher,
    openVoucherModal,
    closeVoucherModal
  } = useVoucherModal();

  return (
    <div className="space-y-6">
      <BranchRestrictionNotice />

      {/* Header con botones */}
      <FinancialHeader
        title={getBranchTitle(FINANCIAL_TEXTS.pageTitle)}
        subtitle={getBranchDescription(FINANCIAL_TEXTS.pageSubtitle)}
        showCharts={showCharts}
        onToggleCharts={() => setShowCharts(!showCharts)}
        onNewTransaction={() => setShowForm(true)}
      />

      {/* Métricas principales */}
      <FinancialMetrics summary={summary} />

      {/* Gráficos (condicional) */}
      {showCharts && <FinancialCharts />}

      {/* Cards de resumen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MonthlySummaryCard summary={summary} />
        <PaymentMethodsCard
          filteredTransactions={filteredTransactions}
          paymentMethods={paymentMethods}
          totalIncome={summary.totalIncome}
        />
        <TopExpensesCard
          filteredTransactions={filteredTransactions}
          categories={categories}
        />
      </div>

      {/* Tabla de transacciones */}
      <TransactionsTable
        filteredTransactions={filteredTransactions}
        paymentMethods={paymentMethods}
        categories={categories}
        onVoucherClick={openVoucherModal}
      />

      {/* Modal de formulario de transacción */}
      {showForm && (
        <TransactionForm
          onClose={() => setShowForm(false)}
          onSuccess={() => setShowForm(false)}
        />
      )}

      {/* Modal de voucher */}
      {showVoucherModal && (
        <VoucherModal
          selectedVoucher={selectedVoucher}
          paymentMethods={paymentMethods}
          onClose={closeVoucherModal}
        />
      )}
    </div>
  );
};

export default Financial;
