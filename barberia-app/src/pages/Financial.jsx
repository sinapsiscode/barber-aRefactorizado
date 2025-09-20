import { useFinancial } from '../hooks/useFinancial';

import FinancialHeader from '../components/financial/FinancialHeader';
import FinancialMetrics from '../components/financial/FinancialMetrics';
import FinancialSummary from '../components/financial/FinancialSummary';
import FinancialTable from '../components/financial/FinancialTable';
import TransactionForm from '../components/financial/TransactionForm';
import FinancialCharts from '../components/financial/FinancialCharts';

const Financial = () => {
  const {
    // Estado
    showForm,
    showCharts,
    user,
    currentBranch,
    selectedBranch,

    // Datos
    transactions,
    financialSummary,
    paymentMethods,
    paymentMethodStats,
    categories,
    categoryStats,

    // Acciones
    handleShowForm,
    handleCloseForm,
    handleToggleCharts
  } = useFinancial();

  const handleExportPDF = () => {
    // TODO: Implementar exportación PDF
    console.log('Exportar PDF');
  };

  return (
    <div className="space-y-6">
      <FinancialHeader
        user={user}
        currentBranch={currentBranch}
        selectedBranch={selectedBranch}
        showCharts={showCharts}
        onToggleCharts={handleToggleCharts}
        onNewTransaction={handleShowForm}
        onExportPDF={handleExportPDF}
      />

      <FinancialMetrics summary={financialSummary} />

      {showCharts && <FinancialCharts />}

      <FinancialSummary
        summary={financialSummary}
        paymentMethodStats={paymentMethodStats}
        categoryStats={categoryStats}
      />

      <FinancialTable
        transactions={transactions}
        paymentMethods={paymentMethods}
        categories={categories}
      />

      {showForm && (
        <TransactionForm
          onClose={handleCloseForm}
          onSuccess={handleCloseForm}
        />
      )}
    </div>
  );
};

export default Financial;