import { useState, useEffect } from 'react';
import { useFinancialStore, useBranchStore, useAuthStore } from '../stores';
import BranchRestrictionNotice from '../components/common/BranchRestrictionNotice';
import TransactionForm from '../components/financial/TransactionForm';
import FinancialCharts from '../components/financial/FinancialCharts';
import FinancialReportPDF from '../components/financial/FinancialReportPDF';
import useBranchFilter from '../hooks/useBranchFilter';
import { useFinancialMetrics } from '../hooks/financial/useFinancialMetrics';
import { useVoucherModal } from '../hooks/financial/useVoucherModal';
import { FINANCIAL_TEXTS } from '../constants/financial';
import { pdf } from '@react-pdf/renderer';
import Swal from 'sweetalert2';

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
    loadPaymentMethods,
    loadCategories,
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
    if (paymentMethods.length === 0) {
      loadPaymentMethods();
    }
    if (!categories.income || !categories.expense) {
      loadCategories();
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

  // Función para exportar transacciones a PDF
  const handleExportPDF = async () => {
    try {
      // Mostrar loading
      Swal.fire({
        title: 'Generando PDF...',
        text: 'Por favor espera',
        allowOuterClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Obtener nombre de la sucursal si existe
      const { selectedBranch } = useBranchStore.getState();
      const branchName = selectedBranch?.name || selectedBranch?.nombre || 'Todas las Sucursales';

      // Generar el documento PDF
      const blob = await pdf(
        <FinancialReportPDF
          transactions={filteredTransactions}
          summary={summary}
          categories={categories}
          paymentMethods={paymentMethods}
          branchName={branchName}
        />
      ).toBlob();

      // Crear URL y descargar
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte_financiero_${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();

      // Limpiar
      URL.revokeObjectURL(url);

      // Mostrar éxito
      Swal.fire({
        icon: 'success',
        title: 'PDF Generado',
        text: 'El reporte se ha descargado exitosamente',
        confirmButtonColor: '#ffc000',
        timer: 2000
      });
    } catch (error) {
      console.error('Error exportando PDF:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo generar el PDF. Por favor intenta de nuevo.',
        confirmButtonColor: '#ffc000'
      });
    }
  };

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
        onExportPDF={handleExportPDF}
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
